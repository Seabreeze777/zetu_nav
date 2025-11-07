'use client'

import { useState } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

interface MarkdownEditorProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
}

export default function MarkdownEditor({ value, onChange, placeholder }: MarkdownEditorProps) {
  const [activeTab, setActiveTab] = useState<'write' | 'preview'>('write')

  return (
    <div className="border border-gray-300 rounded-xl overflow-hidden">
      {/* Tab 切换 */}
      <div className="flex items-center gap-2 px-4 py-2 bg-gray-50 border-b border-gray-300">
        <button
          type="button"
          onClick={() => setActiveTab('write')}
          className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-colors ${
            activeTab === 'write'
              ? 'bg-white text-gray-900 shadow-sm'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          ✍️ 编辑
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('preview')}
          className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-colors ${
            activeTab === 'preview'
              ? 'bg-white text-gray-900 shadow-sm'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          👁️ 预览
        </button>
        <div className="ml-auto text-xs text-gray-500">
          支持 Markdown 语法
        </div>
      </div>

      {/* 编辑区域 */}
      {activeTab === 'write' ? (
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder || '开始写作...'}
          className="w-full h-96 p-4 font-mono text-sm resize-none focus:outline-none"
          style={{ minHeight: '400px' }}
        />
      ) : (
        <div className="p-6 prose prose-sm max-w-none overflow-auto" style={{ minHeight: '400px' }}>
          {value ? (
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {value}
            </ReactMarkdown>
          ) : (
            <p className="text-gray-400 italic">暂无内容</p>
          )}
        </div>
      )}
    </div>
  )
}

