import { NextRequest, NextResponse } from 'next/server';
import { verifyAuth } from '@/lib/auth';
import prisma from '@/lib/prisma';

// 获取单个用户
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // 验证管理员权限
    const user = await verifyAuth(request);
    if (!user || user.role !== 'admin') {
      return NextResponse.json({ error: '无权限' }, { status: 403 });
    }

    const id = parseInt(params.id);

    if (isNaN(id)) {
      return NextResponse.json({ error: '无效的用户ID' }, { status: 400 });
    }

    const targetUser = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        username: true,
        nickname: true,
        email: true,
        avatar: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      }
    });

    if (!targetUser) {
      return NextResponse.json({ error: '用户不存在' }, { status: 404 });
    }

    return NextResponse.json(targetUser);
  } catch (error) {
    console.error('获取用户失败:', error);
    return NextResponse.json({ error: '获取用户失败' }, { status: 500 });
  }
}

// 更新用户
export async function PUT(
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
    const { nickname, email, avatar, role, status } = body;
    const id = parseInt(params.id);

    if (isNaN(id)) {
      return NextResponse.json({ error: '无效的用户ID' }, { status: 400 });
    }

    // 检查用户是否存在
    const existingUser = await prisma.user.findUnique({
      where: { id }
    });

    if (!existingUser) {
      return NextResponse.json({ error: '用户不存在' }, { status: 404 });
    }

    // 如果修改了邮箱，检查是否与其他用户冲突
    if (email && email !== existingUser.email) {
      const emailExists = await prisma.user.findFirst({
        where: {
          email,
          NOT: { id }
        }
      });

      if (emailExists) {
        return NextResponse.json({ error: '邮箱已被使用' }, { status: 400 });
      }
    }

    // 更新用户
    const updatedUser = await prisma.user.update({
      where: { id },
      data: {
        ...(nickname && { nickname }),
        ...(email !== undefined && { email: email || null }),
        ...(avatar !== undefined && { avatar: avatar || null }),
        ...(role && { role }),
        ...(status && { status })
      },
      select: {
        id: true,
        username: true,
        nickname: true,
        email: true,
        avatar: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      }
    });

    return NextResponse.json(updatedUser);
  } catch (error) {
    console.error('更新用户失败:', error);
    return NextResponse.json({ error: '更新用户失败' }, { status: 500 });
  }
}

// 删除用户
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // 验证管理员权限
    const user = await verifyAuth(request);
    if (!user || user.role !== 'admin') {
      return NextResponse.json({ error: '无权限' }, { status: 403 });
    }

    const id = parseInt(params.id);

    if (isNaN(id)) {
      return NextResponse.json({ error: '无效的用户ID' }, { status: 400 });
    }

    // 不允许删除自己
    if (user.userId === id) {
      return NextResponse.json({ error: '不能删除自己的账号' }, { status: 400 });
    }

    // 检查用户是否存在
    const targetUser = await prisma.user.findUnique({
      where: { id }
    });

    if (!targetUser) {
      return NextResponse.json({ error: '用户不存在' }, { status: 404 });
    }

    // 删除用户
    await prisma.user.delete({
      where: { id }
    });

    return NextResponse.json({ message: '删除成功' });
  } catch (error) {
    console.error('删除用户失败:', error);
    return NextResponse.json({ error: '删除用户失败' }, { status: 500 });
  }
}

