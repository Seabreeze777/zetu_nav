/**
 * 后台公告管理 API
 * GET /api/admin/announcements - 获取公告列表
 * POST /api/admin/announcements - 创建公告
 */

import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getCurrentUser } from '@/lib/auth'

// GET - 获取公告列表
export async function GET() {
  try {
    const currentUser = await getCurrentUser()
    if (!currentUser || currentUser.role !== 'admin') {
      return NextResponse.json(
        { success: false, error: '无权访问' },
        { status: 403 }
      )
    }

    const announcements = await prisma.announcement.findMany({
      orderBy: [
        { sortOrder: 'asc' },
        { createdAt: 'desc' }
      ]
    })

    return NextResponse.json({
      success: true,
      data: announcements
    })
  } catch (error: any) {
    console.error('获取公告列表失败:', error)
    return NextResponse.json(
      { success: false, error: '获取公告列表失败' },
      { status: 500 }
    )
  }
}

// POST - 创建公告
export async function POST(request: NextRequest) {
  try {
    const currentUser = await getCurrentUser()
    if (!currentUser || currentUser.role !== 'admin') {
      return NextResponse.json(
        { success: false, error: '无权访问' },
        { status: 403 }
      )
    }

    const data = await request.json()
    const { title, content, link, icon, sortOrder, isActive, startTime, endTime } = data

    // 验证必填字段
    if (!title || !title.trim()) {
      return NextResponse.json(
        { success: false, error: '公告标题不能为空' },
        { status: 400 }
      )
    }

    const announcement = await prisma.announcement.create({
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
    console.error('创建公告失败:', error)
    return NextResponse.json(
      { success: false, error: '创建公告失败' },
      { status: 500 }
    )
  }
}

