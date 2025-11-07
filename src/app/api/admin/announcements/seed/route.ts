/**
 * 公告初始化API（仅开发环境使用）
 * GET /api/admin/announcements/seed
 */

import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getCurrentUser } from '@/lib/auth'

export async function GET() {
  try {
    // 仅管理员可用
    const currentUser = await getCurrentUser()
    if (!currentUser || currentUser.role !== 'admin') {
      return NextResponse.json(
        { success: false, error: '无权访问' },
        { status: 403 }
      )
    }

    // 清空现有数据
    await prisma.announcement.deleteMany({})

    // 插入初始数据
    const announcements = await prisma.announcement.createMany({
      data: [
        {
          title: '🎉 欢迎使用泽途网！',
          content: '一站式导航平台，精选优质网站和工具，让您的工作效率翻倍！',
          icon: '🎉',
          sortOrder: 1,
          isActive: true
        },
        {
          title: '✨ 全新搜索引擎切换功能上线',
          content: '现在可以在百度、Google、Bing之间快速切换，找资源更方便！',
          icon: '✨',
          sortOrder: 2,
          isActive: true
        },
        {
          title: '🚀 已收录 286+ 优质网站和工具',
          content: '涵盖开发工具、设计资源、AI工具、在线学习等12大分类，持续更新中',
          link: '/',
          icon: '🚀',
          sortOrder: 3,
          isActive: true
        },
        {
          title: '📚 资讯中心每日更新技术文章',
          content: '技术干货、行业资讯、学习教程，助您紧跟行业前沿',
          link: '/articles',
          icon: '📚',
          sortOrder: 4,
          isActive: true
        },
        {
          title: '💡 欢迎提交您喜欢的网站',
          content: '如果您有好的网站推荐，欢迎联系我们收录！让更多人发现优质资源',
          icon: '💡',
          sortOrder: 5,
          isActive: true
        }
      ]
    })

    return NextResponse.json({
      success: true,
      message: `成功插入 ${announcements.count} 条公告`,
      data: announcements
    })
  } catch (error: any) {
    console.error('初始化公告失败:', error)
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    )
  }
}

