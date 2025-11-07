# 媒体库系统安装与配置指南

## 🎯 系统概述

泽途网媒体库系统已完成开发，提供以下功能：
- ✅ 腾讯云COS对象存储集成
- ✅ 文件上传（拖拽/点击）
- ✅ 媒体库管理（浏览、搜索、删除）
- ✅ 通用图片选择器组件
- ✅ 自动图片尺寸检测
- ✅ 文件夹分类管理

---

## 📦 依赖安装

### 1. 安装必需的 npm 包

```bash
npm install cos-nodejs-sdk-v5 sharp
```

**说明**：
- `cos-nodejs-sdk-v5`: 腾讯云COS官方SDK
- `sharp`: 图片处理库（获取尺寸、压缩等）

---

## ⚙️ 环境配置

### 2. 配置环境变量

在项目根目录的 `.env` 文件中添加以下配置：

```env
# 腾讯云COS配置
COS_SECRET_ID=your-secret-id-here
COS_SECRET_KEY=your-secret-key-here
COS_BUCKET=your-bucket-name
COS_REGION=ap-beijing
```

### 3. 获取腾讯云COS凭证

访问 [腾讯云COS控制台](https://console.cloud.tencent.com/cos5)：

1. **创建存储桶**
   - 登录控制台
   - 点击"存储桶列表" → "创建存储桶"
   - 填写存储桶名称（如：zetu-media）
   - 选择所属地域（如：北京 ap-beijing）
   - 访问权限：公有读私有写

2. **获取密钥**
   - 访问 [API密钥管理](https://console.cloud.tencent.com/cam/capi)
   - 点击"新建密钥"
   - 复制 SecretId 和 SecretKey

3. **配置CORS（允许Web端上传）**
   - 进入存储桶 → 安全管理 → 跨域访问CORS设置
   - 添加规则：
     ```
     来源Origin: *
     操作Methods: GET, POST, PUT, DELETE, HEAD
     Allow-Headers: *
     Expose-Headers: *
     超时Max-Age: 600
     ```

---

## 🗄️ 数据库迁移

### 4. 执行 Prisma 迁移

```bash
# 生成 Prisma Client
npx prisma generate

# 执行数据库迁移
npx prisma migrate dev --name add_media_table

# 或直接推送到数据库
npx prisma db push
```

这将创建 `media` 表，包含以下字段：
- id, fileName, originalName, fileSize
- mimeType, width, height, url, cosKey
- bucket, folder, uploadedBy, usedCount
- tags, description, createdAt, updatedAt

---

## 🚀 使用指南

### 5. 访问媒体库管理页面

启动项目后，访问：
```
http://localhost:3000/admin/media
```

功能包括：
- 📤 上传文件（支持拖拽）
- 📁 文件夹分类
- 🔍 搜索文件
- 🗑️ 删除文件（同时删除COS文件）
- 📊 查看文件信息（尺寸、大小、使用次数）

### 6. 在代码中使用 MediaSelector 组件

**示例 1：网站 Logo 上传**

```typescript
import MediaSelector from '@/components/admin/MediaSelector'

// 在组件中
const [logoUrl, setLogoUrl] = useState<string | null>(null)

<MediaSelector
  value={logoUrl}
  onChange={(url) => setLogoUrl(url)}
  folder="websites"
  label="网站 Logo"
  description="推荐尺寸：512x512px，支持 PNG、JPG 格式"
  required
/>
```

**示例 2：文章封面上传**

```typescript
<MediaSelector
  value={coverImage}
  onChange={(url) => setCoverImage(url)}
  folder="articles"
  label="文章封面"
  maxSize={5}
/>
```

**示例 3：用户头像上传**

```typescript
<MediaSelector
  value={avatar}
  onChange={(url) => setAvatar(url)}
  folder="avatars"
  accept="image/*"
  maxSize={2}
/>
```

### 7. 直接调用上传API

```typescript
const uploadFile = async (file: File) => {
  const formData = new FormData()
  formData.append('file', file)
  formData.append('folder', 'uploads')
  formData.append('description', '文件描述（可选）')

  const res = await fetch('/api/admin/media/upload', {
    method: 'POST',
    body: formData,
  })
  const data = await res.json()
  
  if (data.success) {
    console.log('上传成功:', data.data.url)
    return data.data.url
  }
}
```

---

## 🎨 替换现有上传入口

### 8. 更新现有页面使用 MediaSelector

**需要更新的页面**：
- ✅ `/admin/websites/new` - 网站Logo
- ✅ `/admin/websites/[id]` - 网站Logo
- ✅ `/admin/articles/new` - 文章封面
- ✅ `/admin/articles/[id]` - 文章封面
- ✅ `/admin/users/[id]` - 用户头像

**替换步骤**：
1. 导入 `MediaSelector` 组件
2. 将原有的 `<input type="file">` 替换为 `<MediaSelector>`
3. 移除手动上传逻辑，直接使用返回的 URL

---

## 📁 文件夹分类建议

推荐的文件夹结构：
```
uploads/          # 默认上传
├── websites/     # 网站Logo
├── articles/     # 文章封面
├── avatars/      # 用户头像
├── banners/      # 横幅广告
└── misc/         # 其他文件
```

在上传时指定 `folder` 参数即可自动分类。

---

## 🔧 API 文档

### 上传文件
```
POST /api/admin/media/upload
Content-Type: multipart/form-data

Body:
- file: File (必需)
- folder: string (可选，默认：uploads)
- description: string (可选)

Response:
{
  "success": true,
  "message": "上传成功",
  "data": {
    "id": 1,
    "url": "https://xxx.cos.ap-beijing.myqcloud.com/...",
    "originalName": "logo.png",
    "fileSize": 45678,
    "width": 512,
    "height": 512,
    ...
  }
}
```

### 获取媒体列表
```
GET /api/admin/media?folder=websites&search=logo&page=1&pageSize=20

Response:
{
  "success": true,
  "data": [...],
  "pagination": {
    "page": 1,
    "pageSize": 20,
    "total": 100,
    "totalPages": 5
  }
}
```

### 删除文件
```
DELETE /api/admin/media/:id

Response:
{
  "success": true,
  "message": "删除成功"
}
```

---

## ⚠️ 注意事项

1. **权限控制**
   - 所有媒体API都需要管理员权限
   - 前端会自动处理权限验证

2. **文件大小限制**
   - 默认限制：10MB
   - 可在组件中通过 `maxSize` 参数修改

3. **COS存储费用**
   - 按实际存储量和流量计费
   - 建议定期清理未使用的文件
   - 可在媒体库中查看 `usedCount` 字段

4. **图片优化建议**
   - 上传前压缩图片
   - 使用WebP格式
   - 合理设置图片尺寸

5. **备份策略**
   - 数据库记录可通过 Prisma 迁移恢复
   - COS文件需单独备份
   - 建议开启COS的版本控制

---

## 🎉 完成！

媒体库系统已全部配置完成！你现在可以：
- ✅ 在后台管理媒体文件
- ✅ 在任何需要上传的地方使用 MediaSelector
- ✅ 复用已上传的文件，节省存储空间
- ✅ 统一管理所有媒体资源

有任何问题请参考腾讯云COS官方文档或联系开发团队。

---

**Made with ❤️ by Zetu Team**

