import { NextRequest, NextResponse } from 'next/server'
import { verifyAuth } from '@/lib/auth'
import prisma from '@/lib/prisma'

// GET /api/admin/audit-logs - 获取操作日志列表
export async function GET(request: NextRequest) {
  try {
    // 验证管理员权限
    const user = await verifyAuth(request)
    if (!user || user.role !== 'admin') {
      return NextResponse.json({ error: '无权限' }, { status: 403 })
    }

    // 获取查询参数
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')
    const moduleParam = searchParams.get('module') || undefined
    const action = searchParams.get('action') || undefined
    const userId = searchParams.get('userId') ? parseInt(searchParams.get('userId')!) : undefined

    // 构建查询条件
    const where: any = {}
    if (moduleParam) where.module = moduleParam
    if (action) where.action = action
    if (userId) where.userId = userId

    // 查询总数
    const total = await prisma.auditLog.count({ where })

    // 查询日志列表
    const logs = await prisma.auditLog.findMany({
      where,
      include: {
        user: {
          select: {
            id: true,
            username: true,
            nickname: true,
            avatar: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
      skip: (page - 1) * limit,
      take: limit,
    })

    return NextResponse.json({
      success: true,
      data: logs,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    console.error('获取操作日志失败:', error)
    return NextResponse.json({ error: '获取操作日志失败' }, { status: 500 })
  }
}

