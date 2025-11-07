'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { useRouter } from 'next/navigation'

interface User {
  id: number
  username: string
  nickname?: string
  email?: string
  role: string
  avatar?: string
}

interface AdminContextType {
  user: User | null
  loading: boolean
  logout: () => Promise<void>
}

const AdminContext = createContext<AdminContextType | undefined>(undefined)

export function AdminProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    checkAuth()
  }, [])

  const checkAuth = async () => {
    try {
      const res = await fetch('/api/auth/me')
      const data = await res.json()

      if (data.success) {
        setUser(data.data)
      } else {
        router.push('/admin/login')
      }
    } catch (error) {
      console.error('认证失败:', error)
      router.push('/admin/login')
    } finally {
      setLoading(false)
    }
  }

  const logout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' })
      localStorage.removeItem('admin_token')
      setUser(null)
      router.push('/admin/login')
    } catch (error) {
      console.error('登出失败:', error)
    }
  }

  return (
    <AdminContext.Provider value={{ user, loading, logout }}>
      {children}
    </AdminContext.Provider>
  )
}

export function useAdmin() {
  const context = useContext(AdminContext)
  if (context === undefined) {
    throw new Error('useAdmin must be used within AdminProvider')
  }
  return context
}

