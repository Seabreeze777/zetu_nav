# Git 推送失败：密钥泄露问题解决方案

## 🔴 问题描述

GitHub 的密钥扫描功能检测到了腾讯云 SecretID，拒绝推送：

```
remote: - GITHUB PUSH PROTECTION
remote:   Push cannot contain secrets
remote:   —— Tencent Cloud Secret ID ———————————————————————————
```

## 🔍 问题原因

在之前的 Git 提交历史中（可能是 `754b3a4 优化 1.05` 或更早的提交），包含了敏感的腾讯云密钥信息。

即使后来在 `.gitignore` 中添加了 `.env`，Git 历史中仍然保留着之前的敏感信息。

## ✅ 解决方案

### 方案1：清理 Git 历史并重新开始（推荐）

```bash
# 1. 备份当前代码
# （代码本身没问题，只是Git历史有问题）

# 2. 删除 .git 目录（清除历史）
Remove-Item -Recurse -Force .git

# 3. 重新初始化
git init

# 4. 确保 .gitignore 包含敏感文件
# .env
# .env.local
# .env*.local

# 5. 添加所有文件
git add .

# 6. 创建新的初始提交
git commit -m "feat: 泽途网导航系统初始化

- 网站管理（支持分类、标签、状态切换）
- 文章管理（Markdown编辑器）
- 媒体库（COS对象存储）
- 系统配置管理（可在后台修改COS等配置）
- 用户管理
- Toast通知系统
- Toggle开关组件"

# 7. 添加远程仓库
git remote add origin https://github.com/Seabreeze777/zetu_nav.git

# 8. 推送（强制覆盖）
git push -f origin main
```

### 方案2：使用 BFG Repo-Cleaner 清理历史

如果你想保留Git历史，可以使用工具清理敏感信息：

```bash
# 1. 安装 BFG
# 下载：https://rtyley.github.io/bfg-repo-cleaner/

# 2. 清理包含敏感信息的文件
java -jar bfg.jar --delete-files .env
java -jar bfg.jar --replace-text passwords.txt  # 包含要替换的密钥

# 3. 清理引用
git reflog expire --expire=now --all
git gc --prune=now --aggressive

# 4. 强制推送
git push -f origin main
```

## 🔐 安全建议

### 1. 立即更换泄露的密钥

前往腾讯云控制台：
- 禁用/删除被泄露的 SecretID 和 SecretKey
- 生成新的密钥对
- 更新本地 `.env` 文件

### 2. 检查敏感文件清单

确保以下文件在 `.gitignore` 中：

```
# 环境变量
.env
.env.local
.env.development.local
.env.test.local
.env.production.local

# 数据库
*.db
*.sqlite

# 日志
logs/
*.log

# 其他敏感文件
secrets/
private/
```

### 3. 使用系统配置管理

现在项目已经有了系统配置管理功能：
- 在后台 → 系统配置 → 初始化配置
- 将 COS 密钥存储在数据库中
- `.env` 只作为降级备份

## 📋 推送成功后的验证

```bash
# 1. 检查 GitHub 仓库
# 访问：https://github.com/Seabreeze777/zetu_nav

# 2. 确认没有敏感文件
git ls-files | grep -E "\.env|secret|password"

# 3. 确认 .gitignore 生效
git status --ignored
```

## 🎯 后续操作

1. **更新密钥**（重要！）
2. **推送代码**
3. **在后台初始化系统配置**
4. **测试COS上传功能**

---

**当前状态**：
- ✅ 代码已完成（系统配置页面布局已修复）
- ✅ `.gitignore` 已正确配置
- ❌ Git历史中包含敏感信息，需要清理
- ⏳ 等待推送到 GitHub

