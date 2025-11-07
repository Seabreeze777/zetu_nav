import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getCurrentUser } from '@/lib/auth'
import { logUpdate, logDelete } from '@/lib/audit-log'

/**
 * PATCH /api/admin/articles/[id]
 * 更新文章（部分更新）
 */
export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    // 验证登录
    const currentUser = await getCurrentUser()
    if (!currentUser) {
      return NextResponse.json(
        { success: false, error: '未登录' },
        { status: 401 }
      )
    }

    const articleId = parseInt(params.id)
    if (isNaN(articleId)) {
      return NextResponse.json(
        { success: false, error: '无效的文章ID' },
        { status: 400 }
      )
    }

    const body = await request.json()

    // 获取更新前的数据
    const before = await prisma.article.findUnique({
      where: { id: articleId },
    })

    // 如果更新发布状态，同时更新发布时间
    if (body.isPublished !== undefined) {
      body.publishedAt = body.isPublished ? new Date() : null
    }

    // 更新文章
    const article = await prisma.article.update({
      where: { id: articleId },
      data: body,
    })

    // 记录操作日志
    try {
      await logUpdate(
        request,
        currentUser.userId,
        'Article',
        articleId,
        article.title,
        before,
        article
      )
    } catch (error) {
      console.error('记录操作日志失败:', error)
    }

    return NextResponse.json({
      success: true,
      data: article,
    })
  } catch (error) {
    console.error('更新文章失败:', error)
    return NextResponse.json(
      { success: false, error: '更新失败' },
      { status: 500 }
    )
  }
}

/**
 * DELETE /api/admin/articles/[id]
 * 删除文章
 */
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    // 验证登录
    const currentUser = await getCurrentUser()
    if (!currentUser) {
      return NextResponse.json(
        { success: false, error: '未登录' },
        { status: 401 }
      )
    }

    const articleId = parseInt(params.id)
    if (isNaN(articleId)) {
      return NextResponse.json(
        { success: false, error: '无效的文章ID' },
        { status: 400 }
      )
    }

    // 获取文章信息（用于日志）
    const article = await prisma.article.findUnique({
      where: { id: articleId },
    })

    // 删除文章（会自动删除关联的标签关系）
    await prisma.article.delete({
      where: { id: articleId },
    })

    // 记录操作日志
    if (article) {
      try {
        await logDelete(
          request,
          currentUser.userId,
          'Article',
          articleId,
          article.title,
          article
        )
      } catch (error) {
        console.error('记录操作日志失败:', error)
      }
    }

    return NextResponse.json({
      success: true,
      message: '删除成功',
    })
  } catch (error) {
    console.error('删除文章失败:', error)
    return NextResponse.json(
      { success: false, error: '删除失败' },
      { status: 500 }
    )
  }
}

/**
 * PUT /api/admin/articles/[id]
 * 更新文章（完整更新）
 */
export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    // 验证登录
    const currentUser = await getCurrentUser()
    if (!currentUser) {
      return NextResponse.json(
        { success: false, error: '未登录' },
        { status: 401 }
      )
    }

    const articleId = parseInt(params.id)
    if (isNaN(articleId)) {
      return NextResponse.json(
        { success: false, error: '无效的文章ID' },
        { status: 400 }
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
      readTime,
      isFeatured,
      isPublished,
      tagIds,
    } = body

    // 检查 slug 是否与其他文章冲突
    const existingArticle = await prisma.article.findUnique({
      where: { slug },
    })

    if (existingArticle && existingArticle.id !== articleId) {
      return NextResponse.json(
        { success: false, error: 'URL 别名已被其他文章使用' },
        { status: 400 }
      )
    }

    // 获取更新前的数据
    const before = await prisma.article.findUnique({
      where: { id: articleId },
    })

    // 更新文章和标签关系
    const article = await prisma.$transaction(async (tx) => {
      // 删除旧的标签关系
      await tx.articleTag.deleteMany({
        where: { articleId },
      })

      // 更新文章基本信息
      const updatedArticle = await tx.article.update({
        where: { id: articleId },
        data: {
          title,
          slug,
          description,
          content,
          coverImage,
          author,
          categoryId,
          readTime,
          isFeatured,
          isPublished,
          publishedAt: isPublished ? new Date() : null,
        },
      })

      // 创建新的标签关系
      if (tagIds && Array.isArray(tagIds) && tagIds.length > 0) {
        await tx.articleTag.createMany({
          data: tagIds.map((tagId: number) => ({
            articleId,
            tagId,
          })),
        })
      }

      return updatedArticle
    })

    // 获取完整的文章信息
    const fullArticle = await prisma.article.findUnique({
      where: { id: articleId },
      include: {
        category: true,
        tags: {
          include: {
            tag: true,
          },
        },
      },
    })

    // 记录操作日志
    try {
      await logUpdate(
        request,
        currentUser.userId,
        'Article',
        articleId,
        title,
        before,
        fullArticle
      )
    } catch (error) {
      console.error('记录操作日志失败:', error)
    }

    return NextResponse.json({
      success: true,
      data: fullArticle,
    })
  } catch (error) {
    console.error('更新文章失败:', error)
    return NextResponse.json(
      { success: false, error: '更新失败' },
      { status: 500 }
    )
  }
}

