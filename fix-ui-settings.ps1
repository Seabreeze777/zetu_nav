# UI配置问题一键修复脚本
# 自动完成所有修复步骤

Write-Output "=== 🔥 UI配置问题一键修复 ==="
Write-Output ""

# 检查是否有开发服务器在运行
$devProcess = Get-Process -Name "node" -ErrorAction SilentlyContinue | Where-Object { $_.CommandLine -like "*next dev*" }
if ($devProcess) {
    Write-Output "⚠️  检测到开发服务器正在运行"
    Write-Output "   请先在另一个终端按 Ctrl+C 停止它"
    Write-Output "   然后重新运行此脚本"
    Write-Output ""
    exit 1
}

Write-Output "📍 步骤 1/4: 删除 Next.js 缓存..."
if (Test-Path ".next") {
    Remove-Item -Recurse -Force .next
    Write-Output "✅ 缓存已删除"
} else {
    Write-Output "ℹ️  缓存不存在（正常）"
}
Write-Output ""

Write-Output "📍 步骤 2/4: 同步数据库..."
npx prisma db push
Write-Output ""

Write-Output "📍 步骤 3/4: 重新生成 Prisma Client..."
npx prisma generate
Write-Output ""

Write-Output "📍 步骤 4/4: 插入默认数据..."
$testCode = @"
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
prisma.uiSettings.findFirst().then(existing => {
  if (!existing) {
    return prisma.uiSettings.create({ data: { heroStyle: '1' } });
  }
  return existing;
}).then((result) => {
  console.log('✅ 数据就绪:', result);
  process.exit(0);
}).catch((e) => {
  console.error('错误:', e.message);
  process.exit(1);
});
"@

node -e $testCode
Write-Output ""

Write-Output "🎉 修复完成！"
Write-Output ""
Write-Output "📋 下一步："
Write-Output "   运行: npm run dev"
Write-Output "   然后刷新浏览器页面"
Write-Output ""

