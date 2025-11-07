import type { Metadata } from 'next'
import './globals.css'
import TopNav from '@/components/layout/TopNav'
import Footer from '@/components/layout/Footer'
import FloatingButtons from '@/components/common/FloatingButtons'
import NProgressBar from '@/components/common/NProgressBar'
import Providers from '@/components/providers/Providers'
import { siteConfig } from '@/config/site'
import { checkEnv } from '@/lib/check-env'

// 在应用启动时检查环境变量（仅在服务端执行一次）
if (typeof window === 'undefined') {
  checkEnv()
}

// 网站元数据配置（会被系统配置动态更新）
export const metadata: Metadata = {
  title: {
    default: siteConfig.name,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  keywords: siteConfig.keywords.split(','),
  icons: {
    icon: '/icons/logo.png',
    shortcut: '/icons/logo.png',
    apple: '/icons/logo.png',
  },
}

// 根布局组件 - 所有页面共用的布局
export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="zh-CN">
      <head>
        {/* Google Font - Inter (专业现代字体) */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link 
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap" 
          rel="stylesheet" 
        />
      </head>
      <body className="flex min-h-screen flex-col bg-gray-100 font-sans antialiased" style={{ fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif" }}>
        <Providers>
          {/* 全局进度条 */}
          <NProgressBar />
          
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

