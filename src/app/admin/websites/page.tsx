'use client'

import { useEffect, useState } from 'react'
import AdminLayout from '@/components/admin/AdminLayout'
import Link from 'next/link'
import Image from 'next/image'
import { useToast } from '@/contexts/ToastContext'
import ToggleSwitch from '@/components/common/ToggleSwitch'

interface Website {
  id: number
  name: string
  description: string
  url: string
  logoUrl: string | null
  clickCount: number
  isActive: boolean
  category: {
    name: string
    slug: string
  }
  tags: Array<{
    name: string
    slug: string
    color: string
  }>
}

export default function WebsitesPage() {
  const toast = useToast()
  const [websites, setWebsites] = useState<Website[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    fetchWebsites()
  }, [])

  const fetchWebsites = async () => {
    try {
      console.log('🔍 开始获取网站列表...')
      const res = await fetch('/api/admin/websites') // ✅ 使用后台专用API
      console.log('📡 响应状态:', res.status, res.statusText)
      const data = await res.json()
      console.log('📦 返回数据:', data)
      console.log('📊 数据条数:', data.data?.length)
      if (data.success) {
        setWebsites(data.data)
        console.log('✅ 网站列表设置成功，条数:', data.data.length)
      } else {
        console.warn('⚠️ API返回失败:', data.error)
        toast.error('获取网站列表失败：' + data.error)
      }
    } catch (error) {
      console.error('❌ 获取网站列表失败:', error)
      toast.error('获取网站列表失败')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: number, name: string) => {
    toast.confirm(
      `确定要删除网站"${name}"吗？此操作不可恢复！`,
      async () => {
        try {
          const res = await fetch(`/api/admin/websites/${id}`, {
            method: 'DELETE',
          })
          const data = await res.json()

          if (data.success) {
            toast.success('删除成功！')
            fetchWebsites()
          } else {
            toast.error('删除失败：' + data.error)
          }
        } catch (error) {
          console.error('删除失败:', error)
          toast.error('删除失败，请稍后重试')
        }
      }
    )
  }

  const handleToggleActive = async (id: number, currentStatus: boolean) => {
    try {
      const res = await fetch(`/api/admin/websites/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isActive: !currentStatus }),
      })
      const data = await res.json()

      if (data.success) {
        toast.success(currentStatus ? '已禁用' : '已启用')
        fetchWebsites()
      } else {
        toast.error('操作失败：' + data.error)
      }
    } catch (error) {
      console.error('操作失败:', error)
      toast.error('操作失败，请稍后重试')
    }
  }

  const filteredWebsites = websites.filter((site) =>
    site.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    site.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    site.url.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <AdminLayout>
      <div className="p-6">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* 页面标题和操作栏 */}
          <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">网站管理</h1>
            <p className="text-gray-600 mt-1">共 {websites.length} 个网站</p>
          </div>
          <Link
            href="/admin/websites/new"
            className="px-4 py-2 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-xl font-medium hover:from-indigo-600 hover:to-purple-700 transition-all shadow-lg hover:shadow-xl"
          >
            ➕ 添加网站
          </Link>
        </div>

        {/* 搜索栏 */}
        <div className="bg-white rounded-2xl shadow-sm p-4">
          <div className="relative">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="搜索网站名称、描述或链接..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            />
            <svg
              className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>

        {/* 网站列表 */}
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          {loading ? (
            <div className="p-8 text-center">
              <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-gray-600">加载中...</p>
            </div>
          ) : filteredWebsites.length === 0 ? (
            <div className="p-8 text-center">
              <p className="text-gray-500">暂无网站数据</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      网站
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      分类
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      标签
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      点击量
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      状态
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      操作
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredWebsites.map((site) => (
                    <tr key={site.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0 relative">
                            {site.logoUrl ? (
                              <Image src={site.logoUrl} alt={site.name} fill className="object-cover" sizes="40px" />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-gray-400">
                                🌐
                              </div>
                            )}
                          </div>
                          <div className="min-w-0">
                            <p className="font-medium text-gray-900 truncate">{site.name}</p>
                            <p className="text-xs text-gray-500 truncate">{site.url}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded-lg">
                          {site.category.name}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex gap-1 flex-wrap">
                          {site.tags.slice(0, 3).map((tag) => (
                            <span
                              key={tag.slug}
                              className="px-2 py-0.5 bg-gray-100 text-gray-700 text-xs rounded"
                            >
                              {tag.name}
                            </span>
                          ))}
                          {site.tags.length > 3 && (
                            <span className="px-2 py-0.5 text-gray-500 text-xs">
                              +{site.tags.length - 3}
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm text-gray-900">{site.clickCount}</span>
                      </td>
                      <td className="px-6 py-4">
                        <ToggleSwitch
                          checked={site.isActive}
                          onChange={() => handleToggleActive(site.id, site.isActive)}
                          size="md"
                        />
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Link
                            href={`/admin/websites/${site.id}`}
                            className="px-3 py-1.5 text-sm text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                          >
                            编辑
                          </Link>
                          <button
                            onClick={() => handleDelete(site.id, site.name)}
                            className="px-3 py-1.5 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          >
                            删除
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
        </div>
      </div>
    </AdminLayout>
  )
}

