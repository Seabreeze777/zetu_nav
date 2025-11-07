import { NextRequest, NextResponse } from 'next/server';
import { verifyAuth } from '@/lib/auth';
import prisma from '@/lib/prisma';
import bcrypt from 'bcryptjs';

// 修改密码
export async function PUT(request: NextRequest) {
  try {
    // 验证用户登录
    const user = await verifyAuth(request);
    if (!user) {
      return NextResponse.json({ error: '请先登录' }, { status: 401 });
    }

    const body = await request.json();
    const { oldPassword, newPassword } = body;

    // 验证必填字段
    if (!oldPassword || !newPassword) {
      return NextResponse.json({ error: '请填写完整信息' }, { status: 400 });
    }

    // 验证新密码长度
    if (newPassword.length < 6) {
      return NextResponse.json({ error: '新密码不能少于6个字符' }, { status: 400 });
    }

    // 获取用户完整信息（包括密码）
    const userWithPassword = await prisma.user.findUnique({
      where: { id: user.userId }
    });

    if (!userWithPassword) {
      return NextResponse.json({ error: '用户不存在' }, { status: 404 });
    }

    // 验证旧密码
    const isPasswordValid = await bcrypt.compare(oldPassword, userWithPassword.password);
    if (!isPasswordValid) {
      return NextResponse.json({ error: '原密码错误' }, { status: 400 });
    }

    // 加密新密码
    const hashedNewPassword = await bcrypt.hash(newPassword, 10);

    // 更新密码
    await prisma.user.update({
      where: { id: user.userId },
      data: {
        password: hashedNewPassword
      }
    });

    return NextResponse.json({
      success: true,
      message: '密码修改成功'
    });
  } catch (error) {
    console.error('修改密码失败:', error);
    return NextResponse.json({ error: '修改失败' }, { status: 500 });
  }
}

