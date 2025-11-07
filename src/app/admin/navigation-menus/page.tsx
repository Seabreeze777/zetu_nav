'use client'

import { useState, useEffect } from 'react'
import AdminLayout from '@/components/admin/AdminLayout'
import { useToast } from '@/contexts/ToastContext'

interface NavigationMenu {
  id: number
  name: string
  href: string
  icon?: string | null
  parentId?: number | null
  sortOrder: number
  isActive: boolean
  openInNewTab: boolean
  children?: NavigationMenu[]
}

export default function NavigationMenusPage() {
  const toast = useToast()
  const [menus, setMenus] = useState<NavigationMenu[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<number | null>(null)
  
  const [formData, setFormData] = useState({
    name: '',
    href: '',
    icon: '',
    parentId: null as number | null,
    sortOrder: 0,
    isActive: true,
    openInNewTab: false,
  })

  useEffect(() => {
    fetchMenus()
  }, [])

  const fetchMenus = async () => {
    try {
      const res = await fetch('/api/admin/navigation-menus')
      const data = await res.json()
      if (data.success) {
        setMenus(data.data)
      }
    } catch (error) {
      console.error('获取菜单失败:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      const url = editingId
        ? `/api/admin/navigation-menus/${editingId}`
        : '/api/admin/navigation-menus'
      
      const res = await fetch(url, {
        method: editingId ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          icon: formData.icon || null,
          parentId: formData.parentId || null,
        }),
      })

      const data = await res.json()

      if (data.success) {
        toast.success(editingId ? '更新成功！' : '添加成功！')
        setShowForm(false)
        setEditingId(null)
        setFormData({ name: '', href: '', icon: '', parentId: null, sortOrder: 0, isActive: true, openInNewTab: false })
        fetchMenus()
      } else {
        toast.error(data.error || '操作失败')
      }
    } catch (error) {
      console.error('操作失败:', error)
      toast.error('操作失败，请重试')
    }
  }

  const handleEdit = (menu: NavigationMenu) => {
    setEditingId(menu.id)
    setFormData({
      name: menu.name,
      href: menu.href,
      icon: menu.icon || '',
      parentId: menu.parentId || null,
      sortOrder: menu.sortOrder,
      isActive: menu.isActive,
      openInNewTab: menu.openInNewTab,
    })
    setShowForm(true)
  }

  const handleDelete = async (id: number, name: string) => {
    toast.confirm(`确定要删除菜单"${name}"吗？（子菜单也会一并删除）`, async () => {
      try {
        const res = await fetch(`/api/admin/navigation-menus/${id}`, {
          method: 'DELETE',
        })
        const data = await res.json()

        if (data.success) {
          toast.success('删除成功！')
          fetchMenus()
        } else {
          toast.error(data.error || '删除失败')
        }
      } catch (error) {
        console.error('删除失败:', error)
        toast.error('删除失败，请重试')
      }
    })
  }

  // 获取所有顶级菜单用于父菜单选择
  const getParentMenuOptions = () => {
    return menus
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
              <h1 className="text-2xl font-bold text-gray-900">导航菜单管理</h1>
              <p className="text-sm text-gray-500 mt-1">管理顶部导航栏的菜单和子菜单</p>
            </div>
          <button
            onClick={() => {
              setShowForm(true)
              setEditingId(null)
              setFormData({ name: '', href: '', icon: '', parentId: null, sortOrder: 0, isActive: true, openInNewTab: false })
            }}
            className="px-6 py-2 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-xl font-medium hover:from-indigo-600 hover:to-purple-700 transition-all shadow-lg hover:shadow-xl"
          >
            + 添加菜单
          </button>
        </div>

        {/* 表单 */}
        {showForm && (
          <div className="bg-white rounded-2xl shadow-sm p-6 mb-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4">
              {editingId ? '编辑菜单' : '添加菜单'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    菜单名称 <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="例如：首页"
                    className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    跳转链接 <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.href}
                    onChange={(e) => setFormData({ ...formData, href: e.target.value })}
                    placeholder="例如：/"
                    className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    图标 Emoji（可选）
                  </label>
                  <input
                    type="text"
                    value={formData.icon}
                    onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                    placeholder="😊"
                    maxLength={2}
                    className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    父菜单（留空则为顶级菜单）
                  </label>
                  <select
                    value={formData.parentId || ''}
                    onChange={(e) => setFormData({ ...formData, parentId: e.target.value ? parseInt(e.target.value) : null })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  >
                    <option value="">无（顶级菜单）</option>
                    {getParentMenuOptions().map((menu) => (
                      <option key={menu.id} value={menu.id} disabled={menu.id === editingId}>
                        {menu.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    排序（数字越小越靠前）
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
                    <span className="text-sm text-gray-700">启用此菜单</span>
                  </label>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    打开方式
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer mt-2">
                    <input
                      type="checkbox"
                      checked={formData.openInNewTab}
                      onChange={(e) => setFormData({ ...formData, openInNewTab: e.target.checked })}
                      className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                    />
                    <span className="text-sm text-gray-700">新窗口打开</span>
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

        {/* 菜单列表 */}
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          <div className="p-6">
            {menus.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                暂无菜单，点击"添加菜单"创建
              </div>
            ) : (
              <div className="space-y-4">
                {menus.map((menu) => (
                  <div key={menu.id} className="border border-gray-200 rounded-xl p-4">
                    {/* 顶级菜单 */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        {menu.icon && <span className="text-2xl">{menu.icon}</span>}
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="font-medium text-gray-900">{menu.name}</h3>
                            <span className={`px-2 py-0.5 text-xs font-semibold rounded-full ${
                              menu.isActive
                                ? 'bg-green-100 text-green-800'
                                : 'bg-gray-100 text-gray-800'
                            }`}>
                              {menu.isActive ? '启用' : '禁用'}
                            </span>
                            {menu.openInNewTab && (
                              <span className="px-2 py-0.5 text-xs bg-blue-100 text-blue-800 rounded-full">
                                新窗口
                              </span>
                            )}
                          </div>
                          <p className="text-sm text-gray-500">{menu.href}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-gray-400">排序: {menu.sortOrder}</span>
                        <button
                          onClick={() => handleEdit(menu)}
                          className="px-3 py-1 text-sm text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                        >
                          编辑
                        </button>
                        <button
                          onClick={() => handleDelete(menu.id, menu.name)}
                          className="px-3 py-1 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          删除
                        </button>
                      </div>
                    </div>

                    {/* 子菜单 */}
                    {menu.children && menu.children.length > 0 && (
                      <div className="mt-3 ml-8 space-y-2">
                        {menu.children.map((child) => (
                          <div key={child.id} className="flex items-center justify-between bg-gray-50 rounded-lg p-3">
                            <div className="flex items-center gap-2">
                              <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                              </svg>
                              <div>
                                <div className="flex items-center gap-2">
                                  <span className="text-sm font-medium text-gray-700">{child.name}</span>
                                  <span className={`px-1.5 py-0.5 text-xs font-semibold rounded ${
                                    child.isActive
                                      ? 'bg-green-100 text-green-700'
                                      : 'bg-gray-100 text-gray-600'
                                  }`}>
                                    {child.isActive ? '启用' : '禁用'}
                                  </span>
                                </div>
                                <p className="text-xs text-gray-400">{child.href}</p>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="text-xs text-gray-400">排序: {child.sortOrder}</span>
                              <button
                                onClick={() => handleEdit(child)}
                                className="text-xs text-indigo-600 hover:underline"
                              >
                                编辑
                              </button>
                              <button
                                onClick={() => handleDelete(child.id, child.name)}
                                className="text-xs text-red-600 hover:underline"
                              >
                                删除
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
        </div>
      </div>
    </AdminLayout>
  )
}

