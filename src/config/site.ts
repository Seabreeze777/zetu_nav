/**
 * 网站全局配置
 * 这些配置会被系统配置管理覆盖（如果数据库中有配置）
 */

export const siteConfig = {
  name: '泽途网',
  description: '精选优质网站与资讯，为您提供高效的导航服务',
  keywords: '网站导航,优质网站,资讯中心,效率工具',
  url: 'https://zetu.com',
  ogImage: '/og-image.jpg',
  links: {
    github: 'https://github.com/Seabreeze777/zetu_nav',
  },
}

export type SiteConfig = typeof siteConfig
