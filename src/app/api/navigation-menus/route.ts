import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

/**
 * GET /api/navigation-menus
 * 获取所有启用的导航菜单（前端使用）
 */
export async function GET() {
  try {
    // 获取所有启用的顶级菜单
    const menus = await prisma.navigationMenu.findMany({
      where: {
        isActive: true,
        parentId: null, // 只获取顶级菜单
      },
      orderBy: {
        sortOrder: 'asc',
      },
      include: {
        children: {
          where: {
            isActive: true,
          },
          orderBy: {
            sortOrder: 'asc',
          },
        },
      },
    })

    return NextResponse.json({
      success: true,
      data: menus,
    })
  } catch (error) {
    console.error('获取导航菜单失败:', error)
    return NextResponse.json(
      {
        success: false,
        error: '获取导航菜单失败',
      },
      { status: 500 }
    )
  }
}

