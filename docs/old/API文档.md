# API 接口文档

## 📋 接口概览

### 导航系统
- `GET  /api/categories` - 获取导航分类列表
- `GET  /api/websites` - 获取网站列表
- `POST /api/websites/[id]/click` - 记录网站点击

### 文章系统
- `GET  /api/article-categories` - 获取文章分类列表
- `GET  /api/articles` - 获取文章列表
- `GET  /api/articles/[slug]` - 获取文章详情
- `POST /api/articles/[slug]/view` - 记录文章浏览

### 标签系统
- `GET  /api/tags` - 获取标签列表

---

## 🔍 详细说明

### 1. 获取导航分类列表

**接口地址：** `GET /api/categories`

**请求示例：**
```bash
curl http://localhost:3000/api/categories
```

**响应示例：**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "name": "热门推荐",
      "slug": "hot",
      "icon": "🔥",
      "description": "最受欢迎的网站和工具",
      "cardsPerRow": 6,
      "websiteCount": 12
    }
  ]
}
```

---

### 2. 获取网站列表

**接口地址：** `GET /api/websites`

**查询参数：**
- `categorySlug` (可选) - 按分类筛选，如：`hot`、`tools`
- `limit` (可选) - 限制返回数量

**请求示例：**
```bash
# 获取所有网站
curl http://localhost:3000/api/websites

# 获取热门推荐分类的网站
curl http://localhost:3000/api/websites?categorySlug=hot

# 获取前10个网站
curl http://localhost:3000/api/websites?limit=10
```

**响应示例：**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "name": "GitHub",
      "description": "全球最大的代码托管平台",
      "url": "https://github.com",
      "logoUrl": "https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png",
      "clickCount": 1520,
      "category": {
        "name": "热门推荐",
        "slug": "hot",
        "icon": "🔥",
        "cardsPerRow": 6
      },
      "tags": [
        {
          "name": "JavaScript",
          "slug": "javascript",
          "color": "#F7DF1E"
        }
      ]
    }
  ],
  "total": 40
}
```

---

### 3. 记录网站点击

**接口地址：** `POST /api/websites/[id]/click`

**路径参数：**
- `id` - 网站ID

**请求示例：**
```bash
curl -X POST http://localhost:3000/api/websites/1/click
```

**响应示例：**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "name": "GitHub",
    "clickCount": 1521
  }
}
```

---

### 4. 获取文章分类列表

**接口地址：** `GET /api/article-categories`

**请求示例：**
```bash
curl http://localhost:3000/api/article-categories
```

**响应示例：**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "name": "前端开发",
      "slug": "frontend",
      "icon": "⚛️",
      "description": "React、Vue、CSS 等前端技术",
      "articleCount": 3
    }
  ]
}
```

---

### 5. 获取文章列表

**接口地址：** `GET /api/articles`

**查询参数：**
- `categorySlug` (可选) - 按分类筛选，如：`frontend`、`backend`、`all`
- `featured` (可选) - 只获取精选文章，值：`true` 或 `false`
- `limit` (可选) - 每页数量，默认 20
- `page` (可选) - 页码，默认 1

**请求示例：**
```bash
# 获取所有文章
curl http://localhost:3000/api/articles

# 获取前端分类的文章
curl http://localhost:3000/api/articles?categorySlug=frontend

# 获取精选文章
curl http://localhost:3000/api/articles?featured=true

# 分页获取（第2页，每页10条）
curl http://localhost:3000/api/articles?page=2&limit=10
```

