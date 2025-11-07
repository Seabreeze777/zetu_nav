/**
 * 侧边栏导航组件
 * 
 * 功能：
 * - 显示所有分类导航
 * - sticky 固定效果
 * - 点击跳转到对应内容区
 * - 自动高亮当前激活的分类（支持滚动联动）
 */

'use client'

// 分类数据
export const categories = [
  { id: 'hot', name: '热门推荐', icon: '🔥', count: 24 },
  { id: 'tools', name: '常用工具', icon: '🛠️', count: 32 },
  { id: 'design', name: '设计资源', icon: '🎨', count: 28 },
  { id: 'dev', name: '开发文档', icon: '💻', count: 45 },
  { id: 'ai', name: 'AI 工具', icon: '🤖', count: 18 },
  { id: 'productivity', name: '效率工具', icon: '⚡', count: 22 },
  { id: 'learning', name: '在线学习', icon: '📚', count: 15 },
  { id: 'social', name: '社交媒体', icon: '🎬', count: 12 },
  { id: 'shopping', name: '电商购物', icon: '🛒', count: 8 },
  { id: 'finance', name: '金融财经', icon: '💰', count: 10 },
]

interface SidebarProps {
  activeCategory: string
  onCategoryClick: (categoryId: string) => void
}

export default function Sidebar({ activeCategory, onCategoryClick }: SidebarProps) {
  const handleCategoryClick = (categoryId: string) => {
    onCategoryClick(categoryId)
    // 平滑滚动到对应区域
    const element = document.getElementById(`category-${categoryId}`)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }

  return (
    <aside className="w-40 flex-shrink-0">
      {/* 侧边栏卡片 - sticky 固定 */}
      <div className="sticky top-20 rounded-xl bg-white shadow-sm p-2">
        {/* 分类列表 */}
        <nav className="space-y-0.5">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => handleCategoryClick(category.id)}
              className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                activeCategory === category.id
                  ? 'bg-purple-50 text-purple-700 border-l-4 border-purple-600'
                  : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              <span className="text-base">{category.icon}</span>
              <span className="text-sm">{category.name}</span>
            </button>
          ))}
        </nav>
      </div>
    </aside>
  )
}

