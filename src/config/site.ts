// 网站配置文件

export const siteConfig = {
  name: '泽途网',
  description: '精选优质网站与资讯，为您提供高效的导航服务',
  url: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
  
  // 联系方式
  links: {
    github: '',
    email: '',
  },
  
  // 功能开关
  features: {
    auth: false,        // 用户认证
    search: true,       // 搜索功能
    statistics: true,   // 统计功能
  },
  
  // 分页配置
  pagination: {
    defaultPageSize: 20,
    maxPageSize: 100,
  },
}

export type SiteConfig = typeof siteConfig

