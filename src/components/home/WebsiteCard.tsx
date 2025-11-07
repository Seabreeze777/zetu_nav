/**
 * 网站卡片组件
 * 
 * 支持三种显示模式：
 * - large: 4列大图模式（横向大图+标题）
 * - button: 5列按钮模式（Logo+标题+描述+扩展按钮）
 * - compact: 6列紧凑模式（Logo+标题+简介）
 */

'use client'

import ImageWithFallback from '@/components/common/ImageWithFallback'

interface ActionButton {
  text: string
  url: string
}

interface WebsiteCardProps {
  name: string
  description: string
  logo?: string
  url: string
  tags?: string[]
  displayMode?: 'large' | 'button' | 'compact'
  actionButtons?: ActionButton[]
  // 兼容旧的size参数
  size?: 'small' | 'medium' | 'large'
  // 骨架屏加载状态
  isLoading?: boolean
}

export default function WebsiteCard({
  name,
  description,
  logo,
  url,
  tags = [],
  displayMode,
  actionButtons = [],
  size,
  isLoading = false,
}: WebsiteCardProps) {
  // 兼容旧的size参数，转换为displayMode
  const mode = displayMode || (
    size === 'large' ? 'compact' : 
    size === 'medium' ? 'compact' : 
    'compact'
  )

  const handleMainClick = (e: React.MouseEvent) => {
    // 如果点击的是按钮，不触发主卡片点击
    if ((e.target as HTMLElement).closest('button')) {
      return
    }
    window.open(url, '_blank')
  }

  const handleButtonClick = (e: React.MouseEvent, buttonUrl: string) => {
    e.stopPropagation()
    window.open(buttonUrl, '_blank')
  }

  // ========== 模式A：大图模式（4列） ==========
  if (mode === 'large') {
    return (
      <div
        onClick={isLoading ? undefined : handleMainClick}
        className="group cursor-pointer rounded-xl bg-white overflow-hidden
          shadow-[0_1px_3px_rgba(0,0,0,0.05),0_8px_16px_rgba(0,0,0,0.08)]
          hover:shadow-[0_4px_6px_rgba(0,0,0,0.07),0_20px_30px_rgba(0,0,0,0.1)]
          hover:-translate-y-1
          active:scale-[0.98]
          transition-all duration-300 ease-out"
      >
        {/* 大封面图 */}
        <div className="relative w-full aspect-video bg-gradient-to-br from-indigo-50 to-purple-50">
          {isLoading ? (
            <div className="w-full h-full bg-gray-200 animate-pulse" />
          ) : (
            <ImageWithFallback
              src={logo}
              alt={name}
              className="w-full h-full object-cover"
              type="website"
              fallbackText={name}
            />
          )}
        </div>
        
        {/* 标题 */}
        <div className="p-4">
          {isLoading ? (
            <div className="h-4 bg-gray-200 rounded w-3/4 animate-pulse" />
          ) : (
            <h3 className="font-semibold text-base text-gray-900 truncate group-hover:text-indigo-600 transition-colors duration-300">
              {name}
            </h3>
          )}
        </div>
      </div>
    )
  }

  // ========== 模式B：按钮模式（5列） ==========
  if (mode === 'button') {
    return (
      <div
        onClick={isLoading ? undefined : handleMainClick}
        className="group cursor-pointer rounded-xl bg-white p-3 flex flex-col
          shadow-[0_1px_3px_rgba(0,0,0,0.05),0_8px_16px_rgba(0,0,0,0.08)]
          hover:shadow-[0_4px_6px_rgba(0,0,0,0.07),0_20px_30px_rgba(0,0,0,0.1)]
          hover:-translate-y-1
          active:scale-[0.98]
          transition-all duration-300 ease-out"
      >
        {/* Logo 和标题 */}
        <div className="flex items-start gap-2.5 mb-2">
          <div className="flex-shrink-0 rounded-lg overflow-hidden h-10 w-10">
            {isLoading ? (
              <div className="h-10 w-10 bg-gray-200 animate-pulse rounded-lg" />
            ) : (
              <ImageWithFallback
                src={logo}
                alt={name}
                className="h-10 w-10 object-cover"
                type="website"
                fallbackText={name}
              />
            )}
          </div>
          <div className="flex-1 min-w-0">
            {isLoading ? (
              <div className="h-4 bg-gray-200 rounded w-full animate-pulse" />
            ) : (
              <h3 className="font-semibold text-sm text-gray-900 line-clamp-1 group-hover:text-indigo-600 transition-colors duration-300">
                {name}
              </h3>
            )}
          </div>
        </div>

        {/* 描述 */}
        {isLoading ? (
          <div className="space-y-1.5 mb-2.5">
            <div className="h-3 bg-gray-200 rounded w-full animate-pulse" />
            <div className="h-3 bg-gray-200 rounded w-4/5 animate-pulse" />
          </div>
        ) : (
          <p className="text-xs text-gray-500 line-clamp-2 mb-2.5">
            {description}
          </p>
        )}

        {/* 扩展按钮区域（始终占位，保持高度一致） */}
        <div className="flex flex-wrap gap-1.5 min-h-[28px]">
          {isLoading ? (
            <>
              <div className="flex-1 h-7 bg-gray-200 rounded animate-pulse" />
              <div className="flex-1 h-7 bg-gray-200 rounded animate-pulse" />
              <div className="flex-1 h-7 bg-gray-200 rounded animate-pulse" />
            </>
          ) : (
            actionButtons && actionButtons.length > 0 ? (
              actionButtons.slice(0, 3).map((btn, index) => (
                <button
                  key={index}
                  onClick={(e) => handleButtonClick(e, btn.url)}
                  className="flex-1 min-w-0 px-2.5 py-1.5 text-xs font-medium text-gray-600 bg-gray-50 border border-gray-200 rounded 
                    hover:bg-gray-100 hover:border-gray-300 hover:text-gray-900
                    transition-all duration-200 ease-out text-center truncate"
                  title={btn.text}
                >
                  {btn.text}
                </button>
              ))
            ) : null
          )}
        </div>
      </div>
    )
  }

  // ========== 模式C：紧凑模式（6列，默认） ==========
  return (
    <div
      onClick={isLoading ? undefined : handleMainClick}
      className="group cursor-pointer rounded-xl bg-white p-4 
        shadow-[0_1px_3px_rgba(0,0,0,0.05),0_8px_16px_rgba(0,0,0,0.08)]
        hover:shadow-[0_4px_6px_rgba(0,0,0,0.07),0_20px_30px_rgba(0,0,0,0.1)]
        hover:-translate-y-1
        active:scale-[0.98]
        transition-all duration-300 ease-out"
    >
      {/* Logo 和标题 */}
      <div className="flex items-start gap-3 mb-2">
        <div className="flex-shrink-0 rounded-lg overflow-hidden h-10 w-10">
          {isLoading ? (
            <div className="h-10 w-10 bg-gray-200 animate-pulse rounded-lg" />
          ) : (
            <ImageWithFallback
              src={logo}
              alt={name}
              className="h-10 w-10 object-cover"
              type="website"
              fallbackText={name}
            />
          )}
        </div>
        <div className="flex-1 min-w-0">
          {isLoading ? (
            <div className="h-4 bg-gray-200 rounded w-full animate-pulse" />
          ) : (
            <h3 className="font-semibold text-sm text-gray-900 truncate group-hover:text-indigo-600 transition-colors duration-300">
              {name}
            </h3>
          )}
        </div>
      </div>

      {/* 简介 */}
      {isLoading ? (
        <div className="h-3 bg-gray-200 rounded w-4/5 animate-pulse" />
      ) : (
        <p className="text-xs text-gray-400 line-clamp-1 leading-tight">
          {description}
        </p>
      )}
    </div>
  )
}

