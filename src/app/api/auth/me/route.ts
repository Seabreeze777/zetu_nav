import { NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

/**
 * GET /api/auth/me
 * 获取当前登录用户信息
 */
export async function GET() {
  try {
    const currentUser = await getCurrentUser()

    if (!currentUser) {
      return NextResponse.json(
        {
          success: false,
          error: '未登录',
        },
        { status: 401 }
      )
    }

    // 从数据库获取最新用户信息
    const user = await prisma.user.findUnique({
      where: { id: currentUser.userId },
      select: {
        id: true,
        username: true,
        nickname: true,
        email: true,
        avatar: true,
        role: true,
        isActive: true,
        lastLoginAt: true,
        createdAt: true,
      },
    })

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          error: '用户不存在',
        },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      data: user,
    })
  } catch (error) {
    console.error('获取用户信息失败:', error)
    return NextResponse.json(
      {
        success: false,
        error: '获取用户信息失败',
      },
      { status: 500 }
    )
  }
}

