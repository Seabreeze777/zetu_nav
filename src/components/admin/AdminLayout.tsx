'use client'

import { useState } from 'react'
import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { useAdmin } from '@/contexts/AdminContext'

interface AdminLayoutProps {
  children: React.ReactNode
}

interface MenuItem {
  name: string
  icon: string
  href: string
  exact?: boolean
}

interface MenuGroup {
  name: string
  icon: string
  items: MenuItem[]
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const pathname = usePathname()
  const { user, loading, logout } = useAdmin()
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  
  // 菜单分组配置
  const menuGroups: MenuGroup[] = [
    {
      name: '数据分析',
      icon: '📊',
      items: [
        { name: '仪表盘', icon: '📊', href: '/admin', exact: true },
        { name: '监控面板', icon: '📈', href: '/admin/dashboard' },
        { name: '操作日志', icon: '📜', href: '/admin/logs' },
      ]
    },
    {
      name: '内容管理',
      icon: '📝',
      items: [
        { name: '网站管理', icon: '🌐', href: '/admin/websites' },
        { name: '文章管理', icon: '📝', href: '/admin/articles' },
        { name: '分类管理', icon: '📂', href: '/admin/categories' },
        { name: '标签管理', icon: '🏷️', href: '/admin/tags' },
        { name: '媒体库', icon: '📷', href: '/admin/media' },
      ]
    },
    {
      name: '界面配置',
      icon: '🎨',
      items: [
        { name: 'UI配置', icon: '🎨', href: '/admin/ui-settings' },
        { name: '导航菜单', icon: '📋', href: '/admin/navigation-menus' },
        { name: '悬浮按钮', icon: '🎯', href: '/admin/floating-buttons' },
        { name: '公告管理', icon: '📢', href: '/admin/announcements' },
      ]
    },
    {
      name: '系统设置',
      icon: '⚙️',
      items: [
        { name: '用户管理', icon: '👥', href: '/admin/users' },
        { name: '系统配置', icon: '⚙️', href: '/admin/system-config' },
      ]
    }
  ]

  // 判断路由是否激活
  const isActive = (href: string, exact = false) => {
    if (exact) {
      return pathname === href
    }
    return pathname.startsWith(href)
  }

  // 判断分组是否有激活的子项
  const isGroupActive = (group: MenuGroup) => {
    return group.items.some(item => isActive(item.href, item.exact))
  }

  // 状态：展开的分组
  const [expandedGroups, setExpandedGroups] = useState<string[]>(() => {
    // 默认展开包含当前激活路由的分组
    const activeGroups = menuGroups.filter(group => isGroupActive(group))
    
    // 如果有激活的分组，展开它
    if (activeGroups.length > 0) {
      return [activeGroups[0].name]
    }
    
    // 如果没有激活的分组（首次进入后台），默认展开第一个分组（数据分析）
    return menuGroups.length > 0 ? [menuGroups[0].name] : []
  })

  const toggleGroup = (groupName: string) => {
    setExpandedGroups(prev => 
      prev.includes(groupName)
        ? prev.filter(name => name !== groupName)
        : [groupName]  // 手风琴效果：只保留当前展开的分组
    )
  }

