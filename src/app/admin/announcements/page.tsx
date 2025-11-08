'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import AdminLayout from '@/components/admin/AdminLayout'
import LoadingButton from '@/components/common/LoadingButton'
import ConfirmDialog from '@/components/common/ConfirmDialog'
import { useToast } from '@/contexts/ToastContext'

interface Announcement {
  id: number
  title: string
  content: string | null
  link: string | null
  icon: string
  sortOrder: number
  isActive: boolean
  startTime: string | null
  endTime: string | null
  createdAt: string
  updatedAt: string
}

export default function AnnouncementsPage() {
  const toast = useToast()
  const [announcements, setAnnouncements] = useState<Announcement[]>([])
  const [loading, setLoading] = useState(true)
  const [deleteDialog, setDeleteDialog] = useState<{ open: boolean; id: number | null }>({
    open: false,
    id: null
  })
  const [deleteLoading, setDeleteLoading] = useState(false)
  const [showAnnouncementBanner, setShowAnnouncementBanner] = useState(true)
  const [toggleLoading, setToggleLoading] = useState(false)

  useEffect(() => {
    loadAnnouncements()
    loadBannerSetting()
  }, [])

  const loadAnnouncements = async () => {
    try {
      const res = await fetch('/api/admin/announcements')
      const data = await res.json()
      if (data.success) {
        setAnnouncements(data.data)
      }
    } catch (error) {
      console.error('加载公告失败:', error)
    } finally {
      setLoading(false)
    }
  }

  const loadBannerSetting = async () => {
    try {
      const res = await fetch('/api/admin/ui-settings')
      const data = await res.json()
      if (data.success) {
        setShowAnnouncementBanner(data.data.showAnnouncementBanner !== false)
      }
    } catch (error) {
      console.error('加载公告栏配置失败:', error)
    }
  }

  const handleToggleBanner = async (checked: boolean) => {
    setToggleLoading(true)
    try {
      const res = await fetch('/api/admin/ui-settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ showAnnouncementBanner: checked }),
      })

      const data = await res.json()
      if (data.success) {
        setShowAnnouncementBanner(checked)
        toast.success(checked ? '公告栏已开启' : '公告栏已关闭')
      } else {
        toast.error('设置失败: ' + data.error)
      }
    } catch (error) {
      console.error('设置公告栏失败:', error)
      toast.error('设置失败')
    } finally {
      setToggleLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!deleteDialog.id) return

    setDeleteLoading(true)
    try {
      const res = await fetch(`/api/admin/announcements/${deleteDialog.id}`, {
        method: 'DELETE',
      })
      const data = await res.json()

      if (data.success) {
        await loadAnnouncements()
        setDeleteDialog({ open: false, id: null })
        toast.success('删除成功')
      } else {
        toast.error(data.error || '删除失败')
      }
    } catch (error) {
      console.error('删除失败:', error)
      toast.error('删除失败')
    } finally {
      setDeleteLoading(false)
    }
  }

  const openDeleteDialog = (id: number) => {
    setDeleteDialog({ open: true, id })
  }

  return (
    <AdminLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-900">公告管理</h1>
          <Link
            href="/admin/announcements/new"
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors duration-200 shadow-sm hover:shadow-md"
          >
            + 添加公告
          </Link>
        </div>

        {/* 公告栏显示开关 */}
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-2xl">📢</span>
              <div>
                <h3 className="text-sm font-semibold text-gray-900">公告栏显示开关</h3>
                <p className="text-xs text-gray-600">控制首页是否显示公告横幅</p>
              </div>
            </div>
            <label className="flex items-center cursor-pointer">
              <div className="relative">
                <input
                  type="checkbox"
                  checked={showAnnouncementBanner}
                  onChange={(e) => handleToggleBanner(e.target.checked)}
                  disabled={toggleLoading}
                  className="sr-only peer"
                />
                <div className="w-14 h-7 bg-gray-300 rounded-full peer peer-checked:bg-green-500 transition-colors"></div>
                <div className="absolute left-1 top-1 w-5 h-5 bg-white rounded-full peer-checked:translate-x-7 transition-transform shadow-md"></div>
              </div>
              <span className="ml-3 text-sm font-medium text-gray-700">
                {showAnnouncementBanner ? '已开启' : '已关闭'}
              </span>
            </label>
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    图标
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    标题
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    排序
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    显示时间
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    状态
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    操作
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {announcements.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                      暂无公告
                    </td>
                  </tr>
                ) : (
                  announcements.map((announcement) => (
                    <tr key={announcement.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-2xl">{announcement.icon}</span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm font-medium text-gray-900 max-w-md truncate">
                          {announcement.title}
                        </div>
                        {announcement.content && (
                          <div className="text-xs text-gray-500 max-w-md truncate">
                            {announcement.content}
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {announcement.sortOrder}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-xs text-gray-500">
                        {announcement.startTime || announcement.endTime ? (
                          <>
                            {announcement.startTime && (
                              <div>开始: {new Date(announcement.startTime).toLocaleDateString()}</div>
                            )}
                            {announcement.endTime && (
                              <div>结束: {new Date(announcement.endTime).toLocaleDateString()}</div>
                            )}
                          </>
                        ) : (
                          <div className="text-gray-400">永久显示</div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-2 py-1 text-xs rounded-full ${
                            announcement.isActive
                              ? 'bg-green-100 text-green-800'
                              : 'bg-gray-100 text-gray-800'
                          }`}
                        >
                          {announcement.isActive ? '启用' : '禁用'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <Link
                          href={`/admin/announcements/${announcement.id}`}
                          className="text-indigo-600 hover:text-indigo-900 mr-4 transition-colors duration-200 hover:underline"
                        >
                          编辑
                        </Link>
                        <button
                          onClick={() => openDeleteDialog(announcement.id)}
                          className="text-red-600 hover:text-red-900 transition-colors duration-200 hover:underline"
                        >
                          删除
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* 删除确认对话框 */}
      <ConfirmDialog
        isOpen={deleteDialog.open}
        onClose={() => setDeleteDialog({ open: false, id: null })}
        onConfirm={handleDelete}
        title="删除公告"
        message="确定要删除这条公告吗？此操作无法撤销。"
        confirmText="删除"
        cancelText="取消"
        type="danger"
        loading={deleteLoading}
      />
    </AdminLayout>
  )
}

