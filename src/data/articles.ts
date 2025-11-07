/**
 * 文章数据模拟
 * 后续替换为从数据库或 CMS 获取
 */

export interface Article {
  slug: string
  title: string
  excerpt: string
  content: string
  author: string
  date: string
  readingTime: number
  views: number
  category: string
  categoryName: string
  tags: string[]
  headings: Array<{
    id: string
    text: string
    level: number
  }>
}

// 模拟文章数据
const articles: Article[] = [
  {
    slug: 'how-to-build-navigation-website',
    title: '如何从零开始搭建一个现代化的导航网站',
    excerpt: '详细介绍使用 Next.js 14、TypeScript 和 Tailwind CSS 搭建导航网站的完整流程，包括架构设计、功能实现和部署上线。',
    content: `
      <h2 id="introduction">引言</h2>
      <p>导航网站是互联网用户的重要入口之一，一个优秀的导航网站不仅需要美观的界面设计，还需要良好的用户体验和高效的性能。本文将详细介绍如何使用现代化的技术栈搭建一个功能完善的导航网站。</p>

      <h2 id="tech-stack">技术栈选择</h2>
      <p>在开始之前，我们需要选择合适的技术栈。本项目采用以下技术：</p>
      <ul>
        <li><strong>Next.js 14</strong>：React 全栈框架，支持 SSR 和 SSG</li>
        <li><strong>TypeScript</strong>：类型安全的 JavaScript 超集</li>
        <li><strong>Tailwind CSS</strong>：实用优先的 CSS 框架</li>
        <li><strong>Prisma + PostgreSQL</strong>：ORM 和数据库</li>
      </ul>

      <h2 id="project-structure">项目架构</h2>
      <p>良好的项目结构是项目成功的关键。我们采用 Next.js 14 的 App Router 结构：</p>
      <pre><code>src/
├── app/              # 页面路由
├── components/       # React 组件
├── data/            # 数据和配置
└── lib/             # 工具函数</code></pre>

      <h3 id="component-design">组件设计</h3>
      <p>组件化是现代前端开发的核心思想。我们将页面拆分为可复用的组件：</p>
      <ul>
        <li>TopNav - 顶部导航栏</li>
        <li>Sidebar - 侧边栏导航</li>
        <li>WebsiteCard - 网站卡片</li>
        <li>FeaturedCard - 精选大卡片</li>
      </ul>

      <h2 id="key-features">核心功能实现</h2>
      <p>导航网站的核心功能包括网站分类、搜索、标签筛选等。</p>

      <h3 id="category-system">分类系统</h3>
      <p>分类系统采用动态路由实现，支持无限级分类。每个分类可以独立配置显示样式和卡片布局。</p>

      <h3 id="search-feature">搜索功能</h3>
      <p>搜索功能支持全文搜索，可以搜索网站名称、描述和标签。使用防抖优化性能。</p>

      <h2 id="performance">性能优化</h2>
      <p>性能优化是提升用户体验的关键：</p>
      <ul>
        <li>使用 Next.js 的静态生成（SSG）</li>
        <li>图片懒加载和压缩</li>
        <li>代码分割和按需加载</li>
        <li>CDN 加速</li>
      </ul>

      <h2 id="deployment">部署上线</h2>
      <p>推荐使用 Vercel 进行部署，一键部署，自动 HTTPS，全球 CDN。</p>

      <h2 id="conclusion">总结</h2>
      <p>通过本文的介绍，你应该对如何搭建一个现代化的导航网站有了全面的了解。从技术选型到项目架构，从功能实现到性能优化，每个环节都至关重要。</p>
    `,
    author: '张三',
    date: '2024-01-15',
    readingTime: 8,
    views: 1234,
    category: 'dev',
    categoryName: '开发文档',
    tags: ['Next.js', 'React', 'TypeScript', '教程'],
    headings: [
      { id: 'introduction', text: '引言', level: 2 },
      { id: 'tech-stack', text: '技术栈选择', level: 2 },
      { id: 'project-structure', text: '项目架构', level: 2 },
      { id: 'component-design', text: '组件设计', level: 3 },
      { id: 'key-features', text: '核心功能实现', level: 2 },
      { id: 'category-system', text: '分类系统', level: 3 },
      { id: 'search-feature', text: '搜索功能', level: 3 },
      { id: 'performance', text: '性能优化', level: 2 },
      { id: 'deployment', text: '部署上线', level: 2 },
      { id: 'conclusion', text: '总结', level: 2 },
    ],
  },
  {
    slug: 'best-design-resources-2024',
    title: '2024 年最佳设计资源推荐',
    excerpt: '精选全球最优质的设计资源网站，包括图标库、配色工具、字体资源等，助你快速提升设计效率。',
    content: '<h2 id="intro">设计资源推荐</h2><p>这是一篇关于设计资源的文章...</p>',
    author: '李四',
    date: '2024-01-10',
    readingTime: 5,
    views: 856,
    category: 'design',
    categoryName: '设计资源',
    tags: ['设计', '资源', '工具'],
    headings: [
      { id: 'intro', text: '设计资源推荐', level: 2 },
    ],
  },
  {
    slug: 'ai-tools-guide',
    title: 'AI 工具完全指南：从入门到精通',
    excerpt: '全面介绍 ChatGPT、Midjourney 等热门 AI 工具的使用技巧和实战案例。',
    content: '<h2 id="intro">AI 工具介绍</h2><p>这是一篇关于 AI 工具的文章...</p>',
    author: '王五',
    date: '2024-01-08',
    readingTime: 12,
    views: 2341,
    category: 'ai',
    categoryName: 'AI 工具',
    tags: ['AI', 'ChatGPT', 'Midjourney'],
    headings: [
      { id: 'intro', text: 'AI 工具介绍', level: 2 },
    ],
  },
]

// 获取所有文章
export function getAllArticles(): Article[] {
  return articles
}

// 根据 slug 获取文章
export function getArticleBySlug(slug: string): Article | undefined {
  return articles.find((article) => article.slug === slug)
}

// 获取相关文章
export function getRelatedArticles(currentSlug: string, category: string, limit = 5): Article[] {
  return articles
    .filter((article) => article.slug !== currentSlug && article.category === category)
    .slice(0, limit)
}

// 获取热门文章
export function getPopularArticles(limit = 5): Article[] {
  return [...articles]
    .sort((a, b) => b.views - a.views)
    .slice(0, limit)
}

