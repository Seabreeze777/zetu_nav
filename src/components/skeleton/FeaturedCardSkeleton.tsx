// 大卡片骨架屏

export default function FeaturedCardSkeleton() {
  return (
    <div className="bg-white rounded-2xl shadow-sm overflow-hidden h-48 animate-pulse">
      <div className="flex h-full">
        {/* 左侧色块骨架 */}
        <div className="w-32 flex-shrink-0 bg-gradient-to-br from-gray-200 to-gray-300"></div>

        {/* 右侧内容骨架 */}
        <div className="flex-1 p-6 flex flex-col justify-between">
          {/* 标题和描述 */}
          <div>
            <div className="h-6 bg-gray-200 rounded w-3/4 mb-3"></div>
            <div className="space-y-2">
              <div className="h-4 bg-gray-200 rounded w-full"></div>
              <div className="h-4 bg-gray-200 rounded w-5/6"></div>
              <div className="h-4 bg-gray-200 rounded w-4/5"></div>
            </div>
          </div>

          {/* 标签骨架 */}
          <div className="flex gap-2">
            <div className="h-6 bg-gray-200 rounded-full w-16"></div>
            <div className="h-6 bg-gray-200 rounded-full w-20"></div>
            <div className="h-6 bg-gray-200 rounded-full w-14"></div>
          </div>
        </div>
      </div>
    </div>
  )
}

