import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyAuth } from '@/lib/auth'

/**
 * GET /api/admin/navigation-menus
 * 获取所有导航菜单（管理员）
 */
export async function GET(request: Request) {
  try {
    const user = await verifyAuth(request)
    if (!user || user.role !== 'admin') {
      return NextResponse.json({ error: '无权限' }, { status: 403 })
    }

    // 获取所有顶级菜单及其子菜单
    const menus = await prisma.navigationMenu.findMany({
      where: {
        parentId: null, // 只获取顶级菜单
      },
      orderBy: {
        sortOrder: 'asc',
      },
      include: {
        children: {
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
      { success: false, error: '获取导航菜单失败' },
      { status: 500 }
    )
  }
}

/**
 * POST /api/admin/navigation-menus
 * 创建导航菜单
 */
export async function POST(request: Request) {
  try {
    const user = await verifyAuth(request)
    if (!user || user.role !== 'admin') {
      return NextResponse.json({ error: '无权限' }, { status: 403 })
    }

    const body = await request.json()
    const { name, href, icon, parentId, sortOrder = 0, isActive = true, openInNewTab = false } = body

    if (!name || !href) {
      return NextResponse.json(
        { success: false, error: '请填写必填字段' },
        { status: 400 }
      )
    }

    const menu = await prisma.navigationMenu.create({
      data: {
        name,
        href,
        icon: icon || null,
        parentId: parentId || null,
        sortOrder,
        isActive,
        openInNewTab,
      },
    })

    return NextResponse.json({
      success: true,
      data: menu,
    })
  } catch (error) {
    console.error('创建导航菜单失败:', error)
    return NextResponse.json(
      { success: false, error: '创建失败' },
      { status: 500 }
    )
  }
}

