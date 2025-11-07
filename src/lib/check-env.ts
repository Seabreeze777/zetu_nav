/**
 * 环境变量检查工具
 * 在应用启动时验证必需的环境变量
 */

interface EnvConfig {
  key: string
  required: boolean
  description: string
}

const ENV_CONFIGS: EnvConfig[] = [
  {
    key: 'DATABASE_URL',
    required: true,
    description: 'MySQL数据库连接字符串',
  },
  {
    key: 'JWT_SECRET',
    required: true,
    description: 'JWT Token加密密钥（建议使用强随机字符串）',
  },
  {
    key: 'COS_SECRET_ID',
    required: false,
    description: '腾讯云COS SecretId（可选，用于图片上传）',
  },
  {
    key: 'COS_SECRET_KEY',
    required: false,
    description: '腾讯云COS SecretKey（可选，用于图片上传）',
  },
  {
    key: 'COS_BUCKET',
    required: false,
    description: '腾讯云COS存储桶名称（可选）',
  },
  {
    key: 'COS_REGION',
    required: false,
    description: '腾讯云COS区域（可选，如：ap-chengdu）',
  },
]

/**
 * 检查环境变量是否配置
 */
export function checkEnv() {
  console.log('🔍 开始检查环境变量...\n')

  const missingRequired: string[] = []
  const missingOptional: string[] = []

  ENV_CONFIGS.forEach(config => {
    const value = process.env[config.key]

    if (!value) {
      if (config.required) {
        missingRequired.push(config.key)
        console.error(`❌ ${config.key} - ${config.description}`)
      } else {
        missingOptional.push(config.key)
        console.warn(`⚠️  ${config.key} - ${config.description}`)
      }
    } else {
      console.log(`✅ ${config.key} - 已配置`)
    }
  })

  console.log('')

  // 如果缺少必需的环境变量，抛出错误
  if (missingRequired.length > 0) {
    console.error('\n❌ 错误：缺少必需的环境变量！\n')
    console.error('请在项目根目录创建 .env 文件，并配置以下变量：\n')
    missingRequired.forEach(key => {
      const config = ENV_CONFIGS.find(c => c.key === key)
      console.error(`${key}="${config?.description}"`)
    })
    console.error('\n参考 .env.example 文件获取完整配置示例\n')
    
    throw new Error(`缺少必需的环境变量: ${missingRequired.join(', ')}`)
  }

  // 警告缺少的可选变量
  if (missingOptional.length > 0) {
    console.warn('⚠️  警告：以下可选环境变量未配置：')
    missingOptional.forEach(key => {
      const config = ENV_CONFIGS.find(c => c.key === key)
      console.warn(`  - ${key}: ${config?.description}`)
    })
    console.warn('\n这些功能可能无法正常使用，如需启用请配置相应的环境变量\n')
  }

  console.log('✅ 环境变量检查完成！\n')
}

/**
 * 获取环境变量（带类型安全）
 */
export function getEnv(key: string, defaultValue?: string): string {
  const value = process.env[key]
  if (!value && !defaultValue) {
    throw new Error(`环境变量 ${key} 未设置且无默认值`)
  }
  return value || defaultValue || ''
}

/**
 * 检查是否为生产环境
 */
export function isProduction(): boolean {
  return process.env.NODE_ENV === 'production'
}

/**
 * 检查是否为开发环境
 */
export function isDevelopment(): boolean {
  return process.env.NODE_ENV === 'development'
}

