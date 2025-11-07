'use client'

import { useState, useEffect } from 'react'
import AdminLayout from '@/components/admin/AdminLayout'
import { useToast } from '@/contexts/ToastContext'

interface DashboardStats {
  totals: {
    websites: number
    articles: number
    users: number
    categories: number
    tags: number
    media: number
  }
  today: {
    websites: number
    articles: number
    users: number
  }
  week: {
    websites: number
    articles: number
    users: number
  }
  popular: {
    websites: Array<{ id: number; name: string; clickCount: number; logoUrl: string | null }>
    articles: Array<{ id: number; title: string; views: number; coverImage: string | null }>
  }
  recentActivities: Array<{
    id: number
    action: string
    module: string
    targetName: string | null
    createdAt: string
    user: {
      username: string
      nickname: string | null
    }
  }>
  trends: Array<{
    date: string
    websites: number
    articles: number
  }>
}

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    fetchStats()
  }, [])

  const fetchStats = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/admin/dashboard/stats')
      const data = await response.json()

      if (data.success) {
        setStats(data.data)
      } else {
        toast.error(data.error || '加载统计数据失败')
      }
    } catch (error) {
      console.error('加载统计数据失败:', error)
      toast.error('加载统计数据失败')
    } finally {
      setLoading(false)
    }
  }

  if (loading || !stats) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-gray-500">加载中...</div>
        </div>
      </AdminLayout>
    )
  }

  return (
    <AdminLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-6">
          {/* 页面标题 */}
          <div>
            <h1 className="text-3xl font-bold text-gray-900">数据概览</h1>
            <p className="mt-2 text-sm text-gray-600">系统统计数据和运营情况一览</p>
          </div>

        {/* 核心指标卡片 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <StatCard
            title="网站总数"
            value={stats.totals.websites}
            todayChange={stats.today.websites}
            weekChange={stats.week.websites}
            icon="🌐"
            color="blue"
          />
          <StatCard
            title="文章总数"
            value={stats.totals.articles}
            todayChange={stats.today.articles}
            weekChange={stats.week.articles}
            icon="📝"
            color="green"
          />
          <StatCard
            title="用户总数"
            value={stats.totals.users}
            todayChange={stats.today.users}
            weekChange={stats.week.users}
            icon="👥"
            color="purple"
          />
        </div>

        {/* 次要指标 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">分类总数</p>
                <p className="mt-1 text-2xl font-semibold text-gray-900">
                  {stats.totals.categories}
                </p>
              </div>
              <span className="text-3xl">📂</span>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">标签总数</p>
                <p className="mt-1 text-2xl font-semibold text-gray-900">
                  {stats.totals.tags}
                </p>
              </div>
              <span className="text-3xl">🏷️</span>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">媒体文件</p>
                <p className="mt-1 text-2xl font-semibold text-gray-900">
                  {stats.totals.media}
                </p>
              </div>
              <span className="text-3xl">🖼️</span>
            </div>
          </div>
        </div>

        {/* 数据趋势图 */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">最近7天数据趋势</h3>
          <div className="h-64 flex items-end justify-between gap-2">
            {stats.trends.map((day, index) => {
              const maxValue = Math.max(...stats.trends.map(d => Math.max(d.websites, d.articles)))
              const websiteHeight = maxValue > 0 ? (day.websites / maxValue) * 100 : 0
              const articleHeight = maxValue > 0 ? (day.articles / maxValue) * 100 : 0

              return (
                <div key={index} className="flex-1 flex flex-col items-center gap-2">
                  <div className="w-full flex gap-1 items-end" style={{ height: '200px' }}>
                    <div
                      className="flex-1 bg-blue-500 rounded-t hover:bg-blue-600 transition-all cursor-pointer relative group"
                      style={{ height: `${websiteHeight}%` }}
                      title={`网站: ${day.websites}`}
                    >
                      <span className="absolute -top-6 left-1/2 transform -translate-x-1/2 text-xs font-medium text-gray-700 opacity-0 group-hover:opacity-100 transition-opacity">
                        {day.websites}
                      </span>
                    </div>
                    <div
                      className="flex-1 bg-green-500 rounded-t hover:bg-green-600 transition-all cursor-pointer relative group"
                      style={{ height: `${articleHeight}%` }}
                      title={`文章: ${day.articles}`}
                    >
                      <span className="absolute -top-6 left-1/2 transform -translate-x-1/2 text-xs font-medium text-gray-700 opacity-0 group-hover:opacity-100 transition-opacity">
                        {day.articles}
                      </span>
                    </div>
                  </div>
                  <span className="text-xs text-gray-500">
                    {new Date(day.date).getMonth() + 1}/{new Date(day.date).getDate()}
                  </span>
                </div>
              )
            })}
          </div>
          <div className="mt-4 flex items-center justify-center gap-6 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-blue-500 rounded"></div>
              <span className="text-gray-600">网站</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-green-500 rounded"></div>
              <span className="text-gray-600">文章</span>
            </div>
          </div>
        </div>

        {/* 热门内容 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* 热门网站 */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">热门网站 Top 10</h3>
            <div className="space-y-3">
              {stats.popular.websites.map((website, index) => (
                <div key={website.id} className="flex items-center gap-3">
                  <div className={`w-6 h-6 flex items-center justify-center rounded-full text-xs font-bold ${
                    index === 0 ? 'bg-yellow-100 text-yellow-800' :
                    index === 1 ? 'bg-gray-100 text-gray-800' :
                    index === 2 ? 'bg-orange-100 text-orange-800' :
                    'bg-gray-50 text-gray-600'
                  }`}>
                    {index + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">{website.name}</p>
                  </div>
                  <div className="text-sm text-gray-500">
                    {website.clickCount.toLocaleString()} 次
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 热门文章 */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">热门文章 Top 10</h3>
            <div className="space-y-3">
              {stats.popular.articles.map((article, index) => (
                <div key={article.id} className="flex items-center gap-3">
                  <div className={`w-6 h-6 flex items-center justify-center rounded-full text-xs font-bold ${
                    index === 0 ? 'bg-yellow-100 text-yellow-800' :
                    index === 1 ? 'bg-gray-100 text-gray-800' :
                    index === 2 ? 'bg-orange-100 text-orange-800' :
                    'bg-gray-50 text-gray-600'
                  }`}>
                    {index + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">{article.title}</p>
                  </div>
                  <div className="text-sm text-gray-500">
                    {article.views.toLocaleString()} 次
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 最近活动 */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">最近操作</h3>
          <div className="space-y-3">
            {stats.recentActivities.slice(0, 10).map((activity) => (
              <div key={activity.id} className="flex items-center gap-3 text-sm">
                <span className="text-gray-500">
                  {new Date(activity.createdAt).toLocaleTimeString('zh-CN', {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </span>
                <span className="text-gray-900 font-medium">
                  {activity.user.nickname || activity.user.username}
                </span>
                <span className="text-gray-600">{getActionText(activity.action)}</span>
                <span className="text-gray-600">{activity.module}</span>
                {activity.targetName && (
                  <span className="text-gray-900">「{activity.targetName}」</span>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
      </div>
    </AdminLayout>
  )
}

// 统计卡片组件
function StatCard({
  title,
  value,
  todayChange,
  weekChange,
  icon,
  color,
}: {
  title: string
  value: number
  todayChange: number
  weekChange: number
  icon: string
  color: 'blue' | 'green' | 'purple'
}) {
  const colorClasses = {
    blue: 'from-blue-500 to-blue-600',
    green: 'from-green-500 to-green-600',
    purple: 'from-purple-500 to-purple-600',
  }

  return (
    <div className={`bg-gradient-to-br ${colorClasses[color]} rounded-lg shadow-lg p-6 text-white`}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-medium">{title}</h3>
        <span className="text-4xl">{icon}</span>
      </div>
      <p className="text-4xl font-bold mb-4">{value.toLocaleString()}</p>
      <div className="flex items-center gap-4 text-sm opacity-90">
        <div>
          <span className="font-medium">今日 +{todayChange}</span>
        </div>
        <div>
          <span className="font-medium">本周 +{weekChange}</span>
        </div>
      </div>
    </div>
  )
}

// 获取操作类型中文
function getActionText(action: string) {
  const map: Record<string, string> = {
    CREATE: '创建了',
    UPDATE: '更新了',
    DELETE: '删除了',
    LOGIN: '登录了',
    LOGOUT: '登出了',
  }
  return map[action] || action
}

