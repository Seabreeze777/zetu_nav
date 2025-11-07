'use client'

interface PaginationProps {
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
  showPageNumbers?: number // 显示多少个页码
}

export default function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  showPageNumbers = 5
}: PaginationProps) {
  if (totalPages <= 1) return null

  // 计算显示的页码范围
  const getPageNumbers = () => {
    const pages: (number | string)[] = []
    const halfShow = Math.floor(showPageNumbers / 2)
    
    let startPage = Math.max(1, currentPage - halfShow)
    let endPage = Math.min(totalPages, currentPage + halfShow)

    // 调整范围以始终显示足够的页码
    if (endPage - startPage + 1 < showPageNumbers) {
      if (startPage === 1) {
        endPage = Math.min(totalPages, startPage + showPageNumbers - 1)
      } else {
        startPage = Math.max(1, endPage - showPageNumbers + 1)
      }
    }

    // 添加第一页
    if (startPage > 1) {
      pages.push(1)
      if (startPage > 2) pages.push('...')
    }

    // 添加中间页码
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i)
    }

    // 添加最后一页
    if (endPage < totalPages) {
      if (endPage < totalPages - 1) pages.push('...')
      pages.push(totalPages)
    }

    return pages
  }

  const pages = getPageNumbers()

  return (
    <div className="flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 sm:px-6">
      <div className="flex flex-1 justify-between sm:hidden">
        {/* 移动端简化版 */}
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          上一页
        </button>
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="relative ml-3 inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          下一页
        </button>
      </div>

      <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
        {/* 页面信息 */}
        <div>
          <p className="text-sm text-gray-700">
            第 <span className="font-medium">{currentPage}</span> 页，共{' '}
            <span className="font-medium">{totalPages}</span> 页
          </p>
        </div>

        {/* 页码按钮 */}
        <div>
          <nav className="isolate inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
            {/* 上一页 */}
            <button
              onClick={() => onPageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span className="sr-only">上一页</span>
              <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                <path fillRule="evenodd" d="M12.79 5.23a.75.75 0 01-.02 1.06L8.832 10l3.938 3.71a.75.75 0 11-1.04 1.08l-4.5-4.25a.75.75 0 010-1.08l4.5-4.25a.75.75 0 011.06.02z" clipRule="evenodd" />
              </svg>
            </button>

            {/* 页码 */}
            {pages.map((page, index) => {
              if (page === '...') {
                return (
                  <span
                    key={`ellipsis-${index}`}
                    className="relative inline-flex items-center px-4 py-2 text-sm font-semibold text-gray-700 ring-1 ring-inset ring-gray-300"
                  >
                    ...
                  </span>
                )
              }

              const pageNumber = page as number
              const isActive = pageNumber === currentPage

              return (
                <button
                  key={pageNumber}
                  onClick={() => onPageChange(pageNumber)}
                  className={`
                    relative inline-flex items-center px-4 py-2 text-sm font-semibold
                    ${isActive
                      ? 'z-10 bg-blue-600 text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600'
                      : 'text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:outline-offset-0'
                    }
                  `}
                >
                  {pageNumber}
                </button>
              )
            })}

            {/* 下一页 */}
            <button
              onClick={() => onPageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span className="sr-only">下一页</span>
              <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                <path fillRule="evenodd" d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z" clipRule="evenodd" />
              </svg>
            </button>
          </nav>
        </div>
      </div>
    </div>
  )
}

