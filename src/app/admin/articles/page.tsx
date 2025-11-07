'use client'

import { useEffect, useState } from 'react'
import AdminLayout from '@/components/admin/AdminLayout'
import Link from 'next/link'
import { useToast } from '@/contexts/ToastContext'

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
  isPublished: boolean
  publishedAt: string | null
  category: {
    name: string
    slug: string
  }
  tags: Array<{
    name: string
    slug: string
  }>
}

export default function ArticlesAdminPage() {
  const toast = useToast()
  const [articles, setArticles] = useState<Article[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    fetchArticles()
  }, [])

  const fetchArticles = async () => {
    try {
      // 获取所有文章（包括未发布的）
      const res = await fetch('/api/articles?pageSize=100')
      const data = await res.json()
      if (data.success) {
        setArticles(data.data)
      }
    } catch (error) {
      console.error('获取文章列表失败:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: number, title: string) => {
    toast.confirm(
      `确定要删除文章"${title}"吗？此操作不可恢复！`,
      async () => {
        try {
          const res = await fetch(`/api/admin/articles/${id}`, {
            method: 'DELETE',
          })
          const data = await res.json()

          if (data.success) {
            toast.success('删除成功！')
            fetchArticles()
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

  const handleTogglePublish = async (id: number, currentStatus: boolean) => {
    try {
      const res = await fetch(`/api/admin/articles/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isPublished: !currentStatus }),
      })
      const data = await res.json()

      if (data.success) {
        toast.success(currentStatus ? '已取消发布' : '已发布')
        fetchArticles()
      } else {
        toast.error('操作失败：' + data.error)
      }
    } catch (error) {
      console.error('操作失败:', error)
      toast.error('操作失败，请稍后重试')
    }
  }

  const filteredArticles = articles.filter((article) =>
    article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    article.description?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <AdminLayout>
      <div className="p-6">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* 页面标题和操作栏 */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">文章管理</h1>
              <p className="text-sm text-gray-500 mt-1">共 {articles.length} 篇文章</p>
            </div>
          <Link
            href="/admin/articles/new"
            className="px-4 py-2 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-xl font-medium hover:from-indigo-600 hover:to-purple-700 transition-all shadow-lg hover:shadow-xl"
          >
            ✍️ 写文章
          </Link>
        </div>

        {/* 搜索栏 */}
        <div className="bg-white rounded-2xl shadow-sm p-4">
          <div className="relative">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="搜索文章标题或描述..."
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

        {/* 文章列表 */}
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          {loading ? (
            <div className="p-8 text-center">
              <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-gray-600">加载中...</p>
            </div>
          ) : filteredArticles.length === 0 ? (
            <div className="p-8 text-center">
              <p className="text-gray-500">暂无文章数据</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      文章
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      分类
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      作者
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      阅读量
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
                  {filteredArticles.map((article) => (
                    <tr key={article.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div className="flex items-start gap-3">
                          <div className="w-16 h-16 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                            {article.coverImage ? (
                              <img src={article.coverImage} alt={article.title} className="w-full h-full object-cover" />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-gray-400">
                                📄
                              </div>
                            )}
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="font-medium text-gray-900 line-clamp-1">{article.title}</p>
                            <p className="text-xs text-gray-500 line-clamp-2 mt-1">{article.description}</p>
                            <div className="flex items-center gap-2 mt-1">
                              {article.isFeatured && (
                                <span className="px-2 py-0.5 bg-yellow-50 text-yellow-700 text-xs rounded">
                                  ⭐ 精选
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded-lg">
                          {article.category.name}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm text-gray-900">{article.author}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm text-gray-900">{article.views}</span>
                      </td>
                      <td className="px-6 py-4">
                        <button
                          onClick={() => handleTogglePublish(article.id, article.isPublished)}
                          className={`px-2 py-1 text-xs font-medium rounded-lg ${
                            article.isPublished
                              ? 'bg-green-50 text-green-700 hover:bg-green-100'
                              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                          }`}
                        >
                          {article.isPublished ? '✓ 已发布' : '✕ 草稿'}
                        </button>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Link
                            href={`/posts/${article.slug}`}
                            target="_blank"
                            className="px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                          >
                            预览
                          </Link>
                          <Link
                            href={`/admin/articles/${article.id}`}
                            className="px-3 py-1.5 text-sm text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                          >
                            编辑
                          </Link>
                          <button
                            onClick={() => handleDelete(article.id, article.title)}
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

