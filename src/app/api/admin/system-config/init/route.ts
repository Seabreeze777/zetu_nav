import { NextRequest, NextResponse } from 'next/server';
import { verifyAuth } from '@/lib/auth';
import prisma from '@/lib/prisma';

// 初始化默认配置
export async function POST(request: NextRequest) {
  try {
    const user = await verifyAuth(request);
    if (!user || user.role !== 'admin') {
      return NextResponse.json({ error: '无权限' }, { status: 403 });
    }

    // 默认配置数据
    const defaultConfigs = [
      // COS 对象存储配置
      {
        category: 'cos',
        key: 'COS_SECRET_ID',
        value: process.env.COS_SECRET_ID || '',
        label: 'SecretId',
        description: '腾讯云 COS SecretId',
        type: 'text',
        isSecret: true,
        sortOrder: 1,
      },
      {
        category: 'cos',
        key: 'COS_SECRET_KEY',
        value: process.env.COS_SECRET_KEY || '',
        label: 'SecretKey',
        description: '腾讯云 COS SecretKey',
        type: 'password',
        isSecret: true,
        sortOrder: 2,
      },
      {
        category: 'cos',
        key: 'COS_BUCKET',
        value: process.env.COS_BUCKET || '',
        label: '存储桶名称',
        description: '例如：my-bucket-1234567890',
        type: 'text',
        isSecret: false,
        sortOrder: 3,
      },
      {
        category: 'cos',
        key: 'COS_REGION',
        value: process.env.COS_REGION || '',
        label: '所属地域',
        description: '例如：ap-chengdu、ap-beijing',
        type: 'text',
        isSecret: false,
        sortOrder: 4,
      },

      // 网站基本配置
      {
        category: 'site',
        key: 'SITE_NAME',
        value: '泽途网',
        label: '网站名称',
        description: '显示在网站标题和页脚',
        type: 'text',
        isSecret: false,
        sortOrder: 1,
      },
      {
        category: 'site',
        key: 'SITE_DESCRIPTION',
        value: '精选优质网站与资讯，为您提供高效的导航服务',
        label: '网站描述',
        description: '用于 SEO 和网站介绍',
        type: 'textarea',
        isSecret: false,
        sortOrder: 2,
      },
      {
        category: 'site',
        key: 'SITE_KEYWORDS',
        value: '网站导航,优质网站,资讯中心,效率工具',
        label: 'SEO关键词',
        description: '多个关键词用逗号分隔',
        type: 'textarea',
        isSecret: false,
        sortOrder: 3,
      },
      {
        category: 'site',
        key: 'ICP_BEIAN',
        value: '宁ICP备2024004974号-1',
        label: 'ICP备案号',
        description: '显示在页脚',
        type: 'text',
        isSecret: false,
        sortOrder: 4,
      },
      {
        category: 'site',
        key: 'FOOTER_TEXT',
        value: 'Made with ❤️ by Zetu Team',
        label: '页脚文字',
        description: '显示在页脚的自定义文字',
        type: 'text',
        isSecret: false,
        sortOrder: 5,
      },
      {
        category: 'site',
        key: 'CONTACT_EMAIL',
        value: 'contact@zetu.com',
        label: '联系邮箱',
        description: '显示在页脚和联系页面',
        type: 'text',
        isSecret: false,
        sortOrder: 6,
      },
    ];

    // 批量创建配置（如果已存在则跳过）
    let created = 0;
    let skipped = 0;

    for (const config of defaultConfigs) {
      const existing = await prisma.systemConfig.findUnique({
        where: {
          category_key: { category: config.category, key: config.key }
        }
      });

      if (!existing) {
        await prisma.systemConfig.create({ data: config });
        created++;
      } else {
        skipped++;
      }
    }

    return NextResponse.json({
      success: true,
      message: `初始化完成！创建 ${created} 条配置，跳过 ${skipped} 条已存在的配置。`,
      created,
      skipped,
    });
  } catch (error) {
    console.error('初始化配置失败:', error);
    return NextResponse.json({ error: '初始化配置失败' }, { status: 500 });
  }
}

