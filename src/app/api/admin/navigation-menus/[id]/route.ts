import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyAuth } from '@/lib/auth'

/**
 * PUT /api/admin/navigation-menus/[id]
 * 更新导航菜单
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await verifyAuth(request)
    if (!user || user.role !== 'admin') {
      return NextResponse.json({ error: '无权限' }, { status: 403 })
    }

    const id = parseInt(params.id)
    if (isNaN(id)) {
      return NextResponse.json({ error: '无效的ID' }, { status: 400 })
    }

    const body = await request.json()
    const { name, href, icon, parentId, sortOrder, isActive, openInNewTab } = body

    const menu = await prisma.navigationMenu.update({
      where: { id },
      data: {
        ...(name && { name }),
        ...(href && { href }),
        ...(icon !== undefined && { icon: icon || null }),
        ...(parentId !== undefined && { parentId: parentId || null }),
        ...(sortOrder !== undefined && { sortOrder }),
        ...(isActive !== undefined && { isActive }),
        ...(openInNewTab !== undefined && { openInNewTab }),
      },
    })

    return NextResponse.json({
      success: true,
      data: menu,
    })
  } catch (error) {
    console.error('更新导航菜单失败:', error)
    return NextResponse.json(
      { success: false, error: '更新失败' },
      { status: 500 }
    )
  }
}

/**
 * DELETE /api/admin/navigation-menus/[id]
 * 删除导航菜单
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await verifyAuth(request)
    if (!user || user.role !== 'admin') {
      return NextResponse.json({ error: '无权限' }, { status: 403 })
    }

    const id = parseInt(params.id)
    if (isNaN(id)) {
      return NextResponse.json({ error: '无效的ID' }, { status: 400 })
    }

    await prisma.navigationMenu.delete({
      where: { id },
    })

    return NextResponse.json({
      success: true,
      message: '删除成功',
    })
  } catch (error) {
    console.error('删除导航菜单失败:', error)
    return NextResponse.json(
      { success: false, error: '删除失败' },
      { status: 500 }
    )
  }
}

