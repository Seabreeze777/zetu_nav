/**
 * 媒体文件上传API
 * POST /api/admin/media/upload
 * 
 * 功能：
 * - 接收文件上传
 * - 上传到腾讯云COS
 * - 保存记录到数据库
 * - 自动获取图片尺寸
 */

import { NextRequest, NextResponse } from 'next/server'
import { verifyAuth } from '@/lib/auth'
import { uploadToCOS, getImageDimensions } from '@/lib/cos'
import prisma from '@/lib/prisma'

export async function POST(request: NextRequest) {
  try {
    // 验证管理员权限
    const user = await verifyAuth(request)
    if (!user || user.role !== 'admin') {
      return NextResponse.json({ error: '未授权' }, { status: 401 })
    }

    // 解析表单数据
    const formData = await request.formData()
    const file = formData.get('file') as File
    const folder = (formData.get('folder') as string) || 'uploads'
    const description = formData.get('description') as string || null

    if (!file) {
      return NextResponse.json({ error: '未选择文件' }, { status: 400 })
    }

    // 文件大小限制（10MB）
    const MAX_SIZE = 10 * 1024 * 1024
    if (file.size > MAX_SIZE) {
      return NextResponse.json({ error: '文件大小不能超过10MB' }, { status: 400 })
    }

    // 转换为Buffer
    const arrayBuffer = await file.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)

    // 上传到COS
    console.log('📤 开始上传文件:', file.name)
    const { key, url } = await uploadToCOS(buffer, file.name, folder)

    // 获取图片尺寸（仅图片文件）
    let width: number | null = null
    let height: number | null = null
    if (file.type.startsWith('image/')) {
      const dimensions = await getImageDimensions(buffer)
      if (dimensions) {
        width = dimensions.width
        height = dimensions.height
      }
    }

    // 确保文件夹在数据库中存在
    if (folder) {
      const existingFolder = await prisma.mediaFolder.findUnique({
        where: { name: folder },
      })
      
      if (!existingFolder) {
        // 自动创建文件夹
        await prisma.mediaFolder.create({
          data: {
            name: folder,
            createdBy: user.userId,
          },
        })
        console.log('✅ 自动创建文件夹:', folder)
      }
    }

    // 保存到数据库
    const media = await prisma.media.create({
      data: {
        fileName: key.split('/').pop()!,
        originalName: file.name,
        fileSize: file.size,
        mimeType: file.type,
        width,
        height,
        url,
        cosKey: key,
        bucket: process.env.COS_BUCKET!,
        folder,
        uploadedBy: user.userId,
        description,
      },
      include: {
        uploader: {
          select: {
            id: true,
            username: true,
            nickname: true,
          },
        },
      },
    })

    console.log('✅ 文件上传成功:', media.id)

    return NextResponse.json({
      success: true,
      message: '上传成功',
      data: media,
    })
  } catch (error: any) {
    console.error('❌ 上传失败:', error)
    return NextResponse.json(
      { error: error.message || '上传失败' },
      { status: 500 }
    )
  }
}

