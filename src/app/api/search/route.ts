import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const q = searchParams.get('q'); // 搜索关键词
    const type = searchParams.get('type'); // 类型：website, article, all

    if (!q) {
      return NextResponse.json({ error: '请输入搜索关键词' }, { status: 400 });
    }

    const results: any = {
      query: q,
      websites: [],
      articles: [],
    };

    // 搜索网站
    if (!type || type === 'all' || type === 'website') {
      results.websites = await prisma.website.findMany({
        where: {
          isActive: true,
          OR: [
            { name: { contains: q } },
            { description: { contains: q } },
            { url: { contains: q } },
          ],
        },
        include: {
          category: {
            select: {
              name: true,
              slug: true,
            },
          },
        },
        take: 20, // 最多返回20条
        orderBy: {
          clickCount: 'desc', // 按点击量排序
        },
      });
    }

    // 搜索文章
    if (!type || type === 'all' || type === 'article') {
      results.articles = await prisma.article.findMany({
        where: {
          isPublished: true,
          OR: [
            { title: { contains: q } },
            { content: { contains: q } },
          ],
        },
        include: {
          category: {
            select: {
              name: true,
              slug: true,
            },
          },
          tags: {
            select: {
              tag: {
                select: {
                  name: true,
                  slug: true,
                  color: true,
                }
              }
            },
          },
        },
        take: 20, // 最多返回20条
        orderBy: {
          views: 'desc', // 按浏览量排序
        },
      });
    }

    // 统计结果数量
    results.total = {
      websites: results.websites.length,
      articles: results.articles.length,
      all: results.websites.length + results.articles.length,
    };

    return NextResponse.json(results);
  } catch (error) {
    console.error('搜索失败:', error);
    return NextResponse.json({ error: '搜索失败' }, { status: 500 });
  }
}

