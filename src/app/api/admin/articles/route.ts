import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getCurrentUser } from '@/lib/auth'

/**
 * POST /api/admin/articles
 * 创建新文章
 */
export async function POST(request: Request) {
  try {
    // 验证登录
    const currentUser = await getCurrentUser()
    if (!currentUser) {
      return NextResponse.json(
        { success: false, error: '未登录' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const {
      title,
      slug,
      description,
      content,
      coverImage,
      author,
      categoryId,
      readTime = 5,
      isFeatured = false,
      isPublished = false,
      tagIds = [],
    } = body

    // 验证必填字段
    if (!title || !slug || !content || !categoryId) {
      return NextResponse.json(
        { success: false, error: '请填写必填字段' },
        { status: 400 }
      )
    }

    // 检查 slug 是否已存在
    const existingArticle = await prisma.article.findUnique({
      where: { slug },
    })

    if (existingArticle) {
      return NextResponse.json(
        { success: false, error: 'URL 别名已存在' },
        { status: 400 }
      )
    }

    // 创建文章和标签关系
    const article = await prisma.$transaction(async (tx) => {
      // 创建文章
      const newArticle = await tx.article.create({
        data: {
          title,
          slug,
          description,
          content,
          coverImage,
          author: author || currentUser.username,
          categoryId,
          readTime,
          isFeatured,
          isPublished,
          publishedAt: isPublished ? new Date() : null,
        },
      })

      // 创建标签关系
      if (tagIds && Array.isArray(tagIds) && tagIds.length > 0) {
        await tx.articleTag.createMany({
          data: tagIds.map((tagId: number) => ({
            articleId: newArticle.id,
            tagId,
          })),
        })
      }

      return newArticle
    })

    // 获取完整的文章信息
    const fullArticle = await prisma.article.findUnique({
      where: { id: article.id },
      include: {
        category: true,
        tags: {
          include: {
            tag: true,
          },
        },
      },
    })

    return NextResponse.json({
      success: true,
      data: fullArticle,
    })
  } catch (error) {
    console.error('创建文章失败:', error)
    return NextResponse.json(
      { success: false, error: '创建失败' },
      { status: 500 }
    )
  }
}

