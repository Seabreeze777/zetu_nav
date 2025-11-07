'use client'

import { useState } from 'react'

interface ImageWithFallbackProps {
  src: string | null | undefined
  alt: string
  className?: string
  type?: 'website' | 'article' | 'avatar' | 'banner'
  fallbackText?: string
  priority?: boolean // 是否优先加载（关键图片设为 true）
}

// 渐变色方案
const gradients = {
  website: [
    'from-blue-400 to-cyan-500',
    'from-purple-400 to-pink-500',
    'from-green-400 to-emerald-500',
    'from-orange-400 to-red-500',
    'from-indigo-400 to-purple-500',
    'from-teal-400 to-blue-500',
  ],
  article: [
    'from-violet-400 to-purple-500',
    'from-blue-400 to-indigo-500',
    'from-emerald-400 to-teal-500',
    'from-amber-400 to-orange-500',
    'from-rose-400 to-pink-500',
    'from-cyan-400 to-blue-500',
  ],
  avatar: [
    'from-gray-400 to-gray-500',
  ],
  banner: [
    'from-indigo-500 via-purple-500 to-pink-500',
    'from-blue-500 via-cyan-500 to-teal-500',
    'from-orange-500 via-rose-500 to-pink-500',
    'from-emerald-500 via-green-500 to-teal-500',
    'from-violet-500 via-purple-500 to-indigo-500',
    'from-amber-500 via-orange-500 to-red-500',
  ],
}

export default function ImageWithFallback({
  src,
  alt,
  className = '',
  type = 'website',
  fallbackText,
  priority = false,
}: ImageWithFallbackProps) {
  const [error, setError] = useState(false)
  const [loading, setLoading] = useState(true)

  // 如果没有图片URL或加载失败，显示占位图
  const shouldShowFallback = !src || error

  // 根据文本生成一个稳定的颜色索引
  const getGradientIndex = () => {
    const text = fallbackText || alt || ''
    let hash = 0
    for (let i = 0; i < text.length; i++) {
      hash = text.charCodeAt(i) + ((hash << 5) - hash)
    }
    return Math.abs(hash) % gradients[type].length
  }

  const gradient = gradients[type][getGradientIndex()]

  // 获取首字母或图标
  const getFallbackContent = () => {
    const text = fallbackText || alt || '?'
    
    if (type === 'banner') {
      return (
        <div className="flex flex-col items-center justify-center h-full relative overflow-hidden">
          {/* 装饰性背景图案 */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 left-0 w-32 h-32 bg-white rounded-full -translate-x-1/2 -translate-y-1/2"></div>
            <div className="absolute bottom-0 right-0 w-40 h-40 bg-white rounded-full translate-x-1/2 translate-y-1/2"></div>
          </div>
          
          {/* 内容 */}
          <div className="relative z-10 flex flex-col items-center">
            <div className="w-20 h-20 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center mb-4 shadow-lg">
              <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
              </svg>
            </div>
            <h3 className="text-white text-xl font-bold text-center px-6 line-clamp-2 drop-shadow-lg">
              {text}
            </h3>
            <p className="text-white/80 text-sm mt-2">Discover Amazing Resources</p>
          </div>
        </div>
      )
    }
    
    if (type === 'website') {
      return (
        <div className="flex flex-col items-center justify-center h-full">
          <svg className="w-1/3 h-1/3 text-white opacity-90" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
          </svg>
          <span className="text-white text-xs font-medium mt-2 opacity-80 text-center px-2 line-clamp-1">
            {text.slice(0, 12)}
          </span>
        </div>
      )
    }

    if (type === 'article') {
      return (
        <div className="flex flex-col items-center justify-center h-full">
          <svg className="w-1/4 h-1/4 text-white opacity-90" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <span className="text-white text-sm font-medium mt-3 opacity-80 text-center px-4 line-clamp-2">
            {text}
          </span>
        </div>
      )
    }

    // avatar 类型
    const firstLetter = text.charAt(0).toUpperCase()
    return (
      <span className="text-white text-2xl font-bold">
        {firstLetter}
      </span>
    )
  }

  if (shouldShowFallback) {
    return (
      <div className={`bg-gradient-to-br ${gradient} ${className} flex items-center justify-center`}>
        {getFallbackContent()}
      </div>
    )
  }

  return (
    <div className={`relative ${className}`}>
      {loading && (
        <div className={`absolute inset-0 bg-gradient-to-br ${gradient} flex items-center justify-center animate-pulse z-10`}>
          <div className="w-8 h-8 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}
      <img
        src={src}
        alt={alt}
        className="w-full h-full object-cover"
        loading={priority ? 'eager' : 'lazy'}
        onLoad={() => setLoading(false)}
        onError={() => {
          setError(true)
          setLoading(false)
        }}
      />
    </div>
  )
}

