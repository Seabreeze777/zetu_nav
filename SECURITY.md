# 🔒 安全配置指南

## ⚠️ 部署前必读！

在将项目部署到生产环境之前，**必须**完成以下安全配置，否则存在严重安全风险！

---

## 🔴 必须立即修改的配置

### 1. JWT密钥（极其重要！）

**默认密钥：** `zetu-nav-secret-key-2025`  
**风险等级：** 🔴 **严重** - 攻击者可以伪造任何用户token

**修改步骤：**

#### 方法1：使用Node.js生成（推荐）
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

示例输出：
```
fd8aef536537e43996ca1e58fc244f1c5f1d82b8e7f8604c3b90b0d3f74c0e6d
```

#### 方法2：使用OpenSSL
```bash
openssl rand -hex 32
```

#### 方法3：在线生成器
访问：https://www.lastpass.com/features/password-generator

**更新位置：**
编辑 `.env` 文件：
```env
JWT_SECRET="your-generated-secret-key-here"
```

⚠️ **注意：**
- 必须是32位以上的随机字符串
- 不要使用任何有意义的单词
- 生产环境和开发环境使用不同的密钥
- 定期更换（建议每3-6个月）
- 更换密钥后，所有用户需要重新登录

---

### 2. 默认管理员密码

**默认账号：** `admin` / `admin123`  
**风险等级：** 🔴 **严重** - 任何人都可以登录后台

**修改步骤：**

#### 方法1：通过后台修改
1. 登录后台：`http://your-domain.com/admin`
2. 进入「用户管理」→ 编辑admin用户
3. 点击「重置密码」
4. 设置新的强密码

#### 方法2：通过数据库修改
```bash
# 生成新密码的哈希值
node -e "const bcrypt = require('bcryptjs'); console.log(bcrypt.hashSync('your-new-password', 10))"

# 在数据库中更新
UPDATE users SET password = '生成的哈希值' WHERE username = 'admin';
```

**强密码要求：**
- ✅ 至少12位字符
- ✅ 包含大写字母
- ✅ 包含小写字母
- ✅ 包含数字
- ✅ 包含特殊字符
- ❌ 不要使用常见单词
- ❌ 不要使用个人信息

---

### 3. 数据库密码

**检查项：**
- [ ] 数据库密码是否足够强（至少16位）
- [ ] 是否限制了数据库访问IP
- [ ] 是否禁用了root远程登录
- [ ] 是否定期备份数据

**修改数据库密码：**
```sql
ALTER USER 'zetu-nav'@'%' IDENTIFIED BY 'new-strong-password';
FLUSH PRIVILEGES;
```

更新 `.env` 文件：
```env
DATABASE_URL="mysql://zetu-nav:new-strong-password@111.231.204.182:3306/zetu-nav"
```

---

## 🟡 强烈建议的配置

### 4. 密码策略

**当前：** 仅要求6位  
**建议：** 8位以上，包含大小写+数字

**修改位置：** `src/app/api/auth/login/route.ts`

```typescript
// 添加密码强度验证
const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{8,}$/;
if (!passwordRegex.test(password)) {
  return NextResponse.json({ 
    error: '密码必须至少8位，包含大小写字母和数字' 
  }, { status: 400 });
}
```

---

### 5. HTTPS配置

**风险：** HTTP传输明文，密码可被窃听

**配置方法：**

#### 使用Let's Encrypt免费证书
```bash
# 安装certbot
sudo apt install certbot python3-certbot-nginx

# 获取证书
sudo certbot --nginx -d your-domain.com
```

#### Nginx配置
```nginx
server {
    listen 443 ssl http2;
    server_name your-domain.com;
    
    ssl_certificate /etc/letsencrypt/live/your-domain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/your-domain.com/privkey.pem;
    
    # 强制HTTPS
    add_header Strict-Transport-Security "max-age=31536000" always;
}

# 重定向HTTP到HTTPS
server {
    listen 80;
    server_name your-domain.com;
    return 301 https://$server_name$request_uri;
}
```

---

### 6. 环境变量保护

**检查清单：**
- [ ] `.env` 文件已添加到 `.gitignore`
- [ ] 不在代码中硬编码任何密钥
- [ ] 生产环境使用环境变量或密钥管理服务

**验证：**
```bash
# 确认.env不会被提交
git status

# 如果显示.env，立即删除
git rm --cached .env
echo ".env" >> .gitignore
git commit -m "Remove .env from git"
```

---

## 🟢 可选但推荐的配置

### 7. Rate Limiting（API限流）

防止暴力破解和DDoS攻击。

**实现方案：**
```bash
npm install express-rate-limit
```

```typescript
// src/middleware/rateLimit.ts
import rateLimit from 'express-rate-limit';

export const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15分钟
  max: 5, // 最多5次尝试
  message: '登录尝试次数过多，请15分钟后再试'
});
```

---

### 8. 双因素认证（2FA）

**可选实现：**
- Google Authenticator
- 短信验证码
- 邮箱验证码

---

### 9. 审计日志

记录所有敏感操作：
- 登录/登出
- 密码修改
- 用户创建/删除
- 内容修改/删除

**实现方案：**
```typescript
// 创建audit_logs表
await prisma.auditLog.create({
  data: {
    userId: user.id,
    action: 'LOGIN',
    ip: request.ip,
    userAgent: request.headers.get('user-agent')
  }
});
```

---

### 10. 数据库备份

**备份策略：**
```bash
# 每日备份脚本
#!/bin/bash
DATE=$(date +%Y%m%d_%H%M%S)
mysqldump -h 111.231.204.182 -u zetu-nav -p zetu-nav > backup_$DATE.sql
```

**自动化：**
```bash
# 添加到crontab
0 2 * * * /path/to/backup.sh
```

---

## ✅ 安全检查清单

部署前请逐项确认：

### 必须项（未完成禁止上线）
- [ ] 已修改JWT_SECRET为强随机字符串
- [ ] 已修改默认管理员密码
- [ ] 数据库密码足够强且已限制IP访问
- [ ] `.env`文件不在Git仓库中
- [ ] 已配置HTTPS证书

### 强烈建议
- [ ] 已启用Rate Limiting
- [ ] 已加强密码策略
- [ ] 已配置防火墙
- [ ] 已设置数据库备份
- [ ] 已添加错误监控

### 可选项
- [ ] 已启用2FA
- [ ] 已实现审计日志
- [ ] 已配置CDN
- [ ] 已添加WAF防护

---

## 📞 安全事件响应

如果发现安全问题：

1. **立即行动**
   - 修改所有密钥和密码
   - 检查日志，评估影响范围
   - 阻止可疑IP

2. **通知用户**
   - 如果用户数据泄露，立即通知
   - 要求所有用户修改密码

3. **修复漏洞**
   - 紧急修复代码
   - 更新依赖包
   - 重新部署

4. **事后总结**
   - 记录事件过程
   - 分析原因
   - 加强防护措施

---

## 📚 参考资源

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [Next.js安全最佳实践](https://nextjs.org/docs/pages/building-your-application/configuring/authentication)
- [密码存储备忘录](https://cheatsheetseries.owasp.org/cheatsheets/Password_Storage_Cheat_Sheet.html)

---

## ⚠️ 最后提醒

**安全不是一次性的工作，而是持续的过程！**

- 定期更新依赖包
- 定期审查日志
- 定期更换密钥
- 关注安全公告

**祝你的网站安全运行！** 🔒

