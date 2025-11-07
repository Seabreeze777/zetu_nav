/**
 * SWR使用示例页面
 * 演示如何使用SWR进行数据缓存和智能骨架屏显示
 */

'use client'

import { useWebsites } from '@/hooks/useSWRFetch'
import { HomeSkeleton } from '@/components/common/Skeleton'

export default function SWRExamplePage() {
  // 使用SWR获取网站数据
  const { data: websites, error, isFirstLoad, isRefreshing } = useWebsites()

  // 首次加载且无缓存：显示骨架屏
  if (isFirstLoad) {
    return (
      <div className="container mx-auto px-4 py-8">
        <HomeSkeleton categoriesCount={3} cardsPerCategory={6} />
      </div>
    )
  }

  // 加载错误
  if (error) {
    return (
      <div className="container mx-auto px-4 py-8 text-center text-red-600">
        加载失败：{error.message}
      </div>
    )
  }

  // 显示数据（有缓存时不显示骨架屏，直接显示旧数据）
  return (
    <div className="container mx-auto px-4 py-8">
      {/* 刷新指示器（可选） */}
      {isRefreshing && (
        <div className="mb-4 p-3 bg-blue-50 text-blue-700 rounded-lg text-sm">
          正在刷新数据...
        </div>
      )}

      {/* 数据展示 */}
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">网站列表</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {websites?.map((website: any) => (
            <div key={website.id} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <h3 className="text-lg font-semibold mb-2">{website.name}</h3>
              <p className="text-gray-600 text-sm">{website.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

