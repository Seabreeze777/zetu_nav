/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    // 允许所有外部图片域名（解决403/404错误）
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
    // 图片加载失败时的处理
    dangerouslyAllowSVG: true,
    contentDispositionType: 'attachment',
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    // 增加超时时间
    minimumCacheTTL: 60,
    // 禁用图片优化（避免外部图片403）
    unoptimized: true,
  },
}

module.exports = nextConfig
