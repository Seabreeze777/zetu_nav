/**
 * 顶部导航组件 - 完善版
 * 
 * 功能：
 * - Logo 和网站名称
 * - 带下拉菜单的导航栏
 * - 搜索框
 * - 主题切换
 * - 登录按钮
 * 
 * 特点：
 * - 悬浮置顶（sticky）
 * - 毛玻璃效果
 * - 一体化嵌入式设计
 */

'use client'

import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useUser } from '@/contexts/UserContext'
import GlobalSearch from '@/components/common/GlobalSearch'

// 菜单项接口
interface MenuItem {
  id: number
  name: string
  href: string
  icon?: string | null
  openInNewTab: boolean
  children?: MenuItem[]
}

export default function TopNav() {
  const router = useRouter()
  const { user, loading, logout } = useUser()
  const [openMenu, setOpenMenu] = useState<string | null>(null)
  const [menuTimeout, setMenuTimeout] = useState<NodeJS.Timeout | null>(null)
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const userMenuRef = useRef<HTMLDivElement>(null)
  
  // 动态菜单
  const [menuItems, setMenuItems] = useState<MenuItem[]>([])
  const [siteName, setSiteName] = useState('泽途网')

  // 加载导航菜单和网站配置
  useEffect(() => {
    async function fetchMenus() {
      try {
        const res = await fetch('/api/navigation-menus')
        const data = await res.json()
        if (data.success) {
          setMenuItems(data.data)
        }
      } catch (error) {
        console.error('加载导航菜单失败:', error)
        // 使用默认菜单
        setMenuItems([
          { id: 1, name: '首页', href: '/', openInNewTab: false, children: [] },
          { id: 2, name: '资讯中心', href: '/articles', openInNewTab: false, children: [] },
        ])
      }
    }
    
    async function fetchConfig() {
      try {
        const res = await fetch('/api/config')
        const data = await res.json()
        if (data.success && data.data.SITE_NAME) {
          setSiteName(data.data.SITE_NAME)
        }
      } catch (error) {
        console.error('加载配置失败:', error)
      }
    }
    
    fetchMenus()
    fetchConfig()
  }, [])


  // 鼠标进入菜单区域（包括按钮和下拉菜单）
  const handleMenuEnter = (menuName: string) => {
    // 清除之前的关闭定时器
    if (menuTimeout) {
      clearTimeout(menuTimeout)
      setMenuTimeout(null)
    }
    // 立即打开菜单
    setOpenMenu(menuName)
  }

  // 鼠标离开整个菜单区域
  const handleMenuLeave = () => {
    // 延迟 300ms 关闭，给用户缓冲时间
    const timeout = setTimeout(() => {
      setOpenMenu(null)
    }, 300)
    setMenuTimeout(timeout)
  }

  // 处理登出
  const handleLogout = async () => {
    await logout()
    setUserMenuOpen(false)
    router.push('/')
  }

  // 点击外部关闭用户菜单
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setUserMenuOpen(false)
      }
    }

    if (userMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [userMenuOpen])

  return (
    <header className="sticky top-0 z-50 w-full border-b border-gray-200/50 bg-white/70 backdrop-blur-xl shadow-sm">
      <div className="container mx-auto px-6">
        <div className="flex h-16 items-center justify-between gap-8">
          {/* 左侧：Logo + 菜单 */}
          <div className="flex items-center gap-8">
            <Link 
              href="/" 
              className="flex items-center transition-opacity hover:opacity-80"
            >
              <img 
                src="/icons/logo_l.png" 
                alt={siteName}
                className="h-10 w-auto object-contain"
              />
            </Link>

            {/* 菜单导航 */}
            <nav className="hidden lg:flex items-center gap-1">
              {menuItems.map((menu) => (
                <div
                  key={menu.name}
                  className="relative flex items-center"
                  onMouseEnter={() => handleMenuEnter(menu.name)}
                  onMouseLeave={handleMenuLeave}
                >
                  {/* 菜单按钮 */}
                  <Link
                    href={menu.href}
                    target={menu.openInNewTab ? '_blank' : undefined}
                    rel={menu.openInNewTab ? 'noopener noreferrer' : undefined}
                    className="flex items-center gap-1.5 px-4 py-2.5 text-base font-medium text-gray-700 rounded-lg transition-all duration-200
                      hover:bg-gray-100 hover:text-indigo-600 hover:scale-105 active:scale-100"
                  >
                    {menu.icon && <span>{menu.icon}</span>}
                    {menu.name}
                    {/* 箭头：仅当有子菜单时显示 */}
                    {menu.children && menu.children.length > 0 && (
                      <svg 
                        className={`h-4 w-4 transition-transform ${openMenu === menu.name ? 'rotate-90' : ''}`}
                        fill="none" 
                        stroke="currentColor" 
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    )}
                  </Link>

                  {/* 下拉菜单：仅当有子菜单时显示 */}
                  {menu.children && menu.children.length > 0 && openMenu === menu.name && (
                    <div className="absolute left-0 top-full">
                      <div className="w-48 rounded-xl border border-gray-200/50 bg-white/95 backdrop-blur-xl shadow-xl">
                        <div className="p-2">
                          {menu.children.map((item) => (
                            <Link
                              key={item.id}
                              href={item.href}
                              target={item.openInNewTab ? '_blank' : undefined}
                              rel={item.openInNewTab ? 'noopener noreferrer' : undefined}
                              className="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 rounded-lg transition-all duration-200
                                hover:bg-indigo-50 hover:text-indigo-600 hover:translate-x-1"
                            >
                              <span className="h-1.5 w-1.5 rounded-full bg-indigo-400"></span>
                              {item.name}
                            </Link>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </nav>
          </div>

          {/* 右侧：搜索框 + 用户菜单 */}
          <div className="flex items-center gap-4">
            {/* 全局搜索框 */}
            <div className="hidden md:flex">
              <GlobalSearch />
            </div>
            {loading ? (
              /* 加载中 */
              <div className="w-9 h-9 rounded-full bg-gray-200 animate-pulse"></div>
            ) : user ? (
              /* 已登录：显示用户菜单 */
              <div className="relative" ref={userMenuRef}>
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-gray-700 transition-all hover:bg-gray-100"
                >
                  {/* 头像 */}
                  <div className="h-8 w-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-sm font-bold shadow-lg">
                    {user.avatar ? (
                      <img src={user.avatar} alt={user.nickname || user.username} className="w-full h-full rounded-full object-cover" />
                    ) : (
                      <span>{(user.nickname || user.username).charAt(0).toUpperCase()}</span>
                    )}
                  </div>
                  {/* 用户名（桌面端显示） */}
                  <span className="hidden sm:inline">{user.nickname || user.username}</span>
                  {/* 下拉箭头 */}
                  <svg 
                    className={`h-4 w-4 transition-transform ${userMenuOpen ? 'rotate-180' : ''}`}
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {/* 用户下拉菜单 */}
                {userMenuOpen && (
                  <div className="absolute right-0 top-full mt-2 w-56 rounded-xl border border-gray-200/50 bg-white/95 backdrop-blur-xl shadow-xl z-50">
                    <div className="p-2">
                      {/* 用户信息 */}
                      <div className="px-3 py-2 border-b border-gray-100 mb-2">
                        <p className="text-sm font-medium text-gray-900">{user.nickname || user.username}</p>
                        {user.email && <p className="text-xs text-gray-500 truncate">{user.email}</p>}
                        <p className="text-xs text-gray-400 mt-1">
                          {user.role === 'admin' ? '👑 管理员' : '👤 普通用户'}
                        </p>
                      </div>

                      {/* 管理员专属：管理后台入口 */}
                      {user.role === 'admin' && (
                        <>
                          <Link
                            href="/admin"
                            onClick={() => setUserMenuOpen(false)}
                            className="flex items-center gap-3 px-3 py-2 text-sm text-indigo-700 rounded-lg transition-all hover:bg-indigo-50 font-medium"
                          >
                            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                            <span>🛠️ 管理后台</span>
                          </Link>
                          <div className="my-2 border-t border-gray-100"></div>
                        </>
                      )}

                      {/* 普通用户菜单 */}
                      <Link
                        href="/favorites"
                        onClick={() => setUserMenuOpen(false)}
                        className="flex items-center gap-3 px-3 py-2 text-sm text-gray-700 rounded-lg transition-all hover:bg-gray-100"
                      >
                        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                        </svg>
                        <span>我的收藏</span>
                      </Link>

                      <Link
                        href="/settings"
                        onClick={() => setUserMenuOpen(false)}
                        className="flex items-center gap-3 px-3 py-2 text-sm text-gray-700 rounded-lg transition-all hover:bg-gray-100"
                      >
                        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                        <span>个人设置</span>
                      </Link>

                      <div className="my-2 border-t border-gray-100"></div>

                      {/* 登出 */}
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-3 py-2 text-sm text-red-600 rounded-lg transition-all hover:bg-red-50"
                      >
                        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                        </svg>
                        <span>退出登录</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              /* 未登录：显示登录按钮 */
              <Link
                href="/login"
                className="hidden sm:flex items-center gap-1.5 rounded-lg border border-blue-200 bg-blue-50 px-4 py-2 text-sm font-medium text-blue-700 transition-all duration-200
                  hover:border-blue-300 hover:bg-blue-100 hover:scale-105 active:scale-100 shadow-sm hover:shadow-md"
              >
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
                <span>登录</span>
              </Link>
            )}

            {/* 移动端菜单按钮 */}
            <button className="rounded-lg p-2.5 text-gray-600 lg:hidden hover:bg-gray-100">
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </header>
  )
}

