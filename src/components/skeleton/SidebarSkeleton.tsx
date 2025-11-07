// 侧边栏骨架屏

export default function SidebarSkeleton() {
  return (
    <aside className="w-40 flex-shrink-0">
      <div className="sticky top-20 rounded-xl bg-white shadow-sm p-2 animate-pulse">
        <div className="space-y-0.5">
          {/* 10个分类按钮骨架 */}
          {[...Array(10)].map((_, index) => (
            <div key={index} className="flex items-center gap-2 px-3 py-2">
              <div className="h-4 w-4 bg-gray-200 rounded"></div>
              <div className="h-4 bg-gray-200 rounded flex-1"></div>
            </div>
          ))}
        </div>
      </div>
    </aside>
  )
}

