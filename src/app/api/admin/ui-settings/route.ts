/**
 * 后台UI配置管理API
 * GET /api/admin/ui-settings - 获取UI配置
 * PUT /api/admin/ui-settings - 更新UI配置
 */

import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyAuth } from '@/lib/auth'
import { createAuditLog } from '@/lib/audit-log'

// GET - 获取UI配置
export async function GET(request: NextRequest) {
  try {
    // 验证管理员权限
    const currentUser = await verifyAuth(request)
    if (!currentUser) {
      return NextResponse.json(
        { success: false, error: '未授权' },
        { status: 401 }
      )
    }

    // 获取或创建UI配置
    let settings = await prisma.uiSettings.findFirst()
    
    if (!settings) {
      settings = await prisma.uiSettings.create({
        data: {
          heroStyle: '4',  // 默认样式4（打字机）
          showAnnouncementBanner: true,
        },
      })
    }

    return NextResponse.json({
      success: true,
      data: settings,
    })
  } catch (error) {
    console.error('获取UI配置失败:', error)
    return NextResponse.json(
      {
        success: false,
        error: '获取UI配置失败',
      },
      { status: 500 }
    )
  }
}

// PUT - 更新UI配置
export async function PUT(request: NextRequest) {
  try {
    // 验证管理员权限
    const currentUser = await verifyAuth(request)
    if (!currentUser) {
      return NextResponse.json(
        { success: false, error: '未授权' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { heroStyle, showAnnouncementBanner, heroConfig } = body

    // 验证heroStyle - 只允许样式3和4
    if (heroStyle && !['3', '4'].includes(heroStyle)) {
      return NextResponse.json(
        { success: false, error: 'Hero样式无效，仅支持样式3和4' },
        { status: 400 }
      )
    }

    // 验证showAnnouncementBanner
    if (showAnnouncementBanner !== undefined && typeof showAnnouncementBanner !== 'boolean') {
      return NextResponse.json(
        { success: false, error: '公告栏开关参数无效' },
        { status: 400 }
      )
    }

    // 验证heroConfig
    if (heroConfig !== undefined && heroConfig !== null) {
      if (typeof heroConfig === 'object') {
        // 将对象转换为JSON字符串
        body.heroConfig = JSON.stringify(heroConfig)
      } else if (typeof heroConfig !== 'string') {
        return NextResponse.json(
          { success: false, error: 'Hero配置格式无效' },
          { status: 400 }
        )
      }
    }

    // 获取现有配置
    let settings = await prisma.uiSettings.findFirst()
    const oldData = settings ? { ...settings } : null

    // 准备更新数据
    const updateData: any = {}
    if (heroStyle !== undefined) updateData.heroStyle = heroStyle
    if (showAnnouncementBanner !== undefined) updateData.showAnnouncementBanner = showAnnouncementBanner
    if (heroConfig !== undefined) updateData.heroConfig = typeof heroConfig === 'string' ? heroConfig : JSON.stringify(heroConfig)

    if (!settings) {
      // 如果不存在，创建新配置 - 默认使用样式3
      settings = await prisma.uiSettings.create({
        data: {
          heroStyle: heroStyle || '4',
          showAnnouncementBanner: showAnnouncementBanner !== undefined ? showAnnouncementBanner : true,
          heroConfig: updateData.heroConfig || null,
        },
      })
    } else {
      // 更新现有配置
      settings = await prisma.uiSettings.update({
        where: { id: settings.id },
        data: updateData,
      })
    }

    // 记录操作日志
    await createAuditLog({
      userId: currentUser.userId,
      action: 'UPDATE',
      module: 'SystemConfig',
      targetId: settings.id,
      targetName: `Hero样式 ${settings.heroStyle}`,
      changes: {
        before: oldData,
        after: settings,
      },
      ip: request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || undefined,
      userAgent: request.headers.get('user-agent') || undefined,
    })

    return NextResponse.json({
      success: true,
      data: settings,
      message: 'UI配置更新成功',
    })
  } catch (error) {
    console.error('更新UI配置失败:', error)
    return NextResponse.json(
      {
        success: false,
        error: '更新UI配置失败',
      },
      { status: 500 }
    )
  }
}

