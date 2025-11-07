/**
 * UI配置表初始化脚本
 * 解决 ui_settings 表和 Prisma Client 的问题
 */

const { PrismaClient } = require('@prisma/client')

async function main() {
  const prisma = new PrismaClient()

  try {
    console.log('🔍 1. 检查 ui_settings 表是否存在...')
    
    // 尝试查询
    try {
      const settings = await prisma.uiSettings.findFirst()
      console.log('✅ ui_settings 表已存在')
      
      if (!settings) {
        console.log('📝 2. 创建默认配置...')
        await prisma.uiSettings.create({
          data: {
            heroStyle: '1',
          },
        })
        console.log('✅ 默认配置创建成功')
      } else {
        console.log('✅ 配置已存在:', settings)
      }
    } catch (error) {
      console.error('❌ ui_settings 表不存在或 Prisma Client 未更新')
      console.error('错误:', error.message)
      console.log('')
      console.log('🔧 解决方案：')
      console.log('1. 停止开发服务器 (Ctrl+C)')
      console.log('2. 运行: npx prisma db push')
      console.log('3. 运行: npx prisma generate')
      console.log('4. 重启服务器: npm run dev')
      process.exit(1)
    }

    console.log('')
    console.log('🎉 所有检查通过！')
    console.log('💡 如果保存还报错，请：')
    console.log('   1. 停止开发服务器 (Ctrl+C)')
    console.log('   2. 运行: npx prisma generate')
    console.log('   3. 重启: npm run dev')
    
  } catch (error) {
    console.error('❌ 发生错误:', error)
    process.exit(1)
  } finally {
    await prisma.$disconnect()
  }
}

main()

