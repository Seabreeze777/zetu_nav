/**
 * 确认对话框组件
 * 
 * 功能：
 * - 用于删除等危险操作的二次确认
 * - 支持自定义标题、内容、按钮文字
 * - 支持不同的提示类型（danger、warning、info）
 */

'use client'

import { Fragment } from 'react'
import LoadingButton from './LoadingButton'

interface ConfirmDialogProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void | Promise<void>
  title: string
  message: string
  confirmText?: string
  cancelText?: string
  type?: 'danger' | 'warning' | 'info'
  loading?: boolean
}

export default function ConfirmDialog({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = '确认',
  cancelText = '取消',
  type = 'danger',
  loading = false,
}: ConfirmDialogProps) {
  if (!isOpen) return null

  const handleConfirm = async () => {
    await onConfirm()
  }

  // 根据类型设置图标和颜色
  const typeConfig = {
    danger: {
      icon: '🗑️',
      iconBg: 'bg-red-100',
      iconColor: 'text-red-600',
      variant: 'danger' as const,
    },
    warning: {
      icon: '⚠️',
      iconBg: 'bg-yellow-100',
      iconColor: 'text-yellow-600',
      variant: 'primary' as const,
    },
    info: {
      icon: 'ℹ️',
      iconBg: 'bg-blue-100',
      iconColor: 'text-blue-600',
      variant: 'primary' as const,
    },
  }

  const config = typeConfig[type]

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
      {/* 遮罩层 */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* 对话框 */}
      <div className="relative bg-white rounded-xl shadow-2xl max-w-md w-full p-6 animate-in zoom-in-95 duration-200">
        {/* 图标 */}
        <div className={`mx-auto flex items-center justify-center h-16 w-16 rounded-full ${config.iconBg} mb-4`}>
          <span className="text-3xl">{config.icon}</span>
        </div>

        {/* 标题 */}
        <h3 className="text-xl font-semibold text-gray-900 text-center mb-2">
          {title}
        </h3>

        {/* 消息 */}
        <p className="text-gray-600 text-center mb-6">
          {message}
        </p>

        {/* 按钮组 */}
        <div className="flex gap-3">
          <LoadingButton
            variant="ghost"
            onClick={onClose}
            disabled={loading}
            fullWidth
          >
            {cancelText}
          </LoadingButton>
          <LoadingButton
            variant={config.variant}
            onClick={handleConfirm}
            loading={loading}
            fullWidth
          >
            {confirmText}
          </LoadingButton>
        </div>
      </div>
    </div>
  )
}
