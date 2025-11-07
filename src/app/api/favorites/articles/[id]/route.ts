import { NextRequest, NextResponse } from 'next/server';
import { verifyAuth } from '@/lib/auth';
import prisma from '@/lib/prisma';

// 收藏/取消收藏文章
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // 验证用户登录
    const user = await verifyAuth(request);
    if (!user) {
      return NextResponse.json({ error: '请先登录' }, { status: 401 });
    }

    const articleId = parseInt(params.id);
    if (isNaN(articleId)) {
      return NextResponse.json({ error: '无效的文章ID' }, { status: 400 });
    }

    // 检查文章是否存在
    const article = await prisma.article.findUnique({
      where: { id: articleId }
    });

    if (!article) {
      return NextResponse.json({ error: '文章不存在' }, { status: 404 });
    }

    // 检查是否已收藏
    const existing = await prisma.articleFavorite.findUnique({
      where: {
        userId_articleId: {
          userId: user.userId,
          articleId: articleId
        }
      }
    });

    if (existing) {
      // 已收藏，取消收藏
      await prisma.articleFavorite.delete({
        where: { id: existing.id }
      });

      return NextResponse.json({
        favorited: false,
        message: '已取消收藏'
      });
    } else {
      // 未收藏，添加收藏
      await prisma.articleFavorite.create({
        data: {
          userId: user.userId,
          articleId: articleId
        }
      });

      return NextResponse.json({
        favorited: true,
        message: '收藏成功'
      });
    }
  } catch (error) {
    console.error('收藏操作失败:', error);
    return NextResponse.json({ error: '操作失败' }, { status: 500 });
  }
}

// 检查是否已收藏
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // 验证用户登录
    const user = await verifyAuth(request);
    if (!user) {
      return NextResponse.json({ favorited: false });
    }

    const articleId = parseInt(params.id);
    if (isNaN(articleId)) {
      return NextResponse.json({ error: '无效的文章ID' }, { status: 400 });
    }

    // 检查是否已收藏
    const existing = await prisma.articleFavorite.findUnique({
      where: {
        userId_articleId: {
          userId: user.userId,
          articleId: articleId
        }
      }
    });

    return NextResponse.json({ favorited: !!existing });
  } catch (error) {
    console.error('检查收藏状态失败:', error);
    return NextResponse.json({ favorited: false });
  }
}

