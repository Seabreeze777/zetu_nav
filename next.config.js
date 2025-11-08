/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    // 允许所有外部图片域名
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
      {
        protocol: 'http',
        hostname: '**',
      },
    ],
    dangerouslyAllowSVG: true,
    // ✅ 图片缓存时间：7天（减少COS流量）
    minimumCacheTTL: 604800,
    // ⚠️ 开发环境禁用优化（避免加载问题），生产环境自动启用
    unoptimized: process.env.NODE_ENV === 'development',
  },
}

module.exports = nextConfig
