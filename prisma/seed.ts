import { PrismaClient } from '@prisma/client'
import * as bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 开始填充数据...\n')

  // ==================== 清空现有数据 ====================
  console.log('🗑️  清空现有数据...')
  await prisma.articleTag.deleteMany()
  await prisma.websiteTag.deleteMany()
  await prisma.article.deleteMany()
  await prisma.website.deleteMany()
  await prisma.tag.deleteMany()
  await prisma.articleCategory.deleteMany()
  await prisma.category.deleteMany()
  await prisma.user.deleteMany()
  console.log('✅ 清空完成\n')

  // ==================== 创建标签 ====================
  console.log('🏷️  创建标签...')
  const tags = await Promise.all([
    prisma.tag.create({ data: { name: 'React', slug: 'react', color: '#61DAFB' } }),
    prisma.tag.create({ data: { name: 'Vue', slug: 'vue', color: '#42B883' } }),
    prisma.tag.create({ data: { name: 'TypeScript', slug: 'typescript', color: '#3178C6' } }),
    prisma.tag.create({ data: { name: 'JavaScript', slug: 'javascript', color: '#F7DF1E' } }),
    prisma.tag.create({ data: { name: 'Next.js', slug: 'nextjs', color: '#000000' } }),
    prisma.tag.create({ data: { name: 'Tailwind CSS', slug: 'tailwindcss', color: '#06B6D4' } }),
    prisma.tag.create({ data: { name: 'Node.js', slug: 'nodejs', color: '#339933' } }),
    prisma.tag.create({ data: { name: 'Python', slug: 'python', color: '#3776AB' } }),
    prisma.tag.create({ data: { name: 'Go', slug: 'go', color: '#00ADD8' } }),
    prisma.tag.create({ data: { name: 'Rust', slug: 'rust', color: '#000000' } }),
    prisma.tag.create({ data: { name: 'Docker', slug: 'docker', color: '#2496ED' } }),
    prisma.tag.create({ data: { name: 'Kubernetes', slug: 'k8s', color: '#326CE5' } }),
    prisma.tag.create({ data: { name: 'AI', slug: 'ai', color: '#FF6B6B' } }),
    prisma.tag.create({ data: { name: 'UI设计', slug: 'ui-design', color: '#FF4081' } }),
    prisma.tag.create({ data: { name: 'CSS', slug: 'css', color: '#1572B6' } }),
    prisma.tag.create({ data: { name: 'Webpack', slug: 'webpack', color: '#8DD6F9' } }),
    prisma.tag.create({ data: { name: 'Vite', slug: 'vite', color: '#646CFF' } }),
    prisma.tag.create({ data: { name: 'GraphQL', slug: 'graphql', color: '#E10098' } }),
    prisma.tag.create({ data: { name: 'MySQL', slug: 'mysql', color: '#4479A1' } }),
    prisma.tag.create({ data: { name: 'PostgreSQL', slug: 'postgresql', color: '#336791' } }),
  ])
  console.log(`✅ 创建了 ${tags.length} 个标签\n`)

  // ==================== 创建导航分类 ====================
  console.log('📂 创建导航分类...')
  const categories = await Promise.all([
    prisma.category.create({
      data: {
        name: '热门推荐',
        slug: 'hot',
        icon: '🔥',
        description: '最受欢迎的网站和工具',
        sortOrder: 1,
        cardsPerRow: 6,
      },
    }),
    prisma.category.create({
      data: {
        name: '常用工具',
        slug: 'tools',
        icon: '🛠️',
        description: '提高效率的实用工具',
        sortOrder: 2,
        cardsPerRow: 5,
      },
    }),
    prisma.category.create({
      data: {
        name: '设计资源',
        slug: 'design',
        icon: '🎨',
        description: '设计师必备资源',
        sortOrder: 3,
        cardsPerRow: 4,
      },
    }),
    prisma.category.create({
      data: {
        name: '开发文档',
        slug: 'dev',
        icon: '💻',
        description: '技术文档和教程',
        sortOrder: 4,
        cardsPerRow: 3,
      },
    }),
    prisma.category.create({
      data: {
        name: 'AI 工具',
        slug: 'ai',
        icon: '🤖',
        description: '人工智能相关工具',
        sortOrder: 5,
        cardsPerRow: 4,
      },
    }),
    prisma.category.create({
      data: {
        name: '效率工具',
        slug: 'productivity',
        icon: '⚡',
        description: '提升工作效率',
        sortOrder: 6,
        cardsPerRow: 5,
      },
    }),
    prisma.category.create({
      data: {
        name: '在线学习',
        slug: 'learning',
        icon: '📚',
        description: '学习资源平台',
        sortOrder: 7,
        cardsPerRow: 4,
      },
    }),
    prisma.category.create({
      data: {
        name: '社交媒体',
        slug: 'social',
        icon: '🎬',
        description: '社交和娱乐平台',
        sortOrder: 8,
        cardsPerRow: 6,
      },
    }),
  ])
  console.log(`✅ 创建了 ${categories.length} 个导航分类\n`)

  // ==================== 创建导航网站 ====================
  console.log('🌐 创建导航网站...')
  
  // 热门推荐（12个）
  const hotWebsites = await Promise.all([
    prisma.website.create({
      data: {
        categoryId: categories[0].id,
        name: 'GitHub',
        description: '全球最大的代码托管平台',
        url: 'https://github.com',
        logoUrl: 'https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png',
        sortOrder: 1,
        clickCount: 1520,
      },
    }),
    prisma.website.create({
      data: {
        categoryId: categories[0].id,
        name: 'Stack Overflow',
        description: '程序员问答社区',
        url: 'https://stackoverflow.com',
        logoUrl: 'https://cdn.sstatic.net/Sites/stackoverflow/Img/apple-touch-icon.png',
        sortOrder: 2,
        clickCount: 980,
      },
    }),
    prisma.website.create({
      data: {
        categoryId: categories[0].id,
        name: 'MDN Web Docs',
        description: 'Web 开发权威文档',
        url: 'https://developer.mozilla.org',
        logoUrl: 'https://developer.mozilla.org/favicon-48x48.png',
        sortOrder: 3,
        clickCount: 850,
      },
    }),
    prisma.website.create({
      data: {
        categoryId: categories[0].id,
        name: 'npm',
        description: 'JavaScript 包管理器',
        url: 'https://www.npmjs.com',
        logoUrl: 'https://static-production.npmjs.com/58a19602036db1daee0d7863c94673a4.png',
        sortOrder: 4,
        clickCount: 720,
      },
    }),
    prisma.website.create({
      data: {
        categoryId: categories[0].id,
        name: 'CodePen',
        description: '前端代码在线编辑器',
        url: 'https://codepen.io',
        logoUrl: 'https://cpwebassets.codepen.io/assets/favicon/favicon-touch-de50acbf5d634ec6791894eba4ba9cf490f709b3d742597c6fc4b734e6492a5a.png',
        sortOrder: 5,
        clickCount: 650,
      },
    }),
    prisma.website.create({
      data: {
        categoryId: categories[0].id,
        name: 'DevDocs',
        description: 'API 文档聚合',
        url: 'https://devdocs.io',
        logoUrl: 'https://devdocs.io/images/apple-icon-152.png',
        sortOrder: 6,
        clickCount: 580,
      },
    }),
  ])

  // 常用工具（10个）
  const toolWebsites = await Promise.all([
    prisma.website.create({
      data: {
        categoryId: categories[1].id,
        name: 'Can I Use',
        description: '浏览器兼容性查询',
        url: 'https://caniuse.com',
        logoUrl: 'https://caniuse.com/img/favicon-128.png',
        sortOrder: 1,
        clickCount: 450,
      },
    }),
    prisma.website.create({
      data: {
        categoryId: categories[1].id,
        name: 'RegExr',
        description: '正则表达式测试工具',
        url: 'https://regexr.com',
        logoUrl: 'https://regexr.com/assets/icons/favicon-96x96.png',
        sortOrder: 2,
        clickCount: 380,
      },
    }),
    prisma.website.create({
      data: {
        categoryId: categories[1].id,
        name: 'TinyPNG',
        description: '在线图片压缩',
        url: 'https://tinypng.com',
        logoUrl: 'https://tinypng.com/images/apple-touch-icon.png',
        sortOrder: 3,
        clickCount: 520,
      },
    }),
    prisma.website.create({
      data: {
        categoryId: categories[1].id,
        name: 'Carbon',
        description: '代码截图美化工具',
        url: 'https://carbon.now.sh',
        logoUrl: 'https://carbon.now.sh/static/brand/icon.png',
        sortOrder: 4,
        clickCount: 310,
      },
    }),
    prisma.website.create({
      data: {
        categoryId: categories[1].id,
        name: 'JSON Formatter',
        description: 'JSON 格式化工具',
        url: 'https://jsonformatter.org',
        logoUrl: 'https://jsonformatter.org/img/jsonformatter-logo.png',
        sortOrder: 5,
        clickCount: 290,
      },
    }),
  ])

  // 设计资源（8个）
  const designWebsites = await Promise.all([
    prisma.website.create({
      data: {
        categoryId: categories[2].id,
        name: 'Figma',
        description: '协作式设计工具',
        url: 'https://www.figma.com',
        logoUrl: 'https://static.figma.com/app/icon/1/favicon.png',
        sortOrder: 1,
        clickCount: 890,
      },
    }),
    prisma.website.create({
      data: {
        categoryId: categories[2].id,
        name: 'Dribbble',
        description: '设计师作品展示平台',
        url: 'https://dribbble.com',
        logoUrl: 'https://cdn.dribbble.com/assets/favicon-b38525134603b9513174ec887944bde1a869eb6cd414f4d640ee48ab2a15a26b.ico',
        sortOrder: 2,
        clickCount: 670,
      },
    }),
    prisma.website.create({
      data: {
        categoryId: categories[2].id,
        name: 'Behance',
        description: 'Adobe 创意作品平台',
        url: 'https://www.behance.net',
        logoUrl: 'https://a5.behance.net/2c7edf6b6e7a5ea2d5ff3854be7f7b4af86a135b/img/site/favicon.ico',
        sortOrder: 3,
        clickCount: 550,
      },
    }),
    prisma.website.create({
      data: {
        categoryId: categories[2].id,
        name: 'Unsplash',
        description: '免费高质量图片',
        url: 'https://unsplash.com',
        logoUrl: 'https://unsplash.com/apple-touch-icon.png',
        sortOrder: 4,
        clickCount: 780,
      },
    }),
  ])

  // 开发文档（6个）
  const devWebsites = await Promise.all([
    prisma.website.create({
      data: {
        categoryId: categories[3].id,
        name: 'React 文档',
        description: 'React 官方文档',
        url: 'https://react.dev',
        logoUrl: 'https://react.dev/favicon.ico',
        sortOrder: 1,
        clickCount: 1200,
      },
    }),
    prisma.website.create({
      data: {
        categoryId: categories[3].id,
        name: 'Vue.js 文档',
        description: 'Vue.js 官方文档',
        url: 'https://vuejs.org',
        logoUrl: 'https://vuejs.org/logo.svg',
        sortOrder: 2,
        clickCount: 950,
      },
    }),
    prisma.website.create({
      data: {
        categoryId: categories[3].id,
        name: 'Next.js 文档',
        description: 'Next.js 官方文档',
        url: 'https://nextjs.org',
        logoUrl: 'https://nextjs.org/static/favicon/favicon.ico',
        sortOrder: 3,
        clickCount: 820,
      },
    }),
  ])

  // AI 工具（8个）
  const aiWebsites = await Promise.all([
    prisma.website.create({
      data: {
        categoryId: categories[4].id,
        name: 'ChatGPT',
        description: 'OpenAI 对话式 AI',
        url: 'https://chat.openai.com',
        logoUrl: 'https://chat.openai.com/apple-touch-icon.png',
        sortOrder: 1,
        clickCount: 2500,
      },
    }),
    prisma.website.create({
      data: {
        categoryId: categories[4].id,
        name: 'Midjourney',
        description: 'AI 绘画工具',
        url: 'https://www.midjourney.com',
        logoUrl: 'https://www.midjourney.com/apple-touch-icon.png',
        sortOrder: 2,
        clickCount: 1800,
      },
    }),
    prisma.website.create({
      data: {
        categoryId: categories[4].id,
        name: 'Claude',
        description: 'Anthropic AI 助手',
        url: 'https://claude.ai',
        logoUrl: 'https://claude.ai/images/claude_app_icon.png',
        sortOrder: 3,
        clickCount: 1200,
      },
    }),
    prisma.website.create({
      data: {
        categoryId: categories[4].id,
        name: 'Copilot',
        description: 'GitHub AI 编程助手',
        url: 'https://github.com/features/copilot',
        logoUrl: 'https://github.githubassets.com/images/modules/site/copilot/copilot.png',
        sortOrder: 4,
        clickCount: 980,
      },
    }),
  ])

  console.log(`✅ 创建了 ${hotWebsites.length + toolWebsites.length + designWebsites.length + devWebsites.length + aiWebsites.length} 个导航网站\n`)

  // ==================== 创建网站-标签关联 ====================
  console.log('🔗 创建网站-标签关联...')
  await Promise.all([
    // GitHub 的标签
    prisma.websiteTag.create({ data: { websiteId: hotWebsites[0].id, tagId: tags.find(t => t.slug === 'javascript')!.id } }),
    prisma.websiteTag.create({ data: { websiteId: hotWebsites[0].id, tagId: tags.find(t => t.slug === 'typescript')!.id } }),
    // React 文档
    prisma.websiteTag.create({ data: { websiteId: devWebsites[0].id, tagId: tags.find(t => t.slug === 'react')!.id } }),
    prisma.websiteTag.create({ data: { websiteId: devWebsites[0].id, tagId: tags.find(t => t.slug === 'javascript')!.id } }),
    // Vue 文档
    prisma.websiteTag.create({ data: { websiteId: devWebsites[1].id, tagId: tags.find(t => t.slug === 'vue')!.id } }),
    prisma.websiteTag.create({ data: { websiteId: devWebsites[1].id, tagId: tags.find(t => t.slug === 'javascript')!.id } }),
    // Next.js 文档
    prisma.websiteTag.create({ data: { websiteId: devWebsites[2].id, tagId: tags.find(t => t.slug === 'nextjs')!.id } }),
    prisma.websiteTag.create({ data: { websiteId: devWebsites[2].id, tagId: tags.find(t => t.slug === 'react')!.id } }),
  ])
  console.log('✅ 创建标签关联完成\n')

  // ==================== 创建文章分类 ====================
  console.log('📁 创建文章分类...')
  const articleCategories = await Promise.all([
    prisma.articleCategory.create({
      data: {
        name: '前端开发',
        slug: 'frontend',
        icon: '⚛️',
        description: 'React、Vue、CSS 等前端技术',
        sortOrder: 1,
      },
    }),
    prisma.articleCategory.create({
      data: {
        name: '后端开发',
        slug: 'backend',
        icon: '🔧',
        description: 'Node.js、Python、数据库等',
        sortOrder: 2,
      },
    }),
    prisma.articleCategory.create({
      data: {
        name: 'UI/UX 设计',
        slug: 'design',
        icon: '🎨',
        description: '界面设计和用户体验',
        sortOrder: 3,
      },
    }),
    prisma.articleCategory.create({
      data: {
        name: '人工智能',
        slug: 'ai',
        icon: '🤖',
        description: 'AI、机器学习相关',
        sortOrder: 4,
      },
    }),
    prisma.articleCategory.create({
      data: {
        name: '工具推荐',
        slug: 'tools',
        icon: '🛠️',
        description: '效率工具和资源推荐',
        sortOrder: 5,
      },
    }),
  ])
  console.log(`✅ 创建了 ${articleCategories.length} 个文章分类\n`)

  // ==================== 创建文章 ====================
  console.log('📝 创建文章...')
  const articles = await Promise.all([
    prisma.article.create({
      data: {
        categoryId: articleCategories[0].id,
        title: 'React 19 新特性深度解析',
        slug: 'react-19-new-features',
        description: '深入了解 React 19 带来的革命性特性，包括 Server Components、Actions 等',
        content: `# React 19 新特性深度解析\n\n## 前言\n\nReact 19 是 React 团队多年努力的成果...\n\n## Server Components\n\n服务器组件是 React 19 最重要的特性之一...\n\n## Actions\n\nActions 提供了一种新的处理表单和数据变更的方式...`,
        coverImage: 'https://picsum.photos/seed/react19/800/400',
        author: '前端小智',
        views: 1520,
        readTime: 8,
        isFeatured: true,
        isPublished: true,
        publishedAt: new Date('2025-01-15'),
      },
    }),
    prisma.article.create({
      data: {
        categoryId: articleCategories[0].id,
        title: 'Tailwind CSS 最佳实践指南',
        slug: 'tailwind-css-best-practices',
        description: '从项目配置到组件封装，全面掌握 Tailwind CSS 的最佳实践',
        content: `# Tailwind CSS 最佳实践指南\n\n## 为什么选择 Tailwind CSS\n\nTailwind CSS 是一个实用优先的 CSS 框架...\n\n## 配置优化\n\n合理的配置可以大幅提升开发效率...`,
        coverImage: 'https://picsum.photos/seed/tailwind/800/400',
        author: 'CSS 大师',
        views: 980,
        readTime: 6,
        isFeatured: true,
        isPublished: true,
        publishedAt: new Date('2025-01-20'),
      },
    }),
    prisma.article.create({
      data: {
        categoryId: articleCategories[0].id,
        title: 'Vue 3 Composition API 完全指南',
        slug: 'vue3-composition-api-guide',
        description: '从基础到进阶，全面掌握 Vue 3 Composition API 的使用技巧',
        content: `# Vue 3 Composition API 完全指南\n\n## 什么是 Composition API\n\nComposition API 是 Vue 3 引入的新特性...\n\n## setup 函数\n\nsetup 是组件的入口点...`,
        coverImage: 'https://picsum.photos/seed/vue3/800/400',
        author: 'Vue 专家',
        views: 850,
        readTime: 10,
        isFeatured: false,
        isPublished: true,
        publishedAt: new Date('2025-01-25'),
      },
    }),
    prisma.article.create({
      data: {
        categoryId: articleCategories[1].id,
        title: 'Node.js 性能优化实战',
        slug: 'nodejs-performance-optimization',
        description: '从代码层面到架构设计，全方位优化 Node.js 应用性能',
        content: `# Node.js 性能优化实战\n\n## 性能分析工具\n\n使用正确的工具是性能优化的第一步...\n\n## 常见性能瓶颈\n\n1. 阻塞事件循环\n2. 内存泄漏\n3. 数据库查询优化`,
        coverImage: 'https://picsum.photos/seed/nodejs/800/400',
        author: '后端架构师',
        views: 720,
        readTime: 12,
        isFeatured: true,
        isPublished: true,
        publishedAt: new Date('2025-01-28'),
      },
    }),
    prisma.article.create({
      data: {
        categoryId: articleCategories[1].id,
        title: 'MySQL 索引优化完全指南',
        slug: 'mysql-index-optimization',
        description: '深入理解 MySQL 索引原理，掌握索引优化技巧',
        content: `# MySQL 索引优化完全指南\n\n## 索引的基本原理\n\nMySQL 使用 B+Tree 作为索引结构...\n\n## 索引优化策略\n\n1. 选择合适的索引类型\n2. 避免索引失效\n3. 覆盖索引的应用`,
        coverImage: 'https://picsum.photos/seed/mysql/800/400',
        author: 'DBA 老王',
        views: 650,
        readTime: 15,
        isFeatured: false,
        isPublished: true,
        publishedAt: new Date('2025-02-01'),
      },
    }),
    prisma.article.create({
      data: {
        categoryId: articleCategories[2].id,
        title: '2025 年 UI 设计趋势预测',
        slug: 'ui-design-trends-2025',
        description: '探索 2025 年最热门的 UI 设计趋势和技术',
        content: `# 2025 年 UI 设计趋势预测\n\n## 新拟态设计的进化\n\n新拟态设计在 2025 年将更加成熟...\n\n## 3D 元素的广泛应用\n\n随着技术的发展，3D 元素变得更加常见...`,
        coverImage: 'https://picsum.photos/seed/uidesign/800/400',
        author: '设计师小美',
        views: 580,
        readTime: 7,
        isFeatured: true,
        isPublished: true,
        publishedAt: new Date('2025-02-05'),
      },
    }),
    prisma.article.create({
      data: {
        categoryId: articleCategories[3].id,
        title: 'ChatGPT 提示词工程完全指南',
        slug: 'chatgpt-prompt-engineering',
        description: '掌握 ChatGPT 提示词技巧，让 AI 更好地为你服务',
        content: `# ChatGPT 提示词工程完全指南\n\n## 什么是提示词工程\n\n提示词工程是与 AI 交互的艺术...\n\n## 核心技巧\n\n1. 明确角色定位\n2. 提供上下文\n3. 分步骤引导`,
        coverImage: 'https://picsum.photos/seed/chatgpt/800/400',
        author: 'AI 探索者',
        views: 2100,
        readTime: 9,
        isFeatured: true,
        isPublished: true,
        publishedAt: new Date('2025-02-08'),
      },
    }),
    prisma.article.create({
      data: {
        categoryId: articleCategories[4].id,
        title: '程序员必备的 10 个效率工具',
        slug: 'top-10-productivity-tools',
        description: '提升开发效率的 10 个神器，让你事半功倍',
        content: `# 程序员必备的 10 个效率工具\n\n## 1. VS Code 插件推荐\n\n优秀的插件可以大幅提升编码效率...\n\n## 2. 终端增强工具\n\nOh My Zsh + Powerlevel10k 让终端更强大...`,
        coverImage: 'https://picsum.photos/seed/tools/800/400',
        author: '效率达人',
        views: 890,
        readTime: 6,
        isFeatured: false,
        isPublished: true,
        publishedAt: new Date('2025-02-10'),
      },
    }),
  ])
  console.log(`✅ 创建了 ${articles.length} 篇文章\n`)

  // ==================== 创建文章-标签关联 ====================
  console.log('🔗 创建文章-标签关联...')
  await Promise.all([
    // React 19 文章
    prisma.articleTag.create({ data: { articleId: articles[0].id, tagId: tags.find(t => t.slug === 'react')!.id } }),
    prisma.articleTag.create({ data: { articleId: articles[0].id, tagId: tags.find(t => t.slug === 'javascript')!.id } }),
    // Tailwind 文章
    prisma.articleTag.create({ data: { articleId: articles[1].id, tagId: tags.find(t => t.slug === 'tailwindcss')!.id } }),
    prisma.articleTag.create({ data: { articleId: articles[1].id, tagId: tags.find(t => t.slug === 'css')!.id } }),
    // Vue 3 文章
    prisma.articleTag.create({ data: { articleId: articles[2].id, tagId: tags.find(t => t.slug === 'vue')!.id } }),
    prisma.articleTag.create({ data: { articleId: articles[2].id, tagId: tags.find(t => t.slug === 'javascript')!.id } }),
    // Node.js 文章
    prisma.articleTag.create({ data: { articleId: articles[3].id, tagId: tags.find(t => t.slug === 'nodejs')!.id } }),
    // MySQL 文章
    prisma.articleTag.create({ data: { articleId: articles[4].id, tagId: tags.find(t => t.slug === 'mysql')!.id } }),
    // UI 设计文章
    prisma.articleTag.create({ data: { articleId: articles[5].id, tagId: tags.find(t => t.slug === 'ui-design')!.id } }),
    // ChatGPT 文章
    prisma.articleTag.create({ data: { articleId: articles[6].id, tagId: tags.find(t => t.slug === 'ai')!.id } }),
  ])
  console.log('✅ 创建文章标签关联完成\n')

  // ==================== 创建管理员用户 ====================
  console.log('👤 创建管理员用户...')
  const hashedPassword = await bcrypt.hash('admin123', 10)
  const admin = await prisma.user.create({
    data: {
      username: 'admin',
      password: hashedPassword,
      email: 'admin@zetu-nav.com',
      nickname: '超级管理员',
      role: 'admin',
      isActive: true,
    },
  })
  console.log('✅ 创建管理员用户完成\n')

  // ==================== 汇总 ====================
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
  console.log('🎉 数据填充完成！\n')
  console.log('📊 数据统计：')
  console.log(`   • ${tags.length} 个标签`)
  console.log(`   • ${categories.length} 个导航分类`)
  console.log(`   • ${hotWebsites.length + toolWebsites.length + designWebsites.length + devWebsites.length + aiWebsites.length} 个导航网站`)
  console.log(`   • ${articleCategories.length} 个文章分类`)
  console.log(`   • ${articles.length} 篇文章`)
  console.log(`   • 1 个管理员账号`)
  console.log('\n🔑 管理员登录信息：')
  console.log('   用户名: admin')
  console.log('   密码:   admin123')
  console.log('   邮箱:   admin@zetu-nav.com')
  console.log('\n💡 提示：')
  console.log('   • 运行 "npx prisma studio" 查看数据')
  console.log('   • 图片使用 Picsum 占位图（后续可在 COS 替换）')
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n')
}

main()
  .catch((e) => {
    console.error('❌ 填充数据时出错：', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })

