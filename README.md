# 🚀 导航网站

一个基于 Next.js 14 的全栈导航网站项目架构。

## 📦 技术栈

- **前端框架**: Next.js 14 (App Router)
- **开发语言**: TypeScript
- **样式方案**: Tailwind CSS
- **数据库 ORM**: Prisma
- **数据库**: PostgreSQL / MySQL / SQLite
- **包管理器**: npm / yarn / pnpm

## 📁 项目结构

```
Design/
├── src/
│   ├── app/                    # Next.js 应用目录
│   │   ├── api/               # API 路由
│   │   │   ├── health/        # 健康检查接口
│   │   │   ├── categories/    # 分类相关接口
│   │   │   └── websites/      # 网站相关接口
│   │   ├── admin/             # 管理后台页面
│   │   ├── layout.tsx         # 根布局
│   │   ├── page.tsx           # 首页
│   │   └── globals.css        # 全局样式
│   ├── components/            # 组件目录
│   │   ├── ui/               # UI 组件
│   │   └── layout/           # 布局组件
│   ├── lib/                  # 工具函数库
│   │   └── prisma.ts         # Prisma 客户端
│   ├── types/                # TypeScript 类型定义
│   │   └── index.ts
│   └── config/               # 配置文件
│       └── site.ts           # 网站配置
├── prisma/
│   └── schema.prisma         # 数据库模型定义
├── public/                   # 静态资源
├── .gitignore               # Git 忽略文件
├── next.config.js           # Next.js 配置
├── tailwind.config.ts       # Tailwind 配置
├── tsconfig.json            # TypeScript 配置
├── package.json             # 依赖管理
└── README.md                # 项目说明
```

## 🚀 快速开始

### 1. 安装依赖

```bash
npm install
```

或使用其他包管理器：

```bash
yarn install
# 或
pnpm install
```

### 2. 配置环境变量

复制 `.env.example` 为 `.env` 并配置数据库连接：

```env
DATABASE_URL="postgresql://username:password@localhost:5432/navigation_db"
```

### 3. 初始化数据库

```bash
# 生成 Prisma 客户端
npm run prisma:generate

# 同步数据库结构（开发环境）
npm run prisma:push
```

### 4. 启动开发服务器

```bash
npm run dev
```

访问 [http://localhost:3000](http://localhost:3000) 查看效果。

## 📝 可用命令

```bash
npm run dev          # 启动开发服务器
npm run build        # 构建生产版本
npm run start        # 启动生产服务器
npm run lint         # 运行代码检查

# Prisma 相关命令
npm run prisma:generate  # 生成 Prisma 客户端
npm run prisma:push      # 同步数据库结构
npm run prisma:studio    # 打开数据库管理界面
```

## 🔌 API 接口

项目已经预设了基础的 API 路由结构：

- `GET /api/health` - 健康检查
- `GET /api/categories` - 获取分类列表
- `POST /api/categories` - 创建分类
- `GET /api/websites` - 获取网站列表
- `POST /api/websites` - 创建网站

## 📄 数据库模型

已在 `prisma/schema.prisma` 中定义了基础模型：

- **Category** - 分类表
- **Website** - 网站表

## 🎨 页面结构

- `/` - 首页（前台展示）
- `/admin` - 管理后台

## ⚙️ 配置说明

### Next.js 配置

在 `next.config.js` 中可以配置：
- 图片域名白名单
- 环境变量
- 其他 Next.js 选项

### Tailwind CSS 配置

在 `tailwind.config.ts` 中可以：
- 自定义颜色
- 添加自定义工具类
- 配置插件

### 网站配置

在 `src/config/site.ts` 中可以配置：
- 网站名称和描述
- 功能开关
- 分页设置

## 🛠️ 开发建议

1. 组件放在 `src/components/` 目录下
2. 工具函数放在 `src/lib/` 目录下
3. 类型定义放在 `src/types/` 目录下
4. API 路由放在 `src/app/api/` 目录下
5. 页面文件放在 `src/app/` 目录下

## 📚 技术文档

- [Next.js 官方文档](https://nextjs.org/docs)
- [React 官方文档](https://react.dev)
- [TypeScript 官方文档](https://www.typescriptlang.org/docs)
- [Tailwind CSS 官方文档](https://tailwindcss.com/docs)
- [Prisma 官方文档](https://www.prisma.io/docs)

## 📝 待开发功能

- [ ] 用户认证系统
- [ ] 分类管理 CRUD
- [ ] 网站管理 CRUD
- [ ] 搜索功能
- [ ] 点击统计
- [ ] 数据导入导出
- [ ] 响应式设计优化

## 📄 License

MIT

---

**注意**: 这是一个基础项目架构，具体业务功能需要根据实际需求进行开发。

