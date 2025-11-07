'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import AdminLayout from '@/components/admin/AdminLayout';
import { useToast } from '@/contexts/ToastContext';

export default function EditCategoryPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const toast = useToast();
  const searchParams = useSearchParams();
  const type = searchParams.get('type') || 'navigation'; // 'navigation' 或 'article'

  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    description: '',
    icon: '',
    cardsPerRow: 6,
    displayMode: 'compact', // 'large' | 'button' | 'compact'
    order: 0,
  });
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    loadCategory();
  }, [params.id, type]);

  const loadCategory = async () => {
    try {
      const response = await fetch(`/api/admin/categories/${params.id}?type=${type}`);
      if (response.ok) {
        const category = await response.json();
        setFormData({
          name: category.name,
          slug: category.slug,
          description: category.description || '',
          icon: category.icon,
          cardsPerRow: category.cardsPerRow || 6,
          displayMode: category.displayMode || 'compact',
          order: category.order || category.sortOrder || 0,
        });
      } else {
        toast.error('加载分类失败');
        router.back();
      }
    } catch (error) {
      console.error('加载分类失败:', error);
      toast.error('加载分类失败，请重试');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'cardsPerRow' || name === 'order' ? parseInt(value) || 0 : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.slug) {
      toast.warning('请填写必填字段');
      return;
    }

    setSubmitting(true);

    const submitData = {
      type,
      ...formData,
      sortOrder: formData.order
    };
    
    console.log('🚀 提交数据:', submitData);

    try {
      const response = await fetch(`/api/admin/categories/${params.id}?type=${type}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(submitData),
      });
      
      console.log('📥 响应状态:', response.status, response.statusText);
      
      const responseData = await response.json();
      console.log('📥 响应数据:', responseData);

      if (response.ok) {
        toast.success('更新成功！');
        router.push(`/admin/categories?type=${type}`);
      } else {
        toast.error(responseData.error || '更新失败');
        console.error('❌ 更新失败:', responseData);
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
        <div className="flex items-center justify-center h-64">
          <div className="text-gray-500">加载中...</div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* 页面头部 */}
        <div className="max-w-5xl mx-auto mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                编辑{type === 'navigation' ? '网站导航' : '文章'}分类
              </h1>
              <p className="text-sm text-gray-500 mt-1">修改分类信息</p>
            </div>
            <button
              onClick={() => router.back()}
              className="px-4 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
            >
              ← 返回
            </button>
          </div>
        </div>

        {/* 表单容器 */}
        <div className="max-w-5xl mx-auto">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200">
            <form onSubmit={handleSubmit} className="p-8 space-y-6">
          {/* 分类名称 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              分类名称 <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="例如：前端开发、设计工具"
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* URL别名 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              URL别名 <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="slug"
              value={formData.slug}
              onChange={handleChange}
              placeholder="例如：frontend、design-tools"
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <p className="mt-1 text-sm text-gray-500">
              用于URL，建议使用英文或拼音
            </p>
          </div>

          {/* 图标 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              图标 Emoji
            </label>
            <input
              type="text"
              name="icon"
              value={formData.icon}
              onChange={handleChange}
              placeholder="😀"
              maxLength={2}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <p className="mt-1 text-sm text-gray-500">
              输入一个 Emoji 表情作为分类图标
            </p>
          </div>

          {/* 显示模式（仅网站分类） */}
          {type === 'navigation' && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  卡片显示模式 <span className="text-red-500">*</span>
                </label>
                <div className="space-y-3">
                  {/* 模式A：4列大图 */}
                  <label className="flex items-start p-4 border-2 rounded-lg cursor-pointer transition-all hover:border-blue-300 hover:bg-blue-50/50 has-[:checked]:border-blue-500 has-[:checked]:bg-blue-50">
                    <input
                      type="radio"
                      name="displayMode"
                      value="large"
                      checked={formData.displayMode === 'large'}
                      onChange={(e) => {
                        handleChange(e);
                        setFormData(prev => ({ ...prev, cardsPerRow: 4 }));
                      }}
                      className="mt-1 mr-3"
                    />
                    <div className="flex-1">
                      <div className="font-medium text-gray-900">
                        📸 大图模式（4列）
                      </div>
                      <div className="text-sm text-gray-600 mt-1">
                        横向大图展示，只显示图片和标题，适合热门推荐、活动展示
                      </div>
                    </div>
                  </label>

                  {/* 模式B：5列按钮 */}
                  <label className="flex items-start p-4 border-2 rounded-lg cursor-pointer transition-all hover:border-blue-300 hover:bg-blue-50/50 has-[:checked]:border-blue-500 has-[:checked]:bg-blue-50">
                    <input
                      type="radio"
                      name="displayMode"
                      value="button"
                      checked={formData.displayMode === 'button'}
                      onChange={(e) => {
                        handleChange(e);
                        setFormData(prev => ({ ...prev, cardsPerRow: 5 }));
                      }}
                      className="mt-1 mr-3"
                    />
                    <div className="flex-1">
                      <div className="font-medium text-gray-900">
                        🔘 按钮模式（5列）
                      </div>
                      <div className="text-sm text-gray-600 mt-1">
                        显示Logo+标题+描述，底部带可配置按钮，适合培训课程、服务展示
                      </div>
                    </div>
                  </label>

                  {/* 模式C：6列紧凑 */}
                  <label className="flex items-start p-4 border-2 rounded-lg cursor-pointer transition-all hover:border-blue-300 hover:bg-blue-50/50 has-[:checked]:border-blue-500 has-[:checked]:bg-blue-50">
                    <input
                      type="radio"
                      name="displayMode"
                      value="compact"
                      checked={formData.displayMode === 'compact'}
                      onChange={(e) => {
                        handleChange(e);
                        setFormData(prev => ({ ...prev, cardsPerRow: 6 }));
                      }}
                      className="mt-1 mr-3"
                    />
                    <div className="flex-1">
                      <div className="font-medium text-gray-900">
                        📋 紧凑模式（6列）
                      </div>
                      <div className="text-sm text-gray-600 mt-1">
                        Logo+标题+简介，紧凑排版，适合工具导航、快速浏览
                      </div>
                    </div>
                  </label>
                </div>
              </div>
            </>
          )}

          {/* 排序 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              排序序号
            </label>
            <input
              type="number"
              name="order"
              value={formData.order}
              onChange={handleChange}
              min="0"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <p className="mt-1 text-sm text-gray-500">
              数字越小越靠前，默认为 0
            </p>
          </div>

          {/* 描述 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              分类描述
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={3}
              placeholder="简单描述该分类的内容..."
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* 底部操作栏 */}
          <div className="flex items-center justify-between pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={() => router.back()}
              className="px-6 py-2.5 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors font-medium"
            >
              取消
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-8 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed font-medium shadow-sm"
            >
              {submitting ? '保存中...' : '💾 保存修改'}
            </button>
          </div>
        </form>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
