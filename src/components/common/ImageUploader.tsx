'use client'

import { useState, useRef } from 'react'
import { useToast } from '@/contexts/ToastContext'

interface ImageUploaderProps {
  /**
   * 上传成功后的回调，返回图片URL
   */
  onUploadSuccess: (url: string) => void
  /**
   * 当前图片URL（用于预览）
   */
  currentImage?: string
  /**
   * 存储文件夹名称，默认为 'images'
   */
  folder?: string
  /**
   * 按钮文本
   */
  buttonText?: string
  /**
   * 最大文件大小（MB），默认5MB
   */
  maxSize?: number
}

export default function ImageUploader({
  onUploadSuccess,
  currentImage,
  folder = 'images',
  buttonText = '上传图片',
  maxSize = 5,
}: ImageUploaderProps) {
  const [uploading, setUploading] = useState(false)
  const [preview, setPreview] = useState<string | null>(currentImage || null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const toast = useToast()

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // 验证文件类型
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp']
    if (!allowedTypes.includes(file.type)) {
      toast.error('不支持的文件类型，仅支持 JPG、PNG、GIF、WebP')
      return
    }

    // 验证文件大小
    const maxSizeBytes = maxSize * 1024 * 1024
    if (file.size > maxSizeBytes) {
      toast.error(`文件大小不能超过${maxSize}MB`)
      return
    }

    // 预览图片
    const reader = new FileReader()
    reader.onload = (e) => {
      setPreview(e.target?.result as string)
    }
    reader.readAsDataURL(file)

    // 上传图片
    setUploading(true)
    const formData = new FormData()
    formData.append('file', file)
    formData.append('folder', folder)

    try {
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      })

      const data = await response.json()

      if (response.ok && data.success) {
        toast.success('上传成功！')
        onUploadSuccess(data.data.url)
      } else {
        throw new Error(data.error || '上传失败')
      }
    } catch (error: any) {
      console.error('上传失败:', error)
      toast.error(error.message || '上传失败，请稍后重试')
      setPreview(currentImage || null) // 恢复预览
    } finally {
      setUploading(false)
      // 清空input，允许再次选择同一文件
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    }
  }

  const handleButtonClick = () => {
    fileInputRef.current?.click()
  }

  return (
    <div className="space-y-3">
      {/* 预览图片 */}
      {preview && (
        <div className="relative w-full h-48 bg-gray-100 rounded-lg overflow-hidden border border-gray-200">
          <img
            src={preview}
            alt="预览"
            className="w-full h-full object-contain"
          />
        </div>
      )}

      {/* 上传按钮 */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={handleButtonClick}
          disabled={uploading}
          className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
        >
          {uploading ? (
            <>
              <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
              <span>上传中...</span>
            </>
          ) : (
            <>
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
              <span>{buttonText}</span>
            </>
          )}
        </button>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
          onChange={handleFileChange}
          className="hidden"
        />

        <p className="text-sm text-gray-500">
          支持 JPG、PNG、GIF、WebP，最大{maxSize}MB
        </p>
      </div>
    </div>
  )
}

