// 测试 Prisma Client 是否正常
const { PrismaClient } = require('@prisma/client')

async function test() {
  const prisma = new PrismaClient()
  
  console.log('🔍 测试 1: 检查 prisma.uiSettings 是否存在')
  console.log('prisma.uiSettings:', typeof prisma.uiSettings)
  
  if (!prisma.uiSettings) {
    console.error('❌ prisma.uiSettings 不存在！')
    console.error('💡 解决：运行 npx prisma generate')
    process.exit(1)
  }
  
  console.log('✅ prisma.uiSettings 存在')
  
  try {
    console.log('\n🔍 测试 2: 尝试查询数据')
    const result = await prisma.uiSettings.findFirst()
    console.log('✅ 查询成功:', result)
    
    if (!result) {
      console.log('\n📝 测试 3: 创建默认数据')
      const created = await prisma.uiSettings.create({
        data: { heroStyle: '1' }
      })
      console.log('✅ 创建成功:', created)
    }
  } catch (error) {
    console.error('\n❌ 数据库操作失败:')
    console.error('错误信息:', error.message)
    console.error('\n💡 可能的原因:')
    console.error('1. 表不存在 - 运行: npx prisma db push')
    console.error('2. 数据库连接失败 - 检查 .env 中的 DATABASE_URL')
    console.error('3. Prisma Client 未更新 - 运行: npx prisma generate')
    process.exit(1)
  } finally {
    await prisma.$disconnect()
  }
  
  console.log('\n🎉 所有测试通过！')
}

test()

