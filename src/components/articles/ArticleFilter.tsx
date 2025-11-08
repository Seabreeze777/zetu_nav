'use client'

interface Category {
  id: number
  name: string
  slug: string
  icon: string
  articleCount: number
}

interface Tag {
  id: number
  name: string
  slug: string
  color: string
  articleCount: number
}

interface ArticleFilterProps {
  categories: Category[]
  activeCategory: string
  onCategoryChange: (categorySlug: string) => void
  tags?: Tag[]
  activeTag?: string
  onTagChange?: (tagSlug: string) => void
}

export default function ArticleFilter({ 
  categories, 
  activeCategory, 
  onCategoryChange,
  tags = [],
  activeTag = '',
  onTagChange
}: ArticleFilterProps) {
  const allCategories = [
    { id: 0, name: '全部文章', slug: 'all', icon: '📚', articleCount: 0 },
    ...categories,
  ]

  return (
    <aside className="w-44 flex-shrink-0">
      <div className="sticky top-20 h-fit space-y-4">
        {/* 分类过滤 */}
        <div className="bg-white rounded-2xl shadow-sm p-2">
          <nav className="space-y-0.5">
            {allCategories.map((category) => (
              <button
                key={category.slug}
                onClick={() => onCategoryChange(category.slug)}
                className={`w-full group relative flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                  activeCategory === category.slug
                    ? 'bg-gradient-to-r from-indigo-50 to-purple-50 text-indigo-700 shadow-sm'
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                {/* 左侧指示条 */}
                {activeCategory === category.slug && (
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-5 bg-gradient-to-b from-indigo-500 to-purple-600 rounded-r-full" />
                )}
                
                {/* 图标 */}
                <span className={`text-lg flex-shrink-0 transition-transform duration-200 ${
                  activeCategory === category.slug ? 'scale-110' : 'group-hover:scale-105'
                }`}>
                  {category.icon}
                </span>
                
                {/* 文字 */}
                <span className="flex-1 text-left truncate">
                  {category.name}
                </span>
                
                {/* 右侧箭头（仅激活时显示） */}
                {activeCategory === category.slug && (
                  <svg
                    className="w-4 h-4 text-indigo-500 flex-shrink-0"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                  </svg>
                )}
                
                {/* 文章数量 */}
                {!activeCategory && category.articleCount > 0 && (
                  <span className="text-xs text-gray-400 flex-shrink-0">{category.articleCount}</span>
                )}
              </button>
            ))}
          </nav>
        </div>

        {/* 热门标签筛选 */}
        {tags.length > 0 && onTagChange && (
          <div className="bg-white rounded-2xl shadow-sm p-3">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-sm font-semibold text-gray-700">🏷️ 热门标签</span>
              {activeTag && (
                <button
                  onClick={() => onTagChange('')}
                  className="text-xs text-gray-400 hover:text-indigo-600 transition-colors"
                >
                  清除
                </button>
              )}
            </div>
            <div className="flex flex-wrap gap-1.5">
              {tags.slice(0, 10).map((tag) => (
                <button
                  key={tag.slug}
                  onClick={() => onTagChange(tag.slug)}
                  className={`px-2.5 py-1 text-xs font-medium rounded-lg transition-all duration-200 ${
                    activeTag === tag.slug
                      ? 'bg-indigo-600 text-white shadow-md'
                      : 'bg-gray-100 text-gray-600 hover:bg-indigo-50 hover:text-indigo-600'
                  }`}
                >
                  {tag.name}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </aside>
  )
}

