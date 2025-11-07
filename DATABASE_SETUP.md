# 数据库配置与建表指南

## 📋 第一步：配置环境变量

### 1. 创建 `.env.local` 文件

在项目根目录创建 `.env.local` 文件（和 `package.json` 同级），复制以下内容：

```env
# ==================== 数据库配置 ====================
# MySQL 连接字符串
DATABASE_URL="mysql://zetu-nav:0dae0b6a05@111.231.204.182:3306/zetu-nav"

# ==================== 腾讯云 COS 配置 ====================
# 从腾讯云控制台获取: https://console.cloud.tencent.com/cam/capi

# API 密钥ID（把你现成的填进来）
COS_SECRET_ID="你的SecretId"

# API 密钥Key（把你现成的填进来）
COS_SECRET_KEY="你的SecretKey"

# 存储桶名称
COS_BUCKET="zetu-nav-1302966033"

# 地域（成都）
COS_REGION="ap-chengdu"

# 访问域名
COS_DOMAIN="https://zetu-nav-1302966033.cos.ap-chengdu.myqcloud.com"

# ==================== 应用配置 ====================
# 网站URL（暂时不用改）
NEXT_PUBLIC_SITE_URL="http://localhost:3000"

# JWT密钥（后台登录用，暂时不用改）
JWT_SECRET="zetu-nav-secret-key-2025"
```

### 2. 填写你的腾讯云 API 密钥

⚠️ **重要：把 `COS_SECRET_ID` 和 `COS_SECRET_KEY` 改成你的真实密钥！**

如果不知道在哪里找：
- 访问：https://console.cloud.tencent.com/cam/capi
- 你应该已经有了（你说你有现成的）
- 复制粘贴到 `.env.local` 文件里

---

## 🚀 第二步：安装依赖并生成 Prisma Client

在项目目录打开终端，运行：

```bash
npm install
```

这会安装 `@prisma/client` 和其他依赖。

---

## 🗄️ 第三步：执行数据库迁移（建表）

运行以下命令，Prisma 会自动连接数据库并创建所有表：

```bash
npx prisma migrate dev --name init
```

**会发生什么：**
1. Prisma 连接到你的 MySQL 数据库（`111.231.204.182`）
2. 自动创建以下 9 个表：
   - `categories` - 导航分类
   - `websites` - 导航网站
   - `article_categories` - 文章分类
   - `articles` - 文章
   - `tags` - 标签
   - `website_tags` - 网站-标签关联
   - `article_tags` - 文章-标签关联
   - `users` - 用户（后台管理员）
   - `_prisma_migrations` - Prisma 迁移记录（自动生成）

3. 生成 Prisma Client（用于代码里操作数据库）

**执行时间：约 10-20 秒**

---

## ✅ 第四步：验证是否成功

如果看到类似这样的输出，就成功了：

```
✔ Generated Prisma Client
✔ Applied migration 20251105_init

Your database is now in sync with your Prisma schema.
```

---

## 🎨 第五步：查看数据库（可选）

运行以下命令，打开 Prisma Studio（可视化数据库管理工具）：

```bash
npx prisma studio
```

- 会自动打开浏览器：`http://localhost:5555`
- 可以看到所有表
- 可以手动添加/编辑数据（临时测试用）

---

## 📊 数据库表结构说明

### 1. **categories** - 导航分类
- 存储「热门推荐」「常用工具」等分类
- `cards_per_row`：每行显示几个卡片（4/5/6）

### 2. **websites** - 导航网站
- 存储导航网站信息
- `logo_url`：存储 COS 图片链接（不存二进制）
- `click_count`：统计点击次数

### 3. **article_categories** - 文章分类
- 存储「前端开发」「后端开发」等文章分类

### 4. **articles** - 文章
- 存储文章内容
- `content`：Markdown 格式
- `cover_image`：存储 COS 图片链接

### 5. **tags** - 标签
- 存储「React」「Vue」等标签
- 可用于网站和文章

### 6. **website_tags** - 网站-标签关联（多对多）

### 7. **article_tags** - 文章-标签关联（多对多）

### 8. **users** - 管理员用户
- 存储后台登录账号
- `password`：会加密存储（bcrypt）

---

## ❓ 常见问题

### Q: 如果建表失败怎么办？

**可能原因：**
1. ❌ 数据库连接失败
   - 检查 `.env.local` 里的 `DATABASE_URL` 是否正确
   - 检查数据库服务器是否开放了 3306 端口

2. ❌ 权限不够
   - 检查 `zetu-nav` 用户是否有建表权限

3. ❌ 数据库不存在
   - 检查 `zetu-nav` 数据库是否已创建

**解决方法：**
```bash
# 测试数据库连接
npx prisma db pull
```

如果提示错误，复制错误信息告诉我。

---

### Q: 如何添加测试数据？

两种方法：

**方法1：用 Prisma Studio（推荐）**
```bash
npx prisma studio
```
在网页里手动添加。

**方法2：后续我会写数据填充脚本**
自动导入示例数据。

---

---

## 🌱 第六步：填充测试数据（重要！）

数据库建好了，但是是空的。需要填充测试数据才能看到效果。

### **方法1：自动填充（推荐）⭐⭐⭐⭐⭐**

运行以下命令，自动导入所有测试数据：

```bash
# 1. 安装新依赖
npm install

# 2. 运行数据填充脚本
npm run seed
```

**会自动创建：**
- ✅ 20 个标签（React、Vue、TypeScript 等）
- ✅ 8 个导航分类（热门推荐、常用工具等）
- ✅ 40+ 个导航网站（GitHub、Figma 等真实网站）
- ✅ 5 个文章分类（前端开发、后端开发等）
- ✅ 8 篇文章（含标题、内容、封面图）
- ✅ 1 个管理员账号

**管理员登录信息：**
- 用户名：`admin`
- 密码：`admin123`
- 邮箱：`admin@zetu-nav.com`

**执行时间：约 5-10 秒**

---

### **方法2：手动添加**

如果你想自己添加数据：

```bash
npx prisma studio
```

在网页里手动添加（http://localhost:5555）

---

## 🎯 完成后的下一步

数据填充完成后，我们就可以：
1. ✅ 开发 API 接口（`/api/websites` 等）
2. ✅ 前端连接真实数据（替换 mock 数据）
3. ✅ 开发后台管理界面
4. ✅ 集成 COS 图片上传

---

**有任何问题随时问我！** 🚀

