@echo off
chcp 65001 > nul
echo ========================================
echo   Next.js 项目清理和优化构建
echo ========================================
echo.

REM 1. 清理旧的构建产物
echo 🗑️  清理旧的构建产物...
if exist .next rmdir /s /q .next
if exist out rmdir /s /q out
if exist node_modules\.cache rmdir /s /q node_modules\.cache
echo ✅ 清理完成
echo.

REM 2. 重新构建
echo 📦 开始构建...
call npm run build
if errorlevel 1 (
    echo ❌ 构建失败！
    exit /b 1
)

echo.
echo ✅ 构建成功！
echo.

REM 3. 分析构建产物
echo 📊 分析构建产物大小...
call npm run build:analyze

echo.
echo ========================================
echo   优化完成！
echo ========================================
pause

