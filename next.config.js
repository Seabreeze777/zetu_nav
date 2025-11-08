/** @type {import('next').NextConfig} */
const nextConfig = {
  // ✅ 生产环境优化：禁用 source map（减少 50% 构建体积）
  productionBrowserSourceMaps: false,
  
  // ✅ 启用压缩
  compress: true,
  
  // ✅ 输出优化
  output: 'standalone', // 可选：生成独立部署包
  
  // ✅ 生产环境移除 console.log
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production' ? {
      exclude: ['error', 'warn'], // 保留 error 和 warn
    } : false,
  },
  
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
  
  // ✅ Webpack 优化配置
  webpack: (config, { isServer, dev }) => {
    // 生产环境优化
    if (!dev) {
      // 完全禁用 source map
      config.devtool = false
      
      // 优化分包策略
      config.optimization = {
        ...config.optimization,
        minimize: true,
        splitChunks: {
          chunks: 'all',
          cacheGroups: {
            default: false,
            vendors: false,
            // 公共代码块
            commons: {
              name: 'commons',
              minChunks: 2,
              priority: 10,
            },
            // React 相关
            react: {
              name: 'react',
              test: /[\\/]node_modules[\\/](react|react-dom|scheduler)[\\/]/,
              priority: 20,
            },
            // 其他 node_modules
            libs: {
              name: 'libs',
              test: /[\\/]node_modules[\\/]/,
              priority: 15,
            },
          },
        },
      }
    }
    
    return config
  },
}

module.exports = nextConfig
