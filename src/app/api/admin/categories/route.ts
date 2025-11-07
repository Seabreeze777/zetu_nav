import { NextRequest, NextResponse } from 'next/server';
import { verifyAuth } from '@/lib/auth';
import prisma from '@/lib/prisma';

// 获取所有分类（网站分类或文章分类）
export async function GET(request: NextRequest) {
  try {
    // 验证管理员权限
    const user = await verifyAuth(request);
    if (!user || user.role !== 'admin') {
      return NextResponse.json({ error: '无权限' }, { status: 403 });
    }

    // 从查询参数获取分类类型
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type'); // 'navigation' 或 'article'

    if (type === 'navigation') {
      // 获取网站分类
      const categories = await prisma.category.findMany({
        orderBy: { sortOrder: 'asc' },
        include: {
          _count: {
            select: { websites: true }
          }
        }
      });

      // 返回时添加order字段映射（兼容前端）
      const categoriesWithOrder = categories.map(cat => ({
        ...cat,
        order: cat.sortOrder
      }));

      return NextResponse.json(categoriesWithOrder);
    } else if (type === 'article') {
      // 获取文章分类
      const categories = await prisma.articleCategory.findMany({
        orderBy: { sortOrder: 'asc' },
        include: {
          _count: {
            select: { articles: true }
          }
        }
      });

      // 返回时添加order字段映射（兼容前端）
      const categoriesWithOrder = categories.map(cat => ({
        ...cat,
        order: cat.sortOrder
      }));

      return NextResponse.json(categoriesWithOrder);
    } else {
      return NextResponse.json({ error: '无效的分类类型' }, { status: 400 });
    }
  } catch (error) {
    console.error('获取分类失败:', error);
    return NextResponse.json({ error: '获取分类失败' }, { status: 500 });
  }
}

// 创建新分类
export async function POST(request: NextRequest) {
  try {
    // 验证管理员权限
    const user = await verifyAuth(request);
    if (!user || user.role !== 'admin') {
      return NextResponse.json({ error: '无权限' }, { status: 403 });
    }

    const body = await request.json();
    const { type, name, slug, description, icon, cardsPerRow, displayMode, sortOrder } = body;

    // 验证必填字段
    if (!type || !name || !slug) {
      return NextResponse.json({ error: '缺少必填字段' }, { status: 400 });
    }

    if (type === 'navigation') {
      // 检查 slug 是否已存在
      const existing = await prisma.category.findUnique({
        where: { slug }
      });

      if (existing) {
        return NextResponse.json({ error: 'URL别名已存在' }, { status: 400 });
      }

      // 创建网站分类
      const category = await prisma.category.create({
        data: {
          name,
          slug,
          description: description || '',
          icon: icon || '📁',
          cardsPerRow: cardsPerRow || 6,
          displayMode: displayMode || 'compact',
          sortOrder: sortOrder || 0
        }
      });

      return NextResponse.json({
        ...category,
        order: category.sortOrder
      });
    } else if (type === 'article') {
      // 检查 slug 是否已存在
      const existing = await prisma.articleCategory.findUnique({
        where: { slug }
      });

      if (existing) {
        return NextResponse.json({ error: 'URL别名已存在' }, { status: 400 });
      }

      // 创建文章分类
      const category = await prisma.articleCategory.create({
        data: {
          name,
          slug,
          description: description || '',
          icon: icon || '📝',
          sortOrder: sortOrder || 0
        }
      });

      return NextResponse.json(category);
    } else {
      return NextResponse.json({ error: '无效的分类类型' }, { status: 400 });
    }
  } catch (error) {
    console.error('创建分类失败:', error);
    return NextResponse.json({ error: '创建分类失败' }, { status: 500 });
  }
}

