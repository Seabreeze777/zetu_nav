const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

console.log('=== Prisma Client 可用模型 ===\n')

const allKeys = Object.keys(prisma)
const models = allKeys.filter(k => !k.startsWith('_') && !k.startsWith('$'))

console.log('模型列表:', models.sort().join(', '))
console.log('\n总共:', models.length, '个模型')

console.log('\n=== 检查 uiSettings ===')
console.log('uiSettings 存在:', 'uiSettings' in prisma)
console.log('类型:', typeof prisma.uiSettings)

if (!prisma.uiSettings) {
  console.log('\n❌ uiSettings 不存在！')
  console.log('\n可能的原因:')
  console.log('1. schema.prisma 中的 UISettings 模型有语法错误')
  console.log('2. Prisma Client 没有正确生成')
  console.log('3. node_modules/@prisma/client 缓存问题')
} else {
  console.log('\n✅ uiSettings 存在！')
}

process.exit(0)

