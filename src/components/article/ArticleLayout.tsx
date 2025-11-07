/**
 * 文章页面布局组件
 * 三栏布局：左侧目录 + 中间内容 + 右侧推荐
 */

import ReadingProgress from './ReadingProgress'
import BackToTop from './BackToTop'

export default function ArticleLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="bg-gray-50 min-h-screen">
      {/* 阅读进度条 */}
      <ReadingProgress />
      
      <div className="container mx-auto px-6 py-8">
        <div className="flex gap-8 max-w-[1400px] mx-auto">
          {children}
        </div>
      </div>

      {/* 返回顶部按钮 */}
      <BackToTop />
    </div>
  )
}

