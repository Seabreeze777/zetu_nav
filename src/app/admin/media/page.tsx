/**
 * 媒体库管理页面
 * /admin/media
 * 
 * 功能：
 * - 文件上传（拖拽/点击）
 * - 网格展示媒体文件
 * - 文件夹筛选
 * - 搜索功能
 * - 批量删除
 * - 图片预览
 */

'use client'

import { useState, useEffect, useRef, DragEvent } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import AdminLayout from '@/components/admin/AdminLayout'
import { useToast } from '@/contexts/ToastContext'

interface Media {
  id: number
  fileName: string
  originalName: string
  fileSize: number
  mimeType: string
  width: number | null
  height: number | null
  url: string
  cosKey: string
  folder: string | null
  usedCount: number
  description: string | null
  createdAt: string
  uploader: {
    id: number
    username: string
    nickname: string | null
  }
}

interface Folder {
  name: string
  count: number
}

export default function MediaLibraryPage() {
  const toast = useToast()
  const [media, setMedia] = useState<Media[]>([])
  const [folders, setFolders] = useState<Folder[]>([])
  const [selectedFolder, setSelectedFolder] = useState<string>('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const [selectedMedia, setSelectedMedia] = useState<Set<number>>(new Set())
  const [isDragging, setIsDragging] = useState(false)
  const [showUploadDialog, setShowUploadDialog] = useState(false)
  const [uploadTargetFolder, setUploadTargetFolder] = useState('')
  const [isNewFolder, setIsNewFolder] = useState(false)
  const [selectedFiles, setSelectedFiles] = useState<FileList | null>(null)
  const [showNewFolderDialog, setShowNewFolderDialog] = useState(false)
  const [newFolderName, setNewFolderName] = useState('')
  const [editingFolder, setEditingFolder] = useState<string | null>(null)
  const [editFolderName, setEditFolderName] = useState('')
  const fileInputRef = useRef<HTMLInputElement>(null)

  // 加载媒体列表
  useEffect(() => {
    fetchMedia()
    fetchFolders()
  }, [])

  const fetchMedia = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/admin/media')
      const data = await res.json()
      console.log('📥 获取媒体列表:', data)
      if (data.success) {
        setMedia(data.data || [])
        console.log('✅ 媒体列表已更新，共', data.data?.length || 0, '个文件')
      }
    } catch (error) {
      console.error('❌ 获取媒体列表失败:', error)
    } finally {
      setLoading(false)
    }
  }

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

  // 打开上传对话框
  const openUploadDialog = () => {
    // 如果当前不是"全部文件"，默认选中当前文件夹
    if (selectedFolder !== 'all') {
      setUploadTargetFolder(selectedFolder)
      setIsNewFolder(false)
    } else if (folders.length > 0) {
      setUploadTargetFolder(folders[0].name)
      setIsNewFolder(false)
    } else {
      setUploadTargetFolder('')
      setIsNewFolder(true)
    }
    setSelectedFiles(null)
    setShowUploadDialog(true)
  }

  // 确认上传
  const handleConfirmUpload = async () => {
    if (!selectedFiles || selectedFiles.length === 0) {
      toast.warning('请选择要上传的文件！')
      return
    }

    // 确定目标文件夹
    let targetFolder = uploadTargetFolder.trim()
    if (!targetFolder) {
      toast.warning('请选择或输入文件夹名称！')
      return
    }

    setUploading(true)
    const uploadedFiles: Media[] = []

    for (const file of Array.from(selectedFiles)) {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('folder', targetFolder)

      try {
        const res = await fetch('/api/admin/media/upload', {
          method: 'POST',
          body: formData,
        })
        const data = await res.json()
        if (data.success) {
          uploadedFiles.push(data.data)
        } else {
          throw new Error(data.error || '上传失败')
        }
      } catch (error: any) {
        console.error('上传失败:', error)
        toast.error(`上传失败: ${file.name}`)
      }
    }

    setUploading(false)
    
    if (uploadedFiles.length > 0) {
      console.log('🎉 上传成功！新文件:', uploadedFiles)
      console.log('📁 上传到文件夹:', targetFolder)
      
      // 关闭对话框
      setShowUploadDialog(false)
      setSelectedFiles(null)
      if (fileInputRef.current) fileInputRef.current.value = ''
      
      // 立即切换到"全部文件"（确保能看到新上传的文件）
      setSelectedFolder('all')
      
      // 重新加载数据
      await fetchMedia()
      await fetchFolders()
      
      toast.success(`成功上传 ${uploadedFiles.length} 个文件到"${targetFolder}"文件夹！`)
    } else {
      toast.error('所有文件上传失败，请检查文件格式和大小！')
    }
  }

  // 文件选择处理
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedFiles(e.target.files)
    }
  }

  // 创建新文件夹
  const handleCreateFolder = async () => {
    const folderName = newFolderName.trim()
    if (!folderName) {
      toast.warning('请输入文件夹名称！')
      return
    }

    // 检查是否已存在
    if (folders.some(f => f.name === folderName)) {
      toast.warning('文件夹已存在！')
      return
    }

    try {
      // 保存到数据库
      const res = await fetch('/api/admin/media/folders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: folderName })
      })
      
      const data = await res.json()
      
      if (!data.success) {
        throw new Error(data.error || '创建失败')
      }

      // 刷新文件夹列表
      await fetchFolders()
      setShowNewFolderDialog(false)
      setNewFolderName('')
      toast.success(`文件夹"${folderName}"创建成功！`)
    } catch (error: any) {
      console.error('创建文件夹失败:', error)
      toast.error(`创建失败: ${error.message}`)
    }
  }

  // 重命名文件夹
  const handleRenameFolder = async (oldName: string) => {
    const newName = editFolderName.trim()
    if (!newName) {
      toast.warning('请输入新的文件夹名称！')
      return
    }

    if (newName === oldName) {
      setEditingFolder(null)
      return
    }

    // 检查是否已存在
    if (folders.some(f => f.name === newName)) {
      toast.warning('文件夹名称已存在！')
      return
    }

    try {
      // 更新所有该文件夹下的媒体文件
      const filesToUpdate = media.filter(m => m.folder === oldName)
      
      for (const file of filesToUpdate) {
        const res = await fetch(`/api/admin/media/${file.id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ folder: newName })
        })
        if (!res.ok) throw new Error('更新失败')
      }

      // 更新本地状态
      setMedia(prev => prev.map(m => m.folder === oldName ? { ...m, folder: newName } : m))
      setFolders(prev => prev.map(f => f.name === oldName ? { ...f, name: newName } : f))
      
      // 如果当前选中的是被重命名的文件夹，切换到新名称
      if (selectedFolder === oldName) {
        setSelectedFolder(newName)
      }
      
      setEditingFolder(null)
      toast.success(`文件夹已重命名为"${newName}"`)
    } catch (error) {
      console.error('重命名文件夹失败:', error)
      toast.error('重命名失败！')
    }
  }

  // 删除文件夹
  const handleDeleteFolder = async (folderName: string) => {
    const filesInFolder = media.filter(m => m.folder === folderName)
    
    if (filesInFolder.length > 0) {
      toast.confirm(
        `文件夹"${folderName}"中有 ${filesInFolder.length} 个文件，删除文件夹将同时删除所有文件。确定继续吗？`,
        async () => {
          try {
            // 删除所有文件
            for (const file of filesInFolder) {
              await handleDelete(file.id)
            }
            
            // 从数据库删除文件夹记录
            await fetch(`/api/admin/media/folders/${encodeURIComponent(folderName)}`, {
              method: 'DELETE'
            })
            
            // 刷新文件夹列表
            await fetchFolders()
            
            // 如果当前选中的是被删除的文件夹，切换到"全部文件"
            if (selectedFolder === folderName) {
              setSelectedFolder('all')
            }
            
            toast.success(`文件夹"${folderName}"及其中的 ${filesInFolder.length} 个文件已删除`)
          } catch (error) {
            console.error('删除文件夹失败:', error)
            toast.error('删除失败！')
          }
        }
      )
    } else {
      // 空文件夹也从数据库删除
      toast.confirm(
        `确定要删除空文件夹"${folderName}"吗？`,
        async () => {
          try {
            await fetch(`/api/admin/media/folders/${encodeURIComponent(folderName)}`, {
              method: 'DELETE'
            })
            
            await fetchFolders()
            
            if (selectedFolder === folderName) {
              setSelectedFolder('all')
            }
            
            toast.success(`文件夹"${folderName}"已删除`)
          } catch (error) {
            console.error('删除文件夹失败:', error)
            toast.error('删除失败！')
          }
        }
      )
    }
  }


  // 删除媒体
  const handleDelete = async (id: number, skipConfirm = false) => {
    const doDelete = async () => {
      try {
        const res = await fetch(`/api/admin/media/${id}`, {
          method: 'DELETE',
        })
        const data = await res.json()
        if (data.success) {
          setMedia(prev => prev.filter(m => m.id !== id))
          fetchFolders()
        } else {
          toast.error(`删除失败: ${data.error}`)
        }
      } catch (error) {
        console.error('删除失败:', error)
        toast.error('删除失败')
      }
    }

    if (skipConfirm) {
      await doDelete()
    } else {
      toast.confirm('确定要删除这个文件吗？', doDelete)
    }
  }

  // 批量删除
  const handleBatchDelete = async () => {
    if (selectedMedia.size === 0) return
    
    toast.confirm(
      `确定要删除选中的 ${selectedMedia.size} 个文件吗？`,
      async () => {
        const count = selectedMedia.size
        for (const id of selectedMedia) {
          await handleDelete(id, true) // skipConfirm = true
        }
        setSelectedMedia(new Set())
        toast.success(`成功删除 ${count} 个文件`)
      }
    )
  }

  // 格式化文件大小
  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
    return `${(bytes / 1024 / 1024).toFixed(1)} MB`
  }

  // 过滤媒体列表
  const filteredMedia = media.filter(m => {
    const matchFolder = selectedFolder === 'all' || m.folder === selectedFolder
    const matchSearch = searchQuery === '' || 
      m.originalName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.description?.toLowerCase().includes(searchQuery.toLowerCase())
    
    return matchFolder && matchSearch
  })

  return (
    <AdminLayout>
      <div className="p-6">
        <div className="max-w-7xl mx-auto">
        {/* 头部 */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-1">媒体库</h1>
            <p className="text-sm text-gray-500">管理所有上传的文件</p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={openUploadDialog}
              disabled={uploading}
              className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
              {uploading ? '上传中...' : '上传文件'}
            </button>
            {selectedMedia.size > 0 && (
              <button
                onClick={handleBatchDelete}
                className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
                删除选中 ({selectedMedia.size})
              </button>
            )}
          </div>
        </div>

        <div className="flex gap-6">
          {/* 左侧：文件夹列表 */}
          <div className="w-64 flex-shrink-0">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="px-4 py-3 bg-gray-50 border-b border-gray-200 flex items-center justify-between">
                <h3 className="text-sm font-semibold text-gray-900">文件夹</h3>
                <button
                  onClick={() => setShowNewFolderDialog(true)}
                  className="p-1.5 hover:bg-gray-200 rounded-lg transition-colors group"
                  title="新建文件夹"
                >
                  <svg className="w-4 h-4 text-gray-600 group-hover:text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                </button>
              </div>
              <nav className="p-2">
                {/* 全部文件 */}
                <button
                  onClick={() => setSelectedFolder('all')}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-colors ${
                    selectedFolder === 'all'
                      ? 'bg-indigo-50 text-indigo-700 font-medium'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <span>📁 全部文件</span>
                  <span className="text-xs text-gray-500">
                    {folders.reduce((sum, f) => sum + f.count, 0)}
                  </span>
                </button>

                {/* 文件夹列表 */}
                {folders.map((folder) => (
                  <div
                    key={folder.name}
                    className={`group flex items-center gap-1 rounded-lg ${
                      selectedFolder === folder.name ? 'bg-indigo-50' : 'hover:bg-gray-50'
                    }`}
                  >
                    {editingFolder === folder.name ? (
                      // 编辑模式
                      <div className="flex-1 flex items-center gap-1 px-2 py-1">
                        <input
                          type="text"
                          value={editFolderName}
                          onChange={(e) => setEditFolderName(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') handleRenameFolder(folder.name)
                            if (e.key === 'Escape') setEditingFolder(null)
                          }}
                          className="flex-1 px-2 py-1 text-sm border border-indigo-300 rounded focus:ring-1 focus:ring-indigo-500 focus:outline-none"
                          autoFocus
                        />
                        <button
                          onClick={() => handleRenameFolder(folder.name)}
                          className="p-1 text-green-600 hover:bg-green-50 rounded"
                          title="确认"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        </button>
                        <button
                          onClick={() => setEditingFolder(null)}
                          className="p-1 text-gray-600 hover:bg-gray-100 rounded"
                          title="取消"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>
                    ) : (
                      // 正常模式
                      <>
                        <button
                          onClick={() => setSelectedFolder(folder.name)}
                          className={`flex-1 flex items-center justify-between px-3 py-2 text-sm transition-colors ${
                            selectedFolder === folder.name
                              ? 'text-indigo-700 font-medium'
                              : 'text-gray-700'
                          }`}
                        >
                          <span className="truncate">📂 {folder.name}</span>
                          <span className="text-xs text-gray-500">{folder.count}</span>
                        </button>
                        <div className="flex items-center gap-0.5 pr-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={(e) => {
                              e.stopPropagation()
                              setEditingFolder(folder.name)
                              setEditFolderName(folder.name)
                            }}
                            className="p-1 text-blue-600 hover:bg-blue-50 rounded"
                            title="重命名"
                          >
                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation()
                              handleDeleteFolder(folder.name)
                            }}
                            className="p-1 text-red-600 hover:bg-red-50 rounded"
                            title="删除"
                          >
                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                ))}
              </nav>
            </div>
          </div>

          {/* 右侧：媒体网格 */}
          <div className="flex-1">
            {/* 搜索栏 */}
            <div className="mb-4">
              <div className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="搜索文件名..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
                <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>

            {/* 媒体网格 */}
            {loading ? (
              <div className="text-center py-20">
                <div className="inline-block w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
                <p className="mt-4 text-gray-600">加载中...</p>
              </div>
            ) : filteredMedia.length === 0 ? (
              <div className="text-center py-20 bg-white rounded-xl border border-gray-200">
                <div className="text-5xl mb-4">📷</div>
                <p className="text-gray-600 mb-2">
                  {media.length === 0 ? '暂无文件' : '没有找到匹配的文件'}
                </p>
                <p className="text-sm text-gray-500">
                  {media.length === 0 ? '点击上方"上传文件"按钮开始上传' : '尝试更改筛选条件或搜索关键词'}
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-4 gap-4">
                {filteredMedia.map((item) => (
                  <div
                    key={item.id}
                    className={`group relative bg-white rounded-lg border-2 overflow-hidden cursor-pointer transition-all ${
                      selectedMedia.has(item.id)
                        ? 'border-indigo-500 ring-2 ring-indigo-500'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    onClick={() => {
                      const newSet = new Set(selectedMedia)
                      if (newSet.has(item.id)) {
                        newSet.delete(item.id)
                      } else {
                        newSet.add(item.id)
                      }
                      setSelectedMedia(newSet)
                    }}
                  >
                    {/* 图片预览 */}
                    <div className="aspect-square bg-gray-100 relative">
                      {item.mimeType.startsWith('image/') ? (
                        <img
                          src={item.url}
                          alt={item.originalName}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            console.error('❌ 图片加载失败:', item.url)
                            console.error('文件信息:', item)
                            e.currentTarget.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="200" height="200"%3E%3Ctext x="50%25" y="50%25" font-size="40" text-anchor="middle" dy=".3em"%3E🖼️%3C/text%3E%3Ctext x="50%25" y="70%25" font-size="12" fill="red" text-anchor="middle"%3E图片加载失败%3C/text%3E%3C/svg%3E'
                          }}
                          onLoad={() => {
                            console.log('✅ 图片加载成功:', item.url)
                          }}
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-4xl">
                          📄
                        </div>
                      )}
                      
                      {/* 悬停操作 */}
                      <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100">
                        <a
                          href={item.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          className="p-2 bg-white rounded-lg hover:bg-gray-100 transition-colors"
                          title="查看"
                        >
                          <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                        </a>
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            handleDelete(item.id)
                          }}
                          className="p-2 bg-white rounded-lg hover:bg-red-50 transition-colors"
                          title="删除"
                        >
                          <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>

                      {/* 选中标记 */}
                      {selectedMedia.has(item.id) && (
                        <div className="absolute top-2 right-2 w-6 h-6 bg-indigo-600 rounded-full flex items-center justify-center">
                          <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                      )}
                    </div>

                    {/* 文件信息 */}
                    <div className="p-3">
                      <p className="text-sm font-medium text-gray-900 truncate" title={item.originalName}>
                        {item.originalName}
                      </p>
                      <div className="flex items-center justify-between mt-1">
                        <span className="text-xs text-gray-500">{formatFileSize(item.fileSize)}</span>
                        {item.width && item.height && (
                          <span className="text-xs text-gray-500">
                            {item.width} × {item.height}
                          </span>
                        )}
                      </div>
                      {item.usedCount > 0 && (
                        <div className="mt-2 text-xs text-indigo-600">
                          使用 {item.usedCount} 次
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* 上传对话框 */}
        {showUploadDialog && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-[10000] flex items-center justify-center p-4">
            <div className="bg-white rounded-xl p-6 w-full max-w-lg">
              <h3 className="text-xl font-bold text-gray-900 mb-6">上传文件</h3>
              
              {/* 文件夹选择 */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  目标文件夹 <span className="text-red-500">*</span>
                </label>
                
                <div className="space-y-3">
                  {/* 选择现有文件夹 */}
                  {!isNewFolder && (
                    <>
                      <select
                        value={uploadTargetFolder}
                        onChange={(e) => {
                          if (e.target.value === '__new__') {
                            setIsNewFolder(true)
                            setUploadTargetFolder('')
                          } else {
                            setUploadTargetFolder(e.target.value)
                          }
                        }}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      >
                        {folders.map((folder) => (
                          <option key={folder.name} value={folder.name}>
                            {folder.name} ({folder.count} 个文件)
                          </option>
                        ))}
                        <option value="__new__">+ 新建文件夹</option>
                      </select>
                      <p className="text-sm text-gray-500">
                        将上传到：<span className="font-medium text-indigo-600">{uploadTargetFolder}</span>
                      </p>
                    </>
                  )}
                  
                  {/* 新建文件夹 */}
                  {isNewFolder && (
                    <div>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={uploadTargetFolder}
                          onChange={(e) => setUploadTargetFolder(e.target.value)}
                          placeholder="输入新文件夹名称（如：banners）"
                          className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                          autoFocus
                        />
                        <button
                          onClick={() => {
                            setIsNewFolder(false)
                            if (folders.length > 0) {
                              setUploadTargetFolder(folders[0].name)
                            }
                          }}
                          className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                        >
                          取消
                        </button>
                      </div>
                      <p className="text-sm text-gray-500 mt-2">
                        建议使用英文命名，如：websites, articles, banners
                      </p>
                    </div>
                  )}
                </div>
              </div>
              
              {/* 文件选择 */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  选择文件 <span className="text-red-500">*</span>
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-indigo-500 transition-colors">
                  <input
                    type="file"
                    ref={fileInputRef}
                    multiple
                    accept="image/*"
                    onChange={handleFileSelect}
                    className="hidden"
                  />
                  {!selectedFiles ? (
                    <div>
                      <div className="text-5xl mb-3">📁</div>
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="text-indigo-600 hover:text-indigo-700 font-medium"
                      >
                        点击选择文件
                      </button>
                      <p className="text-sm text-gray-500 mt-2">支持多选图片文件</p>
                    </div>
                  ) : (
                    <div>
                      <div className="text-4xl mb-2">✅</div>
                      <p className="text-gray-700 font-medium mb-2">
                        已选择 {selectedFiles.length} 个文件
                      </p>
                      <ul className="text-sm text-gray-600 space-y-1 mb-3">
                        {Array.from(selectedFiles).slice(0, 3).map((file, i) => (
                          <li key={i} className="truncate">{file.name}</li>
                        ))}
                        {selectedFiles.length > 3 && (
                          <li className="text-gray-500">...还有 {selectedFiles.length - 3} 个文件</li>
                        )}
                      </ul>
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedFiles(null)
                          if (fileInputRef.current) fileInputRef.current.value = ''
                        }}
                        className="text-red-600 hover:text-red-700 text-sm font-medium"
                      >
                        重新选择
                      </button>
                    </div>
                  )}
                </div>
              </div>
              
              {/* 操作按钮 */}
              <div className="flex gap-3 justify-end">
                <button
                  onClick={() => {
                    setShowUploadDialog(false)
                    setSelectedFiles(null)
                    if (fileInputRef.current) fileInputRef.current.value = ''
                  }}
                  disabled={uploading}
                  className="px-6 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50"
                >
                  取消
                </button>
                <button
                  onClick={handleConfirmUpload}
                  disabled={uploading || !selectedFiles || !uploadTargetFolder.trim()}
                  className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {uploading ? (
                    <span className="flex items-center gap-2">
                      <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      上传中...
                    </span>
                  ) : (
                    '开始上传'
                  )}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* 新建文件夹对话框 */}
        {showNewFolderDialog && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-[10000] flex items-center justify-center p-4">
            <div className="bg-white rounded-xl p-6 w-full max-w-md">
              <h3 className="text-xl font-bold text-gray-900 mb-4">新建文件夹</h3>
              <p className="text-sm text-gray-600 mb-4">
                为媒体文件创建一个新的分类文件夹
              </p>
              <input
                type="text"
                value={newFolderName}
                onChange={(e) => setNewFolderName(e.target.value)}
                placeholder="输入文件夹名称（如：banners）"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 mb-2"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault()
                    handleCreateFolder()
                  }
                  if (e.key === 'Escape') {
                    setShowNewFolderDialog(false)
                    setNewFolderName('')
                  }
                }}
                autoFocus
              />
              <p className="text-xs text-gray-500 mb-6">
                💡 建议使用英文命名，如：websites、articles、banners、avatars 等
              </p>
              <div className="flex gap-3 justify-end">
                <button
                  onClick={() => {
                    setShowNewFolderDialog(false)
                    setNewFolderName('')
                  }}
                  className="px-6 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  取消
                </button>
                <button
                  onClick={handleCreateFolder}
                  disabled={!newFolderName.trim()}
                  className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  创建文件夹
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
      </div>
    </AdminLayout>
  )
}


