'use client'

import { useEffect, useState } from 'react'
import AdminLayout from '@/components/admin/AdminLayout'

interface Stats {
  websites: number
  articles: number
  categories: number
  tags: number
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchStats()
  }, [])

  const fetchStats = async () => {
    try {
      // 获取网站数量
      const websitesRes = await fetch('/api/websites')
      const websitesData = await websitesRes.json()
      const websitesCount = websitesData.success ? websitesData.total : 0

      // 获取文章数量
      const articlesRes = await fetch('/api/articles')
      const articlesData = await articlesRes.json()
      const articlesCount = articlesData.success ? articlesData.pagination?.total || 0 : 0

      // 获取分类数量
      const categoriesRes = await fetch('/api/categories')
      const categoriesData = await categoriesRes.json()
      const categoriesCount = categoriesData.success ? categoriesData.data.length : 0

      // 获取标签数量
      const tagsRes = await fetch('/api/tags')
      const tagsData = await tagsRes.json()
      const tagsCount = tagsData.success ? tagsData.data.length : 0

      setStats({
        websites: websitesCount,
        articles: articlesCount,
        categories: categoriesCount,
        tags: tagsCount,
      })
    } catch (error) {
      console.error('获取统计数据失败:', error)
    } finally {
      setLoading(false)
    }
  }

  const statCards = stats
    ? [
        { title: '网站数量', value: stats.websites, icon: '🌐', color: 'from-blue-500 to-cyan-500' },
        { title: '文章数量', value: stats.articles, icon: '📝', color: 'from-purple-500 to-pink-500' },
        { title: '分类数量', value: stats.categories, icon: '📂', color: 'from-green-500 to-emerald-500' },
        { title: '标签数量', value: stats.tags, icon: '🏷️', color: 'from-orange-500 to-red-500' },
      ]
    : []

  return (
    <AdminLayout>
      <div className="p-6">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* 页面标题 */}
          <div>
            <h1 className="text-2xl font-bold text-gray-900">仪表盘</h1>
            <p className="text-sm text-gray-500 mt-1">欢迎回来，查看您的网站数据概览</p>
          </div>

        {/* 统计卡片 */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-white rounded-2xl shadow-sm p-6 animate-pulse">
                <div className="h-12 w-12 bg-gray-200 rounded-xl mb-4"></div>
                <div className="h-4 bg-gray-200 rounded w-20 mb-2"></div>
                <div className="h-8 bg-gray-200 rounded w-16"></div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {statCards.map((card) => (
              <div
                key={card.title}
                className="bg-white rounded-2xl shadow-sm hover:shadow-lg transition-shadow p-6"
              >
                <div className={`w-12 h-12 bg-gradient-to-br ${card.color} rounded-xl flex items-center justify-center text-2xl mb-4`}>
                  {card.icon}
                </div>
                <p className="text-sm text-gray-600 mb-1">{card.title}</p>
                <p className="text-3xl font-bold text-gray-900">{card.value}</p>
              </div>
            ))}
          </div>
        )}

        {/* 快捷操作 */}
        <div className="bg-white rounded-2xl shadow-sm p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4">快捷操作</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <a
              href="/admin/websites"
              className="flex flex-col items-center gap-2 p-4 rounded-xl border-2 border-gray-200 hover:border-indigo-500 hover:bg-indigo-50 transition-all"
            >
              <span className="text-3xl">➕</span>
              <span className="text-sm font-medium text-gray-900">添加网站</span>
            </a>
            <a
              href="/admin/articles"
              className="flex flex-col items-center gap-2 p-4 rounded-xl border-2 border-gray-200 hover:border-indigo-500 hover:bg-indigo-50 transition-all"
            >
              <span className="text-3xl">✍️</span>
              <span className="text-sm font-medium text-gray-900">写文章</span>
            </a>
            <a
              href="/admin/categories"
              className="flex flex-col items-center gap-2 p-4 rounded-xl border-2 border-gray-200 hover:border-indigo-500 hover:bg-indigo-50 transition-all"
            >
              <span className="text-3xl">📂</span>
              <span className="text-sm font-medium text-gray-900">管理分类</span>
            </a>
            <a
              href="/"
              target="_blank"
              className="flex flex-col items-center gap-2 p-4 rounded-xl border-2 border-gray-200 hover:border-indigo-500 hover:bg-indigo-50 transition-all"
            >
              <span className="text-3xl">🌍</span>
              <span className="text-sm font-medium text-gray-900">查看网站</span>
            </a>
          </div>
        </div>

        {/* 最近活动 */}
        <div className="bg-white rounded-2xl shadow-sm p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4">系统信息</h2>
          <div className="space-y-3 text-sm">
            <div className="flex items-center justify-between py-2 border-b border-gray-100">
              <span className="text-gray-600">数据库状态</span>
              <span className="text-green-600 font-medium">● 正常</span>
            </div>
            <div className="flex items-center justify-between py-2 border-b border-gray-100">
              <span className="text-gray-600">Next.js 版本</span>
              <span className="text-gray-900 font-medium">14.0.4</span>
            </div>
            <div className="flex items-center justify-between py-2">
              <span className="text-gray-600">Prisma 版本</span>
              <span className="text-gray-900 font-medium">5.7.0</span>
            </div>
          </div>
        </div>
        </div>
      </div>
    </AdminLayout>
  )
}
