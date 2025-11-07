'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import AdminLayout from '@/components/admin/AdminLayout';
import MediaSelector from '@/components/admin/MediaSelector';
import { useToast } from '@/contexts/ToastContext';

interface UserData {
  id: number;
  username: string;
  nickname: string;
  email: string | null;
  avatar: string | null;
  role: string;
  status: string;
  createdAt: string;
}

export default function EditUserPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const toast = useToast();
  const userId = params.id;

  const [formData, setFormData] = useState<UserData>({
    id: 0,
    username: '',
    nickname: '',
    email: null,
    avatar: null,
    role: 'USER',
    status: 'ACTIVE',
    createdAt: '',
  });
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // 加载用户数据
  useEffect(() => {
    const loadUser = async () => {
      try {
        const response = await fetch(`/api/admin/users/${userId}`);
        if (response.ok) {
          const data = await response.json();
          setFormData(data);
        } else {
          toast.error('加载失败');
          router.back();
        }
      } catch (error) {
        console.error('加载失败:', error);
        toast.error('加载失败');
        router.back();
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, [userId, router, toast]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.nickname) {
      toast.warning('昵称不能为空');
      return;
    }

    setSubmitting(true);

    try {
      const response = await fetch(`/api/admin/users/${userId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nickname: formData.nickname,
          email: formData.email || null,
          avatar: formData.avatar || null,
          role: formData.role,
          status: formData.status,
        }),
      });

      if (response.ok) {
        toast.success('更新成功！');
        router.push('/admin/users');
      } else {
        const data = await response.json();
        toast.error(data.error || '更新失败');
      }
    } catch (error) {
      console.error('更新失败:', error);
      toast.error('更新失败，请重试');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="p-8 text-center text-gray-500">加载中...</div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">编辑用户</h1>
        <p className="text-gray-600">修改用户信息和权限</p>
      </div>

      <div className="bg-white rounded-lg shadow-sm p-6 max-w-2xl">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* 用户名（只读） */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              用户名
            </label>
            <input
              type="text"
              value={formData.username}
              disabled
              className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-500 cursor-not-allowed"
            />
            <p className="mt-1 text-sm text-gray-500">
              用户名不可修改
            </p>
          </div>

          {/* 注册时间（只读） */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              注册时间
            </label>
            <input
              type="text"
              value={new Date(formData.createdAt).toLocaleString('zh-CN')}
              disabled
              className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-500 cursor-not-allowed"
            />
          </div>

          {/* 昵称 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              昵称 <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="nickname"
              value={formData.nickname}
              onChange={handleChange}
              placeholder="显示名称"
              required
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
              value={formData.email || ''}
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
              value={formData.avatar || null}
              onChange={(url) => setFormData({ ...formData, avatar: url || '' })}
              folder="avatars"
              label=""
              description="推荐尺寸：200x200px"
              buttonText="上传头像"
            />
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

          {/* 状态 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              账号状态
            </label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="ACTIVE">正常</option>
              <option value="INACTIVE">已禁用</option>
            </select>
            <p className="mt-1 text-sm text-gray-500">
              禁用后该用户将无法登录
            </p>
          </div>

          {/* 按钮组 */}
          <div className="flex items-center gap-4 pt-4">
            <button
              type="submit"
              disabled={submitting}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-400"
            >
              {submitting ? '保存中...' : '保存修改'}
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

