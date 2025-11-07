import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyAuth } from '@/lib/auth'

/**
 * GET /api/admin/websites
 * 获取所有网站列表（包括禁用的，用于后台管理）
 */
export async function GET(request: Request) {
  try {
    // 验证管理员权限
    const user = await verifyAuth(request)
    if (!user || user.role !== 'admin') {
      return NextResponse.json(
        { success: false, error: '权限不足' },
        { status: 403 }
      )
    }

    // 查询所有网站（不过滤isActive）
    const websites = await prisma.website.findMany({
      orderBy: [
        { sortOrder: 'asc' },
        { clickCount: 'desc' },
      ],
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
    const formattedWebsites = websites.map((website) => {
      return {
        id: website.id,
        name: website.name,
        description: website.description,
        url: website.url,
        logoUrl: website.logoUrl, // ✅ 直接使用原始URL（公共读）
        clickCount: website.clickCount,
        isActive: website.isActive,
        sortOrder: website.sortOrder,
        category: website.category,
        tags: website.tags.map((wt) => wt.tag),
      }
    })

    return NextResponse.json({
      success: true,
      data: formattedWebsites,
      total: formattedWebsites.length,
    })
  } catch (error) {
    console.error('获取网站列表失败:', error)
    return NextResponse.json(
      { success: false, error: '获取网站列表失败' },
      { status: 500 }
    )
  }
}
