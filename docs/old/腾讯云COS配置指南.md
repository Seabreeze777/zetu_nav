# 📦 腾讯云COS配置指南

本指南帮助你配置腾讯云对象存储（COS），用于网站的图片上传和存储功能。

> **注意：** 图片上传功能是可选的。如果不配置COS，可以直接使用图片URL（从其他图床或CDN）。

---

## 📋 前置条件

- [x] 腾讯云账号（已注册并实名认证）
- [x] 已开通对象存储COS服务

---

## 🎯 第一步：创建存储桶

### 1. 登录腾讯云控制台

访问：https://console.cloud.tencent.com/cos

### 2. 创建存储桶

1. 点击「存储桶列表」→「创建存储桶」
2. 填写配置信息：

| 配置项 | 建议值 | 说明 |
|--------|--------|------|
| **名称** | `zetu-nav-[APPID]` | 存储桶名称，会自动添加APPID后缀 |
| **所属地域** | `成都` 或就近地域 | 选择离用户最近的地域 |
| **访问权限** | `公有读私有写` | 允许公开访问图片 |
| **存储桶标签** | 可选 | 用于费用分类 |
| **服务端加密** | 不启用 | 图片不需要加密 |

3. 点击「创建」

### 3. 配置跨域访问（重要）

存储桶创建后，需要配置CORS：

1. 进入存储桶 → 「安全管理」→「跨域访问CORS设置」
2. 点击「添加规则」，配置如下：

```
来源 Origin：*
操作 Methods：GET, POST, PUT, DELETE, HEAD
Allow-Headers：*
Expose-Headers：ETag
超时 Max-Age：600
```

3. 保存配置

---

## 🔑 第二步：获取API密钥

### 1. 创建密钥

访问：https://console.cloud.tencent.com/cam/capi

1. 点击「新建密钥」
2. 完成身份验证
3. 记录生成的密钥：
   - **SecretId**（类似：`AKIDxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx`）
   - **SecretKey**（类似：`xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx`）

> **⚠️ 安全提示：**
> - 密钥只显示一次，请妥善保管
> - 不要将密钥提交到代码仓库
> - 定期轮换密钥

### 2. 配置子账号（推荐）

为了安全，建议创建子账号用于应用访问：

1. 访问：https://console.cloud.tencent.com/cam
2. 「用户」→「新建用户」→「自定义创建」
3. 选择「可访问资源并接收消息」
4. 填写用户信息
5. 设置权限：添加策略「QcloudCOSDataFullControl」
6. 生成API密钥

---

## ⚙️ 第三步：配置项目

### 1. 添加环境变量

在项目根目录的 `.env` 文件中添加：

```env
# 腾讯云COS配置
TENCENT_SECRET_ID="你的SecretId"
TENCENT_SECRET_KEY="你的SecretKey"
COS_BUCKET="zetu-nav-1302966033"
COS_REGION="ap-chengdu"
```

### 2. 获取存储桶信息

- **存储桶名称**：在COS控制台「存储桶列表」中查看完整名称
- **所属地域**：地域简称，如：
  - 北京：`ap-beijing`
  - 上海：`ap-shanghai`
  - 广州：`ap-guangzhou`
  - 成都：`ap-chengdu`

### 3. 安装COS SDK（如需上传功能）

```bash
npm install cos-nodejs-sdk-v5
```

---

## 📝 第四步：实现图片上传功能

### 创建上传API路由

创建文件：`src/app/api/upload/route.ts`

```typescript
import { NextRequest, NextResponse } from 'next/server';
import COS from 'cos-nodejs-sdk-v5';
import { verifyAuth } from '@/lib/auth';

const cos = new COS({
  SecretId: process.env.TENCENT_SECRET_ID,
  SecretKey: process.env.TENCENT_SECRET_KEY,
});

export async function POST(request: NextRequest) {
  try {
    // 验证管理员权限
    const user = await verifyAuth(request);
    if (!user || user.role !== 'ADMIN') {
      return NextResponse.json({ error: '无权限' }, { status: 403 });
    }

    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json({ error: '没有文件' }, { status: 400 });
    }

    // 生成文件名（使用时间戳+随机数）
    const ext = file.name.split('.').pop();
    const filename = `${Date.now()}-${Math.random().toString(36).substring(7)}.${ext}`;
    const key = `images/${filename}`;

    // 转换文件为Buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // 上传到COS
    const result = await cos.putObject({
      Bucket: process.env.COS_BUCKET!,
      Region: process.env.COS_REGION!,
      Key: key,
      Body: buffer,
      ContentType: file.type,
    });

    // 返回访问URL
    const url = `https://${process.env.COS_BUCKET}.cos.${process.env.COS_REGION}.myqcloud.com/${key}`;

    return NextResponse.json({
      success: true,
      url,
      filename,
    });
  } catch (error) {
    console.error('上传失败:', error);
    return NextResponse.json({ error: '上传失败' }, { status: 500 });
  }
}
```

### 创建上传组件

创建文件：`src/components/admin/ImageUploader.tsx`

```typescript
'use client';

