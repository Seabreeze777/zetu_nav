/**
 * 文章目录组件（Table of Contents）
 * 左侧固定，自动高亮当前章节
 */

'use client'

import { useEffect, useState } from 'react'

interface Heading {
  id: string
  text: string
  level: number
}

export default function ArticleTOC({ headings }: { headings: Heading[] }) {
  const [activeId, setActiveId] = useState<string>('')

  useEffect(() => {
    // 滚动监听，自动高亮当前章节
    const handleScroll = () => {
      const scrollY = window.scrollY + 100

      for (let i = headings.length - 1; i >= 0; i--) {
        const heading = headings[i]
        const element = document.getElementById(heading.id)
        
        if (element && element.offsetTop <= scrollY) {
          setActiveId(heading.id)
          break
        }
      }
    }

    handleScroll()
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [headings])

  const handleClick = (id: string) => {
    const element = document.getElementById(id)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }

  return (
    <div className="w-64 flex-shrink-0">
      <div className="sticky top-24">
        <div className="bg-white rounded-xl shadow-sm p-4">
          <h3 className="text-sm font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
            目录
          </h3>

          <nav className="space-y-2">
            {headings.map((heading) => (
              <button
                key={heading.id}
                onClick={() => handleClick(heading.id)}
                className={`block w-full text-left text-sm transition-all ${
                  activeId === heading.id
                    ? 'text-blue-600 font-medium'
                    : 'text-gray-600 hover:text-gray-900'
                } ${heading.level === 3 ? 'pl-4' : ''}`}
              >
                {heading.text}
              </button>
            ))}
          </nav>
        </div>
      </div>
    </div>
  )
}

