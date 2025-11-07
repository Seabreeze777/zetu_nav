/**
 * API限流单元测试
 */

import { checkRateLimit, RateLimitPresets } from '../rate-limit'

describe('Rate Limit', () => {
  beforeEach(() => {
    // 清理测试前的状态
    jest.clearAllMocks()
  })

  describe('checkRateLimit', () => {
    it('应该允许首次请求', () => {
      const result = checkRateLimit('test-user', RateLimitPresets.search)
      
      expect(result.allowed).toBe(true)
      expect(result.remaining).toBe(RateLimitPresets.search.maxRequests - 1)
    })

    it('应该在限制内允许多次请求', () => {
      const key = 'test-user-multiple'
      const config = { interval: 60000, maxRequests: 3 }
      
      const result1 = checkRateLimit(key, config)
      const result2 = checkRateLimit(key, config)
      const result3 = checkRateLimit(key, config)
      
      expect(result1.allowed).toBe(true)
      expect(result2.allowed).toBe(true)
      expect(result3.allowed).toBe(true)
      expect(result3.remaining).toBe(0)
    })

    it('应该在超过限制时拒绝请求', () => {
      const key = 'test-user-exceeded'
      const config = { interval: 60000, maxRequests: 2 }
      
      checkRateLimit(key, config) // 第1次
      checkRateLimit(key, config) // 第2次
      const result = checkRateLimit(key, config) // 第3次（超限）
      
      expect(result.allowed).toBe(false)
      expect(result.remaining).toBe(0)
    })

    it('应该在时间窗口重置后允许新请求', async () => {
      const key = 'test-user-reset'
      const config = { interval: 100, maxRequests: 1 } // 100ms窗口
      
      checkRateLimit(key, config) // 第1次，用完额度
      
      // 等待时间窗口过期
      await new Promise(resolve => setTimeout(resolve, 150))
      
      const result = checkRateLimit(key, config) // 重置后的第1次
      expect(result.allowed).toBe(true)
    })
  })

  describe('RateLimitPresets', () => {
    it('登录限流应该是15分钟5次', () => {
      expect(RateLimitPresets.login.interval).toBe(15 * 60 * 1000)
      expect(RateLimitPresets.login.maxRequests).toBe(5)
    })

    it('搜索限流应该是1分钟10次', () => {
      expect(RateLimitPresets.search.interval).toBe(60 * 1000)
      expect(RateLimitPresets.search.maxRequests).toBe(10)
    })

    it('管理接口限流应该是1分钟60次', () => {
      expect(RateLimitPresets.admin.interval).toBe(60 * 1000)
      expect(RateLimitPresets.admin.maxRequests).toBe(60)
    })
  })
})

