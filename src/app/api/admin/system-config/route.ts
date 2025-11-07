import { NextRequest, NextResponse } from 'next/server';
import { verifyAuth } from '@/lib/auth';
import prisma from '@/lib/prisma';

// 获取配置列表（按分类）
export async function GET(request: NextRequest) {
  try {
    const user = await verifyAuth(request);
    if (!user || user.role !== 'admin') {
      return NextResponse.json({ error: '无权限' }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');

    const configs = await prisma.systemConfig.findMany({
      where: category ? { category } : undefined,
      orderBy: [{ category: 'asc' }, { sortOrder: 'asc' }],
    });

    // 对于敏感配置，不返回明文值
    const safeConfigs = configs.map(config => ({
      ...config,
      value: config.isSecret ? '******' : config.value,
    }));

    return NextResponse.json({ success: true, data: safeConfigs });
  } catch (error) {
    console.error('获取配置失败:', error);
    return NextResponse.json({ error: '获取配置失败' }, { status: 500 });
  }
}

// 创建新配置
export async function POST(request: NextRequest) {
  try {
    const user = await verifyAuth(request);
    if (!user || user.role !== 'admin') {
      return NextResponse.json({ error: '无权限' }, { status: 403 });
    }

    const body = await request.json();
    const { category, key, value, label, description, type, isSecret, sortOrder } = body;

    // 验证必填字段
    if (!category || !key || !label) {
      return NextResponse.json({ error: '缺少必填字段' }, { status: 400 });
    }

    // 检查是否已存在
    const existing = await prisma.systemConfig.findUnique({
      where: {
        category_key: { category, key }
      }
    });

    if (existing) {
      return NextResponse.json({ error: '该配置已存在' }, { status: 400 });
    }

    const config = await prisma.systemConfig.create({
      data: {
        category,
        key,
        value: value || '',
        label,
        description,
        type: type || 'text',
        isSecret: isSecret || false,
        sortOrder: sortOrder || 0,
      },
    });

    return NextResponse.json({ success: true, data: config });
  } catch (error) {
    console.error('创建配置失败:', error);
    return NextResponse.json({ error: '创建配置失败' }, { status: 500 });
  }
}

