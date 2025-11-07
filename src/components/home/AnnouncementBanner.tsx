/**
 * 单行滚动公告栏组件
 * 显示在Hero下方，单行文字无限循环滚动
 */

'use client'

import { useState, useEffect } from 'react'

interface Announcement {
  id: number
  title: string
  content: string | null
  link: string | null
  icon: string
}

export default function AnnouncementBanner() {
  const [announcements, setAnnouncements] = useState<Announcement[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [selectedAnnouncement, setSelectedAnnouncement] = useState<Announcement | null>(null)

  // 加载公告
  useEffect(() => {
    async function loadAnnouncements() {
      try {
        const res = await fetch('/api/announcements')
        const data = await res.json()
        if (data.success && data.data.length > 0) {
          setAnnouncements(data.data)
        }
      } catch (error) {
        console.error('加载公告失败:', error)
      }
    }
    loadAnnouncements()
  }, [])

  // 自动切换公告（每5秒）
  useEffect(() => {
    if (announcements.length === 0) return
    
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % announcements.length)
    }, 5000)

    return () => clearInterval(timer)
  }, [announcements])

  if (announcements.length === 0) {
    return null // 没有公告时不显示
  }

  const currentAnnouncement = announcements[currentIndex]

  const handleClick = () => {
    setSelectedAnnouncement(currentAnnouncement)
  }

  const closeDialog = () => {
    setSelectedAnnouncement(null)
  }

  return (
    <>
      {/* 公告栏 */}
      <div className="container mx-auto px-6 -mt-2 mb-2">
        <div 
          className="bg-gradient-to-r from-amber-50 via-yellow-50 to-amber-50 border border-amber-200/60 rounded-xl shadow-sm overflow-hidden cursor-pointer group hover:shadow-md transition-all duration-300"
          onClick={handleClick}
        >
          <div className="flex items-center gap-3 px-4 py-2.5">
            {/* 图标 */}
            <span className="text-lg flex-shrink-0 animate-pulse">
              {currentAnnouncement.icon}
            </span>
            
            {/* 标签 */}
            <span className="text-xs font-bold text-amber-700 bg-amber-100 px-2 py-0.5 rounded-md flex-shrink-0">
              公告
            </span>
            
            {/* 公告文字（滑动切换） */}
            <div className="flex-1 overflow-hidden">
              <p 
                key={currentIndex} 
                className="text-sm font-medium text-gray-800 truncate animate-fade-in-up group-hover:text-indigo-600 transition-colors"
              >
                {currentAnnouncement.title}
              </p>
            </div>
            
            {/* 查看更多箭头 */}
            <svg 
              className="w-4 h-4 text-gray-400 flex-shrink-0 group-hover:text-indigo-600 group-hover:translate-x-1 transition-all duration-200" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </div>
        </div>
      </div>

      {/* 公告详情弹窗 */}
      {selectedAnnouncement && (
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={closeDialog}
        >
          <div 
            className="bg-white rounded-2xl shadow-2xl max-w-lg w-full p-6 animate-scale-in"
            onClick={(e) => e.stopPropagation()}
          >
            {/* 标题栏 */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <span className="text-4xl">{selectedAnnouncement.icon}</span>
                <h3 className="text-xl font-bold text-gray-900">
                  {selectedAnnouncement.title}
                </h3>
              </div>
              <button
                onClick={closeDialog}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* 内容 */}
            {selectedAnnouncement.content && (
              <div className="mb-6">
                <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                  {selectedAnnouncement.content}
                </p>
              </div>
            )}

            {/* 底部操作 */}
            <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100">
              {selectedAnnouncement.link && (
                <a
                  href={selectedAnnouncement.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition-colors"
                >
                  了解更多
                </a>
              )}
              <button
                onClick={closeDialog}
                className="px-4 py-2 bg-gray-100 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-200 transition-colors"
              >
                关闭
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

