/**
 * 页脚组件 - 专业版
 * 
 * 功能：
 * - 多栏布局
 * - 快速链接
 * - 社交媒体
 * - 统计信息
 * - 备案信息
 */

'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

export default function Footer() {
  const pathname = usePathname()
  
  // 后台页面不显示页脚
  if (pathname.startsWith('/admin')) {
    return null
  }

  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-gray-300">
      <div className="container mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          {/* 关于我们 */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 text-xl shadow-lg">
                🚀
              </div>
              <span className="text-xl font-bold text-white">
                泽途网
              </span>
            </div>
            <p className="text-sm text-gray-400 leading-relaxed mb-4">
              精选优质网站与资讯，为您提供高效的导航服务，让信息触手可及。
            </p>
            <div className="flex items-center gap-2 text-xs text-gray-500">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              <span>快速 · 精准 · 高效</span>
            </div>
          </div>

          {/* 快速导航 */}
          <div>
            <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
              <span className="text-indigo-400">▸</span>
              快速导航
            </h3>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-sm hover:text-indigo-400 transition-colors flex items-center gap-2 group">
                  <span className="text-indigo-400/0 group-hover:text-indigo-400/100 transition-colors">›</span>
                  首页
                </Link>
              </li>
              <li>
                <Link href="/articles" className="text-sm hover:text-indigo-400 transition-colors flex items-center gap-2 group">
                  <span className="text-indigo-400/0 group-hover:text-indigo-400/100 transition-colors">›</span>
                  资讯中心
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-sm hover:text-indigo-400 transition-colors flex items-center gap-2 group">
                  <span className="text-indigo-400/0 group-hover:text-indigo-400/100 transition-colors">›</span>
                  关于我们
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-sm hover:text-indigo-400 transition-colors flex items-center gap-2 group">
                  <span className="text-indigo-400/0 group-hover:text-indigo-400/100 transition-colors">›</span>
                  联系我们
                </Link>
              </li>
            </ul>
          </div>

          {/* 相关链接 */}
          <div>
            <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
              <span className="text-purple-400">▸</span>
              相关链接
            </h3>
            <ul className="space-y-2">
              <li>
                <Link href="/privacy" className="text-sm hover:text-purple-400 transition-colors flex items-center gap-2 group">
                  <span className="text-purple-400/0 group-hover:text-purple-400/100 transition-colors">›</span>
                  隐私政策
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-sm hover:text-purple-400 transition-colors flex items-center gap-2 group">
                  <span className="text-purple-400/0 group-hover:text-purple-400/100 transition-colors">›</span>
                  服务条款
                </Link>
              </li>
              <li>
                <Link href="/sitemap" className="text-sm hover:text-purple-400 transition-colors flex items-center gap-2 group">
                  <span className="text-purple-400/0 group-hover:text-purple-400/100 transition-colors">›</span>
                  网站地图
                </Link>
              </li>
              <li>
                <Link href="/feedback" className="text-sm hover:text-purple-400 transition-colors flex items-center gap-2 group">
                  <span className="text-purple-400/0 group-hover:text-purple-400/100 transition-colors">›</span>
                  意见反馈
                </Link>
              </li>
            </ul>
          </div>

          {/* 联系方式 */}
          <div>
            <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
              <span className="text-pink-400">▸</span>
              联系方式
            </h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-2">
                <svg className="w-4 h-4 mt-0.5 text-indigo-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <span>contact@zetu.com</span>
              </li>
              <li>
                <p className="text-gray-400 mb-2">关注我们</p>
                <div className="flex items-center gap-2">
                  <a
                    href="#"
                    className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/5 border border-white/10 text-gray-400 transition-all hover:bg-indigo-500 hover:border-indigo-500 hover:text-white"
                    title="GitHub"
                  >
                    <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                    </svg>
                  </a>
                  <a
                    href="#"
                    className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/5 border border-white/10 text-gray-400 transition-all hover:bg-blue-500 hover:border-blue-500 hover:text-white"
                    title="Twitter"
                  >
                    <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                    </svg>
                  </a>
                  <a
                    href="#"
                    className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/5 border border-white/10 text-gray-400 transition-all hover:bg-green-500 hover:border-green-500 hover:text-white"
                    title="微信"
                  >
                    <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M8.691 2.188C3.891 2.188 0 5.476 0 9.53c0 2.212 1.17 4.203 3.002 5.55a.59.59 0 01.213.665l-.39 1.48c-.019.07-.048.141-.048.213 0 .163.13.295.29.295a.326.326 0 00.167-.054l1.903-1.114a.864.864 0 01.717-.098 10.16 10.16 0 002.837.403c.276 0 .543-.027.811-.05-.857-2.578.157-4.972 1.932-6.446 1.703-1.415 3.882-1.98 5.853-1.838-.576-3.583-4.196-6.348-8.596-6.348zM5.785 5.991c.642 0 1.162.529 1.162 1.18a1.17 1.17 0 01-1.162 1.178A1.17 1.17 0 014.623 7.17c0-.651.52-1.18 1.162-1.18zm5.813 0c.642 0 1.162.529 1.162 1.18a1.17 1.17 0 01-1.162 1.178 1.17 1.17 0 01-1.162-1.178c0-.651.52-1.18 1.162-1.18zm5.34 2.867c-1.797-.052-3.746.512-5.28 1.786-1.72 1.428-2.687 3.72-1.78 6.22.942 2.453 3.666 4.229 6.884 4.229.826 0 1.622-.12 2.361-.336a.722.722 0 01.598.082l1.584.926a.272.272 0 00.14.047c.134 0 .24-.111.24-.248 0-.06-.023-.12-.038-.177l-.327-1.233a.582.582 0 01-.023-.156.49.49 0 01.201-.398C23.024 18.48 24 16.82 24 14.98c0-3.21-2.931-5.837-6.656-6.088V8.89c-.135-.01-.27-.027-.407-.03zm-2.53 3.274c.535 0 .969.44.969.982a.976.976 0 01-.969.983.976.976 0 01-.969-.983c0-.542.434-.982.969-.982zm4.844 0c.535 0 .969.44.969.982a.976.976 0 01-.969.983.976.976 0 01-.969-.983c0-.542.434-.982.969-.982z"/>
                    </svg>
                  </a>
                </div>
              </li>
            </ul>
          </div>
        </div>

        {/* 底部分割线 */}
        <div className="border-t border-white/10 pt-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-gray-400">
            <div className="flex items-center gap-4">
              <span>© {currentYear} 泽途网</span>
              <span className="hidden md:inline">·</span>
              <span className="hidden md:inline">All Rights Reserved</span>
            </div>
            <div className="flex items-center gap-4">
              <a href="#" className="hover:text-indigo-400 transition-colors">
                宁ICP备2024004974号-1
              </a>
              <span>·</span>
              <span>Made with ❤️ by Zetu Team</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

