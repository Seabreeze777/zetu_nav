/**
 * NProgress 全局进度条组件
 * 
 * 功能：
 * - 监听 Next.js 路由变化
 * - 自动显示/隐藏进度条
 * - 提供丝滑的页面跳转体验
 */

'use client'

import { useEffect } from 'react'
import { usePathname, useSearchParams } from 'next/navigation'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
import '@/styles/nprogress.css'

// 配置 NProgress
NProgress.configure({
  minimum: 0.3,
  easing: 'ease',
  speed: 500,
  showSpinner: false,
  trickle: true,
  trickleSpeed: 200,
})

export default function NProgressBar() {
  const pathname = usePathname()
  const searchParams = useSearchParams()

  useEffect(() => {
    // 路由开始变化时显示进度条
    NProgress.start()

    // 路由变化完成后隐藏进度条
    const timer = setTimeout(() => {
      NProgress.done()
    }, 100)

    return () => {
      clearTimeout(timer)
      NProgress.done()
    }
  }, [pathname, searchParams])

  return null
}

