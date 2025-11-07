import Link from 'next/link'
import ImageWithFallback from '@/components/common/ImageWithFallback'

interface ArticleListCardProps {
  slug: string
  title: string
  description: string
  coverImage?: string
  category: string
  tags: string[]
  author: string
  date: string
  readTime: string | number
  views: number
}

export default function ArticleListCard({
  slug,
  title,
  description,
  coverImage,
  category,
  tags,
  author,
  date,
  readTime,
  views
}: ArticleListCardProps) {
  return (
    <Link 
      href={`/posts/${slug}`}
      className="group block bg-white rounded-2xl overflow-hidden 
        shadow-[0_1px_3px_rgba(0,0,0,0.05),0_8px_16px_rgba(0,0,0,0.08)]
        hover:shadow-[0_4px_6px_rgba(0,0,0,0.07),0_20px_30px_rgba(0,0,0,0.1)]
        hover:-translate-y-1
        active:scale-[0.99]
        transition-all duration-300 ease-out"
    >
      {/* 顶部：封面图 */}
      <div className="relative h-48 bg-gray-100 overflow-hidden">
        <ImageWithFallback
          src={coverImage}
          alt={title}
          className="w-full h-full object-cover"
          type="article"
          fallbackText={title}
        />
        {/* 分类标签 */}
        <div className="absolute top-3 left-3">
          <span className="px-3 py-1 bg-white/90 backdrop-blur-sm text-indigo-600 text-xs font-medium rounded-full shadow-sm">
            {category}
          </span>
        </div>
      </div>

      {/* 底部：内容 */}
      <div className="p-5">
        {/* 标题 */}
        <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors line-clamp-2 leading-snug">
          {title}
        </h3>

        {/* 描述 */}
        <p className="text-gray-600 text-sm leading-relaxed line-clamp-3 mb-4">
          {description}
        </p>

        {/* 标签 */}
        <div className="flex flex-wrap gap-2 mb-4">
          {tags.slice(0, 3).map((tag) => (
            <span
              key={tag}
              className="px-2.5 py-0.5 bg-gray-100 text-gray-600 text-xs rounded-md"
            >
              {tag}
            </span>
          ))}
        </div>

        {/* 底部信息 */}
        <div className="flex items-center justify-between text-xs text-gray-500 pt-4 border-t border-gray-100">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1">
              <span>👤</span>
              {author}
            </span>
            <span className="flex items-center gap-1">
              <span>📅</span>
              {date}
            </span>
          </div>
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1">
              <span>⏱️</span>
              {readTime}
            </span>
            <span className="flex items-center gap-1">
              <span>👁️</span>
              {views >= 1000 ? `${(views / 1000).toFixed(1)}k` : views}
            </span>
          </div>
        </div>
      </div>
    </Link>
  )
}

