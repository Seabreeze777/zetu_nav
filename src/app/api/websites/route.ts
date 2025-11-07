import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

/**
 * GET /api/websites
 * 获取网站列表
 * 查询参数:
 *   - categorySlug: 按分类筛选 (可选)
 *   - limit: 限制数量 (可选)
 */
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const categorySlug = searchParams.get('categorySlug')
    const limit = searchParams.get('limit')
    
    console.log('🌐 GET /api/websites - 查询参数:', { categorySlug, limit })

    // 构建查询条件
    const where: any = {
      isActive: true,
    }

    // 如果指定了分类，添加分类筛选
    if (categorySlug) {
      const category = await prisma.category.findUnique({
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

    // 查询网站
    const websites = await prisma.website.findMany({
      where,
      orderBy: [
        { sortOrder: 'asc' },
        { clickCount: 'desc' },
      ],
      take: limit ? parseInt(limit) : undefined,
      include: {
        category: {
          select: {
            name: true,
            slug: true,
            icon: true,
            cardsPerRow: true,
            displayMode: true,
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
    const formattedWebsites = websites.map((website) => {
      return {
        id: website.id,
        name: website.name,
        description: website.description,
        url: website.url,
        logoUrl: website.logoUrl, // ✅ 直接使用原始URL（公共读）
        clickCount: website.clickCount,
        isActive: website.isActive,
        actionButtons: website.actionButtons,
        category: website.category,
        tags: website.tags.map((wt) => wt.tag),
      }
    })
    
    console.log('✅ 查询到网站数量:', websites.length)
    console.log('📦 返回数据示例（前3条）:', formattedWebsites.slice(0, 3))

    return NextResponse.json({
      success: true,
      data: formattedWebsites,
      total: formattedWebsites.length,
    })
  } catch (error) {
    console.error('获取网站列表失败:', error)
    return NextResponse.json(
      {
        success: false,
        error: '获取网站列表失败',
      },
      { status: 500 }
    )
  }
}
