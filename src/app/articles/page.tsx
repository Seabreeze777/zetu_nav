'use client'

import { useState, useEffect } from 'react'
import Pagination from '@/components/common/Pagination'
import ArticleListLayout from '@/components/articles/ArticleListLayout'
import ArticleFilter from '@/components/articles/ArticleFilter'
import ArticleListCard from '@/components/articles/ArticleListCard'
import ArticleListCardSkeleton from '@/components/skeleton/ArticleListCardSkeleton'
import ArticleFilterSkeleton from '@/components/skeleton/ArticleFilterSkeleton'

// 类型定义
interface ArticleCategory {
  id: number
  name: string
  slug: string
  icon: string
  description: string | null
  articleCount: number
}

interface Article {
  id: number
  title: string
  slug: string
  description: string | null
  coverImage: string | null
  author: string
  views: number
  readTime: number
  isFeatured: boolean
  publishedAt: string | null
  category: {
    name: string
    slug: string
    icon: string
  }
  tags: Array<{
    name: string
    slug: string
    color: string
  }>
}

export default function ArticlesPage() {
  const [activeCategory, setActiveCategory] = useState('all')
  const [isLoading, setIsLoading] = useState(false) // 默认不显示骨架屏
  const [categories, setCategories] = useState<ArticleCategory[]>([])
  const [articles, setArticles] = useState<Article[]>([])
  const [allArticles, setAllArticles] = useState<Article[]>([]) // 保存所有文章用于搜索
  const [tags, setTags] = useState<any[]>([])
  const [searchQuery, setSearchQuery] = useState('')

  // 获取数据
  useEffect(() => {
    async function fetchData() {
      try {
        // 获取分类
        const categoriesRes = await fetch('/api/article-categories')
        const categoriesData = await categoriesRes.json()
        if (categoriesData.success) {
          setCategories(categoriesData.data)
        }

        // 获取文章
        const articlesRes = await fetch('/api/articles')
        const articlesData = await articlesRes.json()
        if (articlesData.success) {
          setArticles(articlesData.data)
          setAllArticles(articlesData.data) // 保存所有文章
        }

        // 获取热门标签
        const tagsRes = await fetch('/api/tags?popular=true&limit=10')
        const tagsData = await tagsRes.json()
        if (tagsData.success) {
          setTags(tagsData.data)
        }
      } catch (error) {
        console.error('获取数据失败:', error)
      }
      // 不需要 setIsLoading(false)，因为默认就是 false
    }

    fetchData()
  }, [])

  // 分类切换处理
  const handleCategoryChange = async (categorySlug: string) => {
    setActiveCategory(categorySlug)
    setSearchQuery('') // 清空搜索
    // 不显示骨架屏，直接切换
    
    try {
      const url = categorySlug === 'all' 
        ? '/api/articles' 
        : `/api/articles?categorySlug=${categorySlug}`
      
      const res = await fetch(url)
      const data = await res.json()
      
      if (data.success) {
        setArticles(data.data)
        setAllArticles(data.data) // 更新所有文章列表
      }
    } catch (error) {
      console.error('获取文章失败:', error)
    }
  }

  // 搜索处理
  const handleSearch = (query: string) => {
    setSearchQuery(query)
    
    if (!query.trim()) {
      // 如果搜索框为空，恢复当前分类的所有文章
      setArticles(allArticles)
      return
    }

    // 前端过滤搜索
    const filtered = allArticles.filter(article => 
      article.title.toLowerCase().includes(query.toLowerCase()) ||
      article.description?.toLowerCase().includes(query.toLowerCase()) ||
      article.tags.some(tag => tag.name.toLowerCase().includes(query.toLowerCase()))
    )
    
    setArticles(filtered)
  }

  // 获取当前分类信息
  const currentCategory = categories.find(c => c.slug === activeCategory)

  // 精选文章（限制10条）
  const featuredArticles = articles.filter(a => a.isFeatured).slice(0, 10)

  // 页面头部
  const header = (
    <div className="bg-gray-50 py-6">
      <div className="container mx-auto px-6">
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <div className="grid grid-cols-2 gap-6">
            {/* 左侧：搜索区 */}
            <div>
              <div className="mb-4">
                <h1 className="text-2xl font-bold text-gray-900">资讯中心</h1>
                <p className="text-sm text-gray-500 mt-1">共 {articles.length} 篇优质文章</p>
              </div>

              {/* 搜索框 */}
              <div className="relative mb-4">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => handleSearch(e.target.value)}
                  placeholder="搜索文章标题、标签或内容..."
                  className="w-full px-4 py-2.5 pl-10 pr-10 bg-gray-50 border-2 border-gray-100 rounded-xl text-sm 
                    focus:outline-none focus:bg-white focus:border-indigo-400 focus:ring-4 focus:ring-indigo-500/10
                    transition-all duration-300 ease-out placeholder:text-gray-400"
                />
                <svg
                  className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
                {/* 清除按钮 */}
                {searchQuery && (
                  <button
                    onClick={() => handleSearch('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-gray-200 rounded-full transition-colors"
                  >
                    <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                )}
              </div>

              {/* 标签云 */}
              <div>
                <span className="text-xs text-gray-500 mb-2 block">热门标签</span>
                <div className="flex items-center gap-2 flex-wrap">
                  {tags.map((tag) => (
                    <button
                      key={tag.slug}
                      className="px-3 py-1.5 text-xs text-gray-600 bg-gray-50 rounded-lg hover:bg-blue-50 hover:text-blue-600 border border-gray-100 hover:border-blue-200 transition-all"
                    >
                      {tag.name}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* 右侧：推荐文章 */}
            <div className="border-l border-gray-100 pl-6">
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-base font-bold text-gray-900">🔥 推荐阅读</h2>
                <a 
                  href="/articles" 
                  className="px-3 py-1 text-xs font-medium text-indigo-600 bg-indigo-50 rounded-lg hover:bg-indigo-100 transition-all duration-300 ease-out hover:shadow-sm"
                >
                  查看更多 →
                </a>
              </div>

              {/* 双列布局 */}
              <div className="grid grid-cols-2 gap-2">
                {featuredArticles.map((article, index) => (
                  <a
                    key={article.slug}
                    href={`/posts/${article.slug}`}
                    className="block group"
                  >
                    <div className="flex items-start gap-2 p-2 rounded-lg hover:bg-gray-50 active:scale-[0.98] transition-all duration-300 ease-out">
                      {/* 序号标识 */}
                      <div className={`flex-shrink-0 w-5 h-5 rounded flex items-center justify-center text-[10px] font-bold ${
                        index === 0 
                          ? 'bg-gradient-to-br from-red-500 to-orange-500 text-white' 
                          : index === 1
                          ? 'bg-gradient-to-br from-orange-500 to-yellow-500 text-white'
                          : index === 2
                          ? 'bg-gradient-to-br from-blue-500 to-cyan-500 text-white'
                          : 'bg-gray-200 text-gray-600'
                      }`}>
                        {index + 1}
                      </div>

                      {/* 文章信息 */}
                      <div className="flex-1 min-w-0">
                        <h3 className="text-xs font-medium text-gray-900 line-clamp-2 leading-tight group-hover:text-indigo-600 transition-colors duration-300">
                          {article.title}
                        </h3>
                        <div className="flex items-center gap-1.5 mt-1">
                          <span className="flex items-center gap-0.5 text-[10px] text-gray-400">
                            <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                            </svg>
                            {article.views}
                          </span>
                        </div>
                      </div>
                    </div>
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )

  return (
    <ArticleListLayout
      header={header}
      sidebar={
        isLoading ? (
          <ArticleFilterSkeleton />
        ) : (
          <ArticleFilter
            categories={categories}
            activeCategory={activeCategory}
            onCategoryChange={handleCategoryChange}
          />
        )
      }
    >
      <div>
        {/* 文章统计和排序 */}
        <div className="flex items-center justify-between mb-4">
          {isLoading ? (
            <div className="h-6 bg-gray-200 rounded w-48 animate-pulse"></div>
          ) : (
            <h2 className="text-lg font-bold text-gray-900">
              {currentCategory?.name || '全部文章'} <span className="text-sm font-normal text-gray-500">（共 {articles.length} 篇）</span>
            </h2>
          )}

          {/* 排序下拉框 */}
          {!isLoading && (
            <div className="relative">
              <select className="appearance-none px-4 py-2 pr-10 bg-white border border-gray-200 rounded-lg text-sm text-gray-700 hover:border-blue-400 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-50 transition-all cursor-pointer">
                <option value="latest">最新发布</option>
                <option value="popular">最受欢迎</option>
                <option value="recommended">精选推荐</option>
              </select>
              <svg
                className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </div>
          )}
        </div>

        {/* 文章列表 - 2列网格 */}
        <div className="grid grid-cols-2 gap-6">
          {isLoading ? (
            // 骨架屏 - 6个卡片
            [...Array(6)].map((_, i) => (
              <ArticleListCardSkeleton key={i} />
            ))
          ) : (
            // 真实内容
            articles.map((article) => (
              <ArticleListCard
                key={article.slug}
                slug={article.slug}
                title={article.title}
                description={article.description || ''}
                coverImage={article.coverImage || ''}
                category={article.category.name}
                tags={article.tags.map(t => t.name)}
                author={article.author}
                date={article.publishedAt || ''}
                readTime={`${article.readTime} 分钟`}
                views={article.views}
              />
            ))
          )}
        </div>

        {/* 加载更多 */}
        {!isLoading && (
          <div className="flex justify-center pt-8">
            <button className="px-6 py-3 bg-white text-gray-700 rounded-xl shadow-sm hover:shadow-md transition-all font-medium">
              加载更多文章
            </button>
          </div>
        )}
      </div>
    </ArticleListLayout>
  )
}

