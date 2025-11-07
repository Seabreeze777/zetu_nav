# 📁 配置文件说明

## 项目中的配置文件

本项目提供了多个配置文件模板，帮助你快速在不同环境下部署。

---

## 📚 文档列表

| 文件名 | 说明 | 适用场景 |
|--------|------|---------|
| **快速配置指南.md** | ⚡ 3分钟快速配置 | 新手入门，快速上手 |
| **环境变量配置说明.md** | 🔧 详细的环境变量说明 | 理解原理，深入配置 |
| **部署指南-宝塔面板.md** | 🚀 完整的部署流程 | 生产环境部署 |
| **env.development.example** | 开发环境配置模板 | 复制为 `.env.development` |
| **env.production.example** | 生产环境配置模板 | 复制为 `.env.production` |
| **.env.example** | 通用配置模板 | 参考用 |

---

## 🚀 快速开始

### 第一次使用？

1. **阅读**：`快速配置指南.md`（3分钟）
2. **配置**：复制 `env.development.example` 为 `.env.development`
3. **启动**：`npm run dev`

### 准备部署到服务器？

1. **阅读**：`部署指南-宝塔面板.md`（10分钟）
2. **配置**：在服务器创建 `.env.production`
3. **部署**：按照部署指南执行

### 想深入了解环境变量？

阅读：`环境变量配置说明.md`

---

## 📝 配置文件使用流程

### 本地开发

```bash
# 1. 复制开发环境模板
cp env.development.example .env.development

# 2. 编辑配置（填入你的本地数据库、COS等）
nano .env.development

# 3. 启动开发服务器
npm run dev
```

### 服务器部署

```bash
# 1. SSH连接服务器
ssh root@你的服务器IP

# 2. 进入项目目录
cd /www/wwwroot/你的项目

# 3. 创建生产环境配置
nano .env.production
# 填入服务器数据库、域名等配置

# 4. 构建和启动
npm run build
pm2 start npm --name zetu -- start
```

---

## ⚠️ 重要提醒

### 🔒 安全相关

1. **不要提交 `.env` 文件到Git**
   - 已配置在 `.gitignore` 中
   - 包含敏感信息（数据库密码、密钥等）

2. **生产环境必须修改默认密钥**
   - `JWT_SECRET` 必须改为强随机密钥
   - 不能使用示例文件中的默认值

3. **保护你的配置文件**
   ```bash
   # Linux服务器设置文件权限
   chmod 600 .env.production
   ```

---

## 🔄 环境变量加载规则

Next.js 会按照以下优先级加载环境变量：

### 开发环境（npm run dev）

```
优先级从高到低：
1. .env.development.local（不提交Git）
2. .env.development ✅（提交Git，不含敏感信息）
3. .env.local（不提交Git）
4. .env（不提交Git）
```

### 生产环境（npm run build + start）

```
优先级从高到低：
1. .env.production.local（不提交Git）
2. .env.production ✅（提交Git，不含敏感信息）
3. .env.local（不提交Git）
4. .env（不提交Git）
```

---

## 📋 配置项说明

### 必需配置

| 配置项 | 说明 | 示例 |
|--------|------|------|
| `DATABASE_URL` | 数据库连接字符串 | `mysql://user:pass@host:3306/db` |
| `JWT_SECRET` | JWT加密密钥 | 64位随机字符串 |
| `COS_SECRET_ID` | 腾讯云COS ID | `AKIDxxxxx` |
| `COS_SECRET_KEY` | 腾讯云COS Key | `xxxxx` |
| `COS_BUCKET` | COS存储桶名称 | `mybucket-1234567890` |
| `COS_REGION` | COS地域 | `ap-beijing` |

### 可选配置

| 配置项 | 说明 | 默认值 |
|--------|------|--------|
| `NODE_ENV` | 环境标识 | `development` / `production` |
| `PORT` | 服务器端口 | `3000` |
| `ADMIN_DEFAULT_PASSWORD` | 管理员初始密码 | `Admin@123456` |
| `NEXT_PUBLIC_SITE_URL` | 网站完整URL | `http://localhost:3000` |

---

## 🛠️ 常用命令

### 生成JWT密钥

```bash
# Windows PowerShell
-join ((65..90) + (97..122) + (48..57) | Get-Random -Count 64 | % {[char]$_})

# Linux / Mac
openssl rand -base64 64
```

### 测试数据库连接

```bash
npx prisma db push
```

### 查看环境变量（调试用）

```bash
# 查看当前环境
echo $NODE_ENV

# 启动并显示环境变量
node -e "console.log(process.env)"
```

---

## 🎯 快速参考

### 问题1：为什么要创建.env文件？

**答**：`.env` 文件不会被打包，环境变量在构建时被注入代码，但文件本身不会复制到服务器。

### 问题2：可以用两个配置文件吗？

**答**：可以！`.env.development` 用于开发，`.env.production` 用于生产。

### 问题3：NEXT_PUBLIC_SITE_URL要改吗？

**答**：要改！开发环境用 `http://localhost:3000`，生产环境用 `https://你的域名.com`。

---

## 📞 需要帮助？

- **快速配置**：查看 `快速配置指南.md`
- **详细说明**：查看 `环境变量配置说明.md`
- **部署流程**：查看 `部署指南-宝塔面板.md`
- **联系方式**：
  - QQ：317881378
  - 微信：Seabreeze_888

---

**祝配置顺利！** 🎉

