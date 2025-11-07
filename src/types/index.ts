// TypeScript 类型定义文件

// 分类类型
export interface Category {
  id: string
  name: string
  icon?: string
  sortOrder: number
  createdAt: Date
  updatedAt: Date
}

// 网站类型
export interface Website {
  id: string
  categoryId: string
  name: string
  url: string
  icon?: string
  description?: string
  sortOrder: number
  clickCount: number
  createdAt: Date
  updatedAt: Date
}

// API 响应类型
export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  message?: string
  error?: string
}

// 分页参数类型
export interface PaginationParams {
  page: number
  pageSize: number
}

// 分页响应类型
export interface PaginatedResponse<T> {
  success: boolean
  data: T[]
  pagination: {
    page: number
    pageSize: number
    total: number
    totalPages: number
  }
}

