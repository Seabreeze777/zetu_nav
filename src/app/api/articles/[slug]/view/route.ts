import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

/**
 * POST /api/articles/[slug]/view
 * 记录文章浏览统计
 */
export async function POST(
  request: Request,
  { params }: { params: { slug: string } }
) {
  try {
    const { slug } = params

    // 增加浏览次数
    const article = await prisma.article.update({
      where: {
        slug,
        isPublished: true,
      },
      data: {
        views: {
          increment: 1,
        },
      },
      select: {
        id: true,
        title: true,
        slug: true,
        views: true,
      },
    })

    return NextResponse.json({
      success: true,
      data: article,
    })
  } catch (error) {
    console.error('记录浏览失败:', error)
    return NextResponse.json(
      {
        success: false,
        error: '记录浏览失败',
      },
      { status: 500 }
    )
  }
}

