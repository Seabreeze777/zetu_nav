'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useUser } from '@/contexts/UserContext'
import { useToast } from '@/contexts/ToastContext'
import Link from 'next/link'

export default function LoginPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { user, login } = useUser()
  const toast = useToast()
  
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [showRegisterDialog, setShowRegisterDialog] = useState(false)

  // 如果已经登录，跳转到首页或回调地址
  useEffect(() => {
    if (user) {
      const redirect = searchParams.get('redirect') || '/'
      router.push(redirect)
    }
  }, [user, router, searchParams])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const result = await login(username, password)

      if (result.success) {
        // 登录成功，跳转到回调地址或首页
        const redirect = searchParams.get('redirect') || '/'
        router.push(redirect)
      } else {
        setError(result.error || '登录失败')
      }
    } catch (error) {
      console.error('登录错误:', error)
      setError('网络错误，请稍后重试')
    } finally {
      setLoading(false)
    }
  }

  const handleRegisterClick = (e: React.MouseEvent) => {
    e.preventDefault()
    setShowRegisterDialog(true)
    // 3秒后自动关闭
    setTimeout(() => {
      setShowRegisterDialog(false)
    }, 3000)
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo 和标题 */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center justify-center gap-2 mb-4">
            <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 via-purple-500 to-purple-600 rounded-2xl flex items-center justify-center text-3xl shadow-lg shadow-indigo-500/30">
              🚀
            </div>
          </Link>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">欢迎回来</h1>
          <p className="text-gray-600">登录以获取完整功能</p>
        </div>

        {/* 登录表单 */}
        <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-xl p-8 border border-white/20">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* 错误提示 */}
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm flex items-center gap-2">
                <svg className="h-5 w-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>{error}</span>
              </div>
            )}

            {/* 用户名 */}
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-2">
                用户名
              </label>
              <input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all bg-white/50"
                placeholder="请输入用户名"
                disabled={loading}
                autoFocus
              />
            </div>

            {/* 密码 */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                密码
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all bg-white/50"
                placeholder="请输入密码"
                disabled={loading}
              />
            </div>

            {/* 记住我 & 忘记密码 */}
            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                />
                <span className="text-gray-600">记住我</span>
              </label>
              <a href="#" className="text-indigo-600 hover:text-indigo-700 font-medium">
                忘记密码？
              </a>
            </div>

            {/* 登录按钮 */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-indigo-500 via-purple-500 to-purple-600 text-white py-3 rounded-xl font-medium hover:from-indigo-600 hover:via-purple-600 hover:to-purple-700 transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span>登录中...</span>
                </span>
              ) : (
                '登录'
              )}
            </button>
          </form>

          {/* 提示信息 */}
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-500">
              还没有账号？
              <button 
                onClick={handleRegisterClick}
                className="text-indigo-600 hover:text-indigo-700 font-medium ml-1 transition-colors"
              >
                注册
              </button>
            </p>
          </div>
        </div>

        {/* 注册未开放提示弹窗 */}
        {showRegisterDialog && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
            <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-sm w-full animate-scale-in">
              <div className="text-center">
                {/* 图标 */}
                <div className="mx-auto w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mb-4">
                  <svg className="w-8 h-8 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                </div>
                {/* 标题 */}
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  功能暂未开放
                </h3>
                {/* 内容 */}
                <p className="text-gray-600 mb-6">
                  注册功能暂时未开放，敬请期待！
                </p>
                {/* 按钮 */}
                <button
                  onClick={() => setShowRegisterDialog(false)}
                  className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 text-white py-3 rounded-xl font-medium hover:from-indigo-600 hover:to-purple-700 transition-all shadow-lg hover:shadow-xl"
                >
                  我知道了
                </button>
              </div>
            </div>
          </div>
        )}

        {/* 底部链接 */}
        <div className="text-center mt-6">
          <Link href="/" className="text-sm text-gray-500 hover:text-gray-700">
            ← 返回首页
          </Link>
        </div>
      </div>
    </div>
  )
}

