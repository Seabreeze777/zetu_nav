/**
 * API限流工具
 * 防止恶意攻击和滥用
 */

interface RateLimitConfig {
  interval: number // 时间窗口（毫秒）
  maxRequests: number // 最大请求次数
}

interface RateLimitRecord {
  count: number
  resetTime: number
}

// 内存存储（生产环境建议使用Redis）
const store = new Map<string, RateLimitRecord>()

/**
 * 检查是否超过限流
 * @param key 限流标识（如IP、用户ID）
 * @param config 限流配置
 * @returns 是否允许请求
 */
export function checkRateLimit(key: string, config: RateLimitConfig): {
  allowed: boolean
  remaining: number
  resetTime: number
} {
  const now = Date.now()
  const record = store.get(key)

  // 如果没有记录或已过期，创建新记录
  if (!record || now > record.resetTime) {
    const resetTime = now + config.interval
    store.set(key, { count: 1, resetTime })
    return {
      allowed: true,
      remaining: config.maxRequests - 1,
      resetTime,
    }
  }

  // 如果未超过限制，增加计数
  if (record.count < config.maxRequests) {
    record.count++
    store.set(key, record)
    return {
      allowed: true,
      remaining: config.maxRequests - record.count,
      resetTime: record.resetTime,
    }
  }

  // 超过限制
  return {
    allowed: false,
    remaining: 0,
    resetTime: record.resetTime,
  }
}

/**
 * 从请求中获取客户端标识（IP）
 */
export function getClientIdentifier(request: Request): string {
  // 尝试从各种headers获取真实IP
  const headers = [
    'x-real-ip',
    'x-forwarded-for',
    'cf-connecting-ip', // Cloudflare
    'x-client-ip',
  ]

  for (const header of headers) {
    const value = request.headers.get(header)
    if (value) {
      // x-forwarded-for可能包含多个IP，取第一个
      return value.split(',')[0].trim()
    }
  }

  return 'unknown'
}

/**
 * 清理过期记录（定期执行）
 */
export function cleanupExpiredRecords() {
  const now = Date.now()
  for (const [key, record] of store.entries()) {
    if (now > record.resetTime) {
      store.delete(key)
    }
  }
}

// 定期清理（每分钟）
setInterval(cleanupExpiredRecords, 60000)

/**
 * 预设的限流配置
 */
export const RateLimitPresets = {
  // 登录接口：15分钟5次
  login: {
    interval: 15 * 60 * 1000,
    maxRequests: 5,
  },
  // 搜索接口：1分钟10次
  search: {
    interval: 60 * 1000,
    maxRequests: 10,
  },
  // 管理接口：1分钟60次
  admin: {
    interval: 60 * 1000,
    maxRequests: 60,
  },
  // 严格限流：1分钟3次
  strict: {
    interval: 60 * 1000,
    maxRequests: 3,
  },
  // 宽松限流：1分钟100次
  loose: {
    interval: 60 * 1000,
    maxRequests: 100,
  },
}