  // 只在真正需要时显示加载界面
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">加载中...</p>
        </div>
      </div>
    )
  }
  
  if (!user) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* 侧边栏 */}
      <aside className={`fixed left-0 top-0 bottom-0 w-64 bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 z-30 transition-transform lg:translate-x-0 ${
        sidebarCollapsed ? '-translate-x-full' : 'translate-x-0'
      } shadow-2xl`}>
        {/* Logo 区域 */}
        <div className="h-16 flex items-center px-6 border-b border-white/10">
          <Link href="/admin" className="flex items-center gap-3 group">
            <div className="w-9 h-9 bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform">
              <span className="text-white text-xl">⚡</span>
            </div>
            <div>
              <span className="font-bold text-white text-base">泽途网</span>
              <p className="text-xs text-gray-400">管理后台</p>
            </div>
          </Link>
        </div>

        {/* 导航菜单 */}
        <nav className="p-3 mt-2 overflow-y-auto" style={{ maxHeight: 'calc(100vh - 180px)' }}>
          {menuGroups.map((group) => {
            const groupActive = isGroupActive(group)
            const isExpanded = expandedGroups.includes(group.name)
            
            return (
              <div key={group.name} className="mb-2">
                {/* 分组标题 */}
                <button
                  onClick={() => toggleGroup(group.name)}
                  className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg transition-all duration-200 ${
                    groupActive
                      ? 'bg-white/10 text-white'
                      : 'text-gray-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <span className="text-lg">{group.icon}</span>
                  <span className="flex-1 text-left text-sm font-semibold">{group.name}</span>
                  {/* 展开/收起箭头 */}
                  <svg
                    className={`w-4 h-4 transition-transform duration-200 ${
                      isExpanded ? 'rotate-180' : ''
                    }`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {/* 子菜单项 */}
                {isExpanded && (
                  <div className="mt-1 ml-4 space-y-0.5">
                    {group.items.map((item) => {
                      const active = isActive(item.href, item.exact)
                      return (
                        <Link
                          key={item.href}
                          href={item.href}
                          className={`group relative flex items-center gap-3 px-4 py-2.5 rounded-lg transition-all duration-200 ${
                            active
                              ? 'bg-gradient-to-r from-indigo-500/20 to-purple-500/20 text-white shadow-lg'
                              : 'text-gray-400 hover:text-white hover:bg-white/5'
                          }`}
                        >
                          {/* 激活指示器 */}
                          {active && (
                            <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-gradient-to-b from-indigo-400 to-purple-500 rounded-r-full" />
                          )}
                          
                          <span className={`text-base transition-transform duration-200 ${active ? 'scale-110' : 'group-hover:scale-105'}`}>
                            {item.icon}
                          </span>
                          <span className={`text-sm ${active ? 'font-semibold' : 'font-medium'}`}>
                            {item.name}
                          </span>
                          
                          {/* 激活箭头 */}
                          {active && (
                            <svg className="w-3.5 h-3.5 ml-auto text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                            </svg>
                          )}
                        </Link>
                      )
                    })}
                  </div>
                )}
              </div>
            )
          })}
        </nav>

        {/* 底部用户区域 */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-white/10 bg-black/20">
          <div className="flex items-center gap-3 px-3 py-2">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center text-white font-bold shadow-lg">
              {(user?.nickname || user?.username || 'A').charAt(0).toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-white truncate">{user?.nickname || user?.username}</p>
              <p className="text-xs text-gray-400">{user?.role === 'admin' ? '👑 管理员' : '📝 编辑'}</p>
            </div>
            <button
              onClick={logout}
              className="p-2 hover:bg-white/10 rounded-lg transition-colors"
              title="退出登录"
            >
              <svg className="w-5 h-5 text-gray-400 hover:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
            </button>
          </div>
        </div>
      </aside>

      {/* 顶部导航栏 */}
      <header className="fixed top-0 left-0 right-0 h-16 bg-white/80 backdrop-blur-sm border-b border-gray-200 z-20 lg:left-64">
        <div className="h-full px-6 flex items-center justify-between">
          {/* 移动端菜单按钮 */}
          <button
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors lg:hidden"
          >
            <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>

          {/* 面包屑或标题 */}
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            <span className="font-medium text-gray-900">
              {(() => {
                // 找到当前激活的菜单项
                for (const group of menuGroups) {
                  const activeItem = group.items.find(item => isActive(item.href, item.exact))
                  if (activeItem) {
                    return activeItem.name
                  }
                }
                return '管理面板'
              })()}
            </span>
          </div>

          {/* 右侧操作区 */}
          <div className="flex items-center gap-3">
            <Link
              href="/"
              target="_blank"
              className="hidden sm:flex items-center gap-2 px-4 py-2 text-sm text-gray-600 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
              <span>前台网站</span>
            </Link>
          </div>
        </div>
      </header>

      {/* 主内容区 */}
      <main className="lg:ml-64 pt-16 min-h-screen">
        {children}
      </main>

      {/* 移动端侧边栏遮罩 */}
      {!sidebarCollapsed && (
        <div
          className="fixed inset-0 bg-black/60 z-20 lg:hidden backdrop-blur-sm"
          onClick={() => setSidebarCollapsed(true)}
        />
      )}
    </div>
  )
}

