import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

/**
 * GET /api/articles/[slug]
 * 获取文章详情
 */
export async function GET(
  request: Request,
  { params }: { params: { slug: string } }
) {
  try {
    const { slug } = params

    const article = await prisma.article.findUnique({
      where: {
        slug,
        isPublished: true,
      },
      include: {
        category: {
          select: {
            name: true,
            slug: true,
            icon: true,
          },
        },
        tags: {
          include: {
            tag: {
              select: {
                name: true,
                slug: true,
                color: true,
              },
            },
          },
        },
      },
    })

    if (!article) {
      return NextResponse.json(
        {
          success: false,
          error: '文章不存在',
        },
        { status: 404 }
      )
    }

    // 获取相关文章（同分类的其他文章）
    const relatedArticles = await prisma.article.findMany({
      where: {
        categoryId: article.categoryId,
        isPublished: true,
        id: {
          not: article.id,
        },
      },
      orderBy: {
        views: 'desc',
      },
      take: 3,
      select: {
        id: true,
        title: true,
        slug: true,
        description: true,
        coverImage: true,
        author: true,
        views: true,
        readTime: true,
        publishedAt: true,
      },
    })

    // 转换数据格式
    const formattedArticle = {
      id: article.id,
      title: article.title,
      slug: article.slug,
      description: article.description,
      content: article.content,
      coverImage: article.coverImage,
      author: article.author,
      views: article.views,
      readTime: article.readTime,
      isFeatured: article.isFeatured,
      publishedAt: article.publishedAt,
      updatedAt: article.updatedAt,
      category: article.category,
      tags: article.tags.map((at) => at.tag),
      relatedArticles,
    }

    return NextResponse.json({
      success: true,
      data: formattedArticle,
    })
  } catch (error) {
    console.error('获取文章详情失败:', error)
    return NextResponse.json(
      {
        success: false,
        error: '获取文章详情失败',
      },
      { status: 500 }
    )
  }
}

