'use client'

import { useState } from 'react'
import { useToast } from '@/contexts/ToastContext'
import ConfirmDialog from '@/components/common/ConfirmDialog'

export default function TestComponentsPage() {
  const toast = useToast()
  const [showDialog, setShowDialog] = useState(false)
  const [dialogType, setDialogType] = useState<'danger' | 'warning' | 'info'>('danger')

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* 标题 */}
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">组件测试页面</h1>
          <p className="text-gray-600">测试 Toast 通知和 ConfirmDialog 对话框</p>
        </div>

        {/* Toast 测试区 */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">🎨 Toast 通知测试</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <button
              onClick={() => toast.success('操作成功！这是一条成功消息')}
              className="px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              ✅ 成功提示
            </button>
            <button
              onClick={() => toast.error('操作失败！请检查网络连接')}
              className="px-4 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              ❌ 错误提示
            </button>
            <button
              onClick={() => toast.warning('警告：此操作不可撤销')}
              className="px-4 py-3 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors"
            >
              ⚠️ 警告提示
            </button>
            <button
              onClick={() => toast.info('这是一条普通信息提示')}
              className="px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              ℹ️ 信息提示
            </button>
          </div>
          <p className="mt-4 text-sm text-gray-500">
            💡 提示会在右上角显示，3秒后自动消失，也可以手动关闭
          </p>
        </div>

        {/* ConfirmDialog 测试区 */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">💬 确认对话框测试</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button
              onClick={() => {
                setDialogType('danger')
                setShowDialog(true)
              }}
              className="px-4 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              🗑️ 危险操作（删除）
            </button>
            <button
              onClick={() => {
                setDialogType('warning')
                setShowDialog(true)
              }}
              className="px-4 py-3 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors"
            >
              ⚠️ 警告操作
            </button>
            <button
              onClick={() => {
                setDialogType('info')
                setShowDialog(true)
              }}
              className="px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              ℹ️ 信息确认
            </button>
          </div>
        </div>

        {/* 组合测试 */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">🎭 组合测试</h2>
          <button
            onClick={() => setShowDialog(true)}
            className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
          >
            模拟删除操作（对话框 + Toast）
          </button>
          <p className="mt-4 text-sm text-gray-500">
            点击后会先显示确认对话框，确认后显示成功提示
          </p>
        </div>

        {/* 返回首页 */}
        <div className="text-center">
          <a
            href="/"
            className="inline-block px-6 py-2 text-blue-600 hover:text-blue-700 transition-colors"
          >
            ← 返回首页
          </a>
        </div>
      </div>

      {/* 确认对话框 */}
      <ConfirmDialog
        isOpen={showDialog}
        type={dialogType}
        title={
          dialogType === 'danger' ? '确认删除' :
          dialogType === 'warning' ? '警告' : '提示'
        }
        message={
          dialogType === 'danger' ? '删除后无法恢复，确定要删除这个项目吗？' :
          dialogType === 'warning' ? '此操作可能会影响系统，是否继续？' :
          '确定要执行此操作吗？'
        }
        confirmText={dialogType === 'danger' ? '删除' : '确认'}
        cancelText="取消"
        onConfirm={() => {
          setShowDialog(false)
          toast.success('操作已执行！')
        }}
        onClose={() => {
          setShowDialog(false)
          toast.info('操作已取消')
        }}
      />
    </div>
  )
}

