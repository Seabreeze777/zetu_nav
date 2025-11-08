#!/usr/bin/env tsx

/**
 * 修复文章发布时间
 * 
 * 问题：之前的逻辑会在每次编辑时重置发布时间
 * 解决：对于已发布但没有发布时间的文章，使用创建时间作为发布时间
 */

import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🔍 检查文章发布时间...\n')

  // 查找所有已发布但没有发布时间的文章
  const articlesWithoutPublishedAt = await prisma.article.findMany({
    where: {
      isPublished: true,
      publishedAt: null,
    },
    select: {
      id: true,
      title: true,
      isPublished: true,
      publishedAt: true,
      createdAt: true,
      updatedAt: true,
    },
  })

  if (articlesWithoutPublishedAt.length === 0) {
    console.log('✅ 所有已发布的文章都有正确的发布时间！')
    return
  }

  console.log(`❌ 发现 ${articlesWithoutPublishedAt.length} 篇已发布但没有发布时间的文章：\n`)

  for (const article of articlesWithoutPublishedAt) {
    console.log(`文章 #${article.id}: "${article.title}"`)
    console.log(`  状态: 已发布`)
    console.log(`  发布时间: NULL ❌`)
    console.log(`  创建时间: ${article.createdAt.toISOString()}`)
    console.log(`  更新时间: ${article.updatedAt.toISOString()}`)
    console.log()
  }

  // 询问用户是否修复（在脚本环境中默认执行）
  console.log('📝 修复方案：使用创建时间作为发布时间\n')

  // 开始修复
  let fixedCount = 0

  for (const article of articlesWithoutPublishedAt) {
    try {
      await prisma.article.update({
        where: { id: article.id },
        data: {
          publishedAt: article.createdAt, // 使用创建时间
        },
      })

      console.log(`✅ 已修复：文章 #${article.id} "${article.title}"`)
      console.log(`   发布时间设置为：${article.createdAt.toISOString()}\n`)
      fixedCount++
    } catch (error) {
      console.error(`❌ 修复失败：文章 #${article.id}`, error)
    }
  }

  console.log('\n========================================')
  console.log('📊 修复统计')
  console.log('========================================')
  console.log(`需要修复：${articlesWithoutPublishedAt.length} 篇`)
  console.log(`修复成功：${fixedCount} 篇`)
  console.log(`修复失败：${articlesWithoutPublishedAt.length - fixedCount} 篇`)
  console.log('========================================\n')

  if (fixedCount === articlesWithoutPublishedAt.length) {
    console.log('✅ 所有文章发布时间已修复！')
  } else {
    console.log('⚠️ 部分文章修复失败，请检查错误信息。')
  }

  // 检查是否还有异常数据
  console.log('\n🔍 最终检查...\n')

  const remainingIssues = await prisma.article.count({
    where: {
      isPublished: true,
      publishedAt: null,
    },
  })

  if (remainingIssues === 0) {
    console.log('✅ 确认：所有已发布的文章都有正确的发布时间！')
  } else {
    console.log(`⚠️ 警告：还有 ${remainingIssues} 篇文章需要手动处理。`)
  }

  // 额外检查：草稿但有发布时间的文章（理论上不应该存在）
  const draftsWithPublishedAt = await prisma.article.findMany({
    where: {
      isPublished: false,
      publishedAt: { not: null },
    },
    select: {
      id: true,
      title: true,
      publishedAt: true,
    },
  })

  if (draftsWithPublishedAt.length > 0) {
    console.log(`\n⚠️ 发现 ${draftsWithPublishedAt.length} 篇草稿文章有发布时间（异常）：\n`)
    draftsWithPublishedAt.forEach(article => {
      console.log(`  - #${article.id}: "${article.title}" (${article.publishedAt?.toISOString()})`)
    })
    console.log('\n这些文章可能是之前发布后又取消发布的。')
    console.log('如果需要清理，请手动运行：')
    console.log('UPDATE articles SET published_at = NULL WHERE is_published = 0;\n')
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

