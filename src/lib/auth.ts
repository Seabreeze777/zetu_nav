import jwt from 'jsonwebtoken'
import { cookies } from 'next/headers'

// 强制要求JWT_SECRET环境变量，禁止使用默认值
const JWT_SECRET = process.env.JWT_SECRET
if (!JWT_SECRET) {
  throw new Error('❌ JWT_SECRET环境变量未设置！请在.env文件中配置JWT_SECRET')
}

const TOKEN_NAME = 'admin_token'

export interface JWTPayload {
  userId: number
  username: string
  role: string
}

// 生成 JWT Token
export function generateToken(payload: JWTPayload): string {
  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: '7d', // 7天过期
  })
}

// 验证 JWT Token
export function verifyToken(token: string): JWTPayload | null {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as JWTPayload
    return decoded
  } catch (error) {
    return null
  }
}

// 从 Cookie 获取当前用户
export async function getCurrentUser(): Promise<JWTPayload | null> {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get(TOKEN_NAME)?.value
    
    if (!token) {
      return null
    }
    
    return verifyToken(token)
  } catch (error) {
    return null
  }
}

// 设置登录 Cookie
export async function setAuthCookie(token: string) {
  const cookieStore = await cookies()
  cookieStore.set(TOKEN_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7, // 7天
    path: '/',
  })
}

// 清除登录 Cookie
export async function clearAuthCookie() {
  const cookieStore = await cookies()
  cookieStore.delete(TOKEN_NAME)
}

// 验证用户身份（用于API路由）
export async function verifyAuth(request: Request): Promise<JWTPayload | null> {
  try {
    // 从Cookie获取token
    const cookieHeader = request.headers.get('cookie')
    if (!cookieHeader) {
      return null
    }

    // 解析cookie
    const cookies = cookieHeader.split(';').reduce((acc: Record<string, string>, cookie) => {
      const [key, value] = cookie.trim().split('=')
      acc[key] = value
      return acc
    }, {})

    const token = cookies[TOKEN_NAME]
    if (!token) {
      return null
    }

    return verifyToken(token)
  } catch (error) {
    return null
  }
}

