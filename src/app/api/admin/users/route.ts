import { NextRequest, NextResponse } from 'next/server';
import { verifyAuth } from '@/lib/auth';
import prisma from '@/lib/prisma';
import bcrypt from 'bcryptjs';

// 获取所有用户
export async function GET(request: NextRequest) {
  try {
    // 验证管理员权限
    const user = await verifyAuth(request);
    if (!user || user.role !== 'admin') {
      return NextResponse.json({ error: '无权限' }, { status: 403 });
    }

    // 从查询参数获取搜索关键词
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search');

    // 构建查询条件
    const where = search
      ? {
          OR: [
            { username: { contains: search } },
            { nickname: { contains: search } },
            { email: { contains: search } }
          ]
        }
      : undefined;

    // 获取用户列表（不返回密码）
    const users = await prisma.user.findMany({
      where,
      orderBy: { createdAt: 'desc' },
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

    return NextResponse.json(users);
  } catch (error) {
    console.error('获取用户失败:', error);
    return NextResponse.json({ error: '获取用户失败' }, { status: 500 });
  }
}

// 创建新用户
export async function POST(request: NextRequest) {
  try {
    // 验证管理员权限
    const user = await verifyAuth(request);
    if (!user || user.role !== 'admin') {
      return NextResponse.json({ error: '无权限' }, { status: 403 });
    }

    const body = await request.json();
    const { username, password, nickname, email, avatar, role } = body;

    // 验证必填字段
    if (!username || !password) {
      return NextResponse.json({ error: '用户名和密码不能为空' }, { status: 400 });
    }

    // 检查用户名是否已存在
    const existingUsername = await prisma.user.findUnique({
      where: { username }
    });

    if (existingUsername) {
      return NextResponse.json({ error: '用户名已存在' }, { status: 400 });
    }

    // 检查邮箱是否已存在
    if (email) {
      const existingEmail = await prisma.user.findFirst({
        where: { email }
      });

      if (existingEmail) {
        return NextResponse.json({ error: '邮箱已被使用' }, { status: 400 });
      }
    }

    // 加密密码
    const hashedPassword = await bcrypt.hash(password, 10);

    // 创建用户
    const newUser = await prisma.user.create({
      data: {
        username,
        password: hashedPassword,
        nickname: nickname || username,
        email: email || null,
        avatar: avatar || null,
        role: role || 'USER'
      },
      select: {
        id: true,
        username: true,
        nickname: true,
        email: true,
        avatar: true,
        role: true,
        createdAt: true,
      }
    });

    return NextResponse.json(newUser);
  } catch (error) {
    console.error('创建用户失败:', error);
    return NextResponse.json({ error: '创建用户失败' }, { status: 500 });
  }
}

