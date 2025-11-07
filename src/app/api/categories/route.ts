import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

/**
 * GET /api/categories
 * 获取所有导航分类及其网站数量
 */
export async function GET() {
  try {
    const categories = await prisma.category.findMany({
      where: {
        isActive: true,
      },
      orderBy: {
        sortOrder: 'asc',
      },
      include: {
        _count: {
          select: {
            websites: {
              where: {
                isActive: true,
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
      cardsPerRow: category.cardsPerRow,
      displayMode: category.displayMode,
      websiteCount: category._count.websites,
    }))

    return NextResponse.json({
      success: true,
      data: formattedCategories,
    })
  } catch (error) {
    console.error('获取导航分类失败:', error)
    return NextResponse.json(
      {
        success: false,
        error: '获取导航分类失败',
      },
      { status: 500 }
    )
  }
}
