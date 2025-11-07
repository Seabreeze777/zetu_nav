'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import AdminLayout from '@/components/admin/AdminLayout';
import { useToast } from '@/contexts/ToastContext';

interface User {
  id: number;
  username: string;
  nickname: string;
  email: string | null;
  avatar: string | null;
  role: string;
  status: string;
  createdAt: string;
}

export default function UsersPage() {
  const router = useRouter();
  const toast = useToast();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  // 加载用户数据
  const loadUsers = async () => {
    setLoading(true);
    try {
      const url = searchQuery
        ? `/api/admin/users?search=${encodeURIComponent(searchQuery)}`
        : '/api/admin/users';
      
      const response = await fetch(url);
      if (response.ok) {
        const data = await response.json();
        setUsers(data);
      }
    } catch (error) {
      console.error('加载用户失败:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  // 切换用户状态
  const handleToggleStatus = async (id: number, currentStatus: string) => {
    const newStatus = currentStatus === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE';
    const action = newStatus === 'ACTIVE' ? '启用' : '禁用';

    toast.confirm(`确定要${action}该用户吗？`, async () => {
      try {
        const response = await fetch(`/api/admin/users/${id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ status: newStatus }),
        });

        if (response.ok) {
          toast.success(`${action}成功！`);
          loadUsers();
        } else {
          const data = await response.json();
          toast.error(data.error || `${action}失败`);
        }
      } catch (error) {
        console.error(`${action}失败:`, error);
        toast.error(`${action}失败，请重试`);
      }
    });
  };

  // 删除用户
  const handleDelete = async (id: number, username: string) => {
    toast.confirm(`确定要删除用户「${username}」吗？此操作不可恢复！`, async () => {
      try {
        const response = await fetch(`/api/admin/users/${id}`, {
          method: 'DELETE',
        });

        if (response.ok) {
          toast.success('删除成功！');
          loadUsers();
        } else {
          const data = await response.json();
          toast.error(data.error || '删除失败');
        }
      } catch (error) {
        console.error('删除失败:', error);
        toast.error('删除失败，请重试');
      }
    });
  };

  // 重置密码
  const handleResetPassword = async (id: number, username: string) => {
    const newPassword = prompt(`请输入用户「${username}」的新密码（至少6个字符）：`);
    
    if (!newPassword) {
      return;
    }

    if (newPassword.length < 6) {
      toast.warning('密码不能少于6个字符');
      return;
    }

    try {
      const response = await fetch(`/api/admin/users/${id}/reset-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ newPassword }),
      });

      if (response.ok) {
        toast.success('密码重置成功！');
      } else {
        const data = await response.json();
        toast.error(data.error || '重置失败');
      }
    } catch (error) {
      console.error('重置密码失败:', error);
      toast.error('重置失败，请重试');
    }
  };

  // 搜索
  const handleSearch = () => {
    loadUsers();
  };

  // 角色显示
  const getRoleBadge = (role: string) => {
    const styles = {
      ADMIN: 'bg-red-100 text-red-800',
      USER: 'bg-blue-100 text-blue-800',
    };
    const labels = {
      ADMIN: '管理员',
      USER: '用户',
    };
    return (
      <span className={`px-2 py-1 text-xs rounded-full ${styles[role as keyof typeof styles] || 'bg-gray-100 text-gray-800'}`}>
        {labels[role as keyof typeof labels] || role}
      </span>
    );
  };

  // 状态显示
  const getStatusBadge = (status: string) => {
    const isActive = status === 'ACTIVE';
    return (
      <span className={`px-2 py-1 text-xs rounded-full ${isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
        {isActive ? '正常' : '已禁用'}
      </span>
    );
  };

  return (
    <AdminLayout>
      <div className="p-6">
        <div className="max-w-7xl mx-auto">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-900">用户管理</h1>
            <p className="text-sm text-gray-500 mt-1">管理系统用户和权限</p>
          </div>

      {/* 搜索和操作栏 */}
      <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
        <div className="flex items-center justify-between gap-4">
          <div className="flex-1 flex gap-2">
            <input
              type="text"
              placeholder="搜索用户名、昵称或邮箱..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              onClick={handleSearch}
              className="px-6 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
            >
              搜索
            </button>
          </div>
          <button
            onClick={() => router.push('/admin/users/new')}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors whitespace-nowrap"
          >
            ➕ 添加用户
          </button>
        </div>
      </div>

      {/* 用户列表 */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-gray-500">加载中...</div>
        ) : users.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            {searchQuery ? '未找到匹配的用户' : '暂无用户'}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    用户名
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    昵称
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    邮箱
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    角色
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    状态
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    注册时间
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    操作
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {users.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {user.id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {user.username}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {user.nickname}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {user.email || '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getRoleBadge(user.role)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(user.status)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(user.createdAt).toLocaleDateString('zh-CN')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => router.push(`/admin/users/${user.id}`)}
                        className="text-blue-600 hover:text-blue-900 mr-3"
                      >
                        编辑
                      </button>
                      <button
                        onClick={() => handleResetPassword(user.id, user.username)}
                        className="text-orange-600 hover:text-orange-900 mr-3"
                      >
                        重置密码
                      </button>
                      <button
                        onClick={() => handleToggleStatus(user.id, user.status)}
                        className="text-purple-600 hover:text-purple-900 mr-3"
                      >
                        {user.status === 'ACTIVE' ? '禁用' : '启用'}
                      </button>
                      <button
                        onClick={() => handleDelete(user.id, user.username)}
                        className="text-red-600 hover:text-red-900"
                      >
                        删除
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* 统计信息 */}
      <div className="mt-4 text-sm text-gray-500">
        共 {users.length} 个用户
      </div>
        </div>
      </div>
    </AdminLayout>
  );
}

