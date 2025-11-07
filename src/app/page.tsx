'use client'

import { useEffect, useState } from 'react'
import HeroSection from '@/components/home/HeroSection'
import WebsiteCard from '@/components/home/WebsiteCard'
import FeaturedCard from '@/components/home/FeaturedCard'

// 类型定义
interface Category {
  id: number
  name: string
  slug: string
  icon: string
  description: string | null
  cardsPerRow: number
  displayMode: string
  websiteCount: number
}

interface Website {
  id: number
  name: string
  description: string | null
  url: string
  logoUrl: string | null
  clickCount: number
  actionButtons?: Array<{
    text: string
    url: string
  }>
  category: {
    name: string
    slug: string
    icon: string
    cardsPerRow: number
    displayMode: string
  }
  tags: Array<{
    name: string
    slug: string
    color: string
  }>
}

interface CategoryWebsites {
  [key: string]: Website[]
}

// 首页组件
export default function HomePage() {
  const [activeCategory, setActiveCategory] = useState('')
  const [isLoading, setIsLoading] = useState(true) // ✅ 每次都显示骨架屏（符合用户期望）
  const [categories, setCategories] = useState<Category[]>([])
  const [websitesByCategory, setWebsitesByCategory] = useState<CategoryWebsites>({})

  // 获取数据
  useEffect(() => {
    async function fetchData() {
      try {
        // 获取分类列表
        const categoriesRes = await fetch('/api/categories')
        const categoriesData = await categoriesRes.json()
        
        if (categoriesData.success) {
          const cats = categoriesData.data as Category[]
          setCategories(cats)
          
          // 设置默认激活第一个分类
          if (cats.length > 0) {
            setActiveCategory(cats[0].slug)
          }

          // 获取每个分类的网站
          const websitesData: CategoryWebsites = {}
          await Promise.all(
            cats.map(async (cat) => {
              const res = await fetch(`/api/websites?categorySlug=${cat.slug}`)
              const data = await res.json()
              if (data.success) {
                websitesData[cat.slug] = data.data
              }
            })
          )
          
          setWebsitesByCategory(websitesData)
        }
      } catch (error) {
        console.error('获取数据失败:', error)
      } finally {
        setIsLoading(false) // ✅ 加载完成后隐藏骨架屏
      }
    }

    fetchData()
  }, [])

  // 滚动监听：自动高亮侧边栏
  useEffect(() => {
    if (categories.length === 0) return

    const handleScroll = () => {
      const THRESHOLD = 90
      
      const sectionPositions = categories.map((category) => {
        const element = document.getElementById(`category-${category.slug}`)
        if (element) {
          const rect = element.getBoundingClientRect()
          return {
            slug: category.slug,
            top: rect.top,
            bottom: rect.bottom,
          }
        }
        return null
      }).filter(Boolean) as Array<{ slug: string; top: number; bottom: number }>

      if (sectionPositions.length === 0) return

      let activeSlug = categories[0].slug

      for (let i = 0; i < sectionPositions.length; i++) {
        const section = sectionPositions[i]
        if (section.top <= THRESHOLD) {
          activeSlug = section.slug
        } else {
          break
        }
      }

      setActiveCategory(activeSlug)
    }

    handleScroll()

    let ticking = false
    const onScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          handleScroll()
          ticking = false
        })
        ticking = true
      }
    }

    window.addEventListener('scroll', onScroll, { passive: true })

    return () => {
      window.removeEventListener('scroll', onScroll)
    }
  }, [categories])

  const handleCategoryClick = (categorySlug: string) => {
    setActiveCategory(categorySlug)
    // 平滑滚动到对应分类
    const element = document.getElementById(`category-${categorySlug}`)
    if (element) {
      const top = element.getBoundingClientRect().top + window.scrollY - 80
      window.scrollTo({ top, behavior: 'smooth' })
    }
  }

  // 处理网站点击
  const handleWebsiteClick = async (websiteId: number) => {
    try {
      await fetch(`/api/websites/${websiteId}/click`, {
        method: 'POST',
      })
    } catch (error) {
      console.error('记录点击失败:', error)
    }
  }


  // 骨架屏 - 使用真实组件结构，只是显示loading状态
  if (isLoading) {
    // 预设骨架屏数据（模拟真实布局）
    const skeletonCategories = [
      { id: 1, name: '', slug: 'skeleton-1', icon: '', description: '', cardsPerRow: 6, displayMode: 'compact', websiteCount: 6 },
      { id: 2, name: '', slug: 'skeleton-2', icon: '', description: '', cardsPerRow: 5, displayMode: 'button', websiteCount: 5 },
      { id: 3, name: '', slug: 'skeleton-3', icon: '', description: '', cardsPerRow: 4, displayMode: 'large', websiteCount: 8 },
    ]

    return (
      <div className="bg-gray-50">
        {/* Hero区域 - 传入loading状态 */}
        <HeroSection isLoading={true} />
        
        <div className="container mx-auto px-6 py-6">
          <div className="flex gap-6">
            {/* 左侧边栏骨架屏 */}
            <aside className="sticky top-20 h-fit w-44">
              <div className="bg-white rounded-2xl shadow-sm p-2">
                <nav className="space-y-0.5">
                  {[1,2,3,4,5,6,7,8].map(i => (
                    <div key={i} className="flex items-center gap-3 px-3 py-2.5 rounded-xl">
                      <div className="text-lg flex-shrink-0 w-5 h-5 bg-gray-200 rounded animate-pulse"></div>
                      <div className="h-4 bg-gray-200 rounded flex-1 animate-pulse"></div>
                    </div>
                  ))}
                </nav>
              </div>
            </aside>

            {/* 右侧内容区 - 使用真实WebsiteCard组件的loading状态 */}
            <main className="flex-1 min-w-0">
              <div className="space-y-8">
                {skeletonCategories.map((category) => (
                  <section key={category.slug} className="scroll-mt-20">
                    {/* 分类标题骨架屏 */}
                    <div className="flex items-center gap-2 mb-3">
                      <div className="w-5 h-5 bg-gray-200 rounded animate-pulse"></div>
                      <div className="h-6 bg-gray-200 rounded w-24 animate-pulse"></div>
                    </div>
                    
                    {/* 使用真实WebsiteCard组件，传入isLoading=true */}
                    <div className={`grid gap-3 ${
                      category.displayMode === 'large' ? 'grid-cols-4' :
                      category.displayMode === 'button' ? 'grid-cols-5' :
                      'grid-cols-6'
                    }`}>
                      {Array(category.websiteCount).fill(0).map((_, i) => (
                        <WebsiteCard
                          key={i}
                          name=""
                          description=""
                          logo=""
                          url=""
                          displayMode={category.displayMode as 'large' | 'button' | 'compact'}
                          isLoading={true}
                        />
                      ))}
                    </div>
                  </section>
                ))}
              </div>
            </main>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-gray-50">
      <HeroSection />
      
      <div className="container mx-auto px-6 py-6">
        <div className="flex gap-6">
          {/* 左侧边栏 */}
          <aside className="sticky top-20 h-fit w-44">
            <div className="bg-white rounded-2xl shadow-sm p-2">
              <nav className="space-y-0.5">
                {categories.map((category) => (
                  <button
                    key={category.slug}
                    onClick={() => handleCategoryClick(category.slug)}
                    className={`w-full group relative flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                      activeCategory === category.slug
                        ? 'bg-gradient-to-r from-indigo-50 to-purple-50 text-indigo-700 shadow-sm'
                        : 'text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    {/* 左侧指示条 */}
                    {activeCategory === category.slug && (
                      <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-5 bg-gradient-to-b from-indigo-500 to-purple-600 rounded-r-full" />
                    )}
                    
                    {/* 图标 */}
                    <span className={`text-lg flex-shrink-0 transition-transform duration-200 ${
                      activeCategory === category.slug ? 'scale-110' : 'group-hover:scale-105'
                    }`}>
                      {category.icon}
                    </span>
                    
                    {/* 文字 */}
                    <span className="flex-1 text-left truncate">
                      {category.name}
                    </span>
                    
                    {/* 右侧箭头（仅激活时显示） */}
                    {activeCategory === category.slug && (
                      <svg 
                        className="w-4 h-4 text-indigo-500 flex-shrink-0" 
                        fill="none" 
                        viewBox="0 0 24 24" 
                        stroke="currentColor"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    )}
                  </button>
                ))}
              </nav>
            </div>
          </aside>
          
          {/* 右侧内容区 */}
          <main className="flex-1 min-w-0">
            <div className="space-y-8">
              {categories.map((category) => {
                const websites = websitesByCategory[category.slug] || []
                
                return (
                  <section key={category.slug} id={`category-${category.slug}`} className="scroll-mt-20">
                    <h2 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
                      <span>{category.icon}</span>
                      <span>{category.name}</span>
                      {category.description && (
                        <span className="ml-2 text-xs font-normal text-gray-500">
                          {category.description}
                        </span>
                      )}
                    </h2>
                    
                    {websites.length > 0 ? (
            <div className={`grid gap-3 ${
              category.displayMode === 'large' ? 'grid-cols-4' :
              category.displayMode === 'button' ? 'grid-cols-5' :
              'grid-cols-6'
            }`}>
                        {websites.map((website) => (
                          <div key={website.id} onClick={() => handleWebsiteClick(website.id)}>
                            <WebsiteCard
                              name={website.name}
                              description={website.description || ''}
                              logo={website.logoUrl || ''}
                              url={website.url}
                              tags={website.tags.map(t => t.name)}
                              displayMode={category.displayMode as 'large' | 'button' | 'compact'}
                              actionButtons={website.actionButtons || []}
                            />
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="bg-white rounded-2xl shadow-sm p-8 text-center">
                        <p className="text-gray-500">暂无网站数据</p>
                      </div>
                    )}
                  </section>
                )
              })}

            </div>
          </main>
        </div>
      </div>
    </div>
  )
}

