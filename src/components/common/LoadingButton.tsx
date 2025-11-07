/**
 * 带加载状态的按钮组件
 * 
 * 功能：
 * - 点击后自动显示 loading 图标
 * - loading 状态下禁用按钮
 * - 统一的 hover/active 效果
 * - 支持不同尺寸和颜色变体
 */

'use client'

import { ButtonHTMLAttributes, ReactNode } from 'react'

interface LoadingButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  loading?: boolean
  children: ReactNode
  variant?: 'primary' | 'secondary' | 'danger' | 'success' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  fullWidth?: boolean
}

export default function LoadingButton({
  loading = false,
  children,
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  disabled,
  className = '',
  onClick,
  ...props
}: LoadingButtonProps) {
  // 基础样式
  const baseStyles = 'inline-flex items-center justify-center gap-2 font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed relative overflow-hidden'

  // 尺寸样式
  const sizeStyles = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg',
  }

  // 颜色变体样式
  const variantStyles = {
    primary: 'bg-indigo-600 text-white hover:bg-indigo-700 active:bg-indigo-800 focus:ring-indigo-500 shadow-sm hover:shadow-md active:shadow-lg transform hover:-translate-y-0.5 active:translate-y-0',
    secondary: 'bg-gray-200 text-gray-800 hover:bg-gray-300 active:bg-gray-400 focus:ring-gray-500 shadow-sm hover:shadow-md active:shadow-lg transform hover:-translate-y-0.5 active:translate-y-0',
    danger: 'bg-red-600 text-white hover:bg-red-700 active:bg-red-800 focus:ring-red-500 shadow-sm hover:shadow-md active:shadow-lg transform hover:-translate-y-0.5 active:translate-y-0',
    success: 'bg-green-600 text-white hover:bg-green-700 active:bg-green-800 focus:ring-green-500 shadow-sm hover:shadow-md active:shadow-lg transform hover:-translate-y-0.5 active:translate-y-0',
    ghost: 'bg-transparent text-gray-700 hover:bg-gray-100 active:bg-gray-200 focus:ring-gray-400 border border-gray-300 hover:border-gray-400',
  }

  const widthStyle = fullWidth ? 'w-full' : ''

  const combinedStyles = `${baseStyles} ${sizeStyles[size]} ${variantStyles[variant]} ${widthStyle} ${className}`

  const isDisabled = disabled || loading

  return (
    <button
      className={combinedStyles}
      disabled={isDisabled}
      onClick={onClick}
      {...props}
    >
      {loading && (
        <svg
          className="animate-spin h-4 w-4"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />
        </svg>
      )}
      <span className={loading ? 'opacity-70' : ''}>{children}</span>
    </button>
  )
}

