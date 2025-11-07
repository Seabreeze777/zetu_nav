// 网站卡片骨架屏 - 支持不同尺寸

interface WebsiteCardSkeletonProps {
  size?: 'small' | 'medium' | 'large'
}

export default function WebsiteCardSkeleton({ size = 'medium' }: WebsiteCardSkeletonProps) {
  const sizeClasses = {
    small: 'p-3',
    medium: 'p-4',
    large: 'p-5'
  }

  const logoSizes = {
    small: 'h-8 w-8',
    medium: 'h-10 w-10',
    large: 'h-12 w-12'
  }

  return (
    <div className={`bg-white rounded-xl shadow-sm ${sizeClasses[size]} animate-pulse`}>
      <div className="flex items-start gap-3">
        {/* Logo 骨架 */}
        <div className={`${logoSizes[size]} bg-gray-200 rounded-lg flex-shrink-0`}></div>
        
        {/* 内容骨架 */}
        <div className="flex-1 min-w-0">
          {/* 标题 */}
          <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
          
          {/* 描述 - 根据尺寸显示不同行数 */}
          {size !== 'small' && (
            <div className="space-y-1.5">
              <div className="h-3 bg-gray-200 rounded w-full"></div>
              {size === 'large' && (
                <>
                  <div className="h-3 bg-gray-200 rounded w-5/6"></div>
                  <div className="h-3 bg-gray-200 rounded w-4/5"></div>
                </>
              )}
            </div>
          )}
        </div>
      </div>

      {/* 标签骨架 - 只在 medium 和 large 显示 */}
      {size !== 'small' && (
        <div className="flex gap-1.5 mt-3">
          <div className="h-5 bg-gray-200 rounded-full w-12"></div>
          <div className="h-5 bg-gray-200 rounded-full w-16"></div>
        </div>
      )}
    </div>
  )
}

