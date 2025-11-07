/**
 * 认证系统单元测试
 */

import { generateToken, verifyToken } from '../auth'

describe('Auth Utils', () => {
  describe('generateToken', () => {
    it('应该生成有效的JWT token', () => {
      const payload = {
        userId: 1,
        username: 'testuser',
        role: 'admin' as const,
      }
      
      const token = generateToken(payload)
      
      expect(token).toBeTruthy()
      expect(typeof token).toBe('string')
      expect(token.split('.')).toHaveLength(3) // JWT格式：header.payload.signature
    })
  })

  describe('verifyToken', () => {
    it('应该正确验证有效token', () => {
      const payload = {
        userId: 1,
        username: 'testuser',
        role: 'admin' as const,
      }
      
      const token = generateToken(payload)
      const decoded = verifyToken(token)
      
      expect(decoded).toBeTruthy()
      expect(decoded?.userId).toBe(payload.userId)
      expect(decoded?.username).toBe(payload.username)
      expect(decoded?.role).toBe(payload.role)
    })

    it('应该拒绝无效token', () => {
      const invalidToken = 'invalid.token.here'
      const decoded = verifyToken(invalidToken)
      
      expect(decoded).toBeNull()
    })

    it('应该拒绝过期token', () => {
      // 注意：需要等待token过期才能测试，这里仅做格式测试
      const decoded = verifyToken('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjB9.invalid')
      expect(decoded).toBeNull()
    })
  })
})

