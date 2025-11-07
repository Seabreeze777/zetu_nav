/**
 * Hero 样式3: 网格背景 + 光标跟随
 * 科技感网格 + 热门标签云
 */

'use client'

import { useState, useEffect } from 'react'

const searchEngines = [
  { name: '百度', value: 'baidu', url: 'https://www.baidu.com/s?wd=', placeholder: '百度一下，你就知道' },
  { name: 'Google', value: 'google', url: 'https://www.google.com/search?q=', placeholder: 'Search with Google' },
  { name: 'Bing', value: 'bing', url: 'https://www.bing.com/search?q=', placeholder: 'Search with Bing' },
]

const popularTags = [
  { name: 'AI工具', icon: '🤖', color: 'from-blue-500 to-cyan-500' },
  { name: '设计', icon: '🎨', color: 'from-pink-500 to-rose-500' },
  { name: '开发', icon: '💻', color: 'from-purple-500 to-indigo-500' },
  { name: '学习', icon: '📚', color: 'from-amber-500 to-orange-500' },
  { name: '效率', icon: '⚡', color: 'from-green-500 to-emerald-500' },
  { name: '娱乐', icon: '🎮', color: 'from-red-500 to-pink-500' },
]

const quickCategories = [
  { name: '热门', icon: '🔥', color: 'bg-gradient-to-r from-orange-500 to-red-500' },
  { name: '开发', icon: '💻', color: 'bg-gradient-to-r from-blue-500 to-indigo-500' },
  { name: '设计', icon: '🎨', color: 'bg-gradient-to-r from-purple-500 to-pink-500' },
  { name: 'AI', icon: '🤖', color: 'bg-gradient-to-r from-green-500 to-teal-500' },
]

interface HeroStyle3Props {
  isLoading?: boolean
  config?: {
    title?: string
  }
}

export default function HeroStyle3({ isLoading = false, config }: HeroStyle3Props) {
  const title = config?.title || '🚀 探索全网优质资源'
  const [searchValue, setSearchValue] = useState('')
  const [activeEngine, setActiveEngine] = useState('baidu')
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 })

  const currentEngine = searchEngines.find(e => e.value === activeEngine) || searchEngines[0]

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const hero = document.getElementById('hero-grid')
      if (hero) {
        const rect = hero.getBoundingClientRect()
        setMousePos({
          x: e.clientX - rect.left,
          y: e.clientY - rect.top,
        })
      }
    }
    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchValue.trim()) {
      window.open(currentEngine.url + encodeURIComponent(searchValue), '_blank')
    }
  }

  return (
    <section className="pt-6 pb-4">
      <div className="container mx-auto px-6">
        <div 
          id="hero-grid"
          className="relative overflow-hidden rounded-2xl shadow-2xl"
          style={{
            background: `
              linear-gradient(135deg, #1e293b 0%, #312e81 50%, #581c87 100%),
              radial-gradient(circle at ${mousePos.x}px ${mousePos.y}px, rgba(168, 85, 247, 0.5), transparent 300px)
            `,
            backgroundImage: `
              radial-gradient(circle at ${mousePos.x}px ${mousePos.y}px, rgba(168, 85, 247, 0.5), transparent 300px),
              repeating-linear-gradient(0deg, rgba(255,255,255,0.15) 0px, rgba(255,255,255,0.15) 3px, transparent 3px, transparent 50px),
              repeating-linear-gradient(90deg, rgba(255,255,255,0.15) 0px, rgba(255,255,255,0.15) 3px, transparent 3px, transparent 50px),
              linear-gradient(135deg, #1e293b 0%, #312e81 50%, #581c87 100%)
            `,
          }}
        >
          <div className="relative p-10">
            {/* 标题 */}
            <div className="text-center mb-8">
              <h2 className="text-4xl font-bold text-white mb-3 drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]">
                {title}
              </h2>
            </div>

            {/* 搜索框 */}
            {!isLoading && (
              <form onSubmit={handleSearch} className="max-w-2xl mx-auto mb-6">
                <div className="relative">
                  <input
                    type="text"
                    value={searchValue}
                    onChange={(e) => setSearchValue(e.target.value)}
                    placeholder={currentEngine.placeholder}
                    className="w-full px-6 py-4 text-base text-gray-900 bg-white/95 backdrop-blur-sm rounded-xl
                      focus:outline-none focus:ring-4 focus:ring-indigo-500/50
                      transition-all duration-200 placeholder:text-gray-400 shadow-2xl"
                  />
                  <div className="absolute right-2 top-1/2 -translate-y-1/2 flex gap-2">
                    {searchEngines.map((engine) => (
                      <button
                        key={engine.value}
                        type="button"
                        onClick={() => setActiveEngine(engine.value)}
                        className={`px-3 py-2 text-xs font-medium rounded-lg transition-all ${
                          activeEngine === engine.value
                            ? 'bg-indigo-600 text-white'
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        }`}
                      >
                        {engine.name}
                      </button>
                    ))}
                  </div>
                </div>
              </form>
            )}

            {/* 标签云 */}
            <div className="flex flex-wrap justify-center gap-3">
              {popularTags.map((tag) => (
                <button
                  key={tag.name}
                  className={`px-4 py-2 bg-gradient-to-r ${tag.color} text-white text-sm font-medium rounded-full
                    hover:scale-110 hover:shadow-lg transition-all duration-200 cursor-pointer`}
                >
                  <span className="mr-1">{tag.icon}</span>
                  {tag.name}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

