'use client'

import { useEffect, useState, useRef } from 'react'
import { HeroStyles } from '@/components/home/hero-styles'
import AnnouncementBanner from '@/components/home/AnnouncementBanner'
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
  const [heroStyle, setHeroStyle] = useState('1') // Hero样式ID
  const [showAnnouncementBanner, setShowAnnouncementBanner] = useState(true) // 公告栏开关
  const [heroConfig, setHeroConfig] = useState<any>({}) // Hero样式配置
  const isScrollingToSectionRef = useRef(false) // ✅ 使用 ref 确保立即生效，避免React状态更新延迟
  const scrollTimerRef = useRef<NodeJS.Timeout | null>(null) // ✅ 存储定时器引用，用于清理

  // 获取数据
  useEffect(() => {
    async function fetchData() {
      try {
        // 获取UI配置（Hero样式、公告栏开关、Hero配置）
        const uiSettingsRes = await fetch('/api/ui-settings')
        const uiSettingsData = await uiSettingsRes.json()
        if (uiSettingsData.success) {
          setHeroStyle(uiSettingsData.data.heroStyle || '1')
          setShowAnnouncementBanner(uiSettingsData.data.showAnnouncementBanner !== false)
          
          // 解析Hero配置
          if (uiSettingsData.data.heroConfig) {
            try {
              const config = JSON.parse(uiSettingsData.data.heroConfig)
              setHeroConfig(config)
            } catch (e) {
              console.error('解析Hero配置失败:', e)
            }
          }
        }

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
      // ✅ 如果正在点击跳转，不触发滚动监听（避免弹跳）
      if (isScrollingToSectionRef.current) return
      
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
    // ✅ 清除之前的定时器（如果快速点击）
    if (scrollTimerRef.current) {
      clearTimeout(scrollTimerRef.current)
    }
    
    // ✅ 使用 ref 立即禁用滚动监听（不等待React渲染）
    isScrollingToSectionRef.current = true
    setActiveCategory(categorySlug)
    
    // 平滑滚动到对应分类
    const element = document.getElementById(`category-${categorySlug}`)
    if (element) {
      const top = element.getBoundingClientRect().top + window.scrollY - 80
      window.scrollTo({ top, behavior: 'smooth' })
      
      // ✅ 使用更长的延迟（1.5秒），确保滚动完全完成
      scrollTimerRef.current = setTimeout(() => {
        isScrollingToSectionRef.current = false
        scrollTimerRef.current = null
      }, 1500)
    } else {
      // 如果元素不存在，立即重新启用滚动监听
      isScrollingToSectionRef.current = false
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
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
        {/* Hero区域在加载时显示简洁的loading状态，避免突兀的骨架屏 */}
        <div className="pt-16 pb-8 relative overflow-hidden" style={{
          backgroundImage: `
            repeating-linear-gradient(0deg, rgba(99,102,241,0.03) 0px, rgba(99,102,241,0.03) 1px, transparent 1px, transparent 40px),
            repeating-linear-gradient(90deg, rgba(99,102,241,0.03) 0px, rgba(99,102,241,0.03) 1px, transparent 1px, transparent 40px)
          `,
        }}>
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-indigo-100/20 rounded-full blur-3xl -z-10"></div>
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-100/20 rounded-full blur-3xl -z-10"></div>
          <div className="container mx-auto px-6 relative">
            <div className="max-w-3xl mx-auto text-center">
              <div className="h-24 mb-12"></div> {/* 占位，避免跳动 */}
            </div>
          </div>
        </div>
        
        {/* 公告栏（loading时不显示） */}
        
        <div className="container mx-auto px-6 py-6">
          <div className="flex gap-6">
            {/* 左侧边栏骨架屏 */}
            <aside className="sticky top-20 h-fit w-44">
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm border border-gray-100/50 p-2">
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

            {/* 右侧内容区 - 整个main是一个白色面板 */}
            <main className="flex-1 min-w-0 bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm border border-gray-100/50 p-6">
              <div className="space-y-8">
                {skeletonCategories.map((category) => (
                  <section key={category.slug} className="scroll-mt-20">
                    {/* 分类标题骨架屏 */}
                    <div className="flex items-center gap-2 mb-4">
                      <div className="w-6 h-6 bg-gray-200 rounded animate-pulse"></div>
                      <div className="h-7 bg-gray-200 rounded w-32 animate-pulse"></div>
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

  // 动态获取Hero组件 - 只支持样式3和4，默认使用样式4（打字机）
  const validHeroStyle = ['3', '4'].includes(heroStyle) ? heroStyle : '4'
  const HeroComponent = HeroStyles[validHeroStyle as keyof typeof HeroStyles] || HeroStyles['4']
  const currentStyleConfig = heroConfig[`style${validHeroStyle}`] || {}

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      <HeroComponent config={currentStyleConfig} />
      
      {/* 单行滚动公告栏 - 根据配置决定是否显示 */}
      {showAnnouncementBanner && <AnnouncementBanner />}
      
      <div className="container mx-auto px-6 pt-2 pb-6">
        <div className="flex gap-6">
          {/* 左侧边栏 - 白色面板，微妙的玻璃态效果 */}
          <aside className="sticky top-20 h-fit w-44">
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm border border-gray-100/50 p-2 transition-all duration-300 hover:shadow-md">
              <nav className="space-y-0.5">
                {categories.map((category) => (
                  <button
                    key={category.slug}
                    onClick={() => handleCategoryClick(category.slug)}
                    className={`w-full group relative flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                      activeCategory === category.slug
                        ? 'bg-gradient-to-r from-indigo-50 to-purple-50 text-indigo-700 shadow-sm'
                        : 'text-gray-700 hover:bg-gray-50 hover:scale-[1.02]'
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
          
          {/* 右侧内容区 - 整个main是一个白色面板（馅料层） */}
          <main className="flex-1 min-w-0 bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm border border-gray-100/50 p-6">
            <div className="space-y-8">
              {categories.map((category) => {
                const websites = websitesByCategory[category.slug] || []
                
                return (
                  <section 
                    key={category.slug} 
                    id={`category-${category.slug}`} 
                    className="scroll-mt-20"
                  >
                    {/* 分类标题 - 加大字号，收紧字距 */}
                    <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2 tracking-tight">
                      <span className="text-2xl">{category.icon}</span>
                      <span>{category.name}</span>
                      {category.description && (
                        <span className="ml-2 text-sm font-normal text-gray-500 tracking-normal">
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
                      <div className="flex flex-col items-center justify-center p-8 border border-gray-100 rounded-lg bg-gray-50/50">
                        <span className="text-3xl mb-2">🚀</span>
                        <p className="text-sm font-medium text-gray-600">内容正在收集中...</p>
                        <p className="text-xs text-gray-400">该分类暂无网站</p>
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

