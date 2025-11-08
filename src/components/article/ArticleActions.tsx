/**
 * 文章操作按钮组件：收藏、分享
 */

'use client'

import { useState, useEffect } from 'react'
import { useToast } from '@/contexts/ToastContext'

interface ArticleActionsProps {
  articleId: number
  articleTitle: string
}

export default function ArticleActions({ articleId, articleTitle }: ArticleActionsProps) {
  const toast = useToast()
  const [isFavorited, setIsFavorited] = useState(false)
  const [isCheckingFavorite, setIsCheckingFavorite] = useState(true)
  const [showShareMenu, setShowShareMenu] = useState(false)

  // 检查是否已收藏
  useEffect(() => {
    checkFavoriteStatus()
  }, [articleId])

  const checkFavoriteStatus = async () => {
    try {
      const res = await fetch(`/api/favorites/${articleId}`)
      const data = await res.json()
      if (data.success) {
        setIsFavorited(data.data.isFavorited)
      }
    } catch (error) {
      console.error('检查收藏状态失败:', error)
    } finally {
      setIsCheckingFavorite(false)
    }
  }

  // 切换收藏状态
  const handleToggleFavorite = async () => {
    try {
      const method = isFavorited ? 'DELETE' : 'POST'
      const res = await fetch(`/api/favorites/${articleId}`, {
        method,
      })

      const data = await res.json()

      if (data.success) {
        setIsFavorited(!isFavorited)
        toast.success(isFavorited ? '已取消收藏' : '收藏成功！')
      } else {
        if (data.error === '请先登录') {
          toast.error('请先登录后再收藏')
          // 可以跳转到登录页
          setTimeout(() => {
            window.location.href = '/login'
          }, 1500)
        } else {
          toast.error(data.error || '操作失败')
        }
      }
    } catch (error) {
      console.error('收藏操作失败:', error)
      toast.error('操作失败，请稍后重试')
    }
  }

  // 分享功能
  const handleShare = (platform?: string) => {
    const url = window.location.href
    const title = articleTitle

    if (platform === 'copy') {
      // 复制链接
      navigator.clipboard.writeText(url).then(() => {
        toast.success('链接已复制到剪贴板')
        setShowShareMenu(false)
      }).catch(() => {
        toast.error('复制失败')
      })
      return
    }

    if (platform === 'wechat') {
      // 微信分享（显示二维码或提示）
      toast.info('请使用微信扫一扫分享')
      setShowShareMenu(false)
      return
    }

    if (platform === 'weibo') {
      // 微博分享
      const weiboUrl = `https://service.weibo.com/share/share.php?url=${encodeURIComponent(url)}&title=${encodeURIComponent(title)}`
      window.open(weiboUrl, '_blank')
      setShowShareMenu(false)
      return
    }

    // 浏览器原生分享 API
    if (navigator.share) {
      navigator.share({
        title: articleTitle,
        url: url,
      }).then(() => {
        toast.success('分享成功')
      }).catch((error) => {
        if (error.name !== 'AbortError') {
          console.error('分享失败:', error)
        }
      })
    } else {
      // 不支持原生分享，显示分享菜单
      setShowShareMenu(!showShareMenu)
    }
  }

  return (
    <div className="flex items-center gap-2">
      {/* 收藏按钮 */}
      <button 
        onClick={handleToggleFavorite}
        disabled={isCheckingFavorite}
        className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all flex items-center gap-1 ${
          isFavorited
            ? 'text-red-600 bg-red-50 border border-red-200 hover:bg-red-100'
            : 'text-gray-600 bg-white border border-gray-200 hover:bg-gray-50'
        }`}
        title={isFavorited ? '取消收藏' : '收藏文章'}
      >
        <svg className="h-4 w-4" fill={isFavorited ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
        </svg>
        {isFavorited ? '已收藏' : '收藏'}
      </button>

      {/* 分享按钮 */}
      <div className="relative">
        <button 
          onClick={() => handleShare()}
          className="px-3 py-1.5 text-xs font-medium text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-1"
          title="分享文章"
        >
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
          </svg>
          分享
        </button>

        {/* 分享菜单 */}
        {showShareMenu && (
          <div className="absolute top-full mt-2 right-0 bg-white border border-gray-200 rounded-lg shadow-lg py-2 z-10 min-w-[140px]">
            <button
              onClick={() => handleShare('copy')}
              className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
            >
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
              </svg>
              复制链接
            </button>
            <button
              onClick={() => handleShare('wechat')}
              className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
            >
              <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8.691 2.188C3.891 2.188 0 5.476 0 9.53c0 2.212 1.17 4.203 3.002 5.55a.59.59 0 0 1 .213.665l-.39 1.48c-.019.07-.048.141-.048.213 0 .163.13.295.29.295a.326.326 0 0 0 .167-.054l1.903-1.114a.864.864 0 0 1 .717-.098 10.16 10.16 0 0 0 2.837.403c.276 0 .543-.027.811-.050-.857-2.578.157-4.972 1.932-6.446 1.703-1.415 3.882-1.98 5.853-1.838-.576-3.583-4.196-6.348-8.596-6.348zM5.785 5.991c.642 0 1.162.529 1.162 1.18a1.17 1.17 0 0 1-1.162 1.178A1.17 1.17 0 0 1 4.623 7.17c0-.651.52-1.18 1.162-1.18zm5.813 0c.642 0 1.162.529 1.162 1.18a1.17 1.17 0 0 1-1.162 1.178 1.17 1.17 0 0 1-1.162-1.178c0-.651.52-1.18 1.162-1.18z"/>
              </svg>
              微信
            </button>
            <button
              onClick={() => handleShare('weibo')}
              className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
            >
              <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M9.93 13.5h4.14c3.18 0 5.76-2.58 5.76-5.76S17.25 2 14.07 2H9.93C6.75 2 4.17 4.58 4.17 7.76s2.58 5.74 5.76 5.74z"/>
              </svg>
              微博
            </button>
          </div>
        )}

        {/* 点击外部关闭菜单 */}
        {showShareMenu && (
          <div 
            className="fixed inset-0 z-[9]" 
            onClick={() => setShowShareMenu(false)}
          />
        )}
      </div>
    </div>
  )
}

