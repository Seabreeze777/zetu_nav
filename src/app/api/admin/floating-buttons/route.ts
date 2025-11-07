import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyAuth } from '@/lib/auth'

/**
 * GET /api/admin/floating-buttons
 * 获取所有悬浮按钮（管理员）
 */
export async function GET(request: Request) {
  try {
    const user = await verifyAuth(request)
    if (!user || user.role !== 'admin') {
      return NextResponse.json({ error: '无权限' }, { status: 403 })
    }

    const buttons = await prisma.floatingButton.findMany({
      orderBy: {
        sortOrder: 'asc',
      },
    })

    return NextResponse.json({
      success: true,
      data: buttons,
    })
  } catch (error) {
    console.error('获取悬浮按钮失败:', error)
    return NextResponse.json(
      { success: false, error: '获取悬浮按钮失败' },
      { status: 500 }
    )
  }
}

/**
 * POST /api/admin/floating-buttons
 * 创建悬浮按钮
 */
export async function POST(request: Request) {
  try {
    const user = await verifyAuth(request)
    if (!user || user.role !== 'admin') {
      return NextResponse.json({ error: '无权限' }, { status: 403 })
    }

    const body = await request.json()
    const { icon, label, url, sortOrder = 0, isActive = true } = body

    if (!icon || !label || !url) {
      return NextResponse.json(
        { success: false, error: '请填写必填字段' },
        { status: 400 }
      )
    }

    // 检查数量限制
    const count = await prisma.floatingButton.count({
      where: { isActive: true },
    })

    if (count >= 5) {
      return NextResponse.json(
        { success: false, error: '最多只能添加5个悬浮按钮' },
        { status: 400 }
      )
    }

    const button = await prisma.floatingButton.create({
      data: {
        icon,
        label,
        url,
        sortOrder,
        isActive,
      },
    })

    return NextResponse.json({
      success: true,
      data: button,
    })
  } catch (error) {
    console.error('创建悬浮按钮失败:', error)
    return NextResponse.json(
      { success: false, error: '创建失败' },
      { status: 500 }
    )
  }
}

