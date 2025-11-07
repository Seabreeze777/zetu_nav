import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

/**
 * GET /api/tags
 * 获取所有标签
 * 查询参数:
 *   - popular: 只获取热门标签 (可选, true/false)
 *   - limit: 限制数量 (可选)
 */
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const popular = searchParams.get('popular')
    const limit = searchParams.get('limit')

    let tags

    if (popular === 'true') {
      // 获取热门标签（根据使用次数排序）
      tags = await prisma.tag.findMany({
        include: {
          _count: {
            select: {
              articles: true,
              websites: true,
            },
          },
        },
        orderBy: [
          {
            articles: {
              _count: 'desc',
            },
          },
        ],
        take: limit ? parseInt(limit) : 20,
      })
    } else {
      // 获取所有标签
      tags = await prisma.tag.findMany({
        orderBy: {
          name: 'asc',
        },
        take: limit ? parseInt(limit) : undefined,
        include: {
          _count: {
            select: {
              articles: true,
              websites: true,
            },
          },
        },
      })
    }

    // 转换数据格式
    const formattedTags = tags.map((tag) => ({
      id: tag.id,
      name: tag.name,
      slug: tag.slug,
      color: tag.color,
      articleCount: tag._count.articles,
      websiteCount: tag._count.websites,
      totalUsage: tag._count.articles + tag._count.websites,
    }))

    return NextResponse.json({
      success: true,
      data: formattedTags,
    })
  } catch (error) {
    console.error('获取标签失败:', error)
    return NextResponse.json(
      {
        success: false,
        error: '获取标签失败',
      },
      { status: 500 }
    )
  }
}

