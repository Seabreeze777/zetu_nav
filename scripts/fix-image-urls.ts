#!/usr/bin/env tsx

/**
 * 检查并修复数据库中的 COS 签名 URL
 * 
 * 问题：旧的图片使用了带签名的 COS URL，会在几小时后过期
 * 解决：将所有签名 URL 转换为公有读 URL
 */

import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🔍 检查数据库中的图片 URL...\n')

  // 检查文章封面图
  const articles = await prisma.article.findMany({
    select: {
      id: true,
      title: true,
      coverImage: true,
    },
  })

  let fixedArticles = 0
  for (const article of articles) {
    if (article.coverImage && article.coverImage.includes('q-sign-algorithm')) {
      console.log(`❌ 文章 #${article.id} "${article.title}" 使用了签名 URL`)
      
      // 转换为公有读 URL
      const url = new URL(article.coverImage)
      const publicUrl = `${url.protocol}//${url.host}${url.pathname}`
      
      await prisma.article.update({
        where: { id: article.id },
        data: { coverImage: publicUrl },
      })
      
      console.log(`   ✅ 已修复为：${publicUrl}\n`)
      fixedArticles++
    }
  }

  // 检查网站 logo
  const websites = await prisma.website.findMany({
    select: {
      id: true,
      name: true,
      logoUrl: true, // ✅ 正确的字段名是 logoUrl
    },
  })

  let fixedWebsites = 0
  for (const website of websites) {
    if (website.logoUrl && website.logoUrl.includes('q-sign-algorithm')) {
      console.log(`❌ 网站 #${website.id} "${website.name}" 使用了签名 URL`)
      
      // 转换为公有读 URL
      const url = new URL(website.logoUrl)
      const publicUrl = `${url.protocol}//${url.host}${url.pathname}`
      
      await prisma.website.update({
        where: { id: website.id },
        data: { logoUrl: publicUrl },
      })
      
      console.log(`   ✅ 已修复为：${publicUrl}\n`)
      fixedWebsites++
    }
  }

  // 检查媒体库
  const media = await prisma.media.findMany({
    select: {
      id: true,
      fileName: true,
      url: true,
    },
  })

  let fixedMedia = 0
  for (const item of media) {
    if (item.url.includes('q-sign-algorithm')) {
      console.log(`❌ 媒体 #${item.id} "${item.fileName}" 使用了签名 URL`)
      
      // 转换为公有读 URL
      const url = new URL(item.url)
      const publicUrl = `${url.protocol}//${url.host}${url.pathname}`
      
      await prisma.media.update({
        where: { id: item.id },
        data: { url: publicUrl },
      })
      
      console.log(`   ✅ 已修复为：${publicUrl}\n`)
      fixedMedia++
    }
  }

  console.log('\n========================================')
  console.log('📊 修复统计')
  console.log('========================================')
  console.log(`文章封面：${fixedArticles} 个`)
  console.log(`网站Logo：${fixedWebsites} 个`)
  console.log(`媒体文件：${fixedMedia} 个`)
  console.log(`总计修复：${fixedArticles + fixedWebsites + fixedMedia} 个`)
  console.log('========================================\n')

  if (fixedArticles + fixedWebsites + fixedMedia === 0) {
    console.log('✅ 所有图片 URL 都是正常的！')
  } else {
    console.log('✅ 修复完成！图片不会再过期了！')
  }
}

main()
  .catch((e) => {
    console.error('❌ 执行失败:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })

