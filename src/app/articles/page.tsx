'use client'

import { useState, useEffect } from 'react'
import Pagination from '@/components/common/Pagination'
import ArticleListLayout from '@/components/articles/ArticleListLayout'
import ArticleFilter from '@/components/articles/ArticleFilter'
import ArticleListCard from '@/components/articles/ArticleListCard'

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
  const [activeTag, setActiveTag] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [categories, setCategories] = useState<ArticleCategory[]>([])
  const [articles, setArticles] = useState<Article[]>([])
  const [allArticles, setAllArticles] = useState<Article[]>([])
  const [tags, setTags] = useState<any[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [featuredStartIndex, setFeaturedStartIndex] = useState(0) // 推荐文章轮播起始索引

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
      } finally {
        setIsLoading(false) // ✅ 加载完成后隐藏骨架屏
      }
    }

    fetchData()
  }, [])

  // 分类切换处理
  const handleCategoryChange = async (categorySlug: string) => {
    setActiveCategory(categorySlug)
    setActiveTag('') // 清空标签筛选
    setSearchQuery('') // 清空搜索
    
    try {
      const url = categorySlug === 'all' 
        ? '/api/articles' 
        : `/api/articles?categorySlug=${categorySlug}`
      
      const res = await fetch(url)
      const data = await res.json()
      
      if (data.success) {
        setArticles(data.data)
        setAllArticles(data.data)
      }
    } catch (error) {
      console.error('获取文章失败:', error)
    }
  }

  // 标签筛选处理
  const handleTagChange = (tagSlug: string) => {
    setActiveTag(tagSlug)
    setSearchQuery('') // 清空搜索
    
    if (!tagSlug) {
      // 清除标签筛选，恢复所有文章
      setArticles(allArticles)
      return
    }

    // 前端过滤：只显示包含该标签的文章
    const filtered = allArticles.filter(article => 
      article.tags.some(tag => tag.slug === tagSlug)
    )
    
    setArticles(filtered)
  }

  // 搜索处理
  const handleSearch = (query: string) => {
    setSearchQuery(query)
    
    if (!query.trim()) {
      // 如果搜索框为空，根据当前标签筛选状态恢复文章
      if (activeTag) {
        handleTagChange(activeTag)
      } else {
        setArticles(allArticles)
      }
      return
    }

    // 前端过滤搜索
    const baseArticles = activeTag 
      ? allArticles.filter(article => article.tags.some(tag => tag.slug === activeTag))
      : allArticles

    const filtered = baseArticles.filter(article => 
      article.title.toLowerCase().includes(query.toLowerCase()) ||
      article.description?.toLowerCase().includes(query.toLowerCase()) ||
      article.tags.some(tag => tag.name.toLowerCase().includes(query.toLowerCase()))
    )
    
    setArticles(filtered)
  }

  // 获取当前分类信息
  const currentCategory = categories.find(c => c.slug === activeCategory)

  // 精选文章处理
  const allFeaturedArticles = articles.filter(a => a.isFeatured)
  const featuredArticles = allFeaturedArticles.slice(featuredStartIndex, featuredStartIndex + 5)
  
  // 推荐文章轮播控制
  const handleFeaturedPrev = () => {
    setFeaturedStartIndex(prev => Math.max(0, prev - 5))
  }
  
  const handleFeaturedNext = () => {
    setFeaturedStartIndex(prev => 
      prev + 5 < allFeaturedArticles.length ? prev + 5 : prev
    )
  }
  
  const canGoPrev = featuredStartIndex > 0
  const canGoNext = featuredStartIndex + 5 < allFeaturedArticles.length

  // 页面头部 - 推荐阅读Hero区域
  const header = (
    <section 
      className="pt-12 pb-8 relative overflow-hidden"
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
        <div className="max-w-6xl mx-auto">
          {/* 手风琴式推荐文章 - 带轮播控制 */}
          <div className="relative">
            {/* 左侧切换按钮 */}
            {canGoPrev && (
              <button
                onClick={handleFeaturedPrev}
                className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-16 z-20 w-12 h-12 bg-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center text-gray-600 hover:text-indigo-600 hover:scale-110"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
            )}

            {/* 右侧切换按钮 */}
            {canGoNext && (
              <button
                onClick={handleFeaturedNext}
                className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-16 z-20 w-12 h-12 bg-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center text-gray-600 hover:text-indigo-600 hover:scale-110"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            )}

            {/* 手风琴卡片区域 */}
            <div className="flex gap-3 h-80">
            {featuredArticles.slice(0, 5).map((article, index) => (
              <a
                key={article.slug}
                href={`/posts/${article.slug}`}
                className="group relative flex-1 hover:flex-[3] bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-500 ease-out border border-gray-200 hover:border-indigo-300"
                style={{
                  backgroundImage: article.coverImage ? `url(${article.coverImage})` : 'none',
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                }}
              >
                {/* 渐变遮罩 */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-black/20 group-hover:from-black/80 group-hover:via-black/40 group-hover:to-transparent transition-all duration-500"></div>

                {/* 排名角标 */}
                <div className={`absolute top-4 left-4 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold text-white shadow-xl z-10 ${
                  index === 0 
                    ? 'bg-gradient-to-br from-red-500 to-orange-500' 
                    : index === 1
                    ? 'bg-gradient-to-br from-orange-500 to-yellow-500'
                    : index === 2
                    ? 'bg-gradient-to-br from-blue-500 to-cyan-500'
                    : 'bg-gradient-to-br from-purple-500 to-pink-500'
                }`}>
                  {index + 1}
                </div>

                {/* 收起状态：排名+分类图标 */}
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 group-hover:opacity-0 group-hover:pointer-events-none transition-all duration-500 z-10">
                  {/* 大号分类图标 */}
                  <div className="text-6xl opacity-90 transform group-hover:scale-110 transition-transform duration-300">
                    {article.category.icon}
                  </div>
                  {/* 分类名称 */}
                  <div className="text-white font-bold text-lg tracking-wide">
                    {article.category.name}
                  </div>
                  {/* 装饰线 */}
                  <div className="w-12 h-0.5 bg-white/40"></div>
                  {/* 简要信息 */}
                  <div className="flex items-center gap-3 text-white/80 text-sm">
                    <span className="flex items-center gap-1">
                      <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                      {article.views}
                    </span>
                    <span>·</span>
                    <span>{article.readTime}分钟</span>
                  </div>
                </div>

                {/* 展开状态：完整内容 */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 pointer-events-none group-hover:pointer-events-auto transition-all duration-500 z-10">
                  <div className="h-full flex flex-col justify-end p-6">
                    {/* 分类标签 */}
                    <div className="mb-3">
                      <span className="inline-flex items-center gap-1 px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-xs font-medium text-white border border-white/30">
                        <span>{article.category.icon}</span>
                        <span>{article.category.name}</span>
                      </span>
                    </div>

                    {/* 标题 */}
                    <h3 className="font-bold text-white text-2xl mb-3 line-clamp-2">
                      {article.title}
                    </h3>

                    {/* 描述 */}
                    <p className="text-sm text-gray-200 line-clamp-2 mb-4">
                      {article.description || '点击查看详情...'}
                    </p>

                    {/* 元信息 */}
                    <div className="flex items-center gap-4 text-xs text-gray-300 mb-4">
                      <span className="flex items-center gap-1">
                        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                        {article.views}
                      </span>
                      <span className="flex items-center gap-1">
                        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        {article.readTime}分钟
                      </span>
                      <span className="flex items-center gap-1">
                        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                        {article.author}
                      </span>
                    </div>

                    {/* 阅读按钮 */}
                    <div>
                      <div className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium text-sm transition-colors">
                        <span>立即阅读</span>
                        <svg className="h-4 w-4 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>
              </a>
            ))}
            </div>

            {/* 页面指示器 */}
            {allFeaturedArticles.length > 5 && (
              <div className="flex items-center justify-center gap-2 mt-6">
                <span className="text-sm text-gray-500">
                  {featuredStartIndex + 1}-{Math.min(featuredStartIndex + 5, allFeaturedArticles.length)} / {allFeaturedArticles.length}
                </span>
                <div className="flex gap-1.5 ml-2">
                  {Array.from({ length: Math.ceil(allFeaturedArticles.length / 5) }).map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setFeaturedStartIndex(i * 5)}
                      className={`w-2 h-2 rounded-full transition-all duration-300 ${
                        Math.floor(featuredStartIndex / 5) === i
                          ? 'bg-indigo-600 w-6'
                          : 'bg-gray-300 hover:bg-gray-400'
                      }`}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  )

  return (
    <ArticleListLayout
      header={header}
      sidebar={
        isLoading ? (
          // 侧边栏骨架屏 - 精确匹配 ArticleFilter 布局
          <aside className="w-44 flex-shrink-0">
            <div className="sticky top-20 h-fit">
              <div className="bg-white rounded-2xl shadow-sm p-2">
                <nav className="space-y-0.5">
                  {[1,2,3,4,5,6].map(i => (
                    <div
                      key={i}
                      className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl"
                    >
                      {/* 图标骨架 */}
                      <div className="w-5 h-5 bg-gray-200 rounded animate-pulse flex-shrink-0" />
                      
                      {/* 文字骨架 */}
                      <div className={`flex-1 h-4 bg-gray-200 rounded animate-pulse ${
                        i === 1 ? 'w-16' : i === 2 ? 'w-20' : i === 3 ? 'w-20' : i === 4 ? 'w-24' : i === 5 ? 'w-20' : 'w-20'
                      }`} />
                    </div>
                  ))}
                </nav>
              </div>
            </div>
          </aside>
        ) : (
          <ArticleFilter
            categories={categories}
            activeCategory={activeCategory}
            onCategoryChange={handleCategoryChange}
            tags={tags}
            activeTag={activeTag}
            onTagChange={handleTagChange}
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

        {/* 文章列表 - 2列网格 - 使用真实组件显示骨架屏 */}
        <div className="grid grid-cols-2 gap-6">
          {isLoading ? (
            // 骨架屏 - 使用真实ArticleListCard组件的loading状态
            [...Array(6)].map((_, i) => (
              <ArticleListCard
                key={i}
                slug=""
                title=""
                description=""
                coverImage=""
                category=""
                tags={[]}
                author=""
                date=""
                readTime=""
                views={0}
                isLoading={true}
              />
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

