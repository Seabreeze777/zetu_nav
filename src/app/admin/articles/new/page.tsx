'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import AdminLayout from '@/components/admin/AdminLayout'
import MarkdownEditor from '@/components/admin/MarkdownEditor'
import MediaSelector from '@/components/admin/MediaSelector'
import { useToast } from '@/contexts/ToastContext'

interface Category {
  id: number
  name: string
  slug: string
}

interface Tag {
  id: number
  name: string
  slug: string
}

export default function NewArticlePage() {
  const router = useRouter()
  const toast = useToast()
  const [loading, setLoading] = useState(false)
  const [categories, setCategories] = useState<Category[]>([])
  const [tags, setTags] = useState<Tag[]>([])
  
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    description: '',
    content: '',
    coverImage: '',
    author: '',
    categoryId: 0,
    readTime: 5,
    isFeatured: false,
    isPublished: false,
    tagIds: [] as number[],
  })

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      // 获取文章分类
      const categoriesRes = await fetch('/api/article-categories')
      const categoriesData = await categoriesRes.json()
      if (categoriesData.success) {
        setCategories(categoriesData.data)
        if (categoriesData.data.length > 0) {
          setFormData((prev) => ({ ...prev, categoryId: categoriesData.data[0].id }))
        }
      }

      // 获取标签
      const tagsRes = await fetch('/api/tags?limit=100')
      const tagsData = await tagsRes.json()
      if (tagsData.success) {
        setTags(tagsData.data)
      }
    } catch (error) {
      console.error('获取数据失败:', error)
    }
  }

  const handleTitleChange = (title: string) => {
    setFormData((prev) => ({
      ...prev,
      title,
      // 自动生成 slug
      slug: title
        .toLowerCase()
        .trim()
        .replace(/[\s\W-]+/g, '-')
        .replace(/^-+|-+$/g, ''),
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const res = await fetch('/api/admin/articles', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      const data = await res.json()

      if (data.success) {
        toast.success('文章创建成功！')
        router.push('/admin/articles')
      } else {
        toast.error('创建失败：' + data.error)
      }
    } catch (error) {
      console.error('创建失败:', error)
      toast.error('创建失败，请稍后重试')
    } finally {
      setLoading(false)
    }
  }

  const handleTagToggle = (tagId: number) => {
    setFormData((prev) => ({
      ...prev,
      tagIds: prev.tagIds.includes(tagId)
        ? prev.tagIds.filter((id) => id !== tagId)
        : [...prev.tagIds, tagId],
    }))
  }

  return (
    <AdminLayout>
      <div className="max-w-5xl mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">写文章</h1>
          <p className="text-gray-600 mt-1">创建新的文章</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* 基本信息 */}
          <div className="bg-white rounded-2xl shadow-sm p-6 space-y-4">
            <h2 className="text-lg font-bold text-gray-900">基本信息</h2>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                文章标题 <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) => handleTitleChange(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="输入文章标题..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                URL 别名 <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={formData.slug}
                onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 font-mono text-sm"
                placeholder="url-slug"
              />
              <p className="text-xs text-gray-500 mt-1">文章链接：/posts/{formData.slug || 'url-slug'}</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                文章描述
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={3}
                className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="简要描述这篇文章..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                文章封面
              </label>
              <MediaSelector
                value={formData.coverImage}
                onChange={(url) => setFormData({ ...formData, coverImage: url || '' })}
                folder="articles"
                label=""
                description="推荐尺寸：1200x630px"
                buttonText="上传封面图"
              />
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  作者
                </label>
                <input
                  type="text"
                  value={formData.author}
                  onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="留空使用当前用户"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  所属分类 <span className="text-red-500">*</span>
                </label>
                <select
                  required
                  value={formData.categoryId}
                  onChange={(e) => setFormData({ ...formData, categoryId: parseInt(e.target.value) })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                >
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  阅读时长（分钟）
                </label>
                <input
                  type="number"
                  value={formData.readTime}
                  onChange={(e) => setFormData({ ...formData, readTime: parseInt(e.target.value) })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  min="1"
                />
              </div>
            </div>
          </div>

          {/* 文章内容 */}
          <div className="bg-white rounded-2xl shadow-sm p-6 space-y-4">
            <h2 className="text-lg font-bold text-gray-900">文章内容 <span className="text-red-500">*</span></h2>
            <MarkdownEditor
              value={formData.content}
              onChange={(content) => setFormData({ ...formData, content })}
              placeholder="开始写作...支持 Markdown 语法"
            />
          </div>

          {/* 标签 */}
          <div className="bg-white rounded-2xl shadow-sm p-6 space-y-4">
            <h2 className="text-lg font-bold text-gray-900">标签</h2>
            <div className="flex flex-wrap gap-2">
              {tags.map((tag) => (
                <button
                  key={tag.id}
                  type="button"
                  onClick={() => handleTagToggle(tag.id)}
                  className={`px-3 py-1.5 rounded-lg text-sm transition-colors ${
                    formData.tagIds.includes(tag.id)
                      ? 'bg-indigo-500 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {tag.name}
                </button>
              ))}
            </div>
          </div>

          {/* 发布选项 */}
          <div className="bg-white rounded-2xl shadow-sm p-6 space-y-4">
            <h2 className="text-lg font-bold text-gray-900">发布选项</h2>
            <div className="space-y-3">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.isFeatured}
                  onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })}
                  className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                />
                <span className="text-sm text-gray-700">⭐ 设为精选文章（显示在首页推荐）</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.isPublished}
                  onChange={(e) => setFormData({ ...formData, isPublished: e.target.checked })}
                  className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                />
                <span className="text-sm text-gray-700">✅ 立即发布（不勾选则保存为草稿）</span>
              </label>
            </div>
          </div>

          {/* 提交按钮 */}
          <div className="flex gap-3 sticky bottom-0 bg-white py-4 border-t border-gray-200 rounded-2xl shadow-lg px-6">
            <button
              type="button"
              onClick={() => router.back()}
              className="px-6 py-2 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors"
            >
              取消
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-6 py-2 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-xl font-medium hover:from-indigo-600 hover:to-purple-700 transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? '创建中...' : formData.isPublished ? '发布文章' : '保存草稿'}
            </button>
          </div>
        </form>
      </div>
    </AdminLayout>
  )
}

