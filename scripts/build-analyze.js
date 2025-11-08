#!/usr/bin/env node

/**
 * 构建分析脚本
 * 分析 .next 文件夹的大小和构成
 */

const fs = require('fs')
const path = require('path')

function getDirectorySize(dir) {
  let size = 0
  const files = fs.readdirSync(dir)
  
  for (const file of files) {
    const filePath = path.join(dir, file)
    const stats = fs.statSync(filePath)
    
    if (stats.isDirectory()) {
      size += getDirectorySize(filePath)
    } else {
      size += stats.size
    }
  }
  
  return size
}

function formatSize(bytes) {
  if (bytes < 1024) return bytes + ' B'
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(2) + ' KB'
  return (bytes / (1024 * 1024)).toFixed(2) + ' MB'
}

function analyzeBuild() {
  const nextDir = path.join(process.cwd(), '.next')
  
  if (!fs.existsSync(nextDir)) {
    console.log('❌ .next 文件夹不存在，请先运行 npm run build')
    return
  }
  
  console.log('\n📊 构建产物分析\n')
  console.log('='.repeat(60))
  
  const items = fs.readdirSync(nextDir)
  const sizes = []
  
  for (const item of items) {
    const itemPath = path.join(nextDir, item)
    const stats = fs.statSync(itemPath)
    
    if (stats.isDirectory()) {
      const size = getDirectorySize(itemPath)
      sizes.push({ name: item, size, type: 'dir' })
    } else {
      sizes.push({ name: item, size: stats.size, type: 'file' })
    }
  }
  
  // 排序
  sizes.sort((a, b) => b.size - a.size)
  
  // 显示结果
  let totalSize = 0
  for (const item of sizes) {
    const icon = item.type === 'dir' ? '📁' : '📄'
    console.log(`${icon} ${item.name.padEnd(30)} ${formatSize(item.size)}`)
    totalSize += item.size
  }
  
  console.log('='.repeat(60))
  console.log(`\n✅ 总大小: ${formatSize(totalSize)}\n`)
  
  // 给出建议
  if (totalSize > 100 * 1024 * 1024) {
    console.log('⚠️  构建产物偏大（> 100MB），建议：')
    console.log('   1. 检查是否启用了 productionBrowserSourceMaps')
    console.log('   2. 检查是否有大型依赖库未做按需导入')
    console.log('   3. 运行: npm run build:analyze 查看详细包分析')
  } else if (totalSize > 50 * 1024 * 1024) {
    console.log('ℹ️  构建产物大小正常（50-100MB）')
  } else {
    console.log('✅ 构建产物大小优秀（< 50MB）')
  }
  
  console.log()
}

analyzeBuild()

