'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import AdminLayout from '@/components/admin/AdminLayout';
import { useToast } from '@/contexts/ToastContext';

interface Tag {
  id: number;
  name: string;
  slug: string;
  color: string;
  _count: {
    websites: number;
    articles: number;
  };
}

export default function TagsPage() {
  const router = useRouter();
  const toast = useToast();
  const [tags, setTags] = useState<Tag[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  // 加载标签数据
  const loadTags = async () => {
    setLoading(true);
    try {
      const url = searchQuery
        ? `/api/admin/tags?search=${encodeURIComponent(searchQuery)}`
        : '/api/admin/tags';
      
      const response = await fetch(url);
      if (response.ok) {
        const data = await response.json();
        setTags(data);
      }
    } catch (error) {
      console.error('加载标签失败:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTags();
  }, []);

  // 删除标签
  const handleDelete = async (id: number, name: string) => {
    toast.confirm(`确定要删除标签「${name}」吗？`, async () => {
      try {
        const response = await fetch(`/api/admin/tags/${id}`, {
          method: 'DELETE',
        });

        if (response.ok) {
          toast.success('删除成功！');
          loadTags();
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

  // 搜索
  const handleSearch = () => {
    loadTags();
  };

  return (
    <AdminLayout>
      <div className="p-6">
        <div className="max-w-7xl mx-auto">
          {/* 页面头部 */}
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-900">标签管理</h1>
            <p className="text-sm text-gray-500 mt-1">管理文章标签</p>
          </div>

      {/* 搜索和操作栏 */}
      <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
        <div className="flex items-center justify-between gap-4">
          <div className="flex-1 flex gap-2">
            <input
              type="text"
              placeholder="搜索标签名称或别名..."
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
            onClick={() => router.push('/admin/tags/new')}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors whitespace-nowrap"
          >
            ➕ 添加标签
          </button>
        </div>
      </div>

      {/* 标签列表 */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-gray-500">加载中...</div>
        ) : tags.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            {searchQuery ? '未找到匹配的标签' : '暂无标签，点击「添加标签」开始创建'}
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
                    标签预览
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    名称
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    URL别名
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    颜色
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    网站数量
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    文章数量
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    操作
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {tags.map((tag) => (
                  <tr key={tag.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {tag.id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className="inline-block px-3 py-1 text-xs rounded-full text-white font-medium"
                        style={{ backgroundColor: tag.color }}
                      >
                        {tag.name}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {tag.name}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <code className="text-sm text-blue-600 bg-blue-50 px-2 py-1 rounded">
                        {tag.slug}
                      </code>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <div
                          className="w-6 h-6 rounded border border-gray-200"
                          style={{ backgroundColor: tag.color }}
                        />
                        <code className="text-xs text-gray-600">
                          {tag.color}
                        </code>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded-lg font-medium">
                        {tag._count.websites}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 py-1 bg-green-50 text-green-700 text-xs rounded-lg font-medium">
                        {tag._count.articles}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => router.push(`/admin/tags/${tag.id}`)}
                        className="text-blue-600 hover:text-blue-900 mr-4"
                      >
                        编辑
                      </button>
                      <button
                        onClick={() => handleDelete(tag.id, tag.name)}
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
        共 {tags.length} 个标签
      </div>
        </div>
      </div>
    </AdminLayout>
  );
}

