'use client'

import { UserProvider } from '@/contexts/UserContext'
import { ToastProvider } from '@/contexts/ToastContext'

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ToastProvider>
      <UserProvider>
        {children}
      </UserProvider>
    </ToastProvider>
  )
}

