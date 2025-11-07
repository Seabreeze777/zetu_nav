/**
 * SWR数据获取Hook
 * 实现智能缓存和自动重新验证
 */

import useSWR, { SWRConfiguration } from 'swr'

// 默认fetcher函数
const fetcher = async (url: string) => {
  const res = await fetch(url)
  if (!res.ok) {
    const error = new Error('请求失败')
    throw error
  }
  const data = await res.json()
  return data.success ? data.data : data
}

// 默认SWR配置
const defaultConfig: SWRConfiguration = {
  revalidateOnFocus: false, // 切换窗口时不重新加载
  revalidateOnReconnect: false, // 重新连接时不重新加载
  dedupingInterval: 60000, // 60秒内重复请求使用缓存
  shouldRetryOnError: false, // 错误时不自动重试
}

/**
 * 使用SWR获取数据（通用）
 * @param url API地址
 * @param config SWR配置
 */
export function useSWRFetch<T = any>(url: string | null, config?: SWRConfiguration) {
  const { data, error, isLoading, mutate } = useSWR<T>(
    url,
    fetcher,
    { ...defaultConfig, ...config }
  )

  return {
    data,
    error,
    isLoading,
    isFirstLoad: isLoading && !data, // 首次加载（显示骨架屏）
    isRefreshing: isLoading && data, // 刷新中（不显示骨架屏）
    mutate, // 手动重新验证
  }
}

/**
 * 获取网站列表（带缓存）
 */
export function useWebsites() {
  return useSWRFetch('/api/websites')
}

/**
 * 获取文章列表（带缓存）
 */
export function useArticles() {
  return useSWRFetch('/api/articles')
}

/**
 * 获取分类列表（带缓存）
 */
export function useCategories() {
  return useSWRFetch('/api/categories')
}

/**
 * 获取媒体列表（带缓存）
 * @param folder 文件夹名称
 */
export function useMedia(folder?: string) {
  const url = folder ? `/api/admin/media?folder=${folder}` : '/api/admin/media'
  return useSWRFetch(url)
}

/**
 * 获取系统配置（带缓存）
 */
export function useSystemConfig() {
  return useSWRFetch('/api/config', {
    dedupingInterval: 300000, // 5分钟缓存（配置不常变）
  })
}

/**
 * 搜索（不使用缓存，每次都重新请求）
 * @param query 搜索关键词
 */
export function useSearch(query: string | null) {
  return useSWRFetch(
    query ? `/api/search?q=${encodeURIComponent(query)}` : null,
    {
      dedupingInterval: 0, // 搜索不使用缓存
      revalidateOnFocus: false,
    }
  )
}

/**
 * 获取仪表盘统计（带缓存）
 */
export function useDashboardStats() {
  return useSWRFetch('/api/admin/dashboard/stats', {
    refreshInterval: 30000, // 每30秒自动刷新
  })
}

/**
 * 获取操作日志（带分页）
 */
export function useAuditLogs(page: number = 1, limit: number = 20) {
  return useSWRFetch(`/api/admin/audit-logs?page=${page}&limit=${limit}`)
}

