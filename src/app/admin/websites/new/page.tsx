'use client'

import React, { useState, useEffect } from 'react'
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

interface Tag {
  id: number
  name: string
  slug: string
}

export default function NewWebsitePage() {
  const router = useRouter()
  const toast = useToast()
  const [loading, setLoading] = useState(false)
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
    actionButtons: [] as Array<{ text: string; url: string }>,
  })

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      // 获取分类
      const categoriesRes = await fetch('/api/categories')
      const categoriesData = await categoriesRes.json()
      if (categoriesData.success) {
        const loadedCategories = categoriesData.data
        setCategories(loadedCategories)
        if (loadedCategories.length > 0) {
          const firstCategoryId = loadedCategories[0].id
          setFormData((prev) => ({ ...prev, categoryId: firstCategoryId }))
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const res = await fetch('/api/admin/websites', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      const data = await res.json()

      if (data.success) {
        toast.success('添加成功！')
        router.push('/admin/websites')
      } else {
        toast.error('添加失败：' + data.error)
      }
    } catch (error) {
      console.error('添加失败:', error)
      toast.error('添加失败，请稍后重试')
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

  return (
    <AdminLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* 页面头部 */}
        <div className="max-w-6xl mx-auto mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">添加网站</h1>
              <p className="text-sm text-gray-500 mt-1">填写网站信息并提交</p>
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
                placeholder="例如：GitHub"
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
                placeholder="简要描述这个网站..."
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
                placeholder="https://github.com"
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
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
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
                  placeholder="0"
                />
                <p className="text-xs text-gray-500 mt-1">数字越小越靠前</p>
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
                    💡 当前分类使用"按钮模式(5列)"，这些按钮会显示在卡片下方
                  </p>
                </div>
              <button
                type="button"
                onClick={() => {
                  setFormData({
                    ...formData,
                    actionButtons: [...formData.actionButtons, { text: '', url: '' }]
                  })
                }}
                disabled={formData.actionButtons.length >= 3}
                className="px-4 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 transition-colors text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                title={formData.actionButtons.length >= 3 ? '最多添加3个按钮' : ''}
              >
                + 添加按钮 {formData.actionButtons.length > 0 && `(${formData.actionButtons.length}/3)`}
              </button>
            </div>

            {formData.actionButtons.length === 0 ? (
              <div className="bg-gray-50 border-2 border-dashed border-gray-300 rounded-xl p-6 text-center">
                <p className="text-gray-500 text-sm">暂无扩展按钮，点击上方"添加按钮"创建</p>
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
                          onChange={(e) => {
                            const newButtons = [...formData.actionButtons]
                            newButtons[index].text = e.target.value
                            setFormData({ ...formData, actionButtons: newButtons })
                          }}
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
                          onChange={(e) => {
                            const newButtons = [...formData.actionButtons]
                            newButtons[index].url = e.target.value
                            setFormData({ ...formData, actionButtons: newButtons })
                          }}
                          placeholder="https://..."
                          className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        />
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        const newButtons = formData.actionButtons.filter((_, i) => i !== index)
                        setFormData({ ...formData, actionButtons: newButtons })
                      }}
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
              disabled={loading}
              className="px-8 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed font-medium shadow-sm"
            >
              {loading ? '提交中...' : '✨ 添加网站'}
            </button>
          </div>
        </form>
          </div>
        </div>
      </div>
    </AdminLayout>
  )
}

