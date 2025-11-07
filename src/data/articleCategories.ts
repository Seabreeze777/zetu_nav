// 文章分类配置
export interface ArticleCategory {
  id: string
  name: string
  slug: string
  icon: string
  description: string
  count?: number
}

// 文章分类数据
export const articleCategories: ArticleCategory[] = [
  {
    id: 'all',
    name: '全部文章',
    slug: 'all',
    icon: '📚',
    description: '浏览所有文章',
    count: 48
  },
  {
    id: 'frontend',
    name: '前端开发',
    slug: 'frontend',
    icon: '🎨',
    description: 'React, Vue, CSS, JavaScript 等前端技术',
    count: 18
  },
  {
    id: 'backend',
    name: '后端开发',
    slug: 'backend',
    icon: '⚙️',
    description: 'Node.js, Python, 数据库等后端技术',
    count: 12
  },
  {
    id: 'design',
    name: 'UI/UX设计',
    slug: 'design',
    icon: '🎭',
    description: '界面设计、用户体验、设计工具',
    count: 8
  },
  {
    id: 'tools',
    name: '工具推荐',
    slug: 'tools',
    icon: '🔧',
    description: '开发工具、效率工具、在线服务',
    count: 10
  }
]

// 获取分类通过 slug
export function getCategoryBySlug(slug: string): ArticleCategory | undefined {
  return articleCategories.find(cat => cat.slug === slug)
}

// 获取所有分类（排除"全部"）
export function getActiveCategories(): ArticleCategory[] {
  return articleCategories.filter(cat => cat.id !== 'all')
}

