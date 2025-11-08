#!/bin/bash

GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

echo ""
echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}  Next.js 项目打包（用于部署）${NC}"
echo -e "${GREEN}========================================${NC}"
echo ""

# 检查 .next 是否存在
if [ ! -d ".next" ]; then
    echo -e "${RED}❌ .next 文件夹不存在！${NC}"
    echo "请先运行: npm run build"
    exit 1
fi

echo -e "${YELLOW}📦 正在打包部署文件...${NC}"
echo ""

# 删除旧的部署文件
rm -rf deploy-temp
rm -f deploy.tar.gz

# 创建临时目录
mkdir -p deploy-temp/.next

echo "[1/8] 复制 .next/server..."
cp -r .next/server deploy-temp/.next/

echo "[2/8] 复制 .next/static..."
cp -r .next/static deploy-temp/.next/

echo "[3/8] 复制 .next 配置文件..."
cp .next/*.json deploy-temp/.next/ 2>/dev/null || true
cp .next/BUILD_ID deploy-temp/.next/ 2>/dev/null || true
cp .next/package.json deploy-temp/.next/ 2>/dev/null || true

echo "[4/8] 复制 public..."
cp -r public deploy-temp/

echo "[5/8] 复制 prisma..."
cp -r prisma deploy-temp/

echo "[6/8] 复制配置文件..."
cp package.json deploy-temp/
cp package-lock.json deploy-temp/
cp next.config.js deploy-temp/
cp tsconfig.json deploy-temp/
[ -f .env ] && cp .env deploy-temp/

echo "[7/8] 压缩文件..."
tar -czf deploy.tar.gz -C deploy-temp .

echo "[8/8] 清理临时文件..."
rm -rf deploy-temp

echo ""
echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}  ✅ 打包完成！${NC}"
echo -e "${GREEN}========================================${NC}"
echo ""

# 显示文件大小
SIZE=$(du -sh deploy.tar.gz | cut -f1)
echo -e "📦 部署包: deploy.tar.gz"
echo -e "📊 大小: ${SIZE}"
echo ""
echo -e "📤 上传步骤:"
echo "   1. 上传 deploy.tar.gz 到服务器"
echo "   2. 解压: tar -xzf deploy.tar.gz"
echo "   3. 安装依赖: npm install --production"
echo "   4. 生成 Prisma: npx prisma generate"
echo "   5. 启动: npm start"
echo ""

