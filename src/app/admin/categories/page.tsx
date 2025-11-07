'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import AdminLayout from '@/components/admin/AdminLayout';
import { useToast } from '@/contexts/ToastContext';

interface Category {
  id: number;
  name: string;
  slug: string;
  description: string;
  icon: string;
  cardsPerRow?: number;
  displayMode?: string;
  order: number;
  _count?: {
    websites?: number;
    articles?: number;
  };
}

export default function CategoriesPage() {
  const router = useRouter();
  const toast = useToast();
  const [activeTab, setActiveTab] = useState<'navigation' | 'article'>('navigation');
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  // 加载分类数据
  const loadCategories = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/admin/categories?type=${activeTab}`);
      if (response.ok) {
        const data = await response.json();
        setCategories(data);
      }
    } catch (error) {
      console.error('加载分类失败:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCategories();
  }, [activeTab]);

  // 删除分类
  const handleDelete = async (id: number, name: string) => {
    toast.confirm(`确定要删除分类「${name}」吗？`, async () => {

    try {
      const response = await fetch(`/api/admin/categories/${id}?type=${activeTab}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        toast.success('删除成功！');
        loadCategories();
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

  // 过滤分类
  const filteredCategories = categories.filter(category =>
    category.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    category.slug.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <AdminLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="max-w-7xl mx-auto">
          {/* 页面头部 */}
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-900">分类管理</h1>
            <p className="text-sm text-gray-500 mt-1">管理网站导航分类和文章分类</p>
          </div>

      {/* Tab 切换 */}
      <div className="bg-white rounded-lg shadow-sm mb-6">
        <div className="border-b border-gray-200">
          <div className="flex">
            <button
              onClick={() => setActiveTab('navigation')}
              className={`px-6 py-3 font-medium text-sm border-b-2 transition-colors ${
                activeTab === 'navigation'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              🧭 网站导航分类
            </button>
            <button
              onClick={() => setActiveTab('article')}
              className={`px-6 py-3 font-medium text-sm border-b-2 transition-colors ${
                activeTab === 'article'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              📝 文章分类
            </button>
          </div>
        </div>
      </div>

      {/* 搜索和操作栏 */}
      <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
        <div className="flex items-center justify-between gap-4">
          <div className="flex-1">
            <input
              type="text"
              placeholder="搜索分类名称或别名..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <button
            onClick={() => router.push(`/admin/categories/new?type=${activeTab}`)}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors whitespace-nowrap"
          >
            ➕ 添加分类
          </button>
        </div>
      </div>

      {/* 分类列表 */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-gray-500">加载中...</div>
        ) : filteredCategories.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            {searchQuery ? '未找到匹配的分类' : '暂无分类，点击「添加分类」开始创建'}
          </div>
        ) : (
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  排序
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  图标
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  名称
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  URL别名
                </th>
                {activeTab === 'navigation' && (
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    显示模式
                  </th>
                )}
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {activeTab === 'navigation' ? '网站数量' : '文章数量'}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  描述
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  操作
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredCategories.map((category) => (
                <tr key={category.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {category.order}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-2xl">
                    {category.icon}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {category.name}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <code className="text-sm text-blue-600 bg-blue-50 px-2 py-1 rounded">
                      {category.slug}
                    </code>
                  </td>
                  {activeTab === 'navigation' && (
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {category.displayMode === 'large' && (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                          📸 大图模式 (4列)
                        </span>
                      )}
                      {category.displayMode === 'button' && (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          🔘 按钮模式 (5列)
                        </span>
                      )}
                      {category.displayMode === 'compact' && (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          📋 紧凑模式 (6列)
                        </span>
                      )}
                      {!category.displayMode && (
                        <span className="text-gray-400">未设置</span>
                      )}
                    </td>
                  )}
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {category._count?.websites || category._count?.articles || 0}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate">
                    {category.description || '-'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      onClick={() => router.push(`/admin/categories/${category.id}?type=${activeTab}`)}
                      className="text-blue-600 hover:text-blue-900 mr-4"
                    >
                      编辑
                    </button>
                    <button
                      onClick={() => handleDelete(category.id, category.name)}
                      className="text-red-600 hover:text-red-900"
                    >
                      删除
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* 统计信息 */}
      <div className="mt-4 text-sm text-gray-500">
        共 {filteredCategories.length} 个分类
        {searchQuery && ` (从 ${categories.length} 个中筛选)`}
      </div>
        </div>
      </div>
    </AdminLayout>
  );
}

