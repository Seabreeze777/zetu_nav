/**
 * 媒体库管理API
 * GET /api/admin/media - 获取媒体列表
 * 
 * 查询参数：
 * - folder: 文件夹筛选
 * - mimeType: 文件类型筛选
 * - search: 文件名搜索
 * - page: 页码（默认1）
 * - pageSize: 每页数量（默认20）
 */

import { NextRequest, NextResponse } from 'next/server'
import { verifyAuth } from '@/lib/auth'
import prisma from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    // 验证管理员权限
    const user = await verifyAuth(request)
    if (!user || user.role !== 'admin') {
      return NextResponse.json({ error: '未授权' }, { status: 401 })
    }

    // 解析查询参数
    const { searchParams } = new URL(request.url)
    const folder = searchParams.get('folder')
    const mimeType = searchParams.get('mimeType')
    const search = searchParams.get('search')
    const page = parseInt(searchParams.get('page') || '1')
    const pageSize = parseInt(searchParams.get('pageSize') || '20')

    // 构建查询条件
    const where: any = {}
    
    if (folder && folder !== 'all') {
      where.folder = folder
    }
    
    if (mimeType) {
      where.mimeType = { contains: mimeType }
    }
    
    if (search) {
      where.OR = [
        { originalName: { contains: search } },
        { description: { contains: search } },
      ]
    }

    // 获取总数
    const total = await prisma.media.count({ where })

    // 获取列表
    const media = await prisma.media.findMany({
      where,
      include: {
        uploader: {
          select: {
            id: true,
            username: true,
            nickname: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
      skip: (page - 1) * pageSize,
      take: pageSize,
    })

    // ✅ 公共读模式，直接使用原始URL（数据库中已存储完整URL）
    return NextResponse.json({
      success: true,
      data: media,
      pagination: {
        page,
        pageSize,
        total,
        totalPages: Math.ceil(total / pageSize),
      },
    })
  } catch (error: any) {
    console.error('❌ 获取媒体列表失败:', error)
    return NextResponse.json(
      { error: error.message || '获取失败' },
      { status: 500 }
    )
  }
}

