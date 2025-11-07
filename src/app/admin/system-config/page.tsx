'use client';

import { useState, useEffect } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { useToast } from '@/contexts/ToastContext';

interface SystemConfig {
  id: number;
  category: string;
  key: string;
  value: string;
  label: string;
  description: string | null;
  type: string;
  isSecret: boolean;
  sortOrder: number;
}

interface ConfigsByCategory {
  [category: string]: SystemConfig[];
}

export default function SystemConfigPage() {
  const toast = useToast();
  const [configs, setConfigs] = useState<ConfigsByCategory>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<string>('cos');
  const [editedValues, setEditedValues] = useState<{ [id: number]: string }>({});
  const [showInitDialog, setShowInitDialog] = useState(false);
  const [initializing, setInitializing] = useState(false);

  // 分类配置
  const categories = {
    cos: { label: 'COS 对象存储', icon: '☁️', color: 'blue' },
    site: { label: '网站信息', icon: '🌐', color: 'green' },
  };

  // 加载配置
  const loadConfigs = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/admin/system-config');
      if (response.ok) {
        const result = await response.json();
        
        // 按分类分组
        const grouped: ConfigsByCategory = {};
        result.data.forEach((config: SystemConfig) => {
          if (!grouped[config.category]) {
            grouped[config.category] = [];
          }
          grouped[config.category].push(config);
        });
        
        setConfigs(grouped);

        // 如果没有任何配置，显示初始化对话框
        if (result.data.length === 0) {
          setShowInitDialog(true);
        }
      } else {
        toast.error('加载配置失败');
      }
    } catch (error) {
      console.error('加载配置失败:', error);
      toast.error('加载配置失败');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadConfigs();
  }, []);

  // 初始化配置
  const handleInitConfigs = async () => {
    setInitializing(true);
    try {
      const response = await fetch('/api/admin/system-config/init', {
        method: 'POST',
      });

      if (response.ok) {
        const result = await response.json();
        toast.success(result.message);
        setShowInitDialog(false);
        loadConfigs();
      } else {
        const error = await response.json();
        toast.error(error.error || '初始化失败');
      }
    } catch (error) {
      console.error('初始化配置失败:', error);
      toast.error('初始化配置失败');
    } finally {
      setInitializing(false);
    }
  };

  // 更新编辑值
  const handleValueChange = (id: number, value: string) => {
    setEditedValues(prev => ({ ...prev, [id]: value }));
  };

  // 保存配置（批量）
  const handleSave = async () => {
    const updates = Object.entries(editedValues).map(([id, value]) => ({
      id: parseInt(id),
      value,
    }));

    if (updates.length === 0) {
      toast.warning('没有需要保存的更改');
      return;
    }

    setSaving(true);
    try {
      const response = await fetch('/api/admin/system-config/batch-update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ configs: updates }),
      });

      if (response.ok) {
        toast.success('保存成功！');
        setEditedValues({});
        loadConfigs();
      } else {
        const error = await response.json();
        toast.error(error.error || '保存失败');
      }
    } catch (error) {
      console.error('保存配置失败:', error);
      toast.error('保存配置失败');
    } finally {
      setSaving(false);
    }
  };

  // 获取配置值（优先使用编辑值）
  const getConfigValue = (config: SystemConfig) => {
    return editedValues[config.id] !== undefined ? editedValues[config.id] : config.value;
  };

  const currentConfigs = configs[activeTab] || [];

  return (
    <AdminLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="space-y-6">
        {/* 页面标题 */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">系统配置</h1>
            <p className="mt-2 text-sm text-gray-600">
              在这里管理系统的各项配置，修改后无需重启服务
            </p>
          </div>
          <div className="flex items-center gap-3">
            {Object.keys(editedValues).length > 0 && (
              <div className="text-sm text-orange-600 bg-orange-50 px-3 py-2 rounded-lg">
                {Object.keys(editedValues).length} 项未保存
              </div>
            )}
            <button
              onClick={() => setShowInitDialog(true)}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              初始化配置
            </button>
            <button
              onClick={handleSave}
              disabled={saving || Object.keys(editedValues).length === 0}
              className="px-6 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {saving ? '保存中...' : '保存更改'}
            </button>
          </div>
        </div>

        {/* 分类标签 */}
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            {Object.entries(categories).map(([key, cat]) => (
              <button
                key={key}
                onClick={() => setActiveTab(key)}
                className={`
                  flex items-center gap-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors
                  ${activeTab === key
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }
                `}
              >
                <span className="text-xl">{cat.icon}</span>
                {cat.label}
                {configs[key] && (
                  <span className={`ml-2 px-2 py-0.5 text-xs rounded-full bg-${cat.color}-100 text-${cat.color}-700`}>
                    {configs[key].length}
                  </span>
                )}
              </button>
            ))}
          </nav>
        </div>

        {/* 配置表单 */}
        <div className="bg-white shadow-sm rounded-lg border border-gray-200">
          {loading ? (
            <div className="p-12 text-center">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <p className="mt-4 text-gray-500">加载中...</p>
            </div>
          ) : currentConfigs.length === 0 ? (
            <div className="p-12 text-center">
              <div className="text-6xl mb-4">📦</div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">暂无配置</h3>
              <p className="text-gray-500 mb-4">该分类下还没有任何配置项</p>
              <button
                onClick={() => setShowInitDialog(true)}
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700"
              >
                立即初始化
              </button>
            </div>
          ) : (
            <div className="p-6 space-y-6">
              {currentConfigs.map((config) => (
                <div key={config.id} className="space-y-2">
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                    {config.label}
                    {config.isSecret && (
                      <span className="px-2 py-0.5 text-xs bg-red-100 text-red-700 rounded">
                        敏感信息
                      </span>
                    )}
                  </label>
                  
                  {config.description && (
                    <p className="text-xs text-gray-500">{config.description}</p>
                  )}

                  {config.type === 'textarea' ? (
                    <textarea
                      value={getConfigValue(config)}
                      onChange={(e) => handleValueChange(config.id, e.target.value)}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder={`请输入${config.label}`}
                    />
                  ) : (
                    <input
                      type={config.type === 'password' ? 'password' : 'text'}
                      value={getConfigValue(config)}
                      onChange={(e) => handleValueChange(config.id, e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder={`请输入${config.label}`}
                    />
                  )}

                  <div className="flex items-center justify-between text-xs">
                    <code className="text-gray-500 bg-gray-100 px-2 py-1 rounded">
                      {config.category}.{config.key}
                    </code>
                    {editedValues[config.id] !== undefined && (
                      <span className="text-orange-600">● 已修改</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* 使用说明 */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <div className="text-2xl">💡</div>
            <div className="flex-1 text-sm">
              <h4 className="font-medium text-blue-900 mb-2">配置说明</h4>
              <ul className="space-y-1 text-blue-700">
                <li>• 配置优先级：<strong>数据库配置</strong> &gt; 环境变量（.env）</li>
                <li>• 修改配置后，大约 <strong>1分钟</strong> 后生效（缓存刷新）</li>
                <li>• 敏感信息（如密钥）会被加密存储，显示为 ******</li>
                <li>• 如果数据库配置为空，系统会自动使用环境变量中的值</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      </div>

      {/* 初始化对话框 */}
      {showInitDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-bold text-gray-900 mb-4">初始化系统配置</h3>
            <p className="text-gray-600 mb-6">
              系统将从环境变量中读取当前配置，并创建默认的配置项。
              这不会覆盖已存在的配置。
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowInitDialog(false)}
                disabled={initializing}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 disabled:opacity-50"
              >
                取消
              </button>
              <button
                onClick={handleInitConfigs}
                disabled={initializing}
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50"
              >
                {initializing ? '初始化中...' : '确认初始化'}
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}

