'use client';

import { useEffect } from 'react';

/**
 * 全局错误页面
 * 捕获根布局和根错误边界的错误
 */
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('全局错误:', error);
  }, [error]);

  return (
    <html>
      <body>
        <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-orange-50 flex items-center justify-center px-4">
          <div className="text-center max-w-2xl">
            <div className="mb-8">
              <div className="text-8xl mb-4">💥</div>
              <h1 className="text-6xl font-bold bg-gradient-to-r from-red-600 to-orange-600 bg-clip-text text-transparent">
                系统错误
              </h1>
            </div>

            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              网站遇到了严重问题
            </h2>
            <p className="text-lg text-gray-600 mb-8">
              我们正在努力修复。请稍后再试。
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <button
                onClick={reset}
                className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                重新加载
              </button>
              <a
                href="/"
                className="px-8 py-3 border-2 border-gray-300 text-gray-700 rounded-lg hover:border-gray-400 hover:bg-gray-50 transition-colors font-medium"
              >
                返回首页
              </a>
            </div>
          </div>
        </div>
      </body>
    </html>
  );
}

