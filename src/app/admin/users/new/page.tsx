'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import AdminLayout from '@/components/admin/AdminLayout';
import MediaSelector from '@/components/admin/MediaSelector';
import { useToast } from '@/contexts/ToastContext';

export default function NewUserPage() {
  const router = useRouter();
  const toast = useToast();
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    confirmPassword: '',
    nickname: '',
    email: '',
    avatar: '',
    role: 'USER',
  });
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // 验证必填字段
    if (!formData.username || !formData.password) {
      toast.warning('用户名和密码不能为空');
      return;
    }

    // 验证密码长度
    if (formData.password.length < 6) {
      toast.warning('密码不能少于6个字符');
      return;
    }

    // 验证密码确认
    if (formData.password !== formData.confirmPassword) {
      toast.warning('两次输入的密码不一致');
      return;
    }

    setSubmitting(true);

    try {
      const response = await fetch('/api/admin/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: formData.username,
          password: formData.password,
          nickname: formData.nickname || formData.username,
          email: formData.email || null,
          avatar: formData.avatar || null,
          role: formData.role,
        }),
      });

      if (response.ok) {
        toast.success('创建成功！');
        router.push('/admin/users');
      } else {
        const data = await response.json();
        toast.error(data.error || '创建失败');
      }
    } catch (error) {
      console.error('创建失败:', error);
      toast.error('创建失败，请重试');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AdminLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-800 mb-2">添加用户</h1>
          <p className="text-gray-600">创建新的系统用户</p>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6 max-w-2xl">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* 用户名 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              用户名 <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              placeholder="用于登录，只能包含字母、数字和下划线"
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* 密码 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              密码 <span className="text-red-500">*</span>
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="至少6个字符"
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* 确认密码 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              确认密码 <span className="text-red-500">*</span>
            </label>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="再次输入密码"
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* 昵称 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              昵称
            </label>
            <input
              type="text"
              name="nickname"
              value={formData.nickname}
              onChange={handleChange}
              placeholder="显示名称，默认与用户名相同"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* 邮箱 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              邮箱
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="example@domain.com"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* 头像 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              用户头像
            </label>
            <MediaSelector
              value={formData.avatar}
              onChange={(url) => setFormData({ ...formData, avatar: url || '' })}
              folder="avatars"
              label=""
              description="推荐尺寸：200x200px"
            />
            <p className="mt-1 text-sm text-gray-500">
              选填，可在用户设置中修改
            </p>
          </div>

          {/* 角色 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              角色权限
            </label>
            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="USER">普通用户</option>
              <option value="ADMIN">管理员</option>
            </select>
            <p className="mt-1 text-sm text-gray-500">
              管理员拥有后台管理权限
            </p>
          </div>

          {/* 按钮组 */}
          <div className="flex items-center gap-4 pt-4">
            <button
              type="submit"
              disabled={submitting}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-400"
            >
              {submitting ? '创建中...' : '创建用户'}
            </button>
            <button
              type="button"
              onClick={() => router.back()}
              className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              取消
            </button>
          </div>
        </form>
      </div>
      </div>
    </AdminLayout>
  );
}

