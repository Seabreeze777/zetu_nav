'use client'

import { useState, useEffect } from 'react'
import AdminLayout from '@/components/admin/AdminLayout'
import { useToast } from '@/contexts/ToastContext'

interface FloatingButton {
  id: number
  icon: string
  label: string
  url: string
  sortOrder: number
  isActive: boolean
}

export default function FloatingButtonsPage() {
  const toast = useToast()
  const [buttons, setButtons] = useState<FloatingButton[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<number | null>(null)
  
  const [formData, setFormData] = useState({
    icon: '',
    label: '',
    url: '',
    sortOrder: 0,
    isActive: true,
  })

  const [showIconPicker, setShowIconPicker] = useState(false)

  // 预设图标库
  const presetIcons = [
    { icon: '📞', label: '电话' },
    { icon: '💬', label: '聊天' },
    { icon: '📧', label: '邮件' },
    { icon: '🎧', label: '客服' },
    { icon: '❓', label: '帮助' },
    { icon: '💡', label: '建议' },
    { icon: '⚙️', label: '设置' },
    { icon: '🔔', label: '通知' },
    { icon: '📱', label: '手机' },
    { icon: '💻', label: '电脑' },
    { icon: '🌐', label: '网站' },
    { icon: '📍', label: '位置' },
    { icon: '🎯', label: '目标' },
    { icon: '⭐', label: '收藏' },
    { icon: '❤️', label: '喜欢' },
    { icon: '👍', label: '点赞' },
    { icon: '📝', label: '文档' },
    { icon: '📊', label: '数据' },
    { icon: '🔥', label: '热门' },
    { icon: '🎁', label: '礼物' },
    { icon: '🚀', label: '火箭' },
    { icon: '💰', label: '金钱' },
    { icon: '🎨', label: '设计' },
    { icon: '🔍', label: '搜索' },
  ]

  useEffect(() => {
    fetchButtons()
  }, [])

  const fetchButtons = async () => {
    try {
      const res = await fetch('/api/admin/floating-buttons')
      const data = await res.json()
      if (data.success) {
        setButtons(data.data)
      }
    } catch (error) {
      console.error('获取按钮失败:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      const url = editingId
        ? `/api/admin/floating-buttons/${editingId}`
        : '/api/admin/floating-buttons'
      
      const res = await fetch(url, {
        method: editingId ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      const data = await res.json()

      if (data.success) {
        toast.success(editingId ? '更新成功！' : '添加成功！')
        setShowForm(false)
        setEditingId(null)
        setFormData({ icon: '', label: '', url: '', sortOrder: 0, isActive: true })
        fetchButtons()
      } else {
        toast.error(data.error || '操作失败')
      }
    } catch (error) {
      console.error('操作失败:', error)
      toast.error('操作失败，请重试')
    }
  }

  const handleEdit = (button: FloatingButton) => {
    setEditingId(button.id)
    setFormData({
      icon: button.icon,
      label: button.label,
      url: button.url,
      sortOrder: button.sortOrder,
      isActive: button.isActive,
    })
    setShowForm(true)
  }

  const handleDelete = async (id: number, label: string) => {
    toast.confirm(`确定要删除按钮"${label}"吗？`, async () => {
      try {
        const res = await fetch(`/api/admin/floating-buttons/${id}`, {
          method: 'DELETE',
        })
        const data = await res.json()

        if (data.success) {
          toast.success('删除成功！')
          fetchButtons()
        } else {
          toast.error(data.error || '删除失败')
        }
      } catch (error) {
        console.error('删除失败:', error)
        toast.error('删除失败，请重试')
      }
    })
  }

  if (loading) {
    return (
      <AdminLayout>
        <div className="p-6">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center justify-center h-64">
              <div className="text-gray-500">加载中...</div>
            </div>
          </div>
        </div>
      </AdminLayout>
    )
  }

  return (
    <AdminLayout>
      <div className="p-6">
        <div className="max-w-7xl mx-auto">
          <div className="mb-6 flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">悬浮按钮管理</h1>
              <p className="text-sm text-gray-500 mt-1">管理全局悬浮按钮（最多5个）</p>
            </div>
          <button
            onClick={() => {
              setShowForm(true)
              setEditingId(null)
              setFormData({ icon: '', label: '', url: '', sortOrder: 0, isActive: true })
            }}
            disabled={buttons.filter(b => b.isActive).length >= 5 && !editingId}
            className="px-6 py-2 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-xl font-medium hover:from-indigo-600 hover:to-purple-700 transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
          >
            + 添加按钮
          </button>
        </div>

        {/* 表单 */}
        {showForm && (
          <div className="bg-white rounded-2xl shadow-sm p-6 mb-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4">
              {editingId ? '编辑按钮' : '添加按钮'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    图标 Emoji <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      required
                      value={formData.icon}
                      onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                      placeholder="点击选择或直接输入"
                      maxLength={2}
                      onClick={() => setShowIconPicker(!showIconPicker)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 cursor-pointer"
                      readOnly
                    />
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                      <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                    
                    {/* 图标选择器 */}
                    {showIconPicker && (
                      <div className="absolute z-10 mt-2 w-full bg-white border border-gray-200 rounded-xl shadow-lg p-3 max-h-60 overflow-y-auto">
                        <div className="grid grid-cols-6 gap-2">
                          {presetIcons.map((item, index) => (
                            <button
                              key={index}
                              type="button"
                              onClick={() => {
                                setFormData({ ...formData, icon: item.icon })
                                setShowIconPicker(false)
                              }}
                              title={item.label}
                              className={`w-full aspect-square flex items-center justify-center text-2xl rounded-lg hover:bg-indigo-50 transition-colors ${
                                formData.icon === item.icon ? 'bg-indigo-100 ring-2 ring-indigo-500' : 'bg-gray-50'
                              }`}
                            >
                              {item.icon}
                            </button>
                          ))}
                        </div>
                        <div className="mt-3 pt-3 border-t border-gray-200">
                          <input
                            type="text"
                            placeholder="或手动输入 emoji"
                            maxLength={2}
                            onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                            className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    按钮标签 <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.label}
                    onChange={(e) => setFormData({ ...formData, label: e.target.value })}
                    placeholder="例如：联系客服"
                    className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  跳转链接 <span className="text-red-500">*</span>
                </label>
                <input
                  type="url"
                  required
                  value={formData.url}
                  onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                  placeholder="https://example.com"
                  className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    排序（数字越小越靠上）
                  </label>
                  <input
                    type="number"
                    value={formData.sortOrder}
                    onChange={(e) => setFormData({ ...formData, sortOrder: parseInt(e.target.value) })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    状态
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer mt-2">
                    <input
                      type="checkbox"
                      checked={formData.isActive}
                      onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                      className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                    />
                    <span className="text-sm text-gray-700">启用此按钮</span>
                  </label>
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowForm(false)
                    setEditingId(null)
                  }}
                  className="px-6 py-2 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors"
                >
                  取消
                </button>
                <button
                  type="submit"
                  className="flex-1 px-6 py-2 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-xl font-medium hover:from-indigo-600 hover:to-purple-700 transition-all shadow-lg hover:shadow-xl"
                >
                  {editingId ? '更新' : '添加'}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* 按钮列表 */}
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  图标
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  标签
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  链接
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  排序
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  状态
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  操作
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {buttons.map((button) => (
                <tr key={button.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-2xl">
                    {button.icon}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {button.label}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <a href={button.url} target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:underline">
                      {button.url}
                    </a>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {button.sortOrder}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                      button.isActive
                        ? 'bg-green-100 text-green-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {button.isActive ? '启用' : '禁用'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button
                      onClick={() => handleEdit(button)}
                      className="text-indigo-600 hover:text-indigo-900 mr-4"
                    >
                      编辑
                    </button>
                    <button
                      onClick={() => handleDelete(button.id, button.label)}
                      className="text-red-600 hover:text-red-900"
                    >
                      删除
                    </button>
                  </td>
                </tr>
              ))}
              {buttons.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                    暂无数据，点击"添加按钮"创建
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        </div>
      </div>
    </AdminLayout>
  )
}

