import { NextRequest, NextResponse } from 'next/server';
import { verifyAuth } from '@/lib/auth';
import prisma from '@/lib/prisma';

// 获取单个标签
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // 验证管理员权限
    const user = await verifyAuth(request);
    if (!user || user.role !== 'admin') {
      return NextResponse.json({ error: '无权限' }, { status: 403 });
    }

    const id = parseInt(params.id);

    if (isNaN(id)) {
      return NextResponse.json({ error: '无效的标签ID' }, { status: 400 });
    }

    const tag = await prisma.tag.findUnique({
      where: { id },
      include: {
        _count: {
          select: { articles: true }
        }
      }
    });

    if (!tag) {
      return NextResponse.json({ error: '标签不存在' }, { status: 404 });
    }

    return NextResponse.json(tag);
  } catch (error) {
    console.error('获取标签失败:', error);
    return NextResponse.json({ error: '获取标签失败' }, { status: 500 });
  }
}

// 更新标签
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // 验证管理员权限
    const user = await verifyAuth(request);
    if (!user || user.role !== 'admin') {
      return NextResponse.json({ error: '无权限' }, { status: 403 });
    }

    const body = await request.json();
    const { name, slug, color } = body;
    const id = parseInt(params.id);

    if (isNaN(id)) {
      return NextResponse.json({ error: '无效的标签ID' }, { status: 400 });
    }

    // 如果修改了 slug，检查是否与其他标签冲突
    if (slug) {
      const existing = await prisma.tag.findFirst({
        where: {
          slug,
          NOT: { id }
        }
      });

      if (existing) {
        return NextResponse.json({ error: 'URL别名已存在' }, { status: 400 });
      }
    }

    // 更新标签
    const tag = await prisma.tag.update({
      where: { id },
      data: {
        ...(name && { name }),
        ...(slug && { slug }),
        ...(color && { color })
      }
    });

    return NextResponse.json(tag);
  } catch (error) {
    console.error('更新标签失败:', error);
    return NextResponse.json({ error: '更新标签失败' }, { status: 500 });
  }
}

// 删除标签
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // 验证管理员权限
    const user = await verifyAuth(request);
    if (!user || user.role !== 'admin') {
      return NextResponse.json({ error: '无权限' }, { status: 403 });
    }

    const id = parseInt(params.id);

    if (isNaN(id)) {
      return NextResponse.json({ error: '无效的标签ID' }, { status: 400 });
    }

    // 检查是否有关联的文章
    const tag = await prisma.tag.findUnique({
      where: { id },
      include: {
        _count: {
          select: { articles: true }
        }
      }
    });

    if (!tag) {
      return NextResponse.json({ error: '标签不存在' }, { status: 404 });
    }

    if (tag._count.articles > 0) {
      return NextResponse.json(
        { error: `该标签还被 ${tag._count.articles} 篇文章使用，无法删除` },
        { status: 400 }
      );
    }

    // 删除标签
    await prisma.tag.delete({
      where: { id }
    });

    return NextResponse.json({ message: '删除成功' });
  } catch (error) {
    console.error('删除标签失败:', error);
    return NextResponse.json({ error: '删除标签失败' }, { status: 500 });
  }
}

