/**
 * 时间格式化工具
 */

/**
 * 格式化日期时间
 * @param date 日期字符串或Date对象
 * @param format 格式，默认 'YYYY-MM-DD HH:mm:ss'
 * @returns 格式化后的时间字符串
 */
export function formatDateTime(
  date: string | Date | null | undefined,
  format: 'full' | 'date' | 'time' | 'relative' = 'full'
): string {
  if (!date) return '-'

  const d = new Date(date)
  
  // 检查是否是有效日期
  if (isNaN(d.getTime())) return '-'

  const year = d.getFullYear()
  const month = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  const hours = String(d.getHours()).padStart(2, '0')
  const minutes = String(d.getMinutes()).padStart(2, '0')
  const seconds = String(d.getSeconds()).padStart(2, '0')

  switch (format) {
    case 'full':
      // 完整格式：2025-11-05 20:58:36
      return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`
    
    case 'date':
      // 仅日期：2025-11-05
      return `${year}-${month}-${day}`
    
    case 'time':
      // 仅时间：20:58:36
      return `${hours}:${minutes}:${seconds}`
    
    case 'relative':
      // 相对时间：刚刚、5分钟前、今天 15:30、昨天、2025-11-05
      return formatRelativeTime(d)
    
    default:
      return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`
  }
}

/**
 * 格式化相对时间
 */
function formatRelativeTime(date: Date): string {
  const now = new Date()
  const diff = now.getTime() - date.getTime()
  const seconds = Math.floor(diff / 1000)
  const minutes = Math.floor(seconds / 60)
  const hours = Math.floor(minutes / 60)
  const days = Math.floor(hours / 24)

  // 1分钟内
  if (seconds < 60) {
    return '刚刚'
  }

  // 1小时内
  if (minutes < 60) {
    return `${minutes}分钟前`
  }

  // 今天
  if (days === 0) {
    const h = String(date.getHours()).padStart(2, '0')
    const m = String(date.getMinutes()).padStart(2, '0')
    return `今天 ${h}:${m}`
  }

  // 昨天
  if (days === 1) {
    const h = String(date.getHours()).padStart(2, '0')
    const m = String(date.getMinutes()).padStart(2, '0')
    return `昨天 ${h}:${m}`
  }

  // 7天内
  if (days < 7) {
    return `${days}天前`
  }

  // 超过7天显示完整日期
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

/**
 * 格式化ISO日期字符串（用于文章列表）
 */
export function formatArticleDate(dateString: string | null | undefined): string {
  return formatDateTime(dateString, 'full')
}

