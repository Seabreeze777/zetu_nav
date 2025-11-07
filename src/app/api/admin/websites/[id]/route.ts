import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getCurrentUser } from '@/lib/auth'
import { logUpdate, logDelete } from '@/lib/audit-log'

/**
 * PUT /api/admin/websites/[id]
 * 更新网站（完整更新）
 */
export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    // 验证登录
    const currentUser = await getCurrentUser()
    if (!currentUser) {
      return NextResponse.json(
        { success: false, error: '未登录' },
        { status: 401 }
      )
    }

    const websiteId = parseInt(params.id)
    if (isNaN(websiteId)) {
      return NextResponse.json(
        { success: false, error: '无效的网站ID' },
        { status: 400 }
      )
    }

    const body = await request.json()
    const { name, description, url, logoUrl, categoryId, sortOrder, isActive, tagIds = [], actionButtons = [] } = body

    console.log('📝 更新网站 ID:', websiteId)
    console.log('📦 收到的 actionButtons:', actionButtons)

    // 获取更新前的数据
    const before = await prisma.website.findUnique({
      where: { id: websiteId },
    })

    // 更新网站和标签关系
    const website = await prisma.$transaction(async (tx) => {
      // 更新网站基本信息
      const updatedWebsite = await tx.website.update({
        where: { id: websiteId },
        data: {
          name,
          description,
          url,
          logoUrl,
          categoryId,
          sortOrder,
          isActive,
          actionButtons: actionButtons || [],
        },
      })

      console.log('✅ 网站更新成功，actionButtons:', updatedWebsite.actionButtons)

      // 删除现有标签关系
      await tx.websiteTag.deleteMany({
        where: { websiteId },
      })

      // 创建新的标签关系
      if (tagIds && Array.isArray(tagIds) && tagIds.length > 0) {
        await tx.websiteTag.createMany({
          data: tagIds.map((tagId: number) => ({
            websiteId,
            tagId,
          })),
        })
      }

      return updatedWebsite
    })

    // 记录操作日志
    try {
      await logUpdate(
        request,
        currentUser.userId,
        'Website',
        websiteId,
        name,
        before,
        website
      )
    } catch (error) {
      console.error('记录操作日志失败:', error)
    }

    return NextResponse.json({
      success: true,
      data: website,
    })
  } catch (error) {
    console.error('❌ 更新网站失败:', error)
    return NextResponse.json(
      { success: false, error: '更新失败' },
      { status: 500 }
    )
  }
}

/**
 * PATCH /api/admin/websites/[id]
 * 更新网站（部分更新）
 */
export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    // 验证登录
    const currentUser = await getCurrentUser()
    if (!currentUser) {
      return NextResponse.json(
        { success: false, error: '未登录' },
        { status: 401 }
      )
    }

    const websiteId = parseInt(params.id)
    if (isNaN(websiteId)) {
      return NextResponse.json(
        { success: false, error: '无效的网站ID' },
        { status: 400 }
      )
    }

    const body = await request.json()

    // 获取更新前的数据
    const before = await prisma.website.findUnique({
      where: { id: websiteId },
    })

    // 更新网站
    const website = await prisma.website.update({
      where: { id: websiteId },
      data: body,
    })

    // 记录操作日志
    try {
      await logUpdate(
        request,
        currentUser.userId,
        'Website',
        websiteId,
        website.name,
        before,
        website
      )
    } catch (error) {
      console.error('记录操作日志失败:', error)
    }

    return NextResponse.json({
      success: true,
      data: website,
    })
  } catch (error) {
    console.error('更新网站失败:', error)
    return NextResponse.json(
      { success: false, error: '更新失败' },
      { status: 500 }
    )
  }
}

/**
 * DELETE /api/admin/websites/[id]
 * 删除网站
 */
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    // 验证登录
    const currentUser = await getCurrentUser()
    if (!currentUser) {
      return NextResponse.json(
        { success: false, error: '未登录' },
        { status: 401 }
      )
    }

    const websiteId = parseInt(params.id)
    if (isNaN(websiteId)) {
      return NextResponse.json(
        { success: false, error: '无效的网站ID' },
        { status: 400 }
      )
    }

    // 获取网站信息（用于日志）
    const website = await prisma.website.findUnique({
      where: { id: websiteId },
    })

    // 删除网站（会自动删除关联的标签关系）
    await prisma.website.delete({
      where: { id: websiteId },
    })

    // 记录操作日志
    if (website) {
      try {
        await logDelete(
          request,
          currentUser.userId,
          'Website',
          websiteId,
          website.name,
          website
        )
      } catch (error) {
        console.error('记录操作日志失败:', error)
      }
    }

    return NextResponse.json({
      success: true,
      message: '删除成功',
    })
  } catch (error) {
    console.error('删除网站失败:', error)
    return NextResponse.json(
      { success: false, error: '删除失败' },
      { status: 500 }
    )
  }
}
