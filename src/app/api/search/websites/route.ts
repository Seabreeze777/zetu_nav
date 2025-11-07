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

    // 搜索网站（匹配名称、描述、URL）
    const websites = await prisma.website.findMany({
      where: {
        isActive: true,
        OR: [
          { name: { contains: query } },
          { description: { contains: query } },
          { url: { contains: query } },
        ],
      },
      select: {
        id: true,
        name: true,
        description: true,
        url: true,
        logoUrl: true,
        clickCount: true,
        category: {
          select: {
            name: true,
            icon: true,
          },
        },
      },
      orderBy: {
        clickCount: 'desc',
      },
      take: 10,
    })

    return NextResponse.json({
      success: true,
      data: websites,
    })
  } catch (error) {
    console.error('搜索网站失败:', error)
    return NextResponse.json(
      { success: false, error: '搜索失败' },
      { status: 500 }
    )
  }
}

