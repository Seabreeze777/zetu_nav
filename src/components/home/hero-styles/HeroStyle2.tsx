/**
 * Hero 样式2: 左右分屏 + 3D 倾斜卡片
 * 右侧展示热门网站卡片
 */

'use client'

import { useState } from 'react'

const searchEngines = [
  { name: '百度', value: 'baidu', url: 'https://www.baidu.com/s?wd=', placeholder: '百度一下，你就知道' },
  { name: 'Google', value: 'google', url: 'https://www.google.com/search?q=', placeholder: 'Search with Google' },
  { name: 'Bing', value: 'bing', url: 'https://www.bing.com/search?q=', placeholder: 'Search with Bing' },
  { name: '搜狗', value: 'sogou', url: 'https://www.sogou.com/web?query=', placeholder: '搜狗搜索' },
  { name: '360', value: '360', url: 'https://www.so.com/s?q=', placeholder: '360搜索' },
  { name: '知乎', value: 'zhihu', url: 'https://www.zhihu.com/search?q=', placeholder: '在知乎搜索' },
  { name: 'B站', value: 'bilibili', url: 'https://search.bilibili.com/all?keyword=', placeholder: '在B站搜索' },
]

// 模拟热门网站数据
const popularSites = [
  { name: 'GitHub', icon: '💻', url: 'https://github.com', bg: 'from-gray-700 to-gray-900' },
  { name: 'ChatGPT', icon: '🤖', url: 'https://chat.openai.com', bg: 'from-green-500 to-emerald-600' },
  { name: 'Figma', icon: '🎨', url: 'https://figma.com', bg: 'from-purple-500 to-pink-600' },
]

interface HeroStyle2Props {
  isLoading?: boolean
  config?: any
}

export default function HeroStyle2({ isLoading = false, config }: HeroStyle2Props) {
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
    <section className="pt-6 pb-3">
      <div className="container mx-auto px-6">
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-purple-600 via-pink-600 to-rose-600 shadow-2xl">
          {/* 动态光效背景 */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(255,255,255,0.15),_transparent_50%)]"></div>
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,_rgba(139,92,246,0.3),_transparent_50%)]"></div>
          
          <div className="relative grid lg:grid-cols-[1fr_1.2fr] gap-6 p-6 items-center">
            {/* 左侧：搜索区 */}
            <div>
              <h2 className="text-3xl font-bold text-white mb-2">
                一站直达
              </h2>
              <p className="text-lg text-white/80 mb-6">
                全网资源触手可及
              </p>

              {!isLoading && (
                <>
                  {/* 搜索框 */}
                  <form onSubmit={handleSearch} className="mb-4">
                    <input
                      type="text"
                      value={searchValue}
                      onChange={(e) => setSearchValue(e.target.value)}
                      placeholder={currentEngine.placeholder}
                      className="w-full px-6 py-4 text-base text-gray-900 bg-white/95 backdrop-blur-sm rounded-xl
                        focus:outline-none focus:ring-4 focus:ring-white/30
                        transition-all duration-200 placeholder:text-gray-400 shadow-lg"
                    />
                  </form>

                  {/* 引擎切换 */}
                  <div className="flex flex-wrap gap-2">
                    {searchEngines.map((engine) => (
                      <button
                        key={engine.value}
                        type="button"
                        onClick={() => setActiveEngine(engine.value)}
                        className={`px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
                          activeEngine === engine.value
                            ? 'bg-white text-indigo-600 shadow-lg'
                            : 'bg-white/20 text-white hover:bg-white/30'
                        }`}
                      >
                        {engine.name}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>

            {/* 右侧：3D卡片堆叠 */}
            <div className="relative h-56 lg:h-64 flex items-center justify-center">
              {popularSites.map((site, index) => (
                <a
                  key={site.name}
                  href={site.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`absolute w-64 h-44 bg-gradient-to-br ${site.bg} rounded-2xl shadow-[0_20px_60px_rgba(0,0,0,0.4)] p-6 
                    flex flex-col items-center justify-center text-white border-2 border-white/20
                    transform hover:scale-125 hover:rotate-0 hover:shadow-[0_30px_100px_rgba(0,0,0,0.6)]
                    transition-all duration-700 cursor-pointer backdrop-blur-sm
                    hover:z-50 group`}
                  style={{
                    top: `${index * 45}px`,
                    right: `${20 + index * 30}px`,
                    transform: `rotate(${(index - 1) * 8}deg) translateY(${index * 8}px) scale(${1 - index * 0.05})`,
                    zIndex: 3 - index,
                  }}
                >
                  <span className="text-6xl mb-4 group-hover:scale-125 group-hover:rotate-12 transition-all duration-500">{site.icon}</span>
                  <span className="font-bold text-2xl group-hover:scale-110 transition-all duration-500">{site.name}</span>
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

