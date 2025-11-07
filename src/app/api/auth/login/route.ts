import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'
import { generateToken, setAuthCookie } from '@/lib/auth'

/**
 * POST /api/auth/login
 * 用户登录
 */
export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { username, password } = body

    // 验证输入
    if (!username || !password) {
      return NextResponse.json(
        {
          success: false,
          error: '请输入用户名和密码',
        },
        { status: 400 }
      )
    }

    // 查找用户
    const user = await prisma.user.findUnique({
      where: { username },
    })

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          error: '用户名或密码错误',
        },
        { status: 401 }
      )
    }

    // 检查用户是否激活
    if (!user.isActive) {
      return NextResponse.json(
        {
          success: false,
          error: '账号已被禁用',
        },
        { status: 403 }
      )
    }

    // 验证密码
    const isPasswordValid = await bcrypt.compare(password, user.password)

    if (!isPasswordValid) {
      return NextResponse.json(
        {
          success: false,
          error: '用户名或密码错误',
        },
        { status: 401 }
      )
    }

    // 生成 JWT Token
    const token = generateToken({
      userId: user.id,
      username: user.username,
      role: user.role,
    })

    // 设置 Cookie
    await setAuthCookie(token)

    // 更新最后登录时间
    await prisma.user.update({
      where: { id: user.id },
      data: { lastLoginAt: new Date() },
    })

    return NextResponse.json({
      success: true,
      data: {
        user: {
          id: user.id,
          username: user.username,
          nickname: user.nickname,
          email: user.email,
          role: user.role,
        },
        token,
      },
    })
  } catch (error) {
    console.error('登录失败:', error)
    return NextResponse.json(
      {
        success: false,
        error: '登录失败，请稍后重试',
      },
      { status: 500 }
    )
  }
}

