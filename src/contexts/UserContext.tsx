'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'

interface User {
  id: number
  username: string
  nickname: string | null
  email: string | null
  avatar: string | null
  role: string
  createdAt: string
}

interface UserContextType {
  user: User | null
  loading: boolean
  login: (username: string, password: string) => Promise<{ success: boolean; error?: string }>
  logout: () => Promise<void>
  refreshUser: () => Promise<void>
}

const UserContext = createContext<UserContextType | undefined>(undefined)

export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  // 检查登录状态
  const checkAuth = async () => {
    try {
      const res = await fetch('/api/auth/me')
      const data = await res.json()
      
      if (data.success) {
        setUser(data.data)
      } else {
        setUser(null)
      }
    } catch (error) {
      console.error('检查登录状态失败:', error)
      setUser(null)
    } finally {
      setLoading(false)
    }
  }

  // 初始化时检查登录状态
  useEffect(() => {
    checkAuth()
  }, [])

  // 登录
  const login = async (username: string, password: string) => {
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      })

      const data = await res.json()

      if (data.success) {
        setUser(data.data.user)
        return { success: true }
      } else {
        return { success: false, error: data.error }
      }
    } catch (error) {
      console.error('登录失败:', error)
      return { success: false, error: '网络错误，请稍后重试' }
    }
  }

  // 登出
  const logout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' })
      setUser(null)
    } catch (error) {
      console.error('登出失败:', error)
    }
  }

  // 刷新用户信息
  const refreshUser = async () => {
    await checkAuth()
  }

  return (
    <UserContext.Provider value={{ user, loading, login, logout, refreshUser }}>
      {children}
    </UserContext.Provider>
  )
}

// 自定义 Hook
export function useUser() {
  const context = useContext(UserContext)
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider')
  }
  return context
}

