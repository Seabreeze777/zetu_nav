import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getCurrentUser } from '@/lib/auth'

/**
 * POST /api/favorites/[articleId]
 * 收藏文章
 */
export async function POST(
  request: Request,
  { params }: { params: { articleId: string } }
) {
  try {
    const articleId = parseInt(params.articleId)
    if (isNaN(articleId)) {
      return NextResponse.json(
        { success: false, error: '无效的文章ID' },
        { status: 400 }
      )
    }

    // 验证登录
    const currentUser = await getCurrentUser()
    if (!currentUser) {
      return NextResponse.json(
        { success: false, error: '请先登录' },
        { status: 401 }
      )
    }

    // 检查文章是否存在
    const article = await prisma.article.findUnique({
      where: { id: articleId, isPublished: true },
    })

    if (!article) {
      return NextResponse.json(
        { success: false, error: '文章不存在' },
        { status: 404 }
      )
    }

    // 检查是否已收藏
    const existingFavorite = await prisma.articleFavorite.findUnique({
      where: {
        userId_articleId: {
          userId: currentUser.userId,
          articleId,
        },
      },
    })

    if (existingFavorite) {
      return NextResponse.json(
        { success: false, error: '已经收藏过了' },
        { status: 400 }
      )
    }

    // 创建收藏记录
    await prisma.articleFavorite.create({
      data: {
        userId: currentUser.userId,
        articleId,
      },
    })

    return NextResponse.json({
      success: true,
      message: '收藏成功',
    })
  } catch (error) {
    console.error('收藏失败:', error)
    return NextResponse.json(
      { success: false, error: '收藏失败' },
      { status: 500 }
    )
  }
}

/**
 * DELETE /api/favorites/[articleId]
 * 取消收藏文章
 */
export async function DELETE(
  request: Request,
  { params }: { params: { articleId: string } }
) {
  try {
    const articleId = parseInt(params.articleId)
    if (isNaN(articleId)) {
      return NextResponse.json(
        { success: false, error: '无效的文章ID' },
        { status: 400 }
      )
    }

    // 验证登录
    const currentUser = await getCurrentUser()
    if (!currentUser) {
      return NextResponse.json(
        { success: false, error: '请先登录' },
        { status: 401 }
      )
    }

    // 删除收藏记录
    await prisma.articleFavorite.delete({
      where: {
        userId_articleId: {
          userId: currentUser.userId,
          articleId,
        },
      },
    })

    return NextResponse.json({
      success: true,
      message: '取消收藏成功',
    })
  } catch (error) {
    console.error('取消收藏失败:', error)
    return NextResponse.json(
      { success: false, error: '取消收藏失败' },
      { status: 500 }
    )
  }
}

/**
 * GET /api/favorites/[articleId]
 * 检查文章收藏状态
 */
export async function GET(
  request: Request,
  { params }: { params: { articleId: string } }
) {
  try {
    const articleId = parseInt(params.articleId)
    if (isNaN(articleId)) {
      return NextResponse.json(
        { success: false, error: '无效的文章ID' },
        { status: 400 }
      )
    }

    // 获取当前用户
    const currentUser = await getCurrentUser()
    if (!currentUser) {
      return NextResponse.json({
        success: true,
        data: { isFavorited: false },
      })
    }

    // 检查是否已收藏
    const favorite = await prisma.articleFavorite.findUnique({
      where: {
        userId_articleId: {
          userId: currentUser.userId,
          articleId,
        },
      },
    })

    return NextResponse.json({
      success: true,
      data: {
        isFavorited: !!favorite,
      },
    })
  } catch (error) {
    console.error('检查收藏状态失败:', error)
    return NextResponse.json(
      { success: false, error: '检查失败' },
      { status: 500 }
    )
  }
}

