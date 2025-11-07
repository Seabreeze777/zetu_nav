const {PrismaClient} = require('@prisma/client')
const p = new PrismaClient()
const keys = Object.keys(p).filter(k => !k.startsWith('_') && !k.startsWith('$'))
console.log('生成的模型:', keys.length, '个')
console.log('包含 uiSettings:', 'uiSettings' in p)
if ('uiSettings' in p) {
  console.log('✅✅✅ 修复成功！')
  process.exit(0)
} else {
  console.log('❌ 仍然失败，模型列表:', keys.join(', '))
  process.exit(1)
}

