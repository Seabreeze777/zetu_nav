/**
 * 媒体选择器组件
 * 
 * 功能：
 * - 支持本地上传
 * - 支持从媒体库选择
 * - 图片预览
 * - 可配置文件夹、尺寸限制等
 * 
 * 使用示例：
 * <MediaSelector
 *   value={logoUrl}
 *   onChange={(url) => setLogoUrl(url)}
 *   folder="websites"
 *   accept="image/*"
 * />
 */

'use client'

import { useState, useRef, useEffect } from 'react'
import Image from 'next/image'
import { useToast } from '@/contexts/ToastContext'

interface MediaSelectorProps {
  value?: string | null               // 当前选中的URL
  onChange: (url: string | null) => void  // 值变化回调
  folder?: string                     // 文件夹分类（默认：uploads，仅用于上传时的默认分类）
  accept?: string                     // 接受的文件类型（默认：image/*）
  maxSize?: number                    // 最大文件大小（MB，默认10）
  label?: string                      // 标签文字
  description?: string                // 描述文字
  required?: boolean                  // 是否必填
}

interface Media {
  id: number
  url: string
  originalName: string
  fileSize: number
  mimeType: string
  width: number | null
  height: number | null
  createdAt: string
  folder: string | null
}

interface MediaFolder {
  id: number
  name: string
  description: string | null
  sortOrder: number
  mediaCount?: number
}

