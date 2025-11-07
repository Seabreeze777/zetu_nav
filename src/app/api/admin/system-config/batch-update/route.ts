import { NextRequest, NextResponse } from 'next/server';
import { verifyAuth } from '@/lib/auth';
import prisma from '@/lib/prisma';

// 批量更新配置（用于保存整个分类的配置）
export async function POST(request: NextRequest) {
  try {
    const user = await verifyAuth(request);
    if (!user || user.role !== 'admin') {
      return NextResponse.json({ error: '无权限' }, { status: 403 });
    }

    const body = await request.json();
    const { configs } = body; // configs: Array<{id, value}>

    if (!Array.isArray(configs)) {
      return NextResponse.json({ error: '参数格式错误' }, { status: 400 });
    }

    // 批量更新
    const updates = await Promise.all(
      configs.map(async (config) => {
        return prisma.systemConfig.update({
          where: { id: config.id },
          data: { value: config.value },
        });
      })
    );

    return NextResponse.json({ success: true, data: updates });
  } catch (error) {
    console.error('批量更新配置失败:', error);
    return NextResponse.json({ error: '批量更新配置失败' }, { status: 500 });
  }
}

