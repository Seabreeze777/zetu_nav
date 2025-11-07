import { ReactNode } from 'react'

interface ArticleListLayoutProps {
  children: ReactNode
  sidebar: ReactNode
  header: ReactNode
}

export default function ArticleListLayout({ children, sidebar, header }: ArticleListLayoutProps) {
  return (
    <div className="bg-gray-50 min-h-screen">
      {/* 页面头部 */}
      {header}

      {/* 主体内容 */}
      <div className="container mx-auto px-6 py-6">
        <div className="flex gap-6">
          {/* 左侧边栏 */}
          {sidebar}

          {/* 右侧内容区 */}
          <main className="flex-1 min-w-0">
            {children}
          </main>
        </div>
      </div>
    </div>
  )
}

