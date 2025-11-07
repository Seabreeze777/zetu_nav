'use client';

import { useState, useEffect } from 'react';
import { useUser } from '@/contexts/UserContext';
import { useRouter } from 'next/navigation';

export default function SettingsPage() {
  const router = useRouter();
  const { user, loading: userLoading, refreshUser } = useUser();

  // 个人信息表单
  const [profileForm, setProfileForm] = useState({
    nickname: '',
    email: '',
    avatar: '',
  });
  const [profileSubmitting, setProfileSubmitting] = useState(false);

  // 密码表单
  const [passwordForm, setPasswordForm] = useState({
    oldPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [passwordSubmitting, setPasswordSubmitting] = useState(false);

  // 检查登录状态
  useEffect(() => {
    if (!userLoading && !user) {
      router.push('/login?redirect=/settings');
    }
  }, [user, userLoading, router]);

  // 加载用户信息
  useEffect(() => {
    if (user) {
      setProfileForm({
        nickname: user.nickname || '',
        email: user.email || '',
        avatar: user.avatar || '',
      });
    }
  }, [user]);

  // 更新个人信息
  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!profileForm.nickname.trim()) {
      alert('昵称不能为空');
      return;
    }

    setProfileSubmitting(true);

    try {
      const response = await fetch('/api/user/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(profileForm),
      });

      const data = await response.json();

      if (response.ok) {
        alert('更新成功！');
        await refreshUser(); // 刷新用户信息
      } else {
        alert(data.error || '更新失败');
      }
    } catch (error) {
      console.error('更新失败:', error);
      alert('更新失败，请重试');
    } finally {
      setProfileSubmitting(false);
    }
  };

  // 修改密码
  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!passwordForm.oldPassword || !passwordForm.newPassword) {
      alert('请填写完整信息');
      return;
    }

    if (passwordForm.newPassword.length < 6) {
      alert('新密码不能少于6个字符');
      return;
    }

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      alert('两次输入的新密码不一致');
      return;
    }

    setPasswordSubmitting(true);

    try {
      const response = await fetch('/api/user/password', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          oldPassword: passwordForm.oldPassword,
          newPassword: passwordForm.newPassword,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        alert('密码修改成功！请重新登录');
        // 清空表单
        setPasswordForm({
          oldPassword: '',
          newPassword: '',
          confirmPassword: '',
        });
      } else {
        alert(data.error || '修改失败');
      }
    } catch (error) {
      console.error('修改失败:', error);
      alert('修改失败，请重试');
    } finally {
      setPasswordSubmitting(false);
    }
  };

  if (userLoading || !user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">加载中...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 页头 */}
      <div className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">个人设置</h1>
          <p className="text-gray-600">管理你的账号信息</p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* 侧边栏导航 */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm p-4">
              <nav className="space-y-1">
                <a
                  href="#profile"
                  className="flex items-center gap-3 px-3 py-2 text-sm font-medium text-blue-600 bg-blue-50 rounded-lg"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  个人资料
                </a>
                <a
                  href="#security"
                  className="flex items-center gap-3 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                  安全设置
                </a>
              </nav>
            </div>
          </div>

          {/* 主内容区 */}
          <div className="lg:col-span-2 space-y-6">
            {/* 个人资料 */}
            <div id="profile" className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6">个人资料</h2>
              <form onSubmit={handleProfileSubmit} className="space-y-4">
                {/* 用户名（只读） */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    用户名
                  </label>
                  <input
                    type="text"
                    value={user.username}
                    disabled
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-500 cursor-not-allowed"
                  />
                  <p className="mt-1 text-sm text-gray-500">
                    用户名不可修改
                  </p>
                </div>

                {/* 昵称 */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    昵称 <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={profileForm.nickname}
                    onChange={(e) => setProfileForm(prev => ({ ...prev, nickname: e.target.value }))}
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
                    value={profileForm.email}
                    onChange={(e) => setProfileForm(prev => ({ ...prev, email: e.target.value }))}
                    placeholder="example@domain.com"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {/* 头像 */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    头像URL
                  </label>
                  <input
                    type="url"
                    value={profileForm.avatar}
                    onChange={(e) => setProfileForm(prev => ({ ...prev, avatar: e.target.value }))}
                    placeholder="https://example.com/avatar.jpg"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <p className="mt-1 text-sm text-gray-500">
                    暂不支持上传，请输入图片URL
                  </p>
                  {profileForm.avatar && (
                    <div className="mt-2">
                      <img 
                        src={profileForm.avatar} 
                        alt="头像预览" 
                        className="w-20 h-20 rounded-full object-cover border border-gray-200"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none';
                        }}
                      />
                    </div>
                  )}
                </div>

                {/* 提交按钮 */}
                <div className="pt-4">
                  <button
                    type="submit"
                    disabled={profileSubmitting}
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-400"
                  >
                    {profileSubmitting ? '保存中...' : '保存修改'}
                  </button>
                </div>
              </form>
            </div>

            {/* 安全设置 */}
            <div id="security" className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6">修改密码</h2>
              <form onSubmit={handlePasswordSubmit} className="space-y-4">
                {/* 原密码 */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    原密码 <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="password"
                    value={passwordForm.oldPassword}
                    onChange={(e) => setPasswordForm(prev => ({ ...prev, oldPassword: e.target.value }))}
                    placeholder="请输入原密码"
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {/* 新密码 */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    新密码 <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="password"
                    value={passwordForm.newPassword}
                    onChange={(e) => setPasswordForm(prev => ({ ...prev, newPassword: e.target.value }))}
                    placeholder="至少6个字符"
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {/* 确认新密码 */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    确认新密码 <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="password"
                    value={passwordForm.confirmPassword}
                    onChange={(e) => setPasswordForm(prev => ({ ...prev, confirmPassword: e.target.value }))}
                    placeholder="再次输入新密码"
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {/* 提交按钮 */}
                <div className="pt-4">
                  <button
                    type="submit"
                    disabled={passwordSubmitting}
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-400"
                  >
                    {passwordSubmitting ? '修改中...' : '修改密码'}
                  </button>
                </div>
              </form>
            </div>

            {/* 账号信息 */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">账号信息</h2>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span className="text-gray-600">账号类型：</span>
                  <span className="font-medium text-gray-900">
                    {user.role === 'admin' ? '👑 管理员' : '👤 普通用户'}
                  </span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span className="text-gray-600">注册时间：</span>
                  <span className="font-medium text-gray-900">
                    {new Date(user.createdAt).toLocaleString('zh-CN')}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