export default function MediaSelector({
  value,
  onChange,
  folder = 'uploads',
  accept = 'image/*',
  maxSize = 10,
  label,
  description,
  required = false,
}: MediaSelectorProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [activeTab, setActiveTab] = useState<'upload' | 'library'>('upload')
  const [uploading, setUploading] = useState(false)
  const [mediaList, setMediaList] = useState<Media[]>([])
  const [folders, setFolders] = useState<MediaFolder[]>([])
  const [selectedFolder, setSelectedFolder] = useState<string>('') // 空字符串表示全部
  const [uploadFolder, setUploadFolder] = useState<string>(folder) // 上传时使用的文件夹
  const [loading, setLoading] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const fileInputRef = useRef<HTMLInputElement>(null)
  const toast = useToast()

  // 加载文件夹（在打开对话框时加载，用于两个Tab）
  useEffect(() => {
    if (isOpen) {
      fetchFolders()
    }
  }, [isOpen])

  // 加载媒体库
  useEffect(() => {
    if (isOpen && activeTab === 'library') {
      fetchMedia()
    }
  }, [isOpen, activeTab, searchQuery, selectedFolder])

  const fetchFolders = async () => {
    try {
      const res = await fetch('/api/admin/media/folders')
      const data = await res.json()
      if (data.success) {
        setFolders(data.data)
      }
    } catch (error) {
      console.error('获取文件夹列表失败:', error)
    }
  }

  const fetchMedia = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      if (selectedFolder) params.set('folder', selectedFolder) // 只在选择了特定文件夹时过滤
      if (searchQuery) params.set('search', searchQuery)

      const res = await fetch(`/api/admin/media?${params}`)
      const data = await res.json()
      if (data.success) {
        setMediaList(data.data)
      }
    } catch (error) {
      console.error('获取媒体列表失败:', error)
      toast.error('获取媒体列表失败')
    } finally {
      setLoading(false)
    }
  }

  // 上传文件
  const handleUpload = async (file: File) => {
    // 检查文件大小
    if (file.size > maxSize * 1024 * 1024) {
      toast.error(`文件大小不能超过 ${maxSize}MB`)
      return
    }

    setUploading(true)
    try {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('folder', uploadFolder) // 使用选择的上传文件夹

      const res = await fetch('/api/admin/media/upload', {
        method: 'POST',
        body: formData,
      })
      const data = await res.json()

      if (data.success) {
        onChange(data.data.url)
        toast.success('上传成功！')
        setIsOpen(false)
      } else {
        toast.error(`上传失败: ${data.error}`)
      }
    } catch (error) {
      console.error('上传失败:', error)
      toast.error('上传失败')
    } finally {
      setUploading(false)
    }
  }

  // 选择媒体
  const handleSelectMedia = (media: Media) => {
    onChange(media.url)
    setIsOpen(false)
  }

  // 清除选择
  const handleClear = () => {
    onChange(null)
  }

  // 格式化文件大小
  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
    return `${(bytes / 1024 / 1024).toFixed(1)} MB`
  }

  return (
    <div className="space-y-2">
      {/* 标签 */}
      {label && (
        <label className="block text-sm font-medium text-gray-700">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      {description && (
        <p className="text-sm text-gray-500">{description}</p>
      )}

      {/* 预览区域 */}
      <div className="flex items-start gap-4">
        {/* 图片预览 */}
        {value ? (
          <div className="relative group">
            <div className="w-32 h-32 rounded-lg border-2 border-gray-200 overflow-hidden bg-gray-50 relative">
              <Image
                src={value}
                alt="预览"
                fill
                className="object-cover"
                sizes="128px"
              />
            </div>
            {/* 悬停操作 */}
            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all rounded-lg flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100">
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault()
                  e.stopPropagation()
                  setIsOpen(true)
                }}
                className="p-2 bg-white rounded-lg hover:bg-gray-100 transition-colors"
                title="更换"
              >
                <svg className="w-4 h-4 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </button>
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault()
                  e.stopPropagation()
                  handleClear()
                }}
                className="p-2 bg-white rounded-lg hover:bg-red-50 transition-colors"
                title="移除"
              >
                <svg className="w-4 h-4 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
        ) : (
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault()
              e.stopPropagation()
              setIsOpen(true)
            }}
            className="w-32 h-32 rounded-lg border-2 border-dashed border-gray-300 hover:border-indigo-400 bg-gray-50 hover:bg-indigo-50 transition-all flex flex-col items-center justify-center gap-2 text-gray-500 hover:text-indigo-600"
          >
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            <span className="text-sm">选择图片</span>
          </button>
        )}

        {/* 文字提示 */}
        {!value && (
          <div className="flex-1 text-sm text-gray-500 pt-2">
            <p>• 支持格式：JPG, PNG, GIF, WebP</p>
            <p>• 最大大小：{maxSize}MB</p>
            <p>• 建议尺寸：根据实际需求</p>
          </div>
        )}
      </div>

      {/* 选择器模态框 */}
      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-[10000] flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-5xl max-h-[80vh] flex flex-col shadow-2xl">
            {/* 头部 */}
            <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">选择图片</h3>
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault()
                  e.stopPropagation()
                  setIsOpen(false)
                }}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* 标签页 */}
            <div className="px-6 pt-4 border-b border-gray-200">
              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault()
                    e.stopPropagation()
                    setActiveTab('upload')
                  }}
                  className={`pb-3 px-2 text-sm font-medium border-b-2 transition-colors ${
                    activeTab === 'upload'
                      ? 'border-indigo-600 text-indigo-600'
                      : 'border-transparent text-gray-600 hover:text-gray-900'
                  }`}
                >
                  上传文件
                </button>
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault()
                    e.stopPropagation()
                    setActiveTab('library')
                  }}
                  className={`pb-3 px-2 text-sm font-medium border-b-2 transition-colors ${
                    activeTab === 'library'
                      ? 'border-indigo-600 text-indigo-600'
                      : 'border-transparent text-gray-600 hover:text-gray-900'
                  }`}
                >
                  媒体库
                </button>
              </div>
            </div>

            {/* 内容区域 */}
            <div className="flex-1 overflow-y-auto p-6">
              {activeTab === 'upload' ? (
                /* 上传区域 */
                <div className="flex flex-col items-center justify-center gap-6 py-12">
                  {/* 文件夹选择 */}
                  <div className="w-full max-w-md">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      上传到文件夹
                    </label>
                    <select
                      value={uploadFolder}
                      onChange={(e) => setUploadFolder(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    >
                      <option value="uploads">默认文件夹 (uploads)</option>
                      {folders.map((folder) => (
                        <option key={folder.id} value={folder.name}>
                          {folder.name} {folder.description && `- ${folder.description}`}
                        </option>
                      ))}
                    </select>
                  </div>

                  <input
                    ref={fileInputRef}
                    type="file"
                    accept={accept}
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0]
                      if (file) {
                        handleUpload(file)
                      }
                      // 清空以便下次选择
                      if (e.target) {
                        e.target.value = ''
                      }
                    }}
                  />
                  <div className="w-full max-w-md">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.preventDefault()
                        e.stopPropagation()
                        if (!uploading) {
                          fileInputRef.current?.click()
                        }
                      }}
                      disabled={uploading}
                      className="w-full border-2 border-dashed border-gray-300 rounded-xl p-12 text-center cursor-pointer hover:border-indigo-400 hover:bg-indigo-50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {uploading ? (
                        <>
                          <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                          <p className="text-gray-600">上传中...</p>
                        </>
                      ) : (
                        <>
                          <div className="text-5xl mb-4">📁</div>
                          <p className="text-gray-900 font-medium mb-2">点击选择文件</p>
                          <p className="text-sm text-gray-500">或拖拽文件到这里</p>
                          <p className="text-xs text-gray-400 mt-4">最大 {maxSize}MB</p>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              ) : (
                /* 媒体库 */
                <div>
                  {/* 搜索和过滤 */}
                  <div className="mb-4 space-y-3">
                    {/* 文件夹过滤 */}
                    <div className="flex gap-2 flex-wrap">
                      <button
                        type="button"
                        onClick={() => setSelectedFolder('')}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                          selectedFolder === ''
                            ? 'bg-indigo-600 text-white'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        全部 ({mediaList.length})
                      </button>
                      {folders.map((folder) => (
                        <button
                          key={folder.id}
                          type="button"
                          onClick={() => setSelectedFolder(folder.name)}
                          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                            selectedFolder === folder.name
                              ? 'bg-indigo-600 text-white'
                              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                          }`}
                        >
                          {folder.name} {folder.mediaCount ? `(${folder.mediaCount})` : ''}
                        </button>
                      ))}
                    </div>

                    {/* 搜索框 */}
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="搜索文件名..."
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    />
                  </div>

                  {/* 媒体网格 */}
                  {loading ? (
                    <div className="text-center py-12">
                      <div className="inline-block w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
                      <p className="mt-4 text-gray-600">加载中...</p>
                    </div>
                  ) : mediaList.length === 0 ? (
                    <div className="text-center py-12">
                      <div className="text-4xl mb-4">📷</div>
                      <p className="text-gray-600">暂无文件</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-5 gap-3">
                      {mediaList.map((media) => (
                        <div
                          key={media.id}
                          onClick={() => handleSelectMedia(media)}
                          className="aspect-square rounded-lg border-2 border-gray-200 hover:border-indigo-500 overflow-hidden cursor-pointer transition-all hover:shadow-lg relative"
                        >
                          <Image
                            src={media.url}
                            alt={media.originalName}
                            fill
                            className="object-cover"
                            sizes="200px"
                          />
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

