import { NextRequest, NextResponse } from 'next/server';
import { verifyAuth } from '@/lib/auth';
import prisma from '@/lib/prisma';
import bcrypt from 'bcryptjs';

// 重置用户密码
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // 验证管理员权限
    const user = await verifyAuth(request);
    if (!user || user.role !== 'admin') {
      return NextResponse.json({ error: '无权限' }, { status: 403 });
    }

    const body = await request.json();
    const { newPassword } = body;
    const id = parseInt(params.id);

    if (isNaN(id)) {
      return NextResponse.json({ error: '无效的用户ID' }, { status: 400 });
    }

    if (!newPassword || newPassword.length < 6) {
      return NextResponse.json({ error: '新密码不能少于6个字符' }, { status: 400 });
    }

    // 检查用户是否存在
    const targetUser = await prisma.user.findUnique({
      where: { id }
    });

    if (!targetUser) {
      return NextResponse.json({ error: '用户不存在' }, { status: 404 });
    }

    // 加密新密码
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // 更新密码
    await prisma.user.update({
      where: { id },
      data: {
        password: hashedPassword
      }
    });

    return NextResponse.json({ message: '密码重置成功' });
  } catch (error) {
    console.error('重置密码失败:', error);
    return NextResponse.json({ error: '重置密码失败' }, { status: 500 });
  }
}

