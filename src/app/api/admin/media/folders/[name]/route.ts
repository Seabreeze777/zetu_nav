import { NextRequest, NextResponse } from 'next/server'
import { verifyAuth } from '@/lib/auth'
import prisma from '@/lib/prisma'

// DELETE /api/admin/media/folders/:name - 删除文件夹
export async function DELETE(
  request: NextRequest,
  { params }: { params: { name: string } }
) {
  try {
    const user = await verifyAuth(request)
    if (!user) {
      return NextResponse.json({ success: false, error: '未授权' }, { status: 401 })
    }

    const folderName = decodeURIComponent(params.name)

    // 从数据库删除
    await prisma.mediaFolder.delete({
      where: { name: folderName },
    })

    return NextResponse.json({
      success: true,
      message: '文件夹已删除',
    })
  } catch (error: any) {
    console.error('删除文件夹失败:', error)
    
    // 如果文件夹不存在，也返回成功（幂等性）
    if (error.code === 'P2025') {
      return NextResponse.json({
        success: true,
        message: '文件夹不存在或已删除',
      })
    }
    
    return NextResponse.json(
      { success: false, error: '删除失败' },
      { status: 500 }
    )
  }
}

