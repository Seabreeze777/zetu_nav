/**
 * 文章头部组件 - 简洁实用版
 */

'use client'

import Link from 'next/link'
import { Article } from '@/data/articles'
import ArticleActions from './ArticleActions'

export default function ArticleHeader({ article }: { article: Article }) {
  return (
    <header className="mb-8">
      {/* 顶部工具栏 */}
      <div className="flex items-center justify-end mb-6">
        {/* ✅ 实用工具按钮：收藏、分享 */}
        <ArticleActions articleId={article.id} articleTitle={article.title} />
      </div>

      {/* 文章标题 */}
      <h1 className="text-3xl font-bold text-gray-900 mb-4 leading-tight">
        {article.title}
      </h1>

      {/* 文章信息栏 */}
      <div className="flex items-center justify-between py-4 border-y border-gray-200">
        {/* 左侧：作者和时间 */}
        <div className="flex items-center gap-4 text-sm">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-white text-xs font-semibold">
              {article.author.charAt(0)}
            </div>
            <span className="font-medium text-gray-900">{article.author}</span>
          </div>
          <span className="text-gray-300">•</span>
          <span className="text-gray-600">{article.date}</span>
        </div>

        {/* 右侧：统计信息 */}
        <div className="flex items-center gap-4 text-sm text-gray-600">
          <div className="flex items-center gap-1">
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {article.readingTime} 分钟
          </div>
          <span className="text-gray-300">•</span>
          <div className="flex items-center gap-1">
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
            {article.views.toLocaleString()}
          </div>
        </div>
      </div>

      {/* 标签 */}
      {article.tags.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-4">
          {article.tags.map((tag) => (
            <span
              key={tag}
              className="px-2.5 py-1 text-xs font-medium rounded-md bg-gray-100 text-gray-700"
            >
              #{tag}
            </span>
          ))}
        </div>
      )}
    </header>
  )
}

