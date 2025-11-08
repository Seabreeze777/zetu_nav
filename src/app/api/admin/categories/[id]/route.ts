import { NextRequest, NextResponse } from 'next/server';
import { verifyAuth } from '@/lib/auth';
import prisma from '@/lib/prisma';

// 获取单个分类
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

    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type'); // 'navigation' 或 'article'
    const id = parseInt(params.id);

    if (isNaN(id)) {
      return NextResponse.json({ error: '无效的分类ID' }, { status: 400 });
    }

    if (type === 'navigation') {
      const category = await prisma.category.findUnique({
        where: { id }
      });

      if (!category) {
        return NextResponse.json({ error: '分类不存在' }, { status: 404 });
      }

      return NextResponse.json({
        ...category,
        order: category.sortOrder
      });
    } else if (type === 'article') {
      const category = await prisma.articleCategory.findUnique({
        where: { id }
      });

      if (!category) {
        return NextResponse.json({ error: '分类不存在' }, { status: 404 });
      }

      return NextResponse.json({
        ...category,
        order: category.sortOrder
      });
    } else {
      return NextResponse.json({ error: '无效的分类类型' }, { status: 400 });
    }
  } catch (error) {
    console.error('获取分类失败:', error);
    return NextResponse.json({ error: '获取分类失败' }, { status: 500 });
  }
}

// 更新分类
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  console.log('=' .repeat(80));
  console.log('🔄 PUT /api/admin/categories/[id] - 开始处理');
  console.log('参数 ID:', params.id);
  
  try {
    // 验证管理员权限
    const user = await verifyAuth(request);
    console.log('👤 当前用户:', user);
    
    if (!user || user.role !== 'admin') {
      console.log('❌ 权限验证失败');
      return NextResponse.json({ error: '无权限' }, { status: 403 });
    }

    const body = await request.json();
    console.log('📦 请求体:', JSON.stringify(body, null, 2));
    
    const { type, name, slug, description, icon, cardsPerRow, displayMode, sortOrder } = body;
    const id = parseInt(params.id);
    
    console.log('🔍 解析后的字段:');
    console.log('  - type:', type);
    console.log('  - id:', id);
    console.log('  - name:', name);
    console.log('  - slug:', slug);
    console.log('  - cardsPerRow:', cardsPerRow);
    console.log('  - displayMode:', displayMode);
    console.log('  - sortOrder:', sortOrder);

    if (isNaN(id)) {
      return NextResponse.json({ error: '无效的分类ID' }, { status: 400 });
    }

    if (!type) {
      return NextResponse.json({ error: '缺少分类类型' }, { status: 400 });
    }

    if (type === 'navigation') {
      console.log('📁 处理网站分类更新');
      
      // 如果修改了 slug，检查是否与其他分类冲突
      if (slug) {
        console.log('🔍 检查slug冲突...');
        const existing = await prisma.category.findFirst({
          where: {
            slug,
            NOT: { id }
          }
        });

        if (existing) {
          console.log('❌ slug已存在:', slug);
          return NextResponse.json({ error: 'URL别名已存在' }, { status: 400 });
        }
        console.log('✅ slug检查通过');
      }

      // 构建更新数据
      const updateData: any = {};
      if (name) updateData.name = name;
      if (slug) updateData.slug = slug;
      if (description !== undefined) updateData.description = description;
      if (icon) updateData.icon = icon;
      if (cardsPerRow !== undefined) updateData.cardsPerRow = cardsPerRow;
      if (displayMode !== undefined) updateData.displayMode = displayMode;
      if (sortOrder !== undefined) updateData.sortOrder = sortOrder;
      
      console.log('💾 准备更新数据:', JSON.stringify(updateData, null, 2));

      // 更新网站分类
      console.log('🔄 执行数据库更新...');
      const category = await prisma.category.update({
        where: { id },
        data: updateData
      });
      
      console.log('✅ 更新成功:', category);

      return NextResponse.json({
        ...category,
        order: category.sortOrder
      });
    } else if (type === 'article') {
      // 如果修改了 slug，检查是否与其他分类冲突
      if (slug) {
        const existing = await prisma.articleCategory.findFirst({
          where: {
            slug,
            NOT: { id }
          }
        });

        if (existing) {
          return NextResponse.json({ error: 'URL别名已存在' }, { status: 400 });
        }
      }

      // 更新文章分类
      const category = await prisma.articleCategory.update({
        where: { id },
        data: {
          ...(name && { name }),
          ...(slug && { slug }),
          ...(description !== undefined && { description }),
          ...(icon && { icon }),
          ...(sortOrder !== undefined && { sortOrder })
        }
      });

      return NextResponse.json(category);
    } else {
      return NextResponse.json({ error: '无效的分类类型' }, { status: 400 });
    }
  } catch (error: any) {
    console.error('❌ 更新分类失败 - 详细错误信息:');
    console.error('错误对象:', error);
    console.error('错误消息:', error.message);
    console.error('错误堆栈:', error.stack);
    return NextResponse.json({ 
      error: '更新分类失败',
      details: error.message 
    }, { status: 500 });
  }
}

// 删除分类
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

    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type'); // 'navigation' 或 'article'
    const id = parseInt(params.id);

    if (isNaN(id)) {
      return NextResponse.json({ error: '无效的分类ID' }, { status: 400 });
    }

    if (type === 'navigation') {
      // 检查是否有关联的网站
      const category = await prisma.category.findUnique({
        where: { id },
        include: {
          _count: {
            select: { websites: true }
          }
        }
      });

      if (!category) {
        return NextResponse.json({ error: '分类不存在' }, { status: 404 });
      }

      if (category._count.websites > 0) {
        return NextResponse.json(
          { error: `该分类下还有 ${category._count.websites} 个网站，无法删除` },
          { status: 400 }
        );
      }

      // 删除网站分类
      await prisma.category.delete({
        where: { id }
      });

      return NextResponse.json({ message: '删除成功' });
    } else if (type === 'article') {
      // 检查是否有关联的文章
      const category = await prisma.articleCategory.findUnique({
        where: { id },
        include: {
          _count: {
            select: { articles: true }
          }
        }
      });

      if (!category) {
        return NextResponse.json({ error: '分类不存在' }, { status: 404 });
      }

      if (category._count.articles > 0) {
        return NextResponse.json(
          { error: `该分类下还有 ${category._count.articles} 篇文章，无法删除` },
          { status: 400 }
        );
      }

      // 删除文章分类
      await prisma.articleCategory.delete({
        where: { id }
      });

      return NextResponse.json({ message: '删除成功' });
    } else {
      return NextResponse.json({ error: '无效的分类类型' }, { status: 400 });
    }
  } catch (error) {
    console.error('删除分类失败:', error);
    return NextResponse.json({ error: '删除分类失败' }, { status: 500 });
  }
}

