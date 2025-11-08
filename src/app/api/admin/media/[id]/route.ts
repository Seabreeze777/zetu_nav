import { NextRequest, NextResponse } from 'next/server'
import { verifyAuth } from '@/lib/auth'
import prisma from '@/lib/prisma'
import { deleteFromCOS } from '@/lib/cos'

// PATCH /api/admin/media/:id - 更新媒体信息
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await verifyAuth(request)
    if (!user) {
      return NextResponse.json({ success: false, error: '未授权' }, { status: 401 })
    }

    const id = parseInt(params.id)
    const body = await request.json()
    const { folder, description, tags } = body

    const updatedMedia = await prisma.media.update({
      where: { id },
      data: {
        ...(folder !== undefined && { folder }),
        ...(description !== undefined && { description }),
        ...(tags !== undefined && { tags }),
      },
    })

    return NextResponse.json({
      success: true,
      data: updatedMedia,
    })
  } catch (error) {
    console.error('更新媒体失败:', error)
    return NextResponse.json(
      { success: false, error: '更新失败' },
      { status: 500 }
    )
  }
}

// DELETE /api/admin/media/:id - 删除媒体
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await verifyAuth(request)
    if (!user) {
      return NextResponse.json({ success: false, error: '未授权' }, { status: 401 })
    }

    const id = parseInt(params.id)
    
    // 获取媒体信息
    const media = await prisma.media.findUnique({
      where: { id },
    })

    if (!media) {
      return NextResponse.json(
        { success: false, error: '文件不存在' },
        { status: 404 }
      )
    }

    // 从 COS 删除文件
    try {
      await deleteFromCOS(media.cosKey)
    } catch (error) {
      console.error('从 COS 删除文件失败:', error)
      // 继续删除数据库记录
    }

    // 从数据库删除
    await prisma.media.delete({
      where: { id },
    })

    return NextResponse.json({
      success: true,
      message: '删除成功',
    })
  } catch (error) {
    console.error('删除媒体失败:', error)
    return NextResponse.json(
      { success: false, error: '删除失败' },
      { status: 500 }
    )
  }
}
