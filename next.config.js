/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    // 允许的图片域名
    domains: [
      'picsum.photos', // 占位图服务
      'via.placeholder.com', // 占位图服务
      'avatars.githubusercontent.com', // GitHub头像
      'zetu-nav-1302966033.cos.ap-chengdu.myqcloud.com', // 腾讯云COS
    ],
    // 允许所有外部图片（开发环境方便，生产环境建议限制）
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
  },
}

module.exports = nextConfig
