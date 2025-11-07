import type { Metadata } from 'next'
import './globals.css'
import TopNav from '@/components/layout/TopNav'
import Footer from '@/components/layout/Footer'
import FloatingButtons from '@/components/common/FloatingButtons'
import Providers from '@/components/providers/Providers'
import { siteConfig } from '@/config/site'

// 网站元数据配置（会被系统配置动态更新）
export const metadata: Metadata = {
  title: {
    default: siteConfig.name,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  keywords: siteConfig.keywords.split(','),
}

// 根布局组件 - 所有页面共用的布局
export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="zh-CN">
      <body className="flex min-h-screen flex-col">
        <Providers>
          {/* 顶部导航 - 全站通用 */}
          <TopNav />
          
          {/* 主内容区 - 每个页面的内容会渲染在这里 */}
          <main className="flex-1">
            {children}
          </main>
          
          {/* 页脚 - 全站通用 */}
          <Footer />
          
          {/* 全局悬浮按钮组 */}
          <FloatingButtons />
        </Providers>
      </body>
    </html>
  )
}

