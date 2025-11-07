import type { Metadata } from 'next'
import { AdminProvider } from '@/contexts/AdminContext'

export const metadata: Metadata = {
  title: '后台管理 - 泽途网',
  description: '泽途网后台管理系统',
}

// Admin 专用布局 - 不包含 TopNav 和 Footer
export default function AdminRootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <AdminProvider>
      {children}
    </AdminProvider>
  )
}

