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
import { useState, useEffect, useRef } from 'react'

interface SiteConfig {
  SITE_NAME: string
  SITE_DESCRIPTION: string
  ICP_BEIAN: string
  FOOTER_TEXT: string
  CONTACT_EMAIL: string
}

export default function Footer() {
  const pathname = usePathname()
  const [config, setConfig] = useState<SiteConfig>({
    SITE_NAME: '泽途网',
    SITE_DESCRIPTION: '精选优质网站与资讯，为您提供高效的导航服务',
    ICP_BEIAN: '宁ICP备2024004974号-1',
    FOOTER_TEXT: 'Made with ❤️ by Zetu Team',
    CONTACT_EMAIL: 'contact@zetu.com',
  })
  const [showQRCode, setShowQRCode] = useState(false)
  const qrCodeRef = useRef<HTMLDivElement>(null)

  // 加载系统配置
  useEffect(() => {
    const loadConfig = async () => {
      try {
        const response = await fetch('/api/config')
        if (response.ok) {
          const result = await response.json()
          if (result.success) {
            setConfig(result.data)
          }
        }
      } catch (error) {
        console.error('加载配置失败:', error)
      }
    }
    loadConfig()
  }, [])

  // 点击外部关闭二维码
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (qrCodeRef.current && !qrCodeRef.current.contains(event.target as Node)) {
        setShowQRCode(false)
      }
    }

    if (showQRCode) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [showQRCode])
  
  // 后台页面不显示页脚
  if (pathname.startsWith('/admin')) {
    return null
  }

  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-gray-100 border-t border-gray-200">
      <div className="container mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          {/* 关于我们 */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <img 
                src="/icons/logo_l.png" 
                alt={config.SITE_NAME}
                className="h-8 w-auto object-contain"
              />
            </div>
            <p className="text-sm text-gray-600 leading-relaxed mb-4">
              {config.SITE_DESCRIPTION}
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
            <h3 className="text-gray-900 font-semibold mb-4 flex items-center gap-2">
              <span className="text-indigo-500">▸</span>
              快速导航
            </h3>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-sm text-gray-600 hover:text-indigo-600 transition-colors duration-200 flex items-center gap-2 group">
                  <span className="text-indigo-600/0 group-hover:text-indigo-600/100 transition-colors">›</span>
                  首页
                </Link>
              </li>
              <li>
                <Link href="/articles" className="text-sm text-gray-600 hover:text-indigo-600 transition-colors duration-200 flex items-center gap-2 group">
                  <span className="text-indigo-600/0 group-hover:text-indigo-600/100 transition-colors">›</span>
                  资讯中心
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-sm text-gray-600 hover:text-indigo-600 transition-colors duration-200 flex items-center gap-2 group">
                  <span className="text-indigo-600/0 group-hover:text-indigo-600/100 transition-colors">›</span>
                  关于我们
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-sm text-gray-600 hover:text-indigo-600 transition-colors duration-200 flex items-center gap-2 group">
                  <span className="text-indigo-600/0 group-hover:text-indigo-600/100 transition-colors">›</span>
                  联系我们
                </Link>
              </li>
            </ul>
          </div>

          {/* 相关链接 */}
          <div>
            <h3 className="text-gray-900 font-semibold mb-4 flex items-center gap-2">
              <span className="text-purple-500">▸</span>
              相关链接
            </h3>
            <ul className="space-y-2">
              <li>
                <Link href="/privacy" className="text-sm text-gray-600 hover:text-purple-600 transition-colors duration-200 flex items-center gap-2 group">
                  <span className="text-purple-600/0 group-hover:text-purple-600/100 transition-colors">›</span>
                  隐私政策
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-sm text-gray-600 hover:text-purple-600 transition-colors duration-200 flex items-center gap-2 group">
                  <span className="text-purple-600/0 group-hover:text-purple-600/100 transition-colors">›</span>
                  服务条款
                </Link>
              </li>
              <li>
                <Link href="/sitemap" className="text-sm text-gray-600 hover:text-purple-600 transition-colors duration-200 flex items-center gap-2 group">
                  <span className="text-purple-600/0 group-hover:text-purple-600/100 transition-colors">›</span>
                  网站地图
                </Link>
              </li>
              <li>
                <Link href="/feedback" className="text-sm text-gray-600 hover:text-purple-600 transition-colors duration-200 flex items-center gap-2 group">
                  <span className="text-purple-600/0 group-hover:text-purple-600/100 transition-colors">›</span>
                  意见反馈
                </Link>
              </li>
            </ul>
          </div>

          {/* 联系方式 */}
          <div>
            <h3 className="text-gray-900 font-semibold mb-4 flex items-center gap-2">
              <span className="text-pink-500">▸</span>
              联系方式
            </h3>
            <ul className="space-y-3 text-sm">
                <li className="flex items-start gap-2 text-gray-600">
                  <svg className="w-4 h-4 mt-0.5 text-indigo-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <span>{config.CONTACT_EMAIL}</span>
                </li>
                <li className="flex items-start gap-2 text-gray-600">
                  <svg className="w-4 h-4 mt-0.5 text-blue-500 flex-shrink-0" fill="currentColor" viewBox="0 0 1024 1024">
                    <path d="M824.8 613.2c-16-51.4-34.4-94.6-62.7-165.3C766.5 262.2 689.3 112 511.5 112 331.7 112 256.2 265.2 261 447.9c-28.4 70.8-46.7 113.7-62.7 165.3-34 109.5-23 154.8-14.6 155.8 18 2.2 70.1-82.4 70.1-82.4 0 49 25.2 112.9 79.8 159-26.4 8.1-85.7 29.9-71.6 53.8 11.4 19.3 196.2 12.3 249.5 6.3 53.3 6 238.1 13 249.5-6.3 14.1-23.8-45.3-45.7-71.6-53.8 54.6-46.2 79.8-110.1 79.8-159 0 0 52.1 84.6 70.1 82.4 8.5-1.1 19.5-46.4-14.5-155.8z"/>
                  </svg>
                  <span>QQ：317881378</span>
                </li>
                <li className="flex items-start gap-2 text-gray-600">
                  <svg className="w-4 h-4 mt-0.5 text-green-500 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8.691 2.188C3.891 2.188 0 5.476 0 9.53c0 2.212 1.17 4.203 3.002 5.55a.59.59 0 01.213.665l-.39 1.48c-.019.07-.048.141-.048.213 0 .163.13.295.29.295a.326.326 0 00.167-.054l1.903-1.114a.864.864 0 01.717-.098 10.16 10.16 0 002.837.403c.276 0 .543-.027.811-.05-.857-2.578.157-4.972 1.932-6.446 1.703-1.415 3.882-1.98 5.853-1.838-.576-3.583-4.196-6.348-8.596-6.348zM5.785 5.991c.642 0 1.162.529 1.162 1.18a1.17 1.17 0 01-1.162 1.178A1.17 1.17 0 014.623 7.17c0-.651.52-1.18 1.162-1.18zm5.813 0c.642 0 1.162.529 1.162 1.18a1.17 1.17 0 01-1.162 1.178 1.17 1.17 0 01-1.162-1.178c0-.651.52-1.18 1.162-1.18zm5.34 2.867c-1.797-.052-3.746.512-5.28 1.786-1.72 1.428-2.687 3.72-1.78 6.22.942 2.453 3.666 4.229 6.884 4.229.826 0 1.622-.12 2.361-.336a.722.722 0 01.598.082l1.584.926a.272.272 0 00.14.047c.134 0 .24-.111.24-.248 0-.06-.023-.12-.038-.177l-.327-1.233a.582.582 0 01-.023-.156.49.49 0 01.201-.398C23.024 18.48 24 16.82 24 14.98c0-3.21-2.931-5.837-6.656-6.088V8.89c-.135-.01-.27-.027-.407-.03zm-2.53 3.274c.535 0 .969.44.969.982a.976.976 0 01-.969.983.976.976 0 01-.969-.983c0-.542.434-.982.969-.982zm4.844 0c.535 0 .969.44.969.982a.976.976 0 01-.969.983.976.976 0 01-.969-.983c0-.542.434-.982.969-.982z"/>
                  </svg>
                  <span>微信：Seabreeze_888</span>
                </li>
                <li className="mt-3">
                  <p className="text-gray-600 mb-2">关注我们</p>
                  <div className="flex items-center gap-2" ref={qrCodeRef}>
                    <div className="relative">
                      <button
                        onClick={() => setShowQRCode(!showQRCode)}
                        className="flex h-9 w-9 items-center justify-center rounded-lg bg-gray-200 text-gray-600 transition-all duration-200 hover:bg-green-500 hover:text-white hover:scale-110"
                        title="微信公众号"
                      >
                        <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M8.691 2.188C3.891 2.188 0 5.476 0 9.53c0 2.212 1.17 4.203 3.002 5.55a.59.59 0 01.213.665l-.39 1.48c-.019.07-.048.141-.048.213 0 .163.13.295.29.295a.326.326 0 00.167-.054l1.903-1.114a.864.864 0 01.717-.098 10.16 10.16 0 002.837.403c.276 0 .543-.027.811-.05-.857-2.578.157-4.972 1.932-6.446 1.703-1.415 3.882-1.98 5.853-1.838-.576-3.583-4.196-6.348-8.596-6.348zM5.785 5.991c.642 0 1.162.529 1.162 1.18a1.17 1.17 0 01-1.162 1.178A1.17 1.17 0 014.623 7.17c0-.651.52-1.18 1.162-1.18zm5.813 0c.642 0 1.162.529 1.162 1.18a1.17 1.17 0 01-1.162 1.178 1.17 1.17 0 01-1.162-1.178c0-.651.52-1.18 1.162-1.18zm5.34 2.867c-1.797-.052-3.746.512-5.28 1.786-1.72 1.428-2.687 3.72-1.78 6.22.942 2.453 3.666 4.229 6.884 4.229.826 0 1.622-.12 2.361-.336a.722.722 0 01.598.082l1.584.926a.272.272 0 00.14.047c.134 0 .24-.111.24-.248 0-.06-.023-.12-.038-.177l-.327-1.233a.582.582 0 01-.023-.156.49.49 0 01.201-.398C23.024 18.48 24 16.82 24 14.98c0-3.21-2.931-5.837-6.656-6.088V8.89c-.135-.01-.27-.027-.407-.03zm-2.53 3.274c.535 0 .969.44.969.982a.976.976 0 01-.969.983.976.976 0 01-.969-.983c0-.542.434-.982.969-.982zm4.844 0c.535 0 .969.44.969.982a.976.976 0 01-.969.983.976.976 0 01-.969-.983c0-.542.434-.982.969-.982z"/>
                        </svg>
                      </button>
                      
                      {/* 微信二维码弹出层 */}
                      {showQRCode && (
                        <div className="fixed bottom-20 bg-white rounded-lg shadow-2xl border border-gray-200 p-4 z-[9999] animate-fade-in-up">
                          <div className="text-center">
                            <p className="text-sm font-medium text-gray-900 mb-3">微信扫码关注我们</p>
                            <img 
                              src="/images/wechat.png" 
                              alt="微信公众号"
                              className="w-40 h-40 object-contain border border-gray-100 rounded-lg"
                            />
                            <p className="text-xs text-gray-500 mt-3">扫描二维码关注公众号</p>
                          </div>
                          {/* 小箭头 */}
                          <div className="absolute -bottom-2 left-4 w-4 h-4 bg-white border-b border-r border-gray-200 transform rotate-45"></div>
                        </div>
                      )}
                    </div>
                    <a
                      href="https://qm.qq.com/q/PLkDHUTK0w"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex h-9 w-9 items-center justify-center rounded-lg bg-gray-200 text-gray-600 transition-all duration-200 hover:bg-blue-500 hover:text-white hover:scale-110"
                      title="QQ群：泽途"
                    >
                      <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 1024 1024">
                        <path d="M824.8 613.2c-16-51.4-34.4-94.6-62.7-165.3C766.5 262.2 689.3 112 511.5 112 331.7 112 256.2 265.2 261 447.9c-28.4 70.8-46.7 113.7-62.7 165.3-34 109.5-23 154.8-14.6 155.8 18 2.2 70.1-82.4 70.1-82.4 0 49 25.2 112.9 79.8 159-26.4 8.1-85.7 29.9-71.6 53.8 11.4 19.3 196.2 12.3 249.5 6.3 53.3 6 238.1 13 249.5-6.3 14.1-23.8-45.3-45.7-71.6-53.8 54.6-46.2 79.8-110.1 79.8-159 0 0 52.1 84.6 70.1 82.4 8.5-1.1 19.5-46.4-14.5-155.8z"/>
                      </svg>
                    </a>
                  </div>
                </li>
            </ul>
          </div>
        </div>

        {/* 底部分割线 */}
        <div className="border-t border-gray-200 pt-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-gray-500">
            <div className="flex items-center gap-4">
              <span>© {currentYear} {config.SITE_NAME}</span>
              <span className="hidden md:inline">·</span>
              <span className="hidden md:inline">All Rights Reserved</span>
            </div>
            <div className="flex items-center gap-4">
              <a 
                href="https://beian.miit.gov.cn/" 
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-indigo-600 transition-colors duration-200 flex items-center gap-1"
              >
                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                </svg>
                {config.ICP_BEIAN}
              </a>
              <span>·</span>
              <span>{config.FOOTER_TEXT}</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

