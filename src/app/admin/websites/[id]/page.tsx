'use client'

import React, { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import AdminLayout from '@/components/admin/AdminLayout'
import MediaSelector from '@/components/admin/MediaSelector'
import ToggleSwitch from '@/components/common/ToggleSwitch'
import { useToast } from '@/contexts/ToastContext'

interface Category {
  id: number
  name: string
  slug: string
  displayMode?: string
}

interface ActionButton {
  text: string
  url: string
}

interface Tag {
  id: number
  name: string
  slug: string
}

interface Website {
  id: number
  name: string
  description: string
  url: string
  logoUrl: string | null
  categoryId: number
  sortOrder: number
  isActive: boolean
  tags: Array<{
    tag: {
      id: number
      name: string
      slug: string
    }
  }>
}

export default function EditWebsitePage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const toast = useToast()
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [categories, setCategories] = useState<Category[]>([])
  const [tags, setTags] = useState<Tag[]>([])
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    url: '',
    logoUrl: '',
    categoryId: 0,
    sortOrder: 0,
    isActive: true,
    tagIds: [] as number[],
    actionButtons: [] as ActionButton[],
  })
  
  console.log('🔧 当前 formData.categoryId:', formData.categoryId)

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      // 先获取分类和网站数据（并行加载）
      const [categoriesRes, websiteRes, tagsRes] = await Promise.all([
        fetch('/api/categories'),
        fetch(`/api/websites`),
        fetch('/api/tags?limit=100')
      ])

      const categoriesData = await categoriesRes.json()
      const websiteData = await websiteRes.json()
      const tagsData = await tagsRes.json()

      let loadedCategories: Category[] = []
      if (categoriesData.success) {
        console.log('✅ 可用分类:', categoriesData.data)
        loadedCategories = categoriesData.data
        setCategories(loadedCategories)
      }

      if (tagsData.success) {
        setTags(tagsData.data)
      }

      if (websiteData.success) {
        const website = websiteData.data.find((w: any) => w.id === parseInt(params.id))
        if (website) {
          // 智能提取 categoryId（兼容不同数据结构）
          let categoryId = typeof website.category === 'object' 
            ? (website.category?.id || 0) 
            : (website.categoryId || website.category || 0)
          
          console.log('✅ 网站数据:', website)
          console.log('✅ 原始 categoryId:', categoryId)
          
          // 🔥 如果 categoryId 为 0 或无效，自动设置为第一个可用分类
          if (categoryId === 0 || !loadedCategories.find(c => c.id === categoryId)) {
            if (loadedCategories.length > 0) {
              categoryId = loadedCategories[0].id
              console.log('⚠️ categoryId 无效，自动设置为第一个分类:', categoryId)
            }
          }
          
          console.log('✅ 最终 categoryId:', categoryId)
          console.log('✅ 分类列表:', loadedCategories)
          
          const targetCategory = loadedCategories.find(c => c.id === categoryId)
          console.log('✅ 目标分类:', targetCategory)
          console.log('✅ 显示模式:', targetCategory?.displayMode)
          
          setFormData({
            name: website.name,
            description: website.description || '',
            url: website.url,
            logoUrl: website.logoUrl || '',
            categoryId: categoryId,
            sortOrder: website.sortOrder || 0,
            isActive: website.isActive,
            tagIds: website.tags.map((t: any) => t.tag?.id || t.id),
            actionButtons: website.actionButtons || [],
          })
        }
      }

    } catch (error) {
      console.error('❌ 获取数据失败:', error)
      toast.error('获取数据失败')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // 验证必填字段
    if (!formData.name || !formData.url) {
      toast.warning('请填写网站名称和链接')
      return
    }
    
    if (!formData.categoryId || formData.categoryId === 0) {
      toast.warning('请选择所属分类')
      return
    }
    
    setSubmitting(true)

    try {
      // 调试输出
      console.log('提交数据:', formData)
      
      const res = await fetch(`/api/admin/websites/${params.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      const data = await res.json()

      if (data.success) {
        toast.success('更新成功！')
        router.push('/admin/websites')
      } else {
        toast.error('更新失败：' + data.error)
        console.error('API 返回错误:', data)
      }
    } catch (error) {
      console.error('更新失败:', error)
      toast.error('更新失败，请稍后重试')
    } finally {
      setSubmitting(false)
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

  const addButton = () => {
    setFormData((prev) => ({
      ...prev,
      actionButtons: [...prev.actionButtons, { text: '', url: '' }]
    }))
  }

  const removeButton = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      actionButtons: prev.actionButtons.filter((_, i) => i !== index)
    }))
  }

  const updateButton = (index: number, field: 'text' | 'url', value: string) => {
    setFormData((prev) => ({
      ...prev,
      actionButtons: prev.actionButtons.map((btn, i) =>
        i === index ? { ...btn, [field]: value } : btn
      )
    }))
  }

  // 获取当前分类的显示模式（使用useMemo确保实时计算）
  const isButtonMode = React.useMemo(() => {
    const currentCategory = categories.find(cat => cat.id === formData.categoryId)
    const result = currentCategory?.displayMode === 'button'
    console.log('🔍 计算按钮模式:', {
      categoryId: formData.categoryId,
      currentCategory,
      displayMode: currentCategory?.displayMode,
      isButtonMode: result
    })
    return result
  }, [formData.categoryId, categories])

  if (loading) {
    return (
      <AdminLayout>
        <div className="text-center py-12">
          <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">加载中...</p>
        </div>
      </AdminLayout>
    )
  }

  return (
    <AdminLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* 页面头部 */}
        <div className="max-w-6xl mx-auto mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">编辑网站</h1>
              <p className="text-sm text-gray-500 mt-1">修改网站信息并保存</p>
            </div>
            <button
              type="button"
              onClick={() => router.back()}
              className="px-4 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
            >
              ← 返回
            </button>
          </div>
        </div>

        {/* 表单容器 */}
        <div className="max-w-6xl mx-auto">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200">
            <form onSubmit={handleSubmit} className="p-8 space-y-8">
          {/* 基本信息 */}
          <div className="space-y-4">
            <h2 className="text-lg font-bold text-gray-900">基本信息</h2>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                网站名称 <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                网站描述
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={3}
                className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                网站链接 <span className="text-red-500">*</span>
              </label>
              <input
                type="url"
                required
                value={formData.url}
                onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                网站 Logo
              </label>
              <MediaSelector
                value={formData.logoUrl}
                onChange={(url) => setFormData({ ...formData, logoUrl: url || '' })}
                folder="websites"
                label=""
                description="推荐尺寸：512x512px"
              />
            </div>
          </div>

          {/* 分类和排序 */}
          <div className="space-y-4">
            <h2 className="text-lg font-bold text-gray-900">分类和排序</h2>

            <div className="grid grid-cols-2 gap-4">
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
                  {categories.length === 0 && (
                    <option value="">加载中...</option>
                  )}
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name} (ID: {cat.id})
                    </option>
                  ))}
                </select>
                <p className="text-xs text-gray-500 mt-1">
                  当前选中 ID: {formData.categoryId}
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  排序
                </label>
                <input
                  type="number"
                  value={formData.sortOrder}
                  onChange={(e) => setFormData({ ...formData, sortOrder: parseInt(e.target.value) })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
            </div>
          </div>

          {/* 标签 */}
          <div className="space-y-4">
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

          {/* 扩展按钮（仅按钮模式显示） */}
          {isButtonMode && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-bold text-gray-900">扩展按钮配置</h2>
                  <p className="text-sm text-gray-500 mt-1">
                    💡 当前分类使用&ldquo;按钮模式(5列)&rdquo;，这些按钮会显示在卡片下方
                  </p>
                </div>
                <button
                  type="button"
                  onClick={addButton}
                  disabled={formData.actionButtons.length >= 3}
                  className="px-4 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 transition-colors text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                  title={formData.actionButtons.length >= 3 ? '最多添加3个按钮' : ''}
                >
                  + 添加按钮 {formData.actionButtons.length > 0 && `(${formData.actionButtons.length}/3)`}
                </button>
              </div>

              {formData.actionButtons.length === 0 ? (
                <div className="bg-gray-50 border-2 border-dashed border-gray-300 rounded-xl p-6 text-center">
                  <p className="text-gray-500 text-sm">暂无扩展按钮，点击上方&ldquo;添加按钮&rdquo;创建</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {formData.actionButtons.map((button, index) => (
                    <div key={index} className="flex gap-3 items-start p-4 bg-gray-50 rounded-xl border border-gray-200">
                      <div className="flex-1 grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-xs font-medium text-gray-700 mb-1.5">
                            按钮文本 <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="text"
                            value={button.text}
                            onChange={(e) => updateButton(index, 'text', e.target.value)}
                            placeholder="例如：API文档"
                            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-gray-700 mb-1.5">
                            跳转链接 <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="url"
                            value={button.url}
                            onChange={(e) => updateButton(index, 'url', e.target.value)}
                            placeholder="https://..."
                            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                          />
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeButton(index)}
                        className="mt-6 px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors text-sm font-medium"
                        title="删除"
                      >
                        🗑️
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* 状态 */}
          <div className="space-y-4">
            <h2 className="text-lg font-bold text-gray-900">状态</h2>
            <ToggleSwitch
              checked={formData.isActive}
              onChange={(checked) => setFormData({ ...formData, isActive: checked })}
              label={formData.isActive ? '已启用（在前台显示）' : '已禁用（不在前台显示）'}
              size="md"
            />
          </div>

          {/* 底部操作栏 */}
          <div className="flex items-center justify-between pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={() => router.back()}
              className="px-6 py-2.5 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors font-medium"
            >
              取消
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-8 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed font-medium shadow-sm"
            >
              {submitting ? '保存中...' : '💾 保存修改'}
            </button>
          </div>
        </form>
          </div>
        </div>
      </div>
    </AdminLayout>
  )
}

