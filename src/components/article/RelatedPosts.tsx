/**
 * 相关文章推荐组件
 * 右侧固定，显示相关文章和热门文章
 */

'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'

interface Article {
  id: number
  title: string
  slug: string
  views: number
  readTime: number
  publishedAt: string | null
}

export default function RelatedPosts({
  currentSlug,
  category,
  relatedArticles = [],
}: {
  currentSlug: string
  category: string
  relatedArticles?: Article[]
}) {
  const [popularArticles, setPopularArticles] = useState<Article[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // 获取热门文章
    fetch('/api/articles?sortBy=views&pageSize=5')
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          // 过滤掉当前文章
          const filtered = data.data.filter((a: Article) => a.slug !== currentSlug)
          setPopularArticles(filtered.slice(0, 4))
        }
      })
      .catch(err => console.error('获取热门文章失败:', err))
      .finally(() => setLoading(false))
  }, [currentSlug])

  return (
    <div className="w-80 flex-shrink-0">
      <div className="sticky top-24 space-y-6">
        {/* 相关文章 */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            相关文章
          </h3>
          <div className="space-y-4">
            {relatedArticles.length === 0 ? (
              <p className="text-sm text-gray-500 text-center py-4">暂无相关文章</p>
            ) : (
              relatedArticles.map((post) => (
                <Link
                  key={post.id}
                  href={`/posts/${post.slug}`}
                  className="block group"
                >
                  <h4 className="text-sm font-medium text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-2 mb-1">
                    {post.title}
                  </h4>
                  <p className="text-xs text-gray-500">
                    {post.publishedAt ? new Date(post.publishedAt).toLocaleDateString('zh-CN') : ''} • {post.readTime} 分钟
                  </p>
                </Link>
              ))
            )}
          </div>
        </div>

        {/* 热门文章 */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <span>🔥</span>
            <span>热门文章</span>
          </h3>
          <div className="space-y-4">
            {loading ? (
              <p className="text-sm text-gray-500 text-center py-4">加载中...</p>
            ) : popularArticles.length === 0 ? (
              <p className="text-sm text-gray-500 text-center py-4">暂无热门文章</p>
            ) : (
              popularArticles.map((post, index) => (
                <Link
                  key={post.id}
                  href={`/posts/${post.slug}`}
                  className="block group"
                >
                  <div className="flex gap-3">
                    <span className={`flex-shrink-0 h-6 w-6 rounded-full flex items-center justify-center text-xs font-bold ${
                      index === 0 ? 'bg-yellow-100 text-yellow-700' :
                      index === 1 ? 'bg-gray-100 text-gray-700' :
                      index === 2 ? 'bg-orange-100 text-orange-700' :
                      'bg-gray-50 text-gray-600'
                    }`}>
                      {index + 1}
                    </span>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-medium text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-2">
                        {post.title}
                      </h4>
                      <p className="text-xs text-gray-500 mt-1">
                        {post.views} 次浏览
                      </p>
                    </div>
                  </div>
                </Link>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

