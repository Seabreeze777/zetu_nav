import { NextRequest, NextResponse } from 'next/server'
import { verifyAuth } from '@/lib/auth'
import prisma from '@/lib/prisma'

// GET /api/admin/dashboard/stats - 获取仪表盘统计数据
export async function GET(request: NextRequest) {
  try {
    // 验证管理员权限
    const user = await verifyAuth(request)
    if (!user || user.role !== 'admin') {
      return NextResponse.json({ error: '无权限' }, { status: 403 })
    }

    // 并行查询所有统计数据
    const [
      websiteCount,
      articleCount,
      userCount,
      categoryCount,
      tagCount,
      mediaCount,
      topWebsites,
      topArticles,
      recentActivities,
    ] = await Promise.all([
      // 网站总数
      prisma.website.count(),

      // 文章总数
      prisma.article.count(),

      // 用户总数
      prisma.user.count(),

      // 分类总数
      prisma.category.count(),

      // 标签总数
      prisma.tag.count(),

      // 媒体文件总数
      prisma.media.count(),

      // 热门网站（点击量Top 10）
      prisma.website.findMany({
        select: {
          id: true,
          name: true,
          clickCount: true,
          logoUrl: true,
        },
        orderBy: {
          clickCount: 'desc',
        },
        take: 10,
      }),

      // 热门文章（浏览量Top 10）
      prisma.article.findMany({
        select: {
          id: true,
          title: true,
          views: true,
          coverImage: true,
        },
        orderBy: {
          views: 'desc',
        },
        take: 10,
      }),

      // 最近操作日志（最新20条）
      prisma.auditLog.findMany({
        include: {
          user: {
            select: {
              id: true,
              username: true,
              nickname: true,
            },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
        take: 20,
      }),
    ])

    // 计算今日新增
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    const [todayWebsites, todayArticles, todayUsers] = await Promise.all([
      prisma.website.count({
        where: {
          createdAt: {
            gte: today,
          },
        },
      }),
      prisma.article.count({
        where: {
          createdAt: {
            gte: today,
          },
        },
      }),
      prisma.user.count({
        where: {
          createdAt: {
            gte: today,
          },
        },
      }),
    ])

    // 计算本周新增
    const weekAgo = new Date()
    weekAgo.setDate(weekAgo.getDate() - 7)
    weekAgo.setHours(0, 0, 0, 0)

    const [weekWebsites, weekArticles, weekUsers] = await Promise.all([
      prisma.website.count({
        where: {
          createdAt: {
            gte: weekAgo,
          },
        },
      }),
      prisma.article.count({
        where: {
          createdAt: {
            gte: weekAgo,
          },
        },
      }),
      prisma.user.count({
        where: {
          createdAt: {
            gte: weekAgo,
          },
        },
      }),
    ])

    // 最近7天的数据趋势
    const last7Days = []
    for (let i = 6; i >= 0; i--) {
      const date = new Date()
      date.setDate(date.getDate() - i)
      date.setHours(0, 0, 0, 0)
      const nextDate = new Date(date)
      nextDate.setDate(nextDate.getDate() + 1)

      const [websites, articles] = await Promise.all([
        prisma.website.count({
          where: {
            createdAt: {
              gte: date,
              lt: nextDate,
            },
          },
        }),
        prisma.article.count({
          where: {
            createdAt: {
              gte: date,
              lt: nextDate,
            },
          },
        }),
      ])

      last7Days.push({
        date: date.toISOString().split('T')[0],
        websites,
        articles,
      })
    }

    return NextResponse.json({
      success: true,
      data: {
        // 总数统计
        totals: {
          websites: websiteCount,
          articles: articleCount,
          users: userCount,
          categories: categoryCount,
          tags: tagCount,
          media: mediaCount,
        },
        // 今日新增
        today: {
          websites: todayWebsites,
          articles: todayArticles,
          users: todayUsers,
        },
        // 本周新增
        week: {
          websites: weekWebsites,
          articles: weekArticles,
          users: weekUsers,
        },
        // 热门内容
        popular: {
          websites: topWebsites,
          articles: topArticles,
        },
        // 最近活动
        recentActivities,
        // 数据趋势
        trends: last7Days,
      },
    })
  } catch (error) {
    console.error('获取仪表盘统计失败:', error)
    return NextResponse.json({ error: '获取统计数据失败' }, { status: 500 })
  }
}

