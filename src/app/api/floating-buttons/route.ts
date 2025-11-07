import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

/**
 * GET /api/floating-buttons
 * 获取所有启用的悬浮按钮
 */
export async function GET() {
  try {
    const buttons = await prisma.floatingButton.findMany({
      where: {
        isActive: true,
      },
      orderBy: {
        sortOrder: 'asc',
      },
      take: 5, // 最多5个
    })

    return NextResponse.json({
      success: true,
      data: buttons,
    })
  } catch (error) {
    console.error('获取悬浮按钮失败:', error)
    return NextResponse.json(
      {
        success: false,
        error: '获取悬浮按钮失败',
      },
      { status: 500 }
    )
  }
}