**响应示例：**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "title": "React 19 新特性深度解析",
      "slug": "react-19-new-features",
      "description": "深入了解 React 19 带来的革命性特性",
      "coverImage": "https://picsum.photos/seed/react19/800/400",
      "author": "前端小智",
      "views": 1520,
      "readTime": 8,
      "isFeatured": true,
      "publishedAt": "2025-01-15T00:00:00.000Z",
      "category": {
        "name": "前端开发",
        "slug": "frontend",
        "icon": "⚛️"
      },
      "tags": [
        {
          "name": "React",
          "slug": "react",
          "color": "#61DAFB"
        }
      ]
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 8,
    "totalPages": 1
  }
}
```

---

### 6. 获取文章详情

**接口地址：** `GET /api/articles/[slug]`

**路径参数：**
- `slug` - 文章URL标识

**请求示例：**
```bash
curl http://localhost:3000/api/articles/react-19-new-features
```

**响应示例：**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "title": "React 19 新特性深度解析",
    "slug": "react-19-new-features",
    "description": "深入了解 React 19 带来的革命性特性",
    "content": "# React 19 新特性深度解析\n\n## 前言\n\nReact 19 是...",
    "coverImage": "https://picsum.photos/seed/react19/800/400",
    "author": "前端小智",
    "views": 1520,
    "readTime": 8,
    "isFeatured": true,
    "publishedAt": "2025-01-15T00:00:00.000Z",
    "updatedAt": "2025-01-15T10:30:00.000Z",
    "category": {
      "name": "前端开发",
      "slug": "frontend",
      "icon": "⚛️"
    },
    "tags": [
      {
        "name": "React",
        "slug": "react",
        "color": "#61DAFB"
      }
    ],
    "relatedArticles": [
      {
        "id": 2,
        "title": "Tailwind CSS 最佳实践指南",
        "slug": "tailwind-css-best-practices",
        "description": "从项目配置到组件封装...",
        "coverImage": "https://picsum.photos/seed/tailwind/800/400",
        "author": "CSS 大师",
        "views": 980,
        "readTime": 6,
        "publishedAt": "2025-01-20T00:00:00.000Z"
      }
    ]
  }
}
```

---

### 7. 记录文章浏览

**接口地址：** `POST /api/articles/[slug]/view`

**路径参数：**
- `slug` - 文章URL标识

**请求示例：**
```bash
curl -X POST http://localhost:3000/api/articles/react-19-new-features/view
```

**响应示例：**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "title": "React 19 新特性深度解析",
    "slug": "react-19-new-features",
    "views": 1521
  }
}
```

---

### 8. 获取标签列表

**接口地址：** `GET /api/tags`

**查询参数：**
- `popular` (可选) - 只获取热门标签，值：`true` 或 `false`
- `limit` (可选) - 限制返回数量

**请求示例：**
```bash
# 获取所有标签
curl http://localhost:3000/api/tags

# 获取热门标签（前20个）
curl http://localhost:3000/api/tags?popular=true

# 获取前10个标签
curl http://localhost:3000/api/tags?limit=10
```

**响应示例：**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "name": "React",
      "slug": "react",
      "color": "#61DAFB",
      "articleCount": 2,
      "websiteCount": 3,
      "totalUsage": 5
    }
  ]
}
```

---

## ❌ 错误响应格式

所有接口在出错时返回统一格式：

```json
{
  "success": false,
  "error": "错误信息描述"
}
```

**常见HTTP状态码：**
- `200` - 成功
- `400` - 请求参数错误
- `404` - 资源不存在
- `500` - 服务器内部错误

---

## 🧪 测试接口

### 使用浏览器测试（GET请求）

直接访问URL：
```
http://localhost:3000/api/categories
http://localhost:3000/api/websites
http://localhost:3000/api/articles
```

### 使用 curl 测试

```bash
# GET 请求
curl http://localhost:3000/api/categories

# POST 请求
curl -X POST http://localhost:3000/api/websites/1/click

# 带参数的 GET 请求
curl "http://localhost:3000/api/websites?categorySlug=hot&limit=10"
```

### 使用 Postman 或 Insomnia

导入以上接口进行测试。

---

## 📝 注意事项

1. **所有接口返回 JSON 格式**
2. **默认只返回已激活/已发布的数据**
3. **分页默认每页 20 条**
4. **日期格式为 ISO 8601**
5. **图片URL为完整地址（COS或Picsum占位图）**

---

**接口已全部就绪，可以开始前端对接！** 🚀

