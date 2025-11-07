/**
 * Hero 区域组件 - 卡片式设计
 * 
 * 功能：
 * - 大标题
 * - 搜索框
 * - 热门标签快捷入口
 * 
 * 设计理念：
 * - 整个 Hero 是一个大卡片，悬浮在背景上
 * - 参考现代导航站的卡片布局
 */

'use client'

import { useState } from 'react'

// 热门标签数据
const hotTags = [
  { name: 'AI 工具', icon: '🤖', href: '/category/ai' },
  { name: '设计资源', icon: '🎨', href: '/category/design' },
  { name: '开发工具', icon: '💻', href: '/category/dev' },
  { name: '效率工具', icon: '⚡', href: '/category/productivity' },
  { name: '在线学习', icon: '📚', href: '/category/learning' },
  { name: '社交媒体', icon: '🎬', href: '/category/social' },
]

interface HeroSectionProps {
  isLoading?: boolean
}

export default function HeroSection({ isLoading = false }: HeroSectionProps) {
  const [searchValue, setSearchValue] = useState('')

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    // 跳转到搜索页面
    if (searchValue.trim()) {
      window.location.href = `/search?q=${encodeURIComponent(searchValue)}`
    }
  }

  return (
    <section className="pt-6 pb-3">
      <div className="container mx-auto px-6">
        {/* Hero 大卡片 - 扁平版 */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-500 via-indigo-500 to-purple-600 p-8 shadow-2xl shadow-blue-500/20">
          {/* 背景装饰 */}
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS1vcGFjaXR5PSIwLjA1IiBzdHJva2Utd2lkdGg9IjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] opacity-30"></div>
          
          <div className="relative max-w-4xl mx-auto">
            {/* 标题区 */}
            <div className="mb-6">
              {isLoading ? (
                <>
                  <div className="h-10 bg-white/20 rounded-xl w-2/3 max-w-2xl mb-2 animate-pulse" />
                  <div className="h-6 bg-white/20 rounded-lg w-1/2 max-w-xl animate-pulse" />
                </>
              ) : (
                <>
                  <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
                    发现优质网站 <span className="text-blue-100">提升效率</span>
                  </h1>
                  <p className="text-base text-blue-50">
                    精选 <span className="font-semibold text-white">286+</span> 个网站，<span className="font-semibold text-white">12</span> 大分类
                  </p>
                </>
              )}
            </div>

            {/* 热门标签 - 紧凑版 */}
            <div className="flex items-center gap-3 text-sm text-blue-100">
              {isLoading ? (
                <>
                  <div className="h-4 w-4 bg-white/20 rounded animate-pulse" />
                  <div className="h-4 w-12 bg-white/20 rounded animate-pulse" />
                  <div className="flex flex-wrap gap-2">
                    {[1,2,3,4,5,6].map(i => (
                      <div key={i} className="h-8 bg-white/20 rounded-lg w-24 animate-pulse" />
                    ))}
                  </div>
                </>
              ) : (
                <>
                  <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                  <span className="font-medium">热门：</span>
                  
                  <div className="flex flex-wrap gap-2">
                    {hotTags.map((tag) => (
                      <a
                        key={tag.name}
                        href={tag.href}
                        className="group flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/90 backdrop-blur-sm shadow-md hover:shadow-lg hover:bg-white transition-all hover:-translate-y-0.5"
                      >
                        <span className="text-base group-hover:scale-110 transition-transform">{tag.icon}</span>
                        <span className="text-xs font-medium text-gray-700 group-hover:text-blue-600 transition-colors">
                          {tag.name}
                        </span>
                      </a>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

