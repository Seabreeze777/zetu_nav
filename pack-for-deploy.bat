@echo off
chcp 65001 > nul
echo.
echo ========================================
echo   Next.js 项目打包（用于部署）
echo ========================================
echo.

REM 检查 .next 是否存在
if not exist .next (
    echo ❌ .next 文件夹不存在！
    echo 请先运行: npm run build
    pause
    exit /b 1
)

echo 📦 正在打包部署文件...
echo.

REM 删除旧的部署文件
if exist deploy-temp rmdir /s /q deploy-temp
if exist deploy.tar.gz del /f /q deploy.tar.gz
if exist deploy.zip del /f /q deploy.zip

REM 创建临时目录
mkdir deploy-temp

echo [1/8] 复制 .next/server...
xcopy .next\server deploy-temp\.next\server\ /E /I /Y /Q > nul

echo [2/8] 复制 .next/static...
xcopy .next\static deploy-temp\.next\static\ /E /I /Y /Q > nul

echo [3/8] 复制 .next 配置文件...
copy .next\*.json deploy-temp\.next\ > nul 2>&1
copy .next\BUILD_ID deploy-temp\.next\ > nul 2>&1
copy .next\package.json deploy-temp\.next\ > nul 2>&1

echo [4/8] 复制 public...
xcopy public deploy-temp\public\ /E /I /Y /Q > nul

echo [5/8] 复制 prisma...
xcopy prisma deploy-temp\prisma\ /E /I /Y /Q > nul

echo [6/8] 复制配置文件...
copy package.json deploy-temp\ > nul
copy package-lock.json deploy-temp\ > nul
copy next.config.js deploy-temp\ > nul
copy tsconfig.json deploy-temp\ > nul
if exist .env copy .env deploy-temp\ > nul

echo [7/8] 压缩文件...
cd deploy-temp
tar -czf ..\deploy.tar.gz . 2>nul
if errorlevel 1 (
    echo ⚠️  tar 命令不可用，使用 PowerShell 压缩...
    cd ..
    powershell -command "Compress-Archive -Path deploy-temp\* -DestinationPath deploy.zip -Force"
    set PACK_FILE=deploy.zip
) else (
    cd ..
    set PACK_FILE=deploy.tar.gz
)

echo [8/8] 清理临时文件...
rmdir /s /q deploy-temp

echo.
echo ========================================
echo   ✅ 打包完成！
echo ========================================
echo.
echo 📦 部署包: %PACK_FILE%
echo.

REM 显示文件大小
for %%F in (%PACK_FILE%) do (
    set size=%%~zF
    set /a size_mb=!size! / 1048576
    echo 📊 大小: !size_mb! MB
)

echo.
echo 📤 上传步骤:
echo    1. 上传 %PACK_FILE% 到服务器
echo    2. 解压: tar -xzf %PACK_FILE% （或 unzip deploy.zip）
echo    3. 安装依赖: npm install --production
echo    4. 生成 Prisma: npx prisma generate
echo    5. 启动: npm start
echo.
pause

