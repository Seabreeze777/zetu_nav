/**
 * Hero 样式5: 卡片式搜索 + 快捷入口
 * 毛玻璃卡片 + 热门快捷入口
 */

'use client'

import { useState } from 'react'

const searchEngines = [
  { name: '百度', value: 'baidu', url: 'https://www.baidu.com/s?wd=', placeholder: '百度一下，你就知道' },
  { name: 'Google', value: 'google', url: 'https://www.google.com/search?q=', placeholder: 'Search with Google' },
  { name: 'Bing', value: 'bing', url: 'https://www.bing.com/search?q=', placeholder: 'Search with Bing' },
]

const quickLinks = [
  { name: 'GitHub', icon: '🔥', url: 'https://github.com', color: 'hover:bg-gray-100' },
  { name: 'MDN', icon: '💻', url: 'https://developer.mozilla.org', color: 'hover:bg-blue-50' },
  { name: 'Figma', icon: '🎨', url: 'https://figma.com', color: 'hover:bg-purple-50' },
  { name: 'ChatGPT', icon: '🤖', url: 'https://chat.openai.com', color: 'hover:bg-green-50' },
  { name: 'B站', icon: '📺', url: 'https://bilibili.com', color: 'hover:bg-pink-50' },
  { name: '掘金', icon: '📝', url: 'https://juejin.cn', color: 'hover:bg-indigo-50' },
]

interface HeroStyle5Props {
  isLoading?: boolean
  config?: any
}

export default function HeroStyle5({ isLoading = false, config }: HeroStyle5Props) {
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
        {/* 渐变背景 + 光晕 */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-violet-600 via-purple-600 to-fuchsia-700 shadow-2xl shadow-purple-500/40 p-8">
          {/* 动态光晕 - 增强效果 */}
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gradient-radial from-pink-300/30 to-transparent rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-gradient-radial from-blue-300/25 to-transparent rounded-full blur-3xl"></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-gradient-radial from-white/10 to-transparent rounded-full blur-2xl"></div>
          
          {/* 毛玻璃卡片 - 增强玻璃质感 */}
          <div className="relative max-w-2xl mx-auto bg-white/90 backdrop-blur-2xl rounded-3xl shadow-[0_8px_32px_rgba(0,0,0,0.12)] border border-white/20 p-8">
            {/* 标题 */}
            <div className="text-center mb-6">
              <h2 className="text-3xl font-bold text-gray-900 mb-2">
                一站直达 <span className="text-indigo-600">全网资源</span>
              </h2>
              <div className="w-24 h-1 bg-gradient-to-r from-indigo-500 to-purple-600 mx-auto rounded-full"></div>
            </div>

            {!isLoading && (
              <>
                {/* 搜索框 */}
                <form onSubmit={handleSearch} className="mb-4">
                  <input
                    type="text"
                    value={searchValue}
                    onChange={(e) => setSearchValue(e.target.value)}
                    placeholder={currentEngine.placeholder}
                    className="w-full px-6 py-4 text-base text-gray-900 bg-gray-50 border-2 border-gray-200 rounded-xl
                      focus:outline-none focus:border-indigo-400 focus:ring-4 focus:ring-indigo-500/10 focus:bg-white
                      transition-all duration-200 placeholder:text-gray-400"
                  />
                </form>

                {/* 引擎切换 */}
                <div className="flex justify-center gap-2 mb-6 pb-6 border-b border-gray-200">
                  {searchEngines.map((engine) => (
                    <button
                      key={engine.value}
                      type="button"
                      onClick={() => setActiveEngine(engine.value)}
                      className={`px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
                        activeEngine === engine.value
                          ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-md'
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                    >
                      {engine.name}
                    </button>
                  ))}
                </div>

                {/* 快捷入口 */}
                <div>
                  <p className="text-xs text-gray-500 text-center mb-3 font-medium">快速访问</p>
                  <div className="grid grid-cols-3 gap-2">
                    {quickLinks.map((link) => (
                      <a
                        key={link.name}
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`flex items-center gap-2 px-3 py-2.5 bg-gray-50 rounded-lg ${link.color}
                          transition-all duration-200 group cursor-pointer border border-gray-100`}
                      >
                        <span className="text-xl group-hover:scale-110 transition-transform">{link.icon}</span>
                        <span className="text-sm font-medium text-gray-700 group-hover:text-gray-900">
                          {link.name}
                        </span>
                      </a>
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}

