/**
 * Hero 样式4: 极简风 + 打字机动画
 * 类似 Google 的极简风格
 */

'use client'

import { useState, useEffect } from 'react'

const searchEngines = [
  { name: '百度', value: 'baidu', url: 'https://www.baidu.com/s?wd=', placeholder: '百度一下，你就知道' },
  { name: 'Google', value: 'google', url: 'https://www.google.com/search?q=', placeholder: 'Search with Google' },
  { name: 'Bing', value: 'bing', url: 'https://www.bing.com/search?q=', placeholder: 'Search with Bing' },
  { name: '搜狗', value: 'sogou', url: 'https://www.sogou.com/web?query=', placeholder: '搜狗搜索' },
  { name: '360', value: '360', url: 'https://www.so.com/s?q=', placeholder: '360搜索' },
]

const defaultScenarios = ['GitHub', '设计工具', 'AI助手', '学习资源', '开发框架', '在线工具']

interface HeroStyle4Props {
  isLoading?: boolean
  config?: {
    searchScenarios?: string[]
    prefixText?: string  // "找"字
    subtitle?: string    // "极速搜索，一触即达"
  }
}

export default function HeroStyle4({ isLoading = false, config }: HeroStyle4Props) {
  const searchScenarios = config?.searchScenarios || defaultScenarios
  const prefixText = config?.prefixText || '找'
  const subtitle = config?.subtitle || '极速搜索，一触即达'
  const [searchValue, setSearchValue] = useState('')
  const [activeEngine, setActiveEngine] = useState('baidu')
  const [displayText, setDisplayText] = useState('')
  const [scenarioIndex, setScenarioIndex] = useState(0)
  const [isDeleting, setIsDeleting] = useState(false)

  const currentEngine = searchEngines.find(e => e.value === activeEngine) || searchEngines[0]

  // 打字机效果
  useEffect(() => {
    const currentScenario = searchScenarios[scenarioIndex]
    
    const timeout = setTimeout(() => {
      if (!isDeleting) {
        // 正在输入
        if (displayText.length < currentScenario.length) {
          setDisplayText(currentScenario.slice(0, displayText.length + 1))
        } else {
          // 输入完成，等待后开始删除
          setTimeout(() => setIsDeleting(true), 2000)
        }
      } else {
        // 正在删除
        if (displayText.length > 0) {
          setDisplayText(displayText.slice(0, -1))
        } else {
          // 删除完成，切换到下一个场景
          setIsDeleting(false)
          setScenarioIndex((prev) => (prev + 1) % searchScenarios.length)
        }
      }
    }, isDeleting ? 50 : 150)

    return () => clearTimeout(timeout)
  }, [displayText, isDeleting, scenarioIndex])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchValue.trim()) {
      window.open(currentEngine.url + encodeURIComponent(searchValue), '_blank')
    }
  }

  return (
    <section 
      className="pt-16 pb-8 relative overflow-hidden"
      style={{
        backgroundImage: `
          repeating-linear-gradient(0deg, rgba(99,102,241,0.03) 0px, rgba(99,102,241,0.03) 1px, transparent 1px, transparent 40px),
          repeating-linear-gradient(90deg, rgba(99,102,241,0.03) 0px, rgba(99,102,241,0.03) 1px, transparent 1px, transparent 40px)
        `,
      }}
    >
      {/* 装饰性渐变光效 */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-indigo-100/20 rounded-full blur-3xl -z-10"></div>
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-100/20 rounded-full blur-3xl -z-10"></div>
      
      <div className="container mx-auto px-6 relative">
        <div className="max-w-3xl mx-auto">
          {/* 打字机标题 */}
          <div className="text-center mb-12">
            <h2 className="text-5xl font-bold text-gray-900 mb-4 flex items-center justify-center">
              <span>{prefixText}</span>
              <span className="text-indigo-600 inline-flex items-center w-[240px] justify-start ml-3">
                <span className="inline-block">{displayText}</span>
                <span className="inline-block w-0.5 h-12 bg-indigo-600 ml-1 animate-pulse"></span>
              </span>
            </h2>
            <p className="text-gray-500 text-lg">{subtitle}</p>
          </div>

          {/* 搜索框 */}
          {!isLoading && (
            <form onSubmit={handleSearch} className="mb-6">
              <div className="relative group">
                <input
                  type="text"
                  value={searchValue}
                  onChange={(e) => setSearchValue(e.target.value)}
                  placeholder={currentEngine.placeholder}
                  className="w-full px-6 py-5 text-lg text-gray-900 bg-white border-2 border-gray-200 rounded-full
                    focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10
                    transition-all duration-300 placeholder:text-gray-400 shadow-lg hover:shadow-xl"
                />
                <button
                  type="submit"
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-3 bg-indigo-600 text-white rounded-full
                    hover:bg-indigo-700 active:scale-95 transition-all duration-200 shadow-md"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </button>
              </div>
            </form>
          )}

          {/* 引擎切换 */}
          <div className="flex flex-wrap justify-center gap-3">
            {searchEngines.map((engine) => (
              <button
                key={engine.value}
                type="button"
                onClick={() => setActiveEngine(engine.value)}
                className={`px-4 py-2 text-sm font-medium rounded-full transition-all duration-200 ${
                  activeEngine === engine.value
                    ? 'bg-gray-900 text-white shadow-md'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {engine.name}
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

