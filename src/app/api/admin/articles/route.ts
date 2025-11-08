import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getCurrentUser } from '@/lib/auth'
import { logCreate } from '@/lib/audit-log'

/**
 * GET /api/admin/articles
 * 获取所有文章（包括未发布的）
 */
export async function GET() {
  try {
    // 验证登录
    const currentUser = await getCurrentUser()
    if (!currentUser) {
      return NextResponse.json(
        { success: false, error: '未登录' },
        { status: 401 }
      )
    }

    // 获取所有文章（包括草稿）
    const articles = await prisma.article.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        category: {
          select: {
            name: true,
            slug: true,
          },
        },
        tags: {
          include: {
            tag: {
              select: {
                name: true,
                slug: true,
              },
            },
          },
        },
      },
    })

    // 转换标签格式
    const formattedArticles = articles.map(article => ({
      ...article,
      tags: article.tags.map(at => at.tag),
    }))

    return NextResponse.json({
      success: true,
      data: formattedArticles,
    })
  } catch (error) {
    console.error('获取文章列表失败:', error)
    return NextResponse.json(
      { success: false, error: '获取文章列表失败' },
      { status: 500 }
    )
  }
}

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

    // 记录操作日志
    try {
      await logCreate(request, currentUser.userId, 'Article', article.id, title, {
        title,
        slug,
        categoryId,
        isPublished,
      })
    } catch (error) {
      console.error('记录操作日志失败:', error)
    }

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

