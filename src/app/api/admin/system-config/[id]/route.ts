import { NextRequest, NextResponse } from 'next/server';
import { verifyAuth } from '@/lib/auth';
import prisma from '@/lib/prisma';

// 更新配置
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await verifyAuth(request);
    if (!user || user.role !== 'admin') {
      return NextResponse.json({ error: '无权限' }, { status: 403 });
    }

    const id = parseInt(params.id);
    const body = await request.json();
    const { value, label, description, type, isSecret, sortOrder } = body;

    // 更新配置
    const config = await prisma.systemConfig.update({
      where: { id },
      data: {
        ...(value !== undefined && { value }),
        ...(label !== undefined && { label }),
        ...(description !== undefined && { description }),
        ...(type !== undefined && { type }),
        ...(isSecret !== undefined && { isSecret }),
        ...(sortOrder !== undefined && { sortOrder }),
      },
    });

    return NextResponse.json({ success: true, data: config });
  } catch (error) {
    console.error('更新配置失败:', error);
    return NextResponse.json({ error: '更新配置失败' }, { status: 500 });
  }
}

// 删除配置
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await verifyAuth(request);
    if (!user || user.role !== 'admin') {
      return NextResponse.json({ error: '无权限' }, { status: 403 });
    }

    const id = parseInt(params.id);

    await prisma.systemConfig.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('删除配置失败:', error);
    return NextResponse.json({ error: '删除配置失败' }, { status: 500 });
  }
}

