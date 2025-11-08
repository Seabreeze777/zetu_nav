import { NextRequest, NextResponse } from 'next/server'
import { verifyAuth } from '@/lib/auth'
import { uploadToCOS } from '@/lib/cos'

/**
 * POST /api/upload
 * 上传文件到腾讯云COS
 */
export async function POST(request: NextRequest) {
  try {
    // 验证登录（只有登录用户才能上传）
    const user = await verifyAuth(request)
    if (!user) {
      return NextResponse.json({ error: '未登录' }, { status: 401 })
    }

    // 解析表单数据
    const formData = await request.formData()
    const file = formData.get('file') as File
    const folder = (formData.get('folder') as string) || 'images' // 默认存储在images文件夹

    if (!file) {
      return NextResponse.json({ error: '未选择文件' }, { status: 400 })
    }

    // 验证文件类型（仅允许图片）
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp']
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: '不支持的文件类型，仅支持 JPG、PNG、GIF、WebP' },
        { status: 400 }
      )
    }

    // 验证文件大小（最大5MB）
    const maxSize = 5 * 1024 * 1024 // 5MB
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: '文件大小不能超过5MB' },
        { status: 400 }
      )
    }

    // 将文件转为Buffer
    const arrayBuffer = await file.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)

    // 生成唯一文件名
    const timestamp = Date.now()
    const randomString = Math.random().toString(36).substring(2, 15)
    const ext = file.name.split('.').pop()
    const uniqueFileName = `${timestamp}-${randomString}.${ext}`
    const key = `${folder}/${uniqueFileName}`

    // 上传到COS
    const url = await uploadToCOS(buffer, key)

    return NextResponse.json({
      success: true,
      data: {
        url,
        key,
        name: file.name,
        size: file.size,
        type: file.type,
      },
    })
  } catch (error) {
    console.error('上传文件失败:', error)
    return NextResponse.json(
      { error: '上传失败，请稍后重试' },
      { status: 500 }
    )
  }
}

/**
 * DELETE /api/upload
 * 删除COS文件（管理员专用）
 */
export async function DELETE(request: NextRequest) {
  try {
    // 验证管理员权限
    const user = await verifyAuth(request)
    if (!user || user.role !== 'admin') {
      return NextResponse.json({ error: '无权限' }, { status: 403 })
    }

    const { searchParams } = new URL(request.url)
    const key = searchParams.get('key')

    if (!key) {
      return NextResponse.json({ error: '缺少文件路径参数' }, { status: 400 })
    }

    // 从COS删除
    const { deleteFromCOS } = await import('@/lib/cos')
    await deleteFromCOS(key)

    return NextResponse.json({ success: true, message: '删除成功' })
  } catch (error) {
    console.error('删除文件失败:', error)
    return NextResponse.json(
      { error: '删除失败，请稍后重试' },
      { status: 500 }
    )
  }
}

