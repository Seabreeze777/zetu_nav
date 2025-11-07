/**
 * 文章内容组件
 * 负责渲染 Markdown 内容
 */

'use client'

export default function ArticleContent({ content }: { content: string }) {
  return (
    <div className="bg-white rounded-2xl shadow-sm p-8 lg:p-12">
      {/* Markdown 内容渲染区域 */}
      <div 
        className="prose prose-lg max-w-none
          prose-headings:font-bold prose-headings:text-gray-900
          prose-h2:text-2xl prose-h2:mt-12 prose-h2:mb-6 prose-h2:pb-3 prose-h2:border-b prose-h2:border-gray-200
          prose-h3:text-xl prose-h3:mt-8 prose-h3:mb-4
          prose-p:text-gray-700 prose-p:leading-relaxed prose-p:my-6
          prose-a:text-blue-600 prose-a:no-underline hover:prose-a:underline
          prose-strong:text-gray-900 prose-strong:font-semibold
          prose-code:text-pink-600 prose-code:bg-pink-50 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:text-sm prose-code:before:content-[''] prose-code:after:content-['']
          prose-pre:bg-gray-900 prose-pre:text-gray-100 prose-pre:rounded-xl prose-pre:shadow-lg
          prose-ul:my-6 prose-ul:list-disc prose-ul:pl-6
          prose-ol:my-6 prose-ol:list-decimal prose-ol:pl-6
          prose-li:my-2 prose-li:text-gray-700
          prose-blockquote:border-l-4 prose-blockquote:border-blue-500 prose-blockquote:pl-4 prose-blockquote:italic prose-blockquote:text-gray-700
          prose-img:rounded-xl prose-img:shadow-lg prose-img:my-8
          prose-hr:my-12 prose-hr:border-gray-200
        "
        dangerouslySetInnerHTML={{ __html: content }}
      />
    </div>
  )
}

