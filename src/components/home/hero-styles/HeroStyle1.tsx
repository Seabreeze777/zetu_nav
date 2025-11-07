/**
 * Hero 区域组件 - 样式1（默认）
 * 简洁搜索风格
 */

'use client'

import { useState } from 'react'

// 搜索引擎配置
const searchEngines = [
  { 
    name: '百度', 
    value: 'baidu',
    url: 'https://www.baidu.com/s?wd=',
    placeholder: '百度一下，你就知道'
  },
  { 
    name: 'Google', 
    value: 'google',
    url: 'https://www.google.com/search?q=',
    placeholder: 'Search with Google'
  },
  { 
    name: 'Bing', 
    value: 'bing',
    url: 'https://www.bing.com/search?q=',
    placeholder: 'Search with Bing'
  },
  { 
    name: '搜狗', 
    value: 'sogou',
    url: 'https://www.sogou.com/web?query=',
    placeholder: '搜狗搜索'
  },
  { 
    name: '360', 
    value: '360',
    url: 'https://www.so.com/s?q=',
    placeholder: '360搜索'
  },
  { 
    name: '知乎', 
    value: 'zhihu',
    url: 'https://www.zhihu.com/search?q=',
    placeholder: '在知乎搜索'
  },
  { 
    name: 'B站', 
    value: 'bilibili',
    url: 'https://search.bilibili.com/all?keyword=',
    placeholder: '在B站搜索'
  },
]

interface HeroSectionProps {
  isLoading?: boolean
  config?: any
}

export default function HeroSection({ isLoading = false, config }: HeroSectionProps) {
  const [searchValue, setSearchValue] = useState('')
  const [activeEngine, setActiveEngine] = useState('baidu')

  const currentEngine = searchEngines.find(e => e.value === activeEngine) || searchEngines[0]

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchValue.trim()) {
      window.open(currentEngine.url + encodeURIComponent(searchValue), '_blank')
    }
  }

  return (
    <section className="pt-6 pb-4">
      <div className="container mx-auto px-6">
        {/* Hero 卡片 */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-500 via-indigo-500 to-purple-600 shadow-2xl shadow-blue-500/20">
          {/* 径向渐变光晕效果 */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(255,255,255,0.15),_transparent_30%)]"></div>
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_right,_rgba(255,255,255,0.1),_transparent_40%)]"></div>
          
          <div className="relative p-8">
            {/* 搜索区 */}
            <div className="max-w-2xl mx-auto bg-white/95 backdrop-blur-sm rounded-xl p-6 shadow-xl">
              {/* 标题区 */}
              <div className="mb-4">
                {isLoading ? (
                  <>
                    <div className="h-8 bg-gray-200 rounded-lg w-2/3 mb-2 animate-pulse mx-auto" />
                    <div className="h-4 bg-gray-200 rounded w-1/2 animate-pulse mx-auto" />
                  </>
                ) : (
                  <>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2 text-center">
                      一站直达 <span className="text-indigo-600">全网资源</span>
                    </h2>
                    <p className="text-sm text-gray-600 text-center">
                      精选工具、资讯和学习资源，让效率翻倍
                    </p>
                  </>
                )}
              </div>

              {/* Tab标签导航 */}
              {!isLoading && (
                <div className="flex flex-wrap justify-center gap-2 mb-4 pb-4 border-b border-gray-200">
                  {searchEngines.map((engine) => (
                    <button
                      key={engine.value}
                      type="button"
                      onClick={() => setActiveEngine(engine.value)}
                      className={`px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
                        activeEngine === engine.value
                          ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-sm'
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                    >
                      {engine.name}
                    </button>
                  ))}
                </div>
              )}

              {/* 搜索框 */}
              {isLoading ? (
                <div className="h-14 bg-gray-200 rounded-lg animate-pulse" />
              ) : (
                <form onSubmit={handleSearch} className="relative">
                  <input
                    type="text"
                    value={searchValue}
                    onChange={(e) => setSearchValue(e.target.value)}
                    placeholder={currentEngine.placeholder}
                    className="w-full px-6 py-3.5 pr-24 text-base text-gray-900 bg-white border-2 border-gray-200 rounded-xl
                      focus:outline-none focus:border-indigo-400 focus:ring-4 focus:ring-indigo-500/10
                      transition-all duration-200 placeholder:text-gray-400 shadow-sm"
                  />
                  <button
                    type="submit"
                    className="absolute right-2 top-1/2 -translate-y-1/2 px-6 py-2 bg-gradient-to-r from-indigo-500 to-purple-600 text-white text-sm font-medium rounded-lg
                      hover:from-indigo-600 hover:to-purple-700 active:scale-95
                      transition-all duration-200 shadow-sm hover:shadow-md"
                  >
                    搜索
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

