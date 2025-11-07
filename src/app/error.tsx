'use client';

import { useEffect } from 'react';
import Link from 'next/link';

/**
 * 通用错误页面
 * 捕获应用中的运行时错误
 */
export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // 记录错误到控制台
    console.error('应用错误:', error);
  }, [error]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-orange-50 flex items-center justify-center px-4">
      <div className="text-center max-w-2xl">
        {/* 错误图标 */}
        <div className="mb-8">
          <div className="text-8xl mb-4">⚠️</div>
          <h1 className="text-6xl font-bold bg-gradient-to-r from-red-600 to-orange-600 bg-clip-text text-transparent">
            糟糕！
          </h1>
        </div>

        {/* 错误信息 */}
        <h2 className="text-3xl font-bold text-gray-900 mb-4">
          出现了一些问题
        </h2>
        <p className="text-lg text-gray-600 mb-8">
          我们遇到了一个意外错误。
          <br />
          请稍后重试，或联系管理员寻求帮助。
        </p>

        {/* 错误详情（开发环境） */}
        {process.env.NODE_ENV === 'development' && (
          <div className="mb-8 p-4 bg-red-50 border border-red-200 rounded-lg text-left">
            <p className="text-sm font-mono text-red-800 break-all">
              {error.message}
            </p>
            {error.digest && (
              <p className="text-xs text-red-600 mt-2">
                错误ID: {error.digest}
              </p>
            )}
          </div>
        )}

        {/* 操作按钮 */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            onClick={reset}
            className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium inline-flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            重新尝试
          </button>
          <Link
            href="/"
            className="px-8 py-3 border-2 border-gray-300 text-gray-700 rounded-lg hover:border-gray-400 hover:bg-gray-50 transition-colors font-medium inline-flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            返回首页
          </Link>
        </div>

        {/* 帮助信息 */}
        <div className="mt-12 p-6 bg-white rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">💬 需要帮助？</h3>
          <div className="text-sm text-gray-600 space-y-2">
            <p>如果问题持续存在，你可以：</p>
            <ul className="list-disc list-inside space-y-1 text-left max-w-md mx-auto">
              <li>刷新页面重新加载</li>
              <li>清除浏览器缓存后重试</li>
              <li>检查网络连接是否正常</li>
              <li>联系网站管理员反馈问题</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

