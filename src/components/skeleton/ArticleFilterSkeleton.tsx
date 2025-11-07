// 文章过滤侧边栏骨架屏

export default function ArticleFilterSkeleton() {
  return (
    <aside className="w-48 flex-shrink-0">
      <div className="sticky top-20">
        {/* 分类过滤骨架 */}
        <div className="bg-white rounded-xl shadow-sm p-3 mb-4 animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-20 mb-3"></div>
          <div className="space-y-0.5">
            {[...Array(5)].map((_, index) => (
              <div key={index} className="flex items-center gap-2 px-3 py-2">
                <div className="h-4 w-4 bg-gray-200 rounded"></div>
                <div className="h-4 bg-gray-200 rounded flex-1"></div>
              </div>
            ))}
          </div>
        </div>

        {/* 排序方式骨架 */}
        <div className="bg-white rounded-xl shadow-sm p-3 animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-16 mb-3"></div>
          <div className="space-y-0.5">
            {[...Array(3)].map((_, index) => (
              <div key={index} className="flex items-center gap-2 px-3 py-2">
                <div className="h-4 w-4 bg-gray-200 rounded"></div>
                <div className="h-4 bg-gray-200 rounded flex-1"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </aside>
  )
}

