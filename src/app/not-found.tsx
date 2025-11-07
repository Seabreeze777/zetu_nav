import Link from 'next/link';

/**
 * 404 错误页面
 * 当访问不存在的页面时显示
 */
export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center px-4">
      <div className="text-center max-w-2xl">
        {/* 404 大标题 */}
        <div className="mb-8">
          <h1 className="text-9xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            404
          </h1>
          <div className="text-6xl mt-4">🔍</div>
        </div>

        {/* 错误信息 */}
        <h2 className="text-3xl font-bold text-gray-900 mb-4">
          页面不存在
        </h2>
        <p className="text-lg text-gray-600 mb-8">
          抱歉，你访问的页面不存在或已被删除。
          <br />
          请检查网址是否正确，或返回首页继续浏览。
        </p>

        {/* 操作按钮 */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href="/"
            className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium inline-flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            返回首页
          </Link>
          <Link
            href="/articles"
            className="px-8 py-3 border-2 border-gray-300 text-gray-700 rounded-lg hover:border-gray-400 hover:bg-gray-50 transition-colors font-medium inline-flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            浏览文章
          </Link>
        </div>

        {/* 友情提示 */}
        <div className="mt-12 p-6 bg-white rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">💡 你可能在找：</h3>
          <ul className="space-y-2 text-left max-w-md mx-auto">
            <li className="flex items-start gap-2">
              <span className="text-blue-600 mt-1">→</span>
              <div>
                <Link href="/" className="text-blue-600 hover:underline font-medium">
                  网站导航
                </Link>
                <span className="text-gray-600"> - 精选优质网站资源</span>
              </div>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-600 mt-1">→</span>
              <div>
                <Link href="/articles" className="text-blue-600 hover:underline font-medium">
                  文章列表
                </Link>
                <span className="text-gray-600"> - 阅读精彩技术文章</span>
              </div>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-600 mt-1">→</span>
              <div>
                <Link href="/search" className="text-blue-600 hover:underline font-medium">
                  搜索功能
                </Link>
                <span className="text-gray-600"> - 快速找到想要的内容</span>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}

