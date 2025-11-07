const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function seedNavigation() {
  try {
    // 清空现有数据
    await prisma.navigationMenu.deleteMany()
    console.log('🗑️  清空现有菜单数据')

    // 创建首页菜单
    const homeMenu = await prisma.navigationMenu.create({
      data: {
        name: '首页',
        href: 'http://localhost:3000/',
        icon: '🏠',
        sortOrder: 0,
        isActive: true,
        openInNewTab: false,
      },
    })
    console.log('✅ 创建首页菜单:', homeMenu)

    // 创建资讯中心菜单
    const articlesMenu = await prisma.navigationMenu.create({
      data: {
        name: '资讯中心',
        href: 'http://localhost:3000/articles',
        icon: '📰',
        sortOrder: 1,
        isActive: true,
        openInNewTab: false,
      },
    })
    console.log('✅ 创建资讯中心菜单:', articlesMenu)

    console.log('\n🎉 导航菜单初始化完成！')
  } catch (error) {
    console.error('❌ 初始化失败:', error)
  } finally {
    await prisma.$disconnect()
  }
}

seedNavigation()

