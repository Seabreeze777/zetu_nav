/**
 * 精选大卡片组件
 * 
 * 用于展示重点推荐的网站或活动
 * 特点：大尺寸、带图片、更丰富的信息
 */

'use client'

interface FeaturedCardProps {
  title: string
  description: string
  tags?: string[]
  imageColor?: string // 纯色背景色
  url: string
}

export default function FeaturedCard({
  title,
  description,
  tags = [],
  imageColor = '#3B82F6', // 默认蓝色
  url,
}: FeaturedCardProps) {
  const handleClick = () => {
    window.open(url, '_blank')
  }

  return (
    <div
      onClick={handleClick}
      className="group cursor-pointer rounded-2xl bg-white shadow-md transition-all hover:shadow-xl hover:-translate-y-1 overflow-hidden h-48"
    >
      <div className="flex h-full">
        {/* 左侧：纯色图片区 */}
        <div
          className="w-2/5 flex-shrink-0 flex items-center justify-center text-white text-6xl font-bold transition-all group-hover:scale-105"
          style={{ backgroundColor: imageColor }}
        >
          <div className="text-center">
            <div className="text-7xl">🎯</div>
          </div>
        </div>

        {/* 右侧：内容区 */}
        <div className="flex-1 p-5 flex flex-col justify-between">
          {/* 标题和描述 */}
          <div>
            <h3 className="text-base font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
              {title}
            </h3>
            <p className="text-xs text-gray-600 line-clamp-3 leading-relaxed">
              {description}
            </p>
          </div>

          {/* 底部标签 */}
          {tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mt-3">
              {tags.slice(0, 4).map((tag, index) => (
                <span
                  key={index}
                  className="px-2 py-0.5 text-[10px] font-medium rounded-md bg-blue-50 text-blue-600"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

