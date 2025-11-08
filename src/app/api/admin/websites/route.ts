import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyAuth } from '@/lib/auth'
import { logCreate } from '@/lib/audit-log'

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

/**
 * POST /api/admin/websites
 * 创建新网站
 */
export async function POST(request: Request) {
  try {
    // 验证管理员权限
    const user = await verifyAuth(request)
    if (!user || user.role !== 'admin') {
      return NextResponse.json(
        { success: false, error: '权限不足' },
        { status: 403 }
      )
    }

    const body = await request.json()
    const { name, description, url, logoUrl, categoryId, tagIds, isActive, sortOrder, actionButtons, linkType, articleId } = body

    // 创建网站
    const website = await prisma.website.create({
      data: {
        name,
        description,
        url,
        logoUrl,
        categoryId,
        isActive: isActive ?? true,
        sortOrder: sortOrder ?? 0,
        actionButtons: actionButtons || [],
        linkType: linkType || 'url',
        articleId: articleId || null,
        tags: {
          create: tagIds?.map((tagId: number) => ({
            tag: { connect: { id: tagId } }
          })) || []
        }
      },
      include: {
        category: true,
        tags: {
          include: {
            tag: true
          }
        }
      }
    })

    // 记录操作日志（失败不影响主流程）
    try {
      await logCreate(
        request,
        user.userId,
        'Website',
        website.id,
        website.name,
        {
          name: website.name,
          url: website.url,
          categoryId: website.categoryId,
        }
      )
    } catch (logError) {
      console.error('记录操作日志失败:', logError)
      // 忽略日志错误，继续返回成功
    }

    return NextResponse.json({
      success: true,
      data: website
    })
  } catch (error) {
    console.error('创建网站失败:', error)
    return NextResponse.json(
      { success: false, error: '创建网站失败' },
      { status: 500 }
    )
  }
}
