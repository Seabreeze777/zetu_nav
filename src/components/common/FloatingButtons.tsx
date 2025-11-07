'use client'

import { useState, useEffect } from 'react'
import { usePathname } from 'next/navigation'

interface FloatingButton {
  id: number
  icon: string
  label: string
  url: string
  sortOrder: number
}

export default function FloatingButtons() {
  const pathname = usePathname()
  const [buttons, setButtons] = useState<FloatingButton[]>([])
  const [showScrollTop, setShowScrollTop] = useState(false)

  const fetchButtons = async () => {
    try {
      const res = await fetch('/api/floating-buttons')
      const data = await res.json()
      if (data.success) {
        setButtons(data.data)
      }
    } catch (error) {
      console.error('获取悬浮按钮失败:', error)
    }
  }

  useEffect(() => {
    // 加载悬浮按钮
    fetchButtons()

    // 监听滚动
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 300)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])
  
  // 后台页面不显示悬浮按钮
  if (pathname.startsWith('/admin')) {
    return null
  }

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <div className="fixed right-8 bottom-24 z-[9999]">
      <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-200/50 p-3 flex flex-col gap-3">
        {/* 自定义按钮 */}
        {buttons.map((button) => (
          <a
            key={button.id}
            href={button.url}
            target="_blank"
            rel="noopener noreferrer"
            title={button.label}
            className="group relative w-12 h-12 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl shadow-sm hover:shadow-md
              flex items-center justify-center text-2xl
              transition-all duration-300 ease-out
              hover:scale-110 active:scale-95
              border border-gray-200 hover:border-indigo-300"
          >
            {button.icon}
            
            {/* 提示标签 */}
            <span className="absolute right-full mr-4 px-3 py-1.5 bg-gray-900 text-white text-xs rounded-lg
              opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap
              shadow-lg">
              {button.label}
            </span>
          </a>
        ))}

        {/* 返回顶部按钮 */}
        {showScrollTop && (
          <button
            onClick={scrollToTop}
            title="返回顶部"
            className="group relative w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl shadow-md hover:shadow-lg
              flex items-center justify-center text-white
              transition-all duration-300 ease-out
              hover:scale-110 active:scale-95
              animate-fade-in border-2 border-white/20"
          >
            <svg 
              className="w-5 h-5" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 10l7-7m0 0l7 7m-7-7v18" />
            </svg>
            
            {/* 提示标签 */}
            <span className="absolute right-full mr-4 px-3 py-1.5 bg-gray-900 text-white text-xs rounded-lg
              opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap
              shadow-lg">
              返回顶部
            </span>
          </button>
        )}
      </div>
    </div>
  )
}

