/**
 * 模拟网站数据
 * 后续会从后台 API 获取
 */

export interface Website {
  id: string
  name: string
  description: string
  logo: string
  url: string
  tags: string[]
}

// 热门推荐（6 列布局 - 精简）
export const hotWebsites: Website[] = [
  { id: '1', name: 'ChatGPT', description: 'OpenAI 推出的 AI 对话助手，支持多种语言交互', logo: '🤖', url: 'https://chat.openai.com', tags: ['AI', '免费'] },
  { id: '2', name: 'Midjourney', description: 'AI 绘画工具，生成高质量艺术作品', logo: '🎨', url: 'https://midjourney.com', tags: ['AI', '设计'] },
  { id: '3', name: 'GitHub', description: '全球最大的代码托管平台', logo: '💻', url: 'https://github.com', tags: ['开发', '开源'] },
  { id: '4', name: 'Notion', description: '全能笔记和协作工具', logo: '📝', url: 'https://notion.so', tags: ['效率', '笔记'] },
  { id: '5', name: 'Figma', description: '在线协作设计工具', logo: '🎯', url: 'https://figma.com', tags: ['设计', '协作'] },
  { id: '6', name: 'Canva', description: '简单易用的设计工具', logo: '🖌️', url: 'https://canva.com', tags: ['设计', '模板'] },
  { id: '7', name: 'Vercel', description: '前端部署平台', logo: '▲', url: 'https://vercel.com', tags: ['部署', '前端'] },
  { id: '8', name: 'Linear', description: '现代化项目管理工具', logo: '📊', url: 'https://linear.app', tags: ['项目', '协作'] },
  { id: '9', name: 'Loom', description: '快速录屏分享工具', logo: '🎥', url: 'https://loom.com', tags: ['视频', '协作'] },
  { id: '10', name: 'Stripe', description: '在线支付解决方案', logo: '💳', url: 'https://stripe.com', tags: ['支付', '开发'] },
  { id: '11', name: 'Slack', description: '团队沟通协作平台', logo: '💬', url: 'https://slack.com', tags: ['沟通', '协作'] },
  { id: '12', name: 'Airtable', description: '云端协作数据库', logo: '🗄️', url: 'https://airtable.com', tags: ['数据库', '协作'] },
]

// 常用工具（5 列布局 - 中等）
export const toolsWebsites: Website[] = [
  { id: '1', name: 'TinyPNG', description: '在线图片压缩工具，支持 PNG 和 JPG 格式，压缩率高', logo: '🐼', url: 'https://tinypng.com', tags: ['图片', '压缩'] },
  { id: '2', name: 'Remove.bg', description: '一键去除图片背景，AI 自动识别前景主体', logo: '🖼️', url: 'https://remove.bg', tags: ['图片', 'AI'] },
  { id: '3', name: 'ColorHunt', description: '精美配色方案分享平台，设计师必备', logo: '🎨', url: 'https://colorhunt.co', tags: ['配色', '设计'] },
  { id: '4', name: 'Excalidraw', description: '手绘风格的在线白板工具', logo: '✏️', url: 'https://excalidraw.com', tags: ['白板', '设计'] },
  { id: '5', name: 'JSON Editor', description: '在线 JSON 格式化和编辑工具', logo: '{ }', url: 'https://jsoneditoronline.org', tags: ['开发', '工具'] },
  { id: '6', name: 'Regex101', description: '正则表达式测试和调试工具', logo: '🔍', url: 'https://regex101.com', tags: ['开发', '正则'] },
  { id: '7', name: 'Carbon', description: '代码转图片，支持多种主题和语言', logo: '📸', url: 'https://carbon.now.sh', tags: ['代码', '分享'] },
  { id: '8', name: 'Responsively', description: '多设备响应式预览工具', logo: '📱', url: 'https://responsively.app', tags: ['开发', '响应式'] },
  { id: '9', name: 'Squoosh', description: 'Google 出品的图片压缩工具', logo: '🗜️', url: 'https://squoosh.app', tags: ['图片', '压缩'] },
  { id: '10', name: 'Ray.so', description: '漂亮的代码截图生成工具', logo: '🌈', url: 'https://ray.so', tags: ['代码', '截图'] },
]

