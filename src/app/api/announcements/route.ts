/**
 * 公告 API - 前台获取
 * GET /api/announcements - 获取启用的公告列表
 */

import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const now = new Date()

    const announcements = await prisma.announcement.findMany({
      where: {
        isActive: true,
        // 如果设置了时间范围，则检查；否则永久显示
        OR: [
          // 有时间范围的，检查是否在范围内
          {
            AND: [
              { startTime: { not: null, lte: now } },
              { endTime: { not: null, gte: now } }
            ]
          },
          // 没有设置开始时间的（永久显示）
          { startTime: null },
          // 没有设置结束时间的（永久显示）
          { endTime: null }
        ]
      },
    orderBy: [
      { sortOrder: 'asc' },
      { createdAt: 'desc' }
    ],
    take: 10, // 获取所有公告
      select: {
        id: true,
        title: true,
        content: true,
        link: true,
        icon: true
      }
    })

    return NextResponse.json({
      success: true,
      data: announcements
    })
  } catch (error: any) {
    console.error('获取公告失败:', error)
    return NextResponse.json(
      { success: false, error: '获取公告失败' },
      { status: 500 }
    )
  }
}

