# 腾讯云COS图片上传使用指南

## 环境配置

### 1. 配置环境变量 (`.env.local`)

```env
COS_SECRET_ID=你的SecretId
COS_SECRET_KEY=你的SecretKey
COS_BUCKET=你的存储桶名称
COS_REGION=存储桶地域（如：ap-chengdu）
COS_DOMAIN=访问域名（如：https://xxx.cos.ap-chengdu.myqcloud.com）
```

### 2. 安装依赖

```bash
npm install cos-nodejs-sdk-v5
```

---

## 使用方法

### 方式1：使用 `ImageUploader` 组件（推荐）

```tsx
'use client'

import { useState } from 'react'
import ImageUploader from '@/components/common/ImageUploader'

export default function MyForm() {
  const [logoUrl, setLogoUrl] = useState('')

  return (
    <form>
      <div>
        <label>网站Logo</label>
        <ImageUploader
          onUploadSuccess={(url) => setLogoUrl(url)}
          currentImage={logoUrl}
          folder="logos"
          buttonText="上传Logo"
          maxSize={5}
        />
      </div>
      
      {/* 其他表单字段 */}
    </form>
  )
}
```

### 方式2：直接调用API

```typescript
async function uploadImage(file: File) {
  const formData = new FormData()
  formData.append('file', file)
  formData.append('folder', 'images') // 可选，默认为 'images'

  const response = await fetch('/api/upload', {
    method: 'POST',
    body: formData,
  })

  const data = await response.json()
  
  if (data.success) {
    console.log('上传成功:', data.data.url)
    return data.data.url
  } else {
    throw new Error(data.error)
  }
}
```

---

## API接口

### `POST /api/upload`

**功能：** 上传图片到腾讯云COS

**权限：** 需要登录

**请求参数：**
- `file` (File): 图片文件
- `folder` (string, 可选): 存储文件夹，默认 `images`

**返回数据：**
```json
{
  "success": true,
  "data": {
    "url": "https://xxx.cos.ap-chengdu.myqcloud.com/images/1234567890-abc123.jpg",
    "key": "images/1234567890-abc123.jpg",
    "name": "原始文件名.jpg",
    "size": 123456,
    "type": "image/jpeg"
  }
}
```

### `DELETE /api/upload?key=xxx`

**功能：** 删除COS文件

**权限：** 仅管理员

**请求参数：**
- `key` (string): 文件在COS中的路径

**返回数据：**
```json
{
  "success": true,
  "message": "删除成功"
}
```

---

## 文件夹组织建议

```
cos-bucket/
├── logos/          # 网站Logo
├── covers/         # 文章封面
├── articles/       # 文章配图
├── avatars/        # 用户头像
├── icons/          # 图标
└── test/           # 测试文件
```

---

## 限制说明

- **支持格式：** JPG、PNG、GIF、WebP
- **文件大小：** 最大5MB（可在组件中配置）
- **权限要求：** 
  - 上传：需要登录
  - 删除：仅管理员

---

## 测试上传

访问测试页面：`http://localhost:3000/test-upload`

---

## 注意事项

1. **安全性：**
   - 不要将 SecretId 和 SecretKey 提交到Git仓库
   - 生产环境使用环境变量配置

2. **文件命名：**
   - 自动生成唯一文件名（时间戳 + 随机字符串）
   - 保留原始文件扩展名

3. **错误处理：**
   - 文件类型不支持
   - 文件大小超限
   - 网络上传失败
   - COS配置错误

4. **CDN加速（可选）：**
   - 如果配置了CDN，可将 `COS_DOMAIN` 改为CDN域名
   - 实现全球加速访问

