/**
 * 后台UI界面配置页面
 * 管理Hero样式等前端UI设置
 */

'use client'

import { useEffect, useState } from 'react'
import AdminLayout from '@/components/admin/AdminLayout'
import { useToast } from '@/contexts/ToastContext'
import { HeroStyleDescriptions } from '@/components/home/hero-styles'

interface UISettings {
  id: number
  heroStyle: string
  showAnnouncementBanner: boolean
  heroConfig: string | null
  createdAt: string
  updatedAt: string
}

export default function UISettingsPage() {
  const toast = useToast()
  const [settings, setSettings] = useState<UISettings | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [selectedStyle, setSelectedStyle] = useState('1')
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [editingStyleId, setEditingStyleId] = useState<string | null>(null)
  const [configForm, setConfigForm] = useState<any>({})

  // 加载UI配置
  useEffect(() => {
    loadSettings()
  }, [])

  const loadSettings = async () => {
    try {
      const res = await fetch('/api/admin/ui-settings')
      const data = await res.json()
      if (data.success) {
        setSettings(data.data)
        // 如果当前样式不在允许的范围内，默认使用样式4（打字机）
        const currentStyle = data.data.heroStyle
        if (['3', '4'].includes(currentStyle)) {
          setSelectedStyle(currentStyle)
        } else {
          setSelectedStyle('4')
        }
      }
    } catch (error) {
      console.error('加载UI配置失败:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    // 验证选择的样式是否有效
    if (!['3', '4'].includes(selectedStyle)) {
      toast.error('请选择有效的Hero样式')
      return
    }

    setSaving(true)
    try {
      const res = await fetch('/api/admin/ui-settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          heroStyle: selectedStyle
        }),
      })

      const data = await res.json()
      if (data.success) {
        setSettings(data.data)
        toast.success('Hero样式已更新！刷新前台页面即可看到效果。')
      } else {
        toast.error('保存失败: ' + data.error)
      }
    } catch (error) {
      console.error('保存UI配置失败:', error)
      toast.error('保存失败，请重试')
    } finally {
      setSaving(false)
    }
  }

  const openEditDialog = (styleId: string) => {
    setEditingStyleId(styleId)
    
    // 加载当前配置
    let currentConfig: any = {}
    if (settings?.heroConfig) {
      try {
        const parsed = JSON.parse(settings.heroConfig)
        currentConfig = parsed[`style${styleId}`] || {}
      } catch (e) {
        console.error('解析配置失败:', e)
      }
    }

    // 设置默认配置
    if (styleId === '4') {
      setConfigForm({
        searchScenarios: currentConfig.searchScenarios || ['GitHub', '设计工具', 'AI助手', '学习资源', '开发框架', '在线工具'],
        prefixText: currentConfig.prefixText || '找',
        subtitle: currentConfig.subtitle || '极速搜索，一触即达'
      })
    } else if (styleId === '2') {
      setConfigForm({
        popularSites: currentConfig.popularSites || [
          { name: 'GitHub', icon: '💻', url: 'https://github.com', bg: 'from-gray-700 to-gray-900' },
          { name: 'ChatGPT', icon: '🤖', url: 'https://chat.openai.com', bg: 'from-green-500 to-emerald-600' },
          { name: 'Figma', icon: '🎨', url: 'https://figma.com', bg: 'from-purple-500 to-pink-600' },
        ]
      })
    } else if (styleId === '3') {
      setConfigForm({
        title: currentConfig.title || '🚀 探索全网优质资源'
      })
    }
    
    setEditDialogOpen(true)
  }

  const handleSaveConfig = async () => {
    try {
      // 构建新的配置对象
      let allConfig: any = {}
      if (settings?.heroConfig) {
        try {
          allConfig = JSON.parse(settings.heroConfig)
        } catch (e) {
          allConfig = {}
        }
      }

      // 更新当前样式的配置
      allConfig[`style${editingStyleId}`] = configForm

      const res = await fetch('/api/admin/ui-settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          heroConfig: JSON.stringify(allConfig)
        }),
      })

      const data = await res.json()
      if (data.success) {
        setSettings(data.data)
        setEditDialogOpen(false)
        toast.success('配置已保存！刷新前台页面即可看到效果。')
      } else {
        toast.error('保存失败: ' + data.error)
      }
    } catch (error) {
      console.error('保存配置失败:', error)
      toast.error('保存失败，请重试')
    }
  }

  if (loading) {
    return (
      <AdminLayout>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
            <div className="space-y-4">
              <div className="h-32 bg-gray-200 rounded"></div>
              <div className="h-32 bg-gray-200 rounded"></div>
              <div className="h-32 bg-gray-200 rounded"></div>
            </div>
          </div>
        </div>
      </AdminLayout>
    )
  }

  return (
    <AdminLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* 页面标题 */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">UI界面配置</h1>
          <p className="mt-2 text-sm text-gray-600">
            自定义首页Hero区域样式，打造独特的用户体验
          </p>
        </div>

        {/* Hero样式选择器 */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="mb-6">
            <h2 className="text-xl font-bold text-gray-900 mb-2">
              Hero 区域样式
            </h2>
            <p className="text-sm text-gray-600">
              选择一个Hero样式，前台刷新后立即生效
            </p>
          </div>

          {/* 样式卡片列表 */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
            {HeroStyleDescriptions.map((style) => (
              <button
                key={style.id}
                onClick={() => setSelectedStyle(style.id)}
                className={`relative p-6 rounded-xl border-2 transition-all duration-200 text-left
                  ${
                    selectedStyle === style.id
                      ? 'border-indigo-600 bg-indigo-50 shadow-md scale-105'
                      : 'border-gray-200 hover:border-gray-300 hover:shadow-sm'
                  }`}
              >
                {/* 选中标记 */}
                {selectedStyle === style.id && (
                  <div className="absolute top-3 right-3 w-6 h-6 bg-indigo-600 rounded-full flex items-center justify-center">
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                )}

                {/* 样式图标 */}
                <div className="text-4xl mb-3">{style.preview}</div>

                {/* 样式名称 */}
                <h3 className={`text-lg font-bold mb-2 ${
                  selectedStyle === style.id ? 'text-indigo-700' : 'text-gray-900'
                }`}>
                  {style.name}
                </h3>

                {/* 样式描述 */}
                <p className="text-sm text-gray-600 leading-relaxed">
                  {style.description}
                </p>

                {/* 编辑按钮 - 仅样式2、3、4可编辑 */}
                {['2', '3', '4'].includes(style.id) && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      openEditDialog(style.id)
                    }}
                    className="absolute bottom-3 right-3 px-3 py-1.5 text-xs font-medium bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    ⚙️ 编辑配置
                  </button>
                )}
              </button>
            ))}
          </div>

          {/* 保存按钮 */}
          <div className="flex items-center justify-between pt-6 border-t border-gray-200">
            <div className="text-sm text-gray-600">
              当前使用：
              <span className="font-bold text-gray-900 ml-1">
                {HeroStyleDescriptions.find(s => s.id === settings?.heroStyle)?.name || '样式1'}
              </span>
            </div>
            
            <button
              onClick={handleSave}
              disabled={saving || selectedStyle === settings?.heroStyle}
              className={`px-6 py-2.5 rounded-lg font-medium text-white transition-all duration-200
                ${
                  saving || selectedStyle === settings?.heroStyle
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-indigo-600 hover:bg-indigo-700 active:scale-95 shadow-sm hover:shadow-md'
                }`}
            >
              {saving ? (
                <>
                  <svg className="inline-block w-4 h-4 mr-2 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  保存中...
                </>
              ) : (
                '保存配置'
              )}
            </button>
          </div>
        </div>

        {/* 预览提示 */}
        <div className="mt-6 bg-blue-50 border border-blue-200 rounded-xl p-4">
          <div className="flex items-start gap-3">
            <span className="text-2xl">💡</span>
            <div>
              <h3 className="font-bold text-blue-900 mb-1">温馨提示</h3>
              <p className="text-sm text-blue-800 leading-relaxed">
                更改Hero样式后，需要<strong>刷新前台页面</strong>才能看到效果。
                建议在新标签页中打开前台，对比不同样式的效果后再保存。
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 编辑配置弹窗 */}
      {editDialogOpen && (
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={() => setEditDialogOpen(false)}
        >
          <div 
            className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[80vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6">
              {/* 标题 */}
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">
                  编辑样式配置 - {HeroStyleDescriptions.find(s => s.id === editingStyleId)?.name}
                </h2>
                <button
                  onClick={() => setEditDialogOpen(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* 配置表单 */}
              <div className="space-y-6">
                {/* 样式4：打字机配置 */}
                {editingStyleId === '4' && (
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-3">
                        标题前缀文字
                      </label>
                      <input
                        type="text"
                        value={configForm.prefixText || ''}
                        onChange={(e) => setConfigForm({ ...configForm, prefixText: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                        placeholder="找"
                      />
                      <p className="mt-2 text-xs text-gray-500">
                        显示在打字机动画前的文字（例如："找"）
                      </p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-3">
                        打字机显示文字（每行一个）
                      </label>
                      <textarea
                        value={configForm.searchScenarios?.join('\n') || ''}
                        onChange={(e) => setConfigForm({
                          ...configForm,
                          searchScenarios: e.target.value.split('\n').filter(s => s.trim())
                        })}
                        rows={6}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                        placeholder="GitHub&#10;设计工具&#10;AI助手"
                      />
                      <p className="mt-2 text-xs text-gray-500">
                        每行一个文字，将依次循环显示
                      </p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-3">
                        副标题文字
                      </label>
                      <input
                        type="text"
                        value={configForm.subtitle || ''}
                        onChange={(e) => setConfigForm({ ...configForm, subtitle: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                        placeholder="极速搜索，一触即达"
                      />
                      <p className="mt-2 text-xs text-gray-500">
                        显示在标题下方的描述文字
                      </p>
                    </div>
                  </div>
                )}

                {/* 样式3：标题 */}
                {editingStyleId === '3' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      Hero标题
                    </label>
                    <input
                      type="text"
                      value={configForm.title || ''}
                      onChange={(e) => setConfigForm({ ...configForm, title: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      placeholder="🚀 探索全网优质资源"
                    />
                  </div>
                )}

                {/* 样式2：卡片信息 */}
                {editingStyleId === '2' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      3D卡片配置
                    </label>
                    <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg mb-3">
                      💡 提示：卡片配置较复杂，建议通过修改代码文件进行调整。<br/>
                      文件路径：<code className="text-indigo-600">src/components/home/hero-styles/HeroStyle2.tsx</code>
                    </p>
                  </div>
                )}
              </div>

              {/* 底部按钮 */}
              <div className="flex items-center justify-end gap-3 mt-8 pt-6 border-t border-gray-200">
                <button
                  onClick={() => setEditDialogOpen(false)}
                  className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  取消
                </button>
                <button
                  onClick={handleSaveConfig}
                  className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors shadow-sm hover:shadow-md"
                >
                  保存配置
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  )
}

