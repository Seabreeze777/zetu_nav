// Hero 区域骨架屏

export default function HeroSectionSkeleton() {
  return (
    <div className="bg-gray-50 pb-3">
      <div className="container mx-auto px-6">
        <div className="bg-gradient-to-br from-gray-200 via-gray-300 to-gray-200 rounded-3xl shadow-xl p-8 animate-pulse">
          <div className="max-w-2xl mx-auto">
            {/* 标题骨架 */}
            <div className="h-10 bg-white/30 rounded-lg w-64 mb-4"></div>
            
            {/* 描述骨架 */}
            <div className="h-6 bg-white/30 rounded-lg w-96 mb-6"></div>
            
            {/* 搜索框骨架 */}
            <div className="h-12 bg-white/50 rounded-xl w-full"></div>
          </div>
        </div>
      </div>
    </div>
  )
}

