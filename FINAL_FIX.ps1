# 终极修复脚本 - 完全重置 Prisma
Write-Output "=== 🔥 终极修复：完全重置 Prisma ==="
Write-Output ""

Write-Output "📍 步骤 1/6: 停止所有进程..."
Write-Output "请确保已经停止了 npm run dev"
Read-Host "按回车继续"

Write-Output ""
Write-Output "📍 步骤 2/6: 删除所有缓存..."
if (Test-Path ".next") {
    Remove-Item -Recurse -Force .next
    Write-Output "✅ 删除 .next"
}
if (Test-Path "node_modules\.prisma") {
    Remove-Item -Recurse -Force "node_modules\.prisma"
    Write-Output "✅ 删除 node_modules\.prisma"
}
if (Test-Path "node_modules\@prisma") {
    Remove-Item -Recurse -Force "node_modules\@prisma"
    Write-Output "✅ 删除 node_modules\@prisma"
}

Write-Output ""
Write-Output "📍 步骤 3/6: 重新安装 Prisma..."
npm uninstall prisma @prisma/client
npm install -D prisma
npm install @prisma/client

Write-Output ""
Write-Output "📍 步骤 4/6: 同步数据库..."
npx prisma db push --skip-generate

Write-Output ""
Write-Output "📍 步骤 5/6: 生成 Prisma Client..."
npx prisma generate

Write-Output ""
Write-Output "📍 步骤 6/6: 验证修复..."
node verify-prisma.js

Write-Output ""
Write-Output "🎉 完成！现在运行："
Write-Output "   npm run dev"
Write-Output ""
Write-Output "然后刷新浏览器！"
