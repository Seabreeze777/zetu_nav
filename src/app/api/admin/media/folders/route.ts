import { NextRequest, NextResponse } from 'next/server'
import { verifyAuth } from '@/lib/auth'
import prisma from '@/lib/prisma'

// GET /api/admin/media/folders - 获取文件夹列表（包含文件数量）
export async function GET(request: NextRequest) {
  try {
    const user = await verifyAuth(request)
    if (!user) {
      return NextResponse.json({ success: false, error: '未授权' }, { status: 401 })
    }

    // 从数据库获取所有文件夹
    const dbFolders = await prisma.mediaFolder.findMany({
      orderBy: { sortOrder: 'asc' },
      select: {
        name: true,
        description: true,
        sortOrder: true,
        createdAt: true,
      },
    })

    // 统计每个文件夹的文件数量
    const folderCounts = await prisma.media.groupBy({
      by: ['folder'],
      _count: {
        id: true,
      },
    })

    // 构建文件夹列表（带文件数量）
    const folders = dbFolders.map(folder => ({
      name: folder.name,
      count: folderCounts.find(c => c.folder === folder.name)?._count.id || 0,
    }))

    // 查找数据库中有文件但没有文件夹记录的（兼容旧数据）
    const foldersWithFiles = folderCounts
      .filter(c => c.folder && !dbFolders.some(f => f.name === c.folder))
      .map(c => ({
        name: c.folder as string,
        count: c._count.id,
      }))

    return NextResponse.json({
      success: true,
      data: [...folders, ...foldersWithFiles],
    })
  } catch (error) {
    console.error('获取文件夹列表失败:', error)
    return NextResponse.json(
      { success: false, error: '获取失败' },
      { status: 500 }
    )
  }
}

// POST /api/admin/media/folders - 创建新文件夹
export async function POST(request: NextRequest) {
  try {
    const user = await verifyAuth(request)
    if (!user) {
      return NextResponse.json({ success: false, error: '未授权' }, { status: 401 })
    }

    const body = await request.json()
    const { name, description } = body

    if (!name || !name.trim()) {
      return NextResponse.json(
        { success: false, error: '文件夹名称不能为空' },
        { status: 400 }
      )
    }

    // 检查是否已存在
    const existing = await prisma.mediaFolder.findUnique({
      where: { name: name.trim() },
    })

    if (existing) {
      return NextResponse.json(
        { success: false, error: '文件夹已存在' },
        { status: 400 }
      )
    }

    // 创建文件夹
    const folder = await prisma.mediaFolder.create({
      data: {
        name: name.trim(),
        description: description?.trim() || null,
        createdBy: user.userId,
      },
    })

    return NextResponse.json({
      success: true,
      data: folder,
    })
  } catch (error) {
    console.error('创建文件夹失败:', error)
    return NextResponse.json(
      { success: false, error: '创建失败' },
      { status: 500 }
    )
  }
}
