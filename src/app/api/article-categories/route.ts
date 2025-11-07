import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

/**
 * GET /api/article-categories
 * 获取所有文章分类及其文章数量
 */
export async function GET() {
  try {
    const categories = await prisma.articleCategory.findMany({
      where: {
        isActive: true,
      },
      orderBy: {
        sortOrder: 'asc',
      },
      include: {
        _count: {
          select: {
            articles: {
              where: {
                isPublished: true,
              },
            },
          },
        },
      },
    })

    // 转换数据格式
    const formattedCategories = categories.map((category) => ({
      id: category.id,
      name: category.name,
      slug: category.slug,
      icon: category.icon,
      description: category.description,
      articleCount: category._count.articles,
    }))

    return NextResponse.json({
      success: true,
      data: formattedCategories,
    })
  } catch (error) {
    console.error('获取文章分类失败:', error)
    return NextResponse.json(
      {
        success: false,
        error: '获取文章分类失败',
      },
      { status: 500 }
    )
  }
}

