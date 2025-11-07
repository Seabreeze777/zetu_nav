import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

/**
 * GET /api/articles
 * 获取文章列表
 * 查询参数:
 *   - categorySlug: 按分类筛选 (可选)
 *   - featured: 只获取精选文章 (可选, true/false)
 *   - limit: 限制数量 (可选)
 *   - page: 页码 (可选, 默认1)
 */
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const categorySlug = searchParams.get('categorySlug')
    const featured = searchParams.get('featured')
    const limit = parseInt(searchParams.get('limit') || '20')
    const page = parseInt(searchParams.get('page') || '1')

    // 构建查询条件
    const where: any = {
      isPublished: true,
    }

    // 如果指定了分类，添加分类筛选
    if (categorySlug && categorySlug !== 'all') {
      const category = await prisma.articleCategory.findUnique({
        where: { slug: categorySlug },
      })

      if (!category) {
        return NextResponse.json(
          {
            success: false,
            error: '分类不存在',
          },
          { status: 404 }
        )
      }

      where.categoryId = category.id
    }

    // 如果只获取精选文章
    if (featured === 'true') {
      where.isFeatured = true
    }

    // 查询文章总数
    const total = await prisma.article.count({ where })

    // 查询文章列表
    const articles = await prisma.article.findMany({
      where,
      orderBy: [
        { isFeatured: 'desc' },
        { publishedAt: 'desc' },
        { views: 'desc' },
      ],
      skip: (page - 1) * limit,
      take: limit,
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

    // 转换数据格式（公共读模式，直接使用原始URL）
    const formattedArticles = articles.map((article) => {
      return {
        id: article.id,
        title: article.title,
        slug: article.slug,
        description: article.description,
        coverImage: article.coverImage, // ✅ 直接使用原始URL（公共读）
        author: article.author,
        views: article.views,
        readTime: article.readTime,
        isFeatured: article.isFeatured,
        publishedAt: article.publishedAt,
        category: article.category,
        tags: article.tags.map((at) => at.tag),
      }
    })

    return NextResponse.json({
      success: true,
      data: formattedArticles,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    console.error('获取文章列表失败:', error)
    return NextResponse.json(
      {
        success: false,
        error: '获取文章列表失败',
      },
      { status: 500 }
    )
  }
}

