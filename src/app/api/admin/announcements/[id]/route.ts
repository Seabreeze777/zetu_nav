/**
 * 后台公告管理 API - 单个操作
 * PUT /api/admin/announcements/[id] - 更新公告
 * DELETE /api/admin/announcements/[id] - 删除公告
 */

import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getCurrentUser } from '@/lib/auth'

// PUT - 更新公告
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const currentUser = await getCurrentUser()
    if (!currentUser || currentUser.role !== 'admin') {
      return NextResponse.json(
        { success: false, error: '无权访问' },
        { status: 403 }
      )
    }

    const id = parseInt(params.id)
    const data = await request.json()
    const { title, content, link, icon, sortOrder, isActive, startTime, endTime } = data

    // 验证必填字段
    if (!title || !title.trim()) {
      return NextResponse.json(
        { success: false, error: '公告标题不能为空' },
        { status: 400 }
      )
    }

    const announcement = await prisma.announcement.update({
      where: { id },
      data: {
        title: title.trim(),
        content: content?.trim() || null,
        link: link?.trim() || null,
        icon: icon || '📢',
        sortOrder: sortOrder || 0,
        isActive: isActive !== undefined ? isActive : true,
        startTime: startTime ? new Date(startTime) : null,
        endTime: endTime ? new Date(endTime) : null
      }
    })

    return NextResponse.json({
      success: true,
      data: announcement
    })
  } catch (error: any) {
    console.error('更新公告失败:', error)
    return NextResponse.json(
      { success: false, error: '更新公告失败' },
      { status: 500 }
    )
  }
}

// DELETE - 删除公告
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const currentUser = await getCurrentUser()
    if (!currentUser || currentUser.role !== 'admin') {
      return NextResponse.json(
        { success: false, error: '无权访问' },
        { status: 403 }
      )
    }

    const id = parseInt(params.id)

    await prisma.announcement.delete({
      where: { id }
    })

    return NextResponse.json({
      success: true,
      message: '删除成功'
    })
  } catch (error: any) {
    console.error('删除公告失败:', error)
    return NextResponse.json(
      { success: false, error: '删除公告失败' },
      { status: 500 }
    )
  }
}

