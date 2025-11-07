/**
 * 系统配置读取工具
 * 
 * 优先级：数据库配置 > 环境变量
 * 
 * 使用缓存机制避免频繁查询数据库
 */

import prisma from '@/lib/prisma';

// 配置缓存
const configCache = new Map<string, string>();
let cacheTime = 0;
const CACHE_TTL = 60000; // 缓存有效期：1分钟

/**
 * 获取配置值
 * @param category 配置分类（cos, site, email等）
 * @param key 配置键名
 * @returns 配置值，如果不存在则返回null
 */
export async function getConfig(category: string, key: string): Promise<string | null> {
  const cacheKey = `${category}:${key}`;
  const now = Date.now();

  // 检查缓存是否有效
  if (now - cacheTime < CACHE_TTL && configCache.has(cacheKey)) {
    return configCache.get(cacheKey) || null;
  }

  try {
    // 从数据库查询
    const config = await prisma.systemConfig.findUnique({
      where: {
        category_key: { category, key },
      },
    });

    if (config && config.value) {
      configCache.set(cacheKey, config.value);
      return config.value;
    }
  } catch (error) {
    console.error(`获取配置失败 [${category}:${key}]:`, error);
  }

  // 降级到环境变量
  return process.env[key] || null;
}

/**
 * 获取多个配置（同一分类）
 * @param category 配置分类
 * @returns 配置对象 Map<key, value>
 */
export async function getConfigs(category: string): Promise<Map<string, string>> {
  const configs = new Map<string, string>();

  try {
    const items = await prisma.systemConfig.findMany({
      where: { category },
    });

    items.forEach(item => {
      configs.set(item.key, item.value);
    });
  } catch (error) {
    console.error(`获取配置分类失败 [${category}]:`, error);
  }

  return configs;
}

/**
 * 清除配置缓存
 */
export function clearConfigCache() {
  configCache.clear();
  cacheTime = 0;
}

/**
 * 刷新配置缓存
 */
export function refreshConfigCache() {
  cacheTime = Date.now();
}

