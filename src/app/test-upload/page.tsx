'use client'

import { useState } from 'react'
import ImageUploader from '@/components/common/ImageUploader'

export default function TestUploadPage() {
  const [uploadedUrl, setUploadedUrl] = useState<string>('')

  return (
    <div className="container mx-auto p-8 max-w-2xl">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">🖼️ 图片上传测试</h1>

      <div className="bg-white p-6 rounded-lg shadow-md space-y-6">
        <div>
          <h2 className="text-xl font-semibold mb-4">上传图片到腾讯云COS</h2>
          <ImageUploader
            onUploadSuccess={(url) => {
              setUploadedUrl(url)
              console.log('上传成功:', url)
            }}
            folder="test"
            buttonText="选择图片上传"
          />
        </div>

        {uploadedUrl && (
          <div className="border-t pt-6">
            <h3 className="text-lg font-semibold mb-3">✅ 上传成功！</h3>
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  图片URL：
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={uploadedUrl}
                    readOnly
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-sm"
                  />
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(uploadedUrl)
                      alert('已复制到剪贴板！')
                    }}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm"
                  >
                    复制
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  图片预览：
                </label>
                <img
                  src={uploadedUrl}
                  alt="上传的图片"
                  className="max-w-full h-auto rounded-lg border border-gray-200"
                />
              </div>

              <div>
                <a
                  href={uploadedUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-indigo-600 hover:text-indigo-700 text-sm"
                >
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                    />
                  </svg>
                  在新标签页中打开
                </a>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-blue-900 mb-3">📝 使用说明</h3>
        <ul className="space-y-2 text-sm text-blue-800">
          <li>• 支持的格式：JPG、PNG、GIF、WebP</li>
          <li>• 最大文件大小：5MB</li>
          <li>• 上传后会自动生成唯一文件名</li>
          <li>• 图片存储在腾讯云COS的 <code className="bg-blue-100 px-1 rounded">test/</code> 文件夹</li>
          <li>• 需要登录后才能上传</li>
        </ul>
      </div>
    </div>
  )
}

