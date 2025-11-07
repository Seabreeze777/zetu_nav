/**
 * UI配置API - 获取前端UI配置
 * GET /api/ui-settings - 获取UI配置（公开接口）
 */

import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    // 获取或创建UI配置（表中只保留一条记录）
    let settings = await prisma.uiSettings.findFirst()
    
    if (!settings) {
      // 如果不存在，创建默认配置
      settings = await prisma.uiSettings.create({
        data: {
          heroStyle: '4', // 默认样式4（极简打字机）
          showAnnouncementBanner: true, // 默认显示公告栏
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

