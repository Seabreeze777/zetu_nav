#!/bin/bash

# 颜色定义
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}  Next.js 项目清理和优化构建${NC}"
echo -e "${GREEN}========================================${NC}"
echo ""

# 1. 清理旧的构建产物
echo -e "${YELLOW}🗑️  清理旧的构建产物...${NC}"
rm -rf .next
rm -rf out
rm -rf node_modules/.cache
echo -e "${GREEN}✅ 清理完成${NC}"
echo ""

# 2. 重新构建
echo -e "${YELLOW}📦 开始构建...${NC}"
npm run build
BUILD_STATUS=$?

if [ $BUILD_STATUS -ne 0 ]; then
  echo -e "${RED}❌ 构建失败！${NC}"
  exit 1
fi

echo ""
echo -e "${GREEN}✅ 构建成功！${NC}"
echo ""

# 3. 分析构建产物
echo -e "${YELLOW}📊 分析构建产物大小...${NC}"
npm run build:analyze

echo ""
echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}  优化完成！${NC}"
echo -e "${GREEN}========================================${NC}"

