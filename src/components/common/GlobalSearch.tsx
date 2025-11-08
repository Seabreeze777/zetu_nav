'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/navigation'

interface SearchResult {
  type: 'website' | 'article'
  id: number
  title: string
  description: string | null
  url: string
  icon?: string
  category?: string
}

export default function GlobalSearch() {
  const router = useRouter()
  const [searchValue, setSearchValue] = useState('')
  const [isOpen, setIsOpen] = useState(false)
  const [results, setResults] = useState<SearchResult[]>([])
  const [loading, setLoading] = useState(false)
  const searchRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  // 防抖搜索
  useEffect(() => {
    if (!searchValue.trim()) {
      setResults([])
      setIsOpen(false)
      return
    }

    const timeoutId = setTimeout(async () => {
      setLoading(true)
      try {
        // 并行搜索网站和文章
        const [websitesRes, articlesRes] = await Promise.all([
          fetch(`/api/search/websites?q=${encodeURIComponent(searchValue)}`),
          fetch(`/api/search/articles?q=${encodeURIComponent(searchValue)}`)
        ])

        const websitesData = await websitesRes.json()
        const articlesData = await articlesRes.json()

        const allResults: SearchResult[] = []

        // 添加网站结果
        if (websitesData.success && websitesData.data) {
          allResults.push(...websitesData.data.map((item: any) => ({
            type: 'website' as const,
            id: item.id,
            title: item.name,
            description: item.description,
            url: item.url,
            icon: item.logoUrl,
            category: item.category?.name
          })))
        }

        // 添加文章结果
        if (articlesData.success && articlesData.data) {
          allResults.push(...articlesData.data.map((item: any) => ({
            type: 'article' as const,
            id: item.id,
            title: item.title,
            description: item.description,
            url: `/articles/${item.slug}`,
            category: item.category?.name
          })))
        }

        setResults(allResults)
        setIsOpen(allResults.length > 0)
      } catch (error) {
        console.error('搜索失败:', error)
      } finally {
        setLoading(false)
      }
    }, 300)

    return () => clearTimeout(timeoutId)
  }, [searchValue])

  // 点击外部关闭
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // 处理结果点击
  const handleResultClick = (result: SearchResult) => {
    if (result.type === 'website') {
      window.open(result.url, '_blank')
    } else {
      router.push(result.url)
    }
    setSearchValue('')
    setIsOpen(false)
  }

  // 跳转到搜索结果列表页
  const goToSearchPage = () => {
    if (searchValue.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchValue.trim())}`)
      setSearchValue('')
      setIsOpen(false)
    }
  }

  // 处理Enter键 - 跳转到搜索列表页
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      goToSearchPage()
    } else if (e.key === 'Escape') {
      setIsOpen(false)
    }
  }

  // 按类型分组结果
  const websites = results.filter(r => r.type === 'website').slice(0, 5)
  const articles = results.filter(r => r.type === 'article').slice(0, 5)

  return (
    <div ref={searchRef} className="relative">
      <div className="relative">
        <input
          ref={inputRef}
          type="text"
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => results.length > 0 && setIsOpen(true)}
          placeholder="搜索网站和文章..."
          className="w-72 rounded-xl border border-gray-200 bg-gray-50/50 px-4 py-2 pl-10 text-sm 
            transition-all duration-300 ease-out
            placeholder:text-gray-400
            focus:border-indigo-400 
            focus:bg-white 
            focus:outline-none 
            focus:ring-4 
            focus:ring-indigo-500/10
            focus:shadow-[0_0_0_4px_rgba(99,102,241,0.08)]"
        />
        
        {/* 搜索图标 */}
        <div className="absolute left-3 top-1/2 -translate-y-1/2">
          <svg className="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>

        {/* 加载指示器 */}
        {loading && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2">
            <div className="w-4 h-4 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin" />
          </div>
        )}

        {/* 清除按钮 */}
        {searchValue && !loading && (
          <button
            onClick={() => {
              setSearchValue('')
              setIsOpen(false)
              inputRef.current?.focus()
            }}
            className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-gray-100 rounded-full transition-colors"
          >
            <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>

      {/* 搜索结果下拉框 */}
      {isOpen && searchValue.trim() && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl border border-gray-200 shadow-2xl overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
          {/* 提示：按Enter查看全部结果 */}
          <div className="px-4 py-2 bg-gradient-to-r from-indigo-50 to-purple-50 border-b border-gray-100 flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs text-gray-600">
              <svg className="w-4 h-4 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>按 <kbd className="px-1.5 py-0.5 bg-white border border-gray-300 rounded text-xs font-mono">Enter</kbd> 查看全部结果</span>
            </div>
            <button
              onClick={goToSearchPage}
              className="text-xs text-indigo-600 hover:text-indigo-700 font-medium flex items-center gap-1"
            >
              查看全部
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>

          {/* 结果列表 */}
          {results.length > 0 && (
            <>
              {/* 网站结果 */}
              {websites.length > 0 && (
                <div className="border-b border-gray-100">
                <div className="px-4 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider bg-gray-50">
                  🌐 网站 ({websites.length})
                </div>
                {websites.map((result) => (
                  <button
                    key={`website-${result.id}`}
                    onClick={() => handleResultClick(result)}
                    className="w-full px-4 py-3 flex items-center gap-3 hover:bg-indigo-50 transition-colors group"
                  >
                    {result.icon ? (
                      <div className="w-8 h-8 rounded-lg relative overflow-hidden flex-shrink-0">
                        <Image src={result.icon} alt="" fill className="object-cover" sizes="32px" />
                      </div>
                    ) : (
                      <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-sm">
                        🔗
                      </div>
                    )}
                    <div className="flex-1 text-left min-w-0">
                      <div className="text-sm font-medium text-gray-900 truncate group-hover:text-indigo-600">
                        {result.title}
                      </div>
                      {result.description && (
                        <div className="text-xs text-gray-500 truncate">{result.description}</div>
                      )}
                    </div>
                    {result.category && (
                      <span className="text-xs text-gray-400 bg-gray-100 px-2 py-1 rounded">
                        {result.category}
                      </span>
                    )}
                  </button>
                  ))}
                </div>
              )}

              {/* 文章结果 */}
              {articles.length > 0 && (
                <div>
                <div className="px-4 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider bg-gray-50">
                  📝 文章 ({articles.length})
                </div>
                {articles.map((result) => (
                  <button
                    key={`article-${result.id}`}
                    onClick={() => handleResultClick(result)}
                    className="w-full px-4 py-3 flex items-center gap-3 hover:bg-purple-50 transition-colors group"
                  >
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center text-white text-sm flex-shrink-0">
                      📄
                    </div>
                    <div className="flex-1 text-left min-w-0">
                      <div className="text-sm font-medium text-gray-900 truncate group-hover:text-purple-600">
                        {result.title}
                      </div>
                      {result.description && (
                        <div className="text-xs text-gray-500 truncate">{result.description}</div>
                      )}
                    </div>
                    {result.category && (
                      <span className="text-xs text-gray-400 bg-gray-100 px-2 py-1 rounded">
                        {result.category}
                      </span>
                    )}
                  </button>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      )}

      {/* 无结果提示 - 也可以查看全部 */}
      {isOpen && searchValue.trim() && !loading && results.length === 0 && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl border border-gray-200 shadow-2xl overflow-hidden">
          {/* 提示栏 */}
          <div className="px-4 py-2 bg-gradient-to-r from-indigo-50 to-purple-50 border-b border-gray-100 flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs text-gray-600">
              <svg className="w-4 h-4 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>按 <kbd className="px-1.5 py-0.5 bg-white border border-gray-300 rounded text-xs font-mono">Enter</kbd> 查看搜索结果页</span>
            </div>
            <button
              onClick={goToSearchPage}
              className="text-xs text-indigo-600 hover:text-indigo-700 font-medium flex items-center gap-1"
            >
              去搜索页
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
          
          {/* 无结果内容 */}
          <div className="p-8 text-center">
            <div className="text-gray-400 text-4xl mb-2">🔍</div>
            <div className="text-sm text-gray-600 mb-1">快速搜索无结果</div>
            <div className="text-xs text-gray-400">点击上方&ldquo;去搜索页&rdquo;查看完整搜索</div>
          </div>
        </div>
      )}
    </div>
  )
}

