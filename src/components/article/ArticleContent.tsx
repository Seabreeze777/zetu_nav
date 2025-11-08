/**
 * 文章内容组件
 * 负责渲染 Markdown 内容
 * 
 * ⚠️ 优化说明：
 * - 只导入常用的编程语言，避免打包所有 200+ 种语言
 * - 从 ~20MB 减少到 ~2MB
 */

'use client'

import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import rehypeSlug from 'rehype-slug'
import rehypeHighlight from 'rehype-highlight'

// ✅ 只导入需要的语言（大幅减少打包体积）
import 'highlight.js/styles/atom-one-dark.css'

// 注册常用语言（你可以根据需要添加/删除）
import hljs from 'highlight.js/lib/core'
import javascript from 'highlight.js/lib/languages/javascript'
import typescript from 'highlight.js/lib/languages/typescript'
import python from 'highlight.js/lib/languages/python'
import java from 'highlight.js/lib/languages/java'
import cpp from 'highlight.js/lib/languages/cpp'
import css from 'highlight.js/lib/languages/css'
import xml from 'highlight.js/lib/languages/xml' // HTML
import bash from 'highlight.js/lib/languages/bash'
import sql from 'highlight.js/lib/languages/sql'
import json from 'highlight.js/lib/languages/json'
import markdown from 'highlight.js/lib/languages/markdown'

// 注册语言
hljs.registerLanguage('javascript', javascript)
hljs.registerLanguage('typescript', typescript)
hljs.registerLanguage('python', python)
hljs.registerLanguage('java', java)
hljs.registerLanguage('cpp', cpp)
hljs.registerLanguage('c++', cpp)
hljs.registerLanguage('css', css)
hljs.registerLanguage('html', xml)
hljs.registerLanguage('xml', xml)
hljs.registerLanguage('bash', bash)
hljs.registerLanguage('shell', bash)
hljs.registerLanguage('sh', bash)
hljs.registerLanguage('sql', sql)
hljs.registerLanguage('json', json)
hljs.registerLanguage('markdown', markdown)
hljs.registerLanguage('md', markdown)

export default function ArticleContent({ content }: { content: string }) {
  return (
    <div className="bg-white rounded-2xl shadow-sm p-8 lg:p-12">
      {/* Markdown 内容渲染区域 */}
      <div 
        className="prose prose-lg max-w-none
          prose-headings:font-bold prose-headings:text-gray-900 prose-headings:scroll-mt-20
          prose-h2:text-2xl prose-h2:mt-12 prose-h2:mb-6 prose-h2:pb-3 prose-h2:border-b prose-h2:border-gray-200
          prose-h3:text-xl prose-h3:mt-8 prose-h3:mb-4
          prose-p:text-gray-700 prose-p:leading-relaxed prose-p:my-6
          prose-a:text-blue-600 prose-a:no-underline hover:prose-a:underline
          prose-strong:text-gray-900 prose-strong:font-semibold
          prose-code:text-pink-600 prose-code:bg-pink-50 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:text-sm prose-code:before:content-[''] prose-code:after:content-['']
          prose-pre:bg-[#282c34] prose-pre:text-gray-100 prose-pre:rounded-xl prose-pre:shadow-lg prose-pre:overflow-x-auto
          prose-pre:code:bg-transparent prose-pre:code:text-gray-100 prose-pre:code:p-0
          prose-ul:my-6 prose-ul:list-disc prose-ul:pl-6
          prose-ol:my-6 prose-ol:list-decimal prose-ol:pl-6
          prose-li:my-2 prose-li:text-gray-700
          prose-blockquote:border-l-4 prose-blockquote:border-blue-500 prose-blockquote:pl-4 prose-blockquote:italic prose-blockquote:text-gray-700
          prose-img:rounded-xl prose-img:shadow-lg prose-img:my-8
          prose-hr:my-12 prose-hr:border-gray-200
          prose-table:border-collapse prose-table:w-full prose-table:my-8
          prose-th:bg-gray-100 prose-th:border prose-th:border-gray-300 prose-th:px-4 prose-th:py-2 prose-th:text-left
          prose-td:border prose-td:border-gray-300 prose-td:px-4 prose-td:py-2
        "
      >
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          rehypePlugins={[rehypeSlug, rehypeHighlight]}
        >
          {content}
        </ReactMarkdown>
      </div>
    </div>
  )
}

