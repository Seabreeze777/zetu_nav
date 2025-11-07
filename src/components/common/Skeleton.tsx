/**
 * 骨架屏组件
 * 用于首次加载时的占位显示，匹配实际布局
 */

// 基础骨架屏元素
export function SkeletonBox({ className = '' }: { className?: string }) {
  return (
    <div className={`animate-pulse bg-gray-200 rounded ${className}`}></div>
  )
}

// 网站卡片骨架屏
export function WebsiteCardSkeleton() {
  return (
    <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm">
      <div className="flex items-start gap-4">
        {/* Logo骨架 */}
        <SkeletonBox className="w-12 h-12 flex-shrink-0 rounded-lg" />
        
        {/* 内容骨架 */}
        <div className="flex-1 space-y-3">
          {/* 标题 */}
          <SkeletonBox className="h-5 w-3/4" />
          {/* 描述第一行 */}
          <SkeletonBox className="h-4 w-full" />
          {/* 描述第二行 */}
          <SkeletonBox className="h-4 w-5/6" />
        </div>
      </div>
      
      {/* 底部标签骨架 */}
      <div className="mt-4 flex gap-2">
        <SkeletonBox className="h-6 w-16" />
        <SkeletonBox className="h-6 w-20" />
      </div>
    </div>
  )
}

// 文章卡片骨架屏
export function ArticleCardSkeleton() {
  return (
    <div className="bg-white rounded-xl overflow-hidden border border-gray-100 shadow-sm">
      {/* 封面图骨架 */}
      <SkeletonBox className="w-full h-48" />
      
      {/* 内容骨架 */}
      <div className="p-6 space-y-3">
        {/* 标题 */}
        <SkeletonBox className="h-6 w-4/5" />
        {/* 描述第一行 */}
        <SkeletonBox className="h-4 w-full" />
        {/* 描述第二行 */}
        <SkeletonBox className="h-4 w-3/4" />
        
        {/* 底部信息 */}
        <div className="flex items-center gap-4 mt-4">
          <SkeletonBox className="h-4 w-20" />
          <SkeletonBox className="h-4 w-24" />
        </div>
      </div>
    </div>
  )
}

// 分类骨架屏
export function CategorySkeleton() {
  return (
    <div className="space-y-4">
      {/* 分类标题 */}
      <div className="flex items-center gap-3 mb-4">
        <SkeletonBox className="w-8 h-8 rounded-lg" />
        <SkeletonBox className="h-6 w-32" />
      </div>
      
      {/* 卡片网格 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <WebsiteCardSkeleton />
        <WebsiteCardSkeleton />
        <WebsiteCardSkeleton />
        <WebsiteCardSkeleton />
        <WebsiteCardSkeleton />
        <WebsiteCardSkeleton />
      </div>
    </div>
  )
}

// 首页骨架屏（根据实际分类配置）
interface HomeSkeletonProps {
  categoriesCount?: number
  cardsPerCategory?: number
}

export function HomeSkeleton({ 
  categoriesCount = 3, 
  cardsPerCategory = 6 
}: HomeSkeletonProps) {
  return (
    <div className="space-y-12">
      {[...Array(categoriesCount)].map((_, catIndex) => (
        <div key={catIndex} className="space-y-6">
          {/* 分类标题骨架 */}
          <div className="flex items-center gap-4">
            <SkeletonBox className="w-10 h-10 rounded-xl" />
            <div className="flex-1">
              <SkeletonBox className="h-7 w-32 mb-2" />
              <SkeletonBox className="h-4 w-48" />
            </div>
          </div>
          
          {/* 网站卡片网格骨架 */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(cardsPerCategory)].map((_, cardIndex) => (
              <WebsiteCardSkeleton key={cardIndex} />
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}

// 列表骨架屏（用于文章列表等）
interface ListSkeletonProps {
  count?: number
  type?: 'website' | 'article'
}

export function ListSkeleton({ count = 10, type = 'website' }: ListSkeletonProps) {
  const SkeletonComponent = type === 'article' ? ArticleCardSkeleton : WebsiteCardSkeleton
  
  return (
    <div className="space-y-4">
      {[...Array(count)].map((_, index) => (
        <SkeletonComponent key={index} />
      ))}
    </div>
  )
}

// 表格行骨架屏（用于后台管理列表）
export function TableRowSkeleton({ columns = 5 }: { columns?: number }) {
  return (
    <tr className="border-b border-gray-200">
      {[...Array(columns)].map((_, index) => (
        <td key={index} className="px-6 py-4">
          <SkeletonBox className="h-5 w-full" />
        </td>
      ))}
    </tr>
  )
}

// 表格骨架屏
export function TableSkeleton({ rows = 10, columns = 5 }: { rows?: number; columns?: number }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <tbody>
          {[...Array(rows)].map((_, index) => (
            <TableRowSkeleton key={index} columns={columns} />
          ))}
        </tbody>
      </table>
    </div>
  )
}

