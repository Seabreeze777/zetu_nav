import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

/**
 * POST /api/websites/[id]/click
 * 记录网站点击统计
 */
export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const websiteId = parseInt(params.id)

    if (isNaN(websiteId)) {
      return NextResponse.json(
        {
          success: false,
          error: '无效的网站ID',
        },
        { status: 400 }
      )
    }

    // 增加点击次数
    const website = await prisma.website.update({
      where: { id: websiteId },
      data: {
        clickCount: {
          increment: 1,
        },
      },
      select: {
        id: true,
        name: true,
        clickCount: true,
      },
    })

    return NextResponse.json({
      success: true,
      data: website,
    })
  } catch (error) {
    console.error('记录点击失败:', error)
    return NextResponse.json(
      {
        success: false,
        error: '记录点击失败',
      },
      { status: 500 }
    )
  }
}

