import { NextRequest, NextResponse } from 'next/server'
import { verifyAuth } from '@/lib/auth'
import prisma from '@/lib/prisma'

// GET /api/admin/audit-logs/stats - 获取操作日志统计
export async function GET(request: NextRequest) {
  try {
    // 验证管理员权限
    const user = await verifyAuth(request)
    if (!user || user.role !== 'admin') {
      return NextResponse.json({ error: '无权限' }, { status: 403 })
    }

    // 获取总日志数
    const totalLogs = await prisma.auditLog.count()

    // 按操作类型统计
    const actionStats = await prisma.auditLog.groupBy({
      by: ['action'],
      _count: true,
    })

    // 按模块统计
    const moduleStats = await prisma.auditLog.groupBy({
      by: ['module'],
      _count: true,
    })

    // 最近7天的日志数量（按天统计）
    const sevenDaysAgo = new Date()
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)

    const recentLogs = await prisma.auditLog.findMany({
      where: {
        createdAt: {
          gte: sevenDaysAgo,
        },
      },
      select: {
        createdAt: true,
      },
    })

    // 按天分组统计
    const dailyStats: Record<string, number> = {}
    recentLogs.forEach(log => {
      const date = log.createdAt.toISOString().split('T')[0]
      dailyStats[date] = (dailyStats[date] || 0) + 1
    })

    // 最活跃的用户（操作次数Top 10）
    const topUsers = await prisma.auditLog.groupBy({
      by: ['userId'],
      _count: true,
      orderBy: {
        _count: {
          userId: 'desc',
        },
      },
      take: 10,
    })

    // 获取用户详细信息
    const userIds = topUsers.map(item => item.userId)
    const users = await prisma.user.findMany({
      where: {
        id: {
          in: userIds,
        },
      },
      select: {
        id: true,
        username: true,
        nickname: true,
        avatar: true,
      },
    })

    const topUsersWithInfo = topUsers.map(item => ({
      ...item,
      user: users.find(u => u.id === item.userId),
    }))

    return NextResponse.json({
      success: true,
      data: {
        totalLogs,
        actionStats: actionStats.map(item => ({
          action: item.action,
          count: item._count,
        })),
        moduleStats: moduleStats.map(item => ({
          module: item.module,
          count: item._count,
        })),
        dailyStats: Object.entries(dailyStats).map(([date, count]) => ({
          date,
          count,
        })),
        topUsers: topUsersWithInfo,
      },
    })
  } catch (error) {
    console.error('获取操作日志统计失败:', error)
    return NextResponse.json({ error: '获取操作日志统计失败' }, { status: 500 })
  }
}

