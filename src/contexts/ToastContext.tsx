'use client'

import React, { createContext, useContext, useState, useCallback, useEffect } from 'react'
import Toast, { ToastMessage, ToastType } from '@/components/common/Toast'

interface ToastContextType {
  success: (message: string, duration?: number) => void
  error: (message: string, duration?: number) => void
  info: (message: string, duration?: number) => void
  warning: (message: string, duration?: number) => void
  confirm: (message: string, onConfirm: () => void, onCancel?: () => void) => void
}

const ToastContext = createContext<ToastContextType | undefined>(undefined)

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastMessage[]>([])
  const [confirmDialog, setConfirmDialog] = useState<{
    message: string
    onConfirm: () => void
    onCancel?: () => void
  } | null>(null)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const addToast = useCallback((type: ToastType, message: string, duration = 3000) => {
    const id = Date.now().toString() + Math.random().toString(36).substring(7)
    setToasts(prev => [...prev, { id, type, message, duration }])
  }, [])

  const removeToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id))
  }, [])

  const success = useCallback((message: string, duration?: number) => addToast('success', message, duration), [addToast])
  const error = useCallback((message: string, duration?: number) => addToast('error', message, duration), [addToast])
  const info = useCallback((message: string, duration?: number) => addToast('info', message, duration), [addToast])
  const warning = useCallback((message: string, duration?: number) => addToast('warning', message, duration), [addToast])

  const confirm = useCallback((message: string, onConfirm: () => void, onCancel?: () => void) => {
    setConfirmDialog({ message, onConfirm, onCancel })
  }, [])

  const handleConfirm = () => {
    if (confirmDialog) {
      confirmDialog.onConfirm()
      setConfirmDialog(null)
    }
  }

  const handleCancel = () => {
    if (confirmDialog) {
      confirmDialog.onCancel?.()
      setConfirmDialog(null)
    }
  }

  return (
    <ToastContext.Provider value={{ success, error, info, warning, confirm }}>
      {children}
      {mounted && (
        <>
          <Toast toasts={toasts} removeToast={removeToast} />
          
          {/* 确认对话框 */}
          {confirmDialog && (
            <div className="fixed inset-0 bg-black bg-opacity-50 z-[99999] flex items-center justify-center p-4">
              <div className="bg-white rounded-xl p-6 w-full max-w-md shadow-2xl">
                <div className="flex items-start gap-4 mb-6">
                  <div className="flex-shrink-0">
                    <svg className="w-6 h-6 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fillRule="evenodd"
                        d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <p className="flex-1 text-gray-800 font-medium">{confirmDialog.message}</p>
                </div>
                <div className="flex gap-3 justify-end">
                  <button
                    onClick={handleCancel}
                    className="px-6 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors font-medium"
                  >
                    取消
                  </button>
                  <button
                    onClick={handleConfirm}
                    className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium"
                  >
                    确定
                  </button>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </ToastContext.Provider>
  )
}

export function useToast() {
  const context = useContext(ToastContext)
  if (!context) {
    throw new Error('useToast must be used within ToastProvider')
  }
  return context
}

