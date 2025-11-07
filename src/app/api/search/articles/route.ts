import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const query = searchParams.get('q') || ''

    if (!query.trim()) {
      return NextResponse.json({
        success: false,
        error: '搜索关键词不能为空'
      })
    }

    // 搜索文章（匹配标题、描述、内容）
    const articles = await prisma.article.findMany({
      where: {
        isPublished: true,
        OR: [
          { title: { contains: query } },
          { description: { contains: query } },
          { content: { contains: query } },
        ],
      },
      select: {
        id: true,
        title: true,
        slug: true,
        description: true,
        coverImage: true,
        views: true,
        category: {
          select: {
            name: true,
            icon: true,
          },
        },
      },
      orderBy: [
        { isFeatured: 'desc' },
        { views: 'desc' },
      ],
      take: 10,
    })

    return NextResponse.json({
      success: true,
      data: articles,
    })
  } catch (error) {
    console.error('搜索文章失败:', error)
    return NextResponse.json(
      { success: false, error: '搜索失败' },
      { status: 500 }
    )
  }
}

