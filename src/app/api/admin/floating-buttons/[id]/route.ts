import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyAuth } from '@/lib/auth'

/**
 * PUT /api/admin/floating-buttons/[id]
 * 更新悬浮按钮
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
    const { icon, label, url, sortOrder, isActive } = body

    const button = await prisma.floatingButton.update({
      where: { id },
      data: {
        ...(icon && { icon }),
        ...(label && { label }),
        ...(url && { url }),
        ...(sortOrder !== undefined && { sortOrder }),
        ...(isActive !== undefined && { isActive }),
      },
    })

    return NextResponse.json({
      success: true,
      data: button,
    })
  } catch (error) {
    console.error('更新悬浮按钮失败:', error)
    return NextResponse.json(
      { success: false, error: '更新失败' },
      { status: 500 }
    )
  }
}

/**
 * DELETE /api/admin/floating-buttons/[id]
 * 删除悬浮按钮
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

    await prisma.floatingButton.delete({
      where: { id },
    })

    return NextResponse.json({
      success: true,
      message: '删除成功',
    })
  } catch (error) {
    console.error('删除悬浮按钮失败:', error)
    return NextResponse.json(
      { success: false, error: '删除失败' },
      { status: 500 }
    )
  }
}

