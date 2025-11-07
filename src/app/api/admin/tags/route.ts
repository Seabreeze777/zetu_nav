import { NextRequest, NextResponse } from 'next/server';
import { verifyAuth } from '@/lib/auth';
import prisma from '@/lib/prisma';

// 获取所有标签
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
            { name: { contains: search } },
            { slug: { contains: search } }
          ]
        }
      : undefined;

    // 获取标签列表（包含网站和文章统计）
    const tags = await prisma.tag.findMany({
      where,
      orderBy: { id: 'desc' },
      include: {
        _count: {
          select: { 
            websites: true,  // ✅ 统计使用该标签的网站数
            articles: true   // ✅ 统计使用该标签的文章数
          }
        }
      }
    });

    return NextResponse.json(tags);
  } catch (error) {
    console.error('获取标签失败:', error);
    return NextResponse.json({ error: '获取标签失败' }, { status: 500 });
  }
}

// 创建新标签
export async function POST(request: NextRequest) {
  try {
    // 验证管理员权限
    const user = await verifyAuth(request);
    if (!user || user.role !== 'admin') {
      return NextResponse.json({ error: '无权限' }, { status: 403 });
    }

    const body = await request.json();
    const { name, slug, color } = body;

    // 验证必填字段
    if (!name || !slug) {
      return NextResponse.json({ error: '缺少必填字段' }, { status: 400 });
    }

    // 检查 slug 是否已存在
    const existing = await prisma.tag.findUnique({
      where: { slug }
    });

    if (existing) {
      return NextResponse.json({ error: 'URL别名已存在' }, { status: 400 });
    }

    // 创建标签
    const tag = await prisma.tag.create({
      data: {
        name,
        slug,
        color: color || '#3B82F6' // 默认蓝色
      }
    });

    return NextResponse.json(tag);
  } catch (error) {
    console.error('创建标签失败:', error);
    return NextResponse.json({ error: '创建标签失败' }, { status: 500 });
  }
}

