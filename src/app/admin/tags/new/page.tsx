'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import AdminLayout from '@/components/admin/AdminLayout';
import { useToast } from '@/contexts/ToastContext';

const PRESET_COLORS = [
  { name: '蓝色', value: '#3B82F6' },
  { name: '绿色', value: '#10B981' },
  { name: '红色', value: '#EF4444' },
  { name: '黄色', value: '#F59E0B' },
  { name: '紫色', value: '#8B5CF6' },
  { name: '粉色', value: '#EC4899' },
  { name: '青色', value: '#06B6D4' },
  { name: '橙色', value: '#F97316' },
  { name: '灰色', value: '#6B7280' },
  { name: '深蓝', value: '#1E40AF' },
];

export default function NewTagPage() {
  const router = useRouter();
  const toast = useToast();
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    color: '#3B82F6',
  });
  const [submitting, setSubmitting] = useState(false);

  // 自动生成 slug（拼音或英文）
  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[^\w\-\u4e00-\u9fa5]+/g, '');
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
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
      const response = await fetch('/api/admin/tags', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        toast.success('创建成功！');
        router.push('/admin/tags');
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
        <div className="max-w-3xl mx-auto mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">添加标签</h1>
              <p className="text-sm text-gray-500 mt-1">创建新的文章标签</p>
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
        <div className="max-w-3xl mx-auto">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200">
            <form onSubmit={handleSubmit} className="p-8 space-y-6">
          {/* 标签名称 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              标签名称 <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="例如：JavaScript、React、设计"
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
              placeholder="例如：javascript、react、design"
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <p className="mt-1 text-sm text-gray-500">
              用于URL，建议使用英文或拼音，自动从标签名称生成
            </p>
          </div>

          {/* 颜色选择 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              标签颜色
            </label>
            
            {/* 预设颜色 */}
            <div className="grid grid-cols-5 gap-3 mb-4">
              {PRESET_COLORS.map((preset) => (
                <button
                  key={preset.value}
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, color: preset.value }))}
                  className={`flex flex-col items-center gap-2 p-3 rounded-lg border-2 transition-all ${
                    formData.color === preset.value
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div
                    className="w-10 h-10 rounded-lg shadow-sm"
                    style={{ backgroundColor: preset.value }}
                  />
                  <span className="text-xs text-gray-600">{preset.name}</span>
                </button>
              ))}
            </div>

            {/* 自定义颜色 */}
            <div className="flex items-center gap-3">
              <label className="text-sm text-gray-600">自定义颜色：</label>
              <input
                type="color"
                name="color"
                value={formData.color}
                onChange={handleChange}
                className="h-10 w-20 border border-gray-300 rounded cursor-pointer"
              />
              <input
                type="text"
                value={formData.color}
                onChange={(e) => setFormData(prev => ({ ...prev, color: e.target.value }))}
                placeholder="#3B82F6"
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* 预览 */}
            <div className="mt-4 p-4 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-600 mb-2">预览效果：</p>
              <span
                className="inline-block px-3 py-1 text-xs rounded-full text-white font-medium"
                style={{ backgroundColor: formData.color }}
              >
                {formData.name || '标签预览'}
              </span>
            </div>
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
              {submitting ? '创建中...' : '✨ 创建标签'}
            </button>
          </div>
        </form>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}

