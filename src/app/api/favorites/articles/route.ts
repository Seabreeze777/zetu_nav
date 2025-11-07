import { NextRequest, NextResponse } from 'next/server';
import { verifyAuth } from '@/lib/auth';
import prisma from '@/lib/prisma';

// 获取用户收藏的文章列表
export async function GET(request: NextRequest) {
  try {
    // 验证用户登录
    const user = await verifyAuth(request);
    if (!user) {
      return NextResponse.json({ error: '请先登录' }, { status: 401 });
    }

    // 获取收藏列表
    const favorites = await prisma.articleFavorite.findMany({
      where: { userId: user.userId },
      include: {
        article: {
          include: {
            category: {
              select: {
                name: true,
                slug: true,
              }
            },
            tags: {
              include: {
                tag: true
              }
            }
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    // 格式化返回数据
    const articles = favorites.map(fav => ({
      ...fav.article,
      tags: fav.article.tags.map(t => t.tag),
      favoritedAt: fav.createdAt
    }));

    return NextResponse.json(articles);
  } catch (error) {
    console.error('获取收藏失败:', error);
    return NextResponse.json({ error: '获取收藏失败' }, { status: 500 });
  }
}