import { useState } from 'react';

interface ImageUploaderProps {
  onUploadSuccess: (url: string) => void;
}

export default function ImageUploader({ onUploadSuccess }: ImageUploaderProps) {
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // 预览
    const reader = new FileReader();
    reader.onload = (e) => setPreview(e.target?.result as string);
    reader.readAsDataURL(file);

    // 上传
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (data.success) {
        onUploadSuccess(data.url);
        alert('上传成功！');
      } else {
        alert(data.error || '上传失败');
      }
    } catch (error) {
      console.error('上传失败:', error);
      alert('上传失败');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        上传图片
      </label>
      <div className="flex items-center gap-4">
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          disabled={uploading}
          className="file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-blue-600 file:text-white hover:file:bg-blue-700 file:cursor-pointer cursor-pointer"
        />
        {uploading && <span className="text-sm text-gray-500">上传中...</span>}
      </div>
      {preview && (
        <div className="mt-4">
          <img src={preview} alt="预览" className="w-32 h-32 object-cover rounded-lg border" />
        </div>
      )}
    </div>
  );
}
```

---

## 💰 费用说明

### COS免费额度（每月）

| 项目 | 免费额度 |
|------|---------|
| 存储容量 | 50GB |
| 流量 | 10GB（大陆地域） |
| 请求次数 | 读/写各100万次 |

超出部分按量计费，价格参考：
- 存储：约 ¥0.099/GB/月
- 流量：约 ¥0.5/GB（CDN回源）
- 请求：¥0.01/万次（读请求）

> **💡 省钱技巧：**
> - 开启CDN加速（免费流量包）
> - 使用生命周期规则自动删除过期文件
> - 压缩图片后再上传
> - 使用图片处理（缩略图）

---

## 🚀 进阶配置

### 1. 开启CDN加速

1. 进入存储桶 → 「域名与传输管理」→「默认CDN加速域名」
2. 开启加速
3. 配置CNAME（如使用自定义域名）

### 2. 配置图片处理

腾讯云CI支持实时图片处理：

```
原图：https://bucket.cos.region.myqcloud.com/image.jpg
缩略图：https://bucket.cos.region.myqcloud.com/image.jpg?imageMogr2/thumbnail/200x200
```

### 3. 设置生命周期

自动删除过期文件，节省费用：

1. 进入存储桶 → 「生命周期」
2. 添加规则：删除180天前的文件

### 4. 配置防盗链

防止图片被盗用：

1. 进入存储桶 → 「安全管理」→「防盗链设置」
2. 添加白名单域名

---

## 🔍 测试配置

### 测试上传

在Prisma Studio或数据库中手动添加测试图片URL：

```
https://zetu-nav-1302966033.cos.ap-chengdu.myqcloud.com/test.jpg
```

如果图片可以正常显示，说明配置成功。

### 测试访问权限

在浏览器中直接访问图片URL，应该可以正常显示。

---

## ⚠️ 常见问题

### Q1: 跨域错误

**错误信息：** `Access to XMLHttpRequest has been blocked by CORS policy`

**解决：** 检查CORS配置是否正确，确保已添加跨域规则。

### Q2: 403 Forbidden

**可能原因：**
- 存储桶访问权限设置错误（应为"公有读"）
- API密钥错误或过期
- 防盗链限制

### Q3: 上传失败

**检查：**
- 环境变量是否正确配置
- API密钥权限是否足够
- 网络连接是否正常
- 文件大小是否超限

---

## 📚 相关链接

- [腾讯云COS官方文档](https://cloud.tencent.com/document/product/436)
- [COS Node.js SDK](https://cloud.tencent.com/document/product/436/8629)
- [COS价格计算器](https://buy.cloud.tencent.com/price/cos/calculator)
- [图片处理文档](https://cloud.tencent.com/document/product/460)

---

**配置完成后，你的网站就可以使用图片上传功能了！** 📸