// 设计资源（4 列布局 - 大卡片）
export const designWebsites: Website[] = [
  { id: '1', name: 'Dribbble', description: '全球顶尖设计师作品分享平台，提供海量 UI/UX、插画、品牌设计等优质资源，是设计师获取灵感的首选社区', logo: '🏀', url: 'https://dribbble.com', tags: ['设计', '灵感', '社区'] },
  { id: '2', name: 'Behance', description: 'Adobe 旗下创意作品展示平台，汇集摄影、平面设计、插画等多领域作品，支持项目展示和创作者交流', logo: '🎯', url: 'https://behance.net', tags: ['作品集', '创意', 'Adobe'] },
  { id: '3', name: 'Unsplash', description: '免费高清图片素材库，由全球摄影师贡献，所有图片可商用无需授权，涵盖各类场景和主题', logo: '📷', url: 'https://unsplash.com', tags: ['图片', '免费', '商用'] },
  { id: '4', name: 'IconFinder', description: '全球最大的图标搜索引擎，提供数百万个高质量图标，支持 SVG、PNG 等多种格式下载', logo: '🔍', url: 'https://iconfinder.com', tags: ['图标', '素材', 'SVG'] },
  { id: '5', name: 'Awwwards', description: '表彰优秀网页设计的权威平台，每日评选最佳网站设计，是 Web 设计师的灵感宝库', logo: '🏆', url: 'https://awwwards.com', tags: ['网页', '获奖', '灵感'] },
  { id: '6', name: 'Pexels', description: '精选免费视频和图片素材，所有内容可商用，提供高质量 4K 视频和照片资源', logo: '🎬', url: 'https://pexels.com', tags: ['视频', '图片', '免费'] },
  { id: '7', name: 'FontShare', description: '免费字体分享平台，提供高质量免费商用字体，定期更新新字体', logo: '🔤', url: 'https://fontshare.com', tags: ['字体', '免费', '商用'] },
  { id: '8', name: 'Coolors', description: '快速生成配色方案的在线工具，支持导出多种格式，设计师配色首选', logo: '🎨', url: 'https://coolors.co', tags: ['配色', '工具', '设计'] },
]

// 精选大卡片数据
export interface FeaturedWebsite {
  id: string
  title: string
  description: string
  tags: string[]
  imageColor: string
  url: string
}

export const featuredWebsites: FeaturedWebsite[] = [
  {
    id: '1',
    title: '【深圳站】TikTok 跨境电商超级大会',
    description: '聚焦 TikTok Shop 最新政策解读、爆款选品策略、达人合作技巧、直播运营实战等核心议题。邀请头部卖家、MCN 机构、服务商共同探讨 TikTok 电商生态的机遇与挑战。',
    tags: ['TikTok', '跨境电商', '深圳', '11月7日'],
    imageColor: '#8B5CF6',
    url: '#',
  },
  {
    id: '2',
    title: 'AI 工具精选集 - 提升 10 倍工作效率',
    description: '精选全球最火的 AI 工具，涵盖文案写作、图片生成、视频剪辑、代码开发等多个领域。每个工具都经过实测，提供详细使用教程和最佳实践案例。',
    tags: ['AI 工具', '效率', '精选', '教程'],
    imageColor: '#3B82F6',
    url: '#',
  },
  {
    id: '3',
    title: '独立开发者资源导航 - 从 0 到 1 的完整指南',
    description: '汇集独立开发者必备的开发工具、设计资源、营销推广、变现平台等全套资源。包含域名购买、服务器部署、支付接入、用户增长等各环节的推荐方案。',
    tags: ['独立开发', '创业', '资源', '指南'],
    imageColor: '#10B981',
    url: '#',
  },
  {
    id: '4',
    title: '设计师灵感库 - 1000+ 优质案例精选',
    description: '收录全球顶尖设计作品，涵盖 UI/UX、品牌、插画、动效等多个设计领域。定期更新最新设计趋势，提供配色方案、字体推荐、排版技巧等实用干货。',
    tags: ['设计', '灵感', '案例', '教程'],
    imageColor: '#F59E0B',
    url: '#',
  },
  {
    id: '5',
    title: '跨境电商选品神器 - 数据驱动爆款挖掘',
    description: '集成多平台数据分析工具，实时追踪热门品类、爆款商品、市场趋势。提供选品评分系统、竞品分析报告、供应链对接等一站式选品解决方案。',
    tags: ['跨境电商', '选品', '数据分析', '工具'],
    imageColor: '#EF4444',
    url: '#',
  },
  {
    id: '6',
    title: 'Web3 学习路径 - 区块链开发完整教程',
    description: '从区块链基础到智能合约开发，从 DeFi 到 NFT，全面系统的 Web3 学习资源。包含 Solidity 编程、合约部署、前端集成等实战项目，助你快速入门 Web3 开发。',
    tags: ['Web3', '区块链', '教程', '开发'],
    imageColor: '#6366F1',
    url: '#',
  },
]

