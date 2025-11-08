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
      // ✅ 使用视口顶部偏移200px作为基准线
      const scrollY = window.scrollY + 200

      // ✅ 从上往下找第一个还没滚动过的标题
      let currentId = headings[0]?.id || ''
      
      for (let i = 0; i < headings.length; i++) {
        const heading = headings[i]
        const element = document.getElementById(heading.id)
        
        if (element) {
          // 如果标题已经滚动过了基准线，就是当前标题
          if (element.offsetTop <= scrollY) {
            currentId = heading.id
          } else {
            // 一旦遇到还没滚动到的标题，就停止
            break
          }
        }
      }
      
      setActiveId(currentId)
    }

    handleScroll()
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [headings])

  const handleClick = (id: string) => {
    const element = document.getElementById(id)
    if (element) {
      // 平滑滚动到元素，考虑固定头部高度
      const yOffset = -100 // 距离顶部100px（考虑导航栏高度）
      const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset
      window.scrollTo({ top: y, behavior: 'smooth' })
    }
  }

  return (
    <div className="w-56 flex-shrink-0">
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
                className={`block w-full text-left text-sm transition-colors whitespace-normal break-words leading-relaxed py-1 ${
                  activeId === heading.id
                    ? 'text-blue-600'
                    : 'text-gray-600 hover:text-gray-900'
                } ${heading.level === 2 ? 'pl-0' : ''} ${heading.level === 3 ? 'pl-3' : ''} ${heading.level >= 4 ? 'pl-6' : ''}`}
                style={{ 
                  wordBreak: 'break-word', 
                  overflowWrap: 'break-word'
                }}
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

