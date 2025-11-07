// 文章列表卡片骨架屏 - 和真实卡片布局完全一致

export default function ArticleListCardSkeleton() {
  return (
    <div className="block bg-white rounded-2xl overflow-hidden shadow-sm animate-pulse">
      {/* 顶部：封面图骨架 - h-36 和真实卡片一致 */}
      <div className="h-36 bg-gradient-to-br from-gray-200 to-gray-300" />

      {/* 底部：内容骨架 */}
      <div className="p-5">
        {/* 标题骨架 - 2行 */}
        <div className="space-y-2 mb-3">
          <div className="h-5 bg-gray-200 rounded w-full"></div>
          <div className="h-5 bg-gray-200 rounded w-3/4"></div>
        </div>

        {/* 描述骨架 - 4行 */}
        <div className="space-y-2 mb-4">
          <div className="h-4 bg-gray-200 rounded w-full"></div>
          <div className="h-4 bg-gray-200 rounded w-full"></div>
          <div className="h-4 bg-gray-200 rounded w-5/6"></div>
          <div className="h-4 bg-gray-200 rounded w-4/5"></div>
        </div>

        {/* 标签骨架 - 3个 */}
        <div className="flex gap-2 mb-4">
          <div className="h-6 bg-gray-200 rounded-full w-16"></div>
          <div className="h-6 bg-gray-200 rounded-full w-20"></div>
          <div className="h-6 bg-gray-200 rounded-full w-14"></div>
        </div>

        {/* 底部信息骨架 */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
          <div className="flex items-center gap-3">
            <div className="h-3 bg-gray-200 rounded w-16"></div>
            <div className="h-3 bg-gray-200 rounded w-20"></div>
          </div>
          <div className="flex items-center gap-3">
            <div className="h-3 bg-gray-200 rounded w-12"></div>
            <div className="h-3 bg-gray-200 rounded w-12"></div>
          </div>
        </div>
      </div>
    </div>
  )
}

