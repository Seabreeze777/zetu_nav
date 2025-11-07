import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// 获取公开的系统配置（不需要登录）
export async function GET(request: NextRequest) {
  try {
    // 只获取网站信息分类的非敏感配置
    const configs = await prisma.systemConfig.findMany({
      where: {
        category: 'site',
        isSecret: false,
      },
      select: {
        key: true,
        value: true,
      },
    });

    // 转换为键值对对象
    const configMap: Record<string, string> = {};
    configs.forEach(config => {
      configMap[config.key] = config.value;
    });

    // 如果数据库中没有配置，返回默认值
    const defaultConfig = {
      SITE_NAME: configMap.SITE_NAME || '泽途网',
      SITE_DESCRIPTION: configMap.SITE_DESCRIPTION || '精选优质网站与资讯，为您提供高效的导航服务',
      SITE_KEYWORDS: configMap.SITE_KEYWORDS || '网站导航,优质网站,资讯中心,效率工具',
      ICP_BEIAN: configMap.ICP_BEIAN || '宁ICP备2024004974号-1',
      FOOTER_TEXT: configMap.FOOTER_TEXT || 'Made with ❤️ by Zetu Team',
      CONTACT_EMAIL: configMap.CONTACT_EMAIL || 'contact@zetu.com',
    };

    return NextResponse.json({ success: true, data: defaultConfig });
  } catch (error) {
    console.error('获取配置失败:', error);
    
    // 降级到默认配置
    return NextResponse.json({
      success: true,
      data: {
        SITE_NAME: '泽途网',
        SITE_DESCRIPTION: '精选优质网站与资讯，为您提供高效的导航服务',
        SITE_KEYWORDS: '网站导航,优质网站,资讯中心,效率工具',
        ICP_BEIAN: '宁ICP备2024004974号-1',
        FOOTER_TEXT: 'Made with ❤️ by Zetu Team',
        CONTACT_EMAIL: 'contact@zetu.com',
      },
    });
  }
}

