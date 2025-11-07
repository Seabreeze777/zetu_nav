'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import AdminLayout from '@/components/admin/AdminLayout';
import { useToast } from '@/contexts/ToastContext';

export default function NewCategoryPage() {
  const router = useRouter();
  const toast = useToast();
  const searchParams = useSearchParams();
  const type = searchParams.get('type') || 'navigation'; // 'navigation' 或 'article'

  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    description: '',
    icon: type === 'navigation' ? '📁' : '📝',
    cardsPerRow: 6,
    displayMode: 'compact', // 'large' | 'button' | 'compact'
    order: 0,
  });
  const [submitting, setSubmitting] = useState(false);

  // 自动生成 slug（拼音或英文）
  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[^\w\-\u4e00-\u9fa5]+/g, '');
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'cardsPerRow' || name === 'order' ? parseInt(value) || 0 : value
    }));

    // 当名称改变时，自动生成 slug（如果 slug 为空）
    if (name === 'name' && !formData.slug) {
      setFormData(prev => ({
        ...prev,
        slug: generateSlug(value)
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.slug) {
      toast.warning('请填写必填字段');
      return;
    }

    setSubmitting(true);

    try {
      const response = await fetch('/api/admin/categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type,
          ...formData,
          sortOrder: formData.order
        }),
      });

      if (response.ok) {
        toast.success('创建成功！');
        router.push(`/admin/categories?type=${type}`);
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
      <div className="p-6">
        {/* 页面头部 */}
        <div className="max-w-5xl mx-auto mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                添加{type === 'navigation' ? '网站导航' : '文章'}分类
              </h1>
              <p className="text-sm text-gray-500 mt-1">创建新的分类</p>
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
              用于URL，建议使用英文或拼音，自动从分类名称生成
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
              {submitting ? '创建中...' : '✨ 创建分类'}
            </button>
          </div>
        </form>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}

