import { NextRequest, NextResponse } from 'next/server';
import { verifyAuth } from '@/lib/auth';
import prisma from '@/lib/prisma';

// 更新个人信息
export async function PUT(request: NextRequest) {
  try {
    // 验证用户登录
    const user = await verifyAuth(request);
    if (!user) {
      return NextResponse.json({ error: '请先登录' }, { status: 401 });
    }

    const body = await request.json();
    const { nickname, email, avatar } = body;

    // 验证昵称
    if (nickname && nickname.trim().length === 0) {
      return NextResponse.json({ error: '昵称不能为空' }, { status: 400 });
    }

    // 如果修改了邮箱，检查是否与其他用户冲突
    if (email) {
      const existingUser = await prisma.user.findFirst({
        where: {
          email,
          NOT: { id: user.userId }
        }
      });

      if (existingUser) {
        return NextResponse.json({ error: '该邮箱已被使用' }, { status: 400 });
      }
    }

    // 更新用户信息
    const updatedUser = await prisma.user.update({
      where: { id: user.userId },
      data: {
        ...(nickname !== undefined && { nickname: nickname.trim() }),
        ...(email !== undefined && { email: email || null }),
        ...(avatar !== undefined && { avatar: avatar || null })
      },
      select: {
        id: true,
        username: true,
        nickname: true,
        email: true,
        avatar: true,
        role: true,
      }
    });

    return NextResponse.json({
      success: true,
      data: updatedUser,
      message: '更新成功'
    });
  } catch (error) {
    console.error('更新个人信息失败:', error);
    return NextResponse.json({ error: '更新失败' }, { status: 500 });
  }
}

