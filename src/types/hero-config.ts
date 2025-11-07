/**
 * Hero样式配置类型定义
 */

// 样式4：极简打字机配置
export interface HeroStyle4Config {
  searchScenarios: string[]  // 打字机显示的文字数组
}

// 样式2：3D卡片堆叠配置
export interface HeroStyle2Config {
  popularSites: Array<{
    name: string
    icon: string
    url: string
    bg: string
  }>
}

// 样式3：科技网格配置
export interface HeroStyle3Config {
  title: string
  popularTags: Array<{
    name: string
    icon: string
    color: string
  }>
  quickCategories: Array<{
    name: string
    icon: string
    color: string
  }>
}

// Hero配置联合类型
export interface HeroConfig {
  style1?: any  // 样式1暂无配置
  style2?: HeroStyle2Config
  style3?: HeroStyle3Config
  style4?: HeroStyle4Config
  style5?: any  // 样式5暂无配置
}

// 默认配置
export const defaultHeroConfigs: HeroConfig = {
  style2: {
    popularSites: [
      { name: 'GitHub', icon: '💻', url: 'https://github.com', bg: 'from-gray-700 to-gray-900' },
      { name: 'ChatGPT', icon: '🤖', url: 'https://chat.openai.com', bg: 'from-green-500 to-emerald-600' },
      { name: 'Figma', icon: '🎨', url: 'https://figma.com', bg: 'from-purple-500 to-pink-600' },
    ],
  },
  style3: {
    title: '🚀 探索全网优质资源',
    popularTags: [
      { name: 'AI工具', icon: '🤖', color: 'from-blue-500 to-cyan-500' },
      { name: '设计', icon: '🎨', color: 'from-pink-500 to-rose-500' },
      { name: '开发', icon: '💻', color: 'from-purple-500 to-indigo-500' },
      { name: '学习', icon: '📚', color: 'from-amber-500 to-orange-500' },
      { name: '效率', icon: '⚡', color: 'from-green-500 to-emerald-500' },
      { name: '娱乐', icon: '🎮', color: 'from-red-500 to-pink-500' },
    ],
    quickCategories: [
      { name: '热门', icon: '🔥', color: 'bg-gradient-to-r from-orange-500 to-red-500' },
      { name: '开发', icon: '💻', color: 'bg-gradient-to-r from-blue-500 to-indigo-500' },
      { name: '设计', icon: '🎨', color: 'bg-gradient-to-r from-purple-500 to-pink-500' },
      { name: 'AI', icon: '🤖', color: 'bg-gradient-to-r from-green-500 to-teal-500' },
    ],
  },
  style4: {
    searchScenarios: ['GitHub', '设计工具', 'AI助手', '学习资源', '开发框架', '在线工具'],
  },
}

