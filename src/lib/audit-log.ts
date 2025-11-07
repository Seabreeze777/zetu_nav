/**
 * 操作日志工具
 * 用于记录管理员操作，方便审计和追踪
 */

import prisma from './prisma'

export type AuditAction = 'CREATE' | 'UPDATE' | 'DELETE' | 'LOGIN' | 'LOGOUT' | 'VIEW'
export type AuditModule =
  | 'Website'
  | 'Article'
  | 'Category'
  | 'ArticleCategory'
  | 'Tag'
  | 'User'
  | 'Media'
  | 'SystemConfig'
  | 'NavigationMenu'
  | 'FloatingButton'
  | 'Auth'

interface CreateAuditLogParams {
  userId: number
  action: AuditAction
  module: AuditModule
  targetId?: number
  targetName?: string
  changes?: any
  ip?: string
  userAgent?: string
}

/**
 * 创建操作日志
 */
export async function createAuditLog(params: CreateAuditLogParams) {
  try {
    const log = await prisma.auditLog.create({
      data: {
        userId: params.userId,
        action: params.action,
        module: params.module,
        targetId: params.targetId,
        targetName: params.targetName,
        changes: params.changes ? JSON.parse(JSON.stringify(params.changes)) : null,
        ip: params.ip,
        userAgent: params.userAgent,
      },
    })
    return log
  } catch (error) {
    console.error('创建操作日志失败:', error)
    // 不要因为日志记录失败而影响业务
    return null
  }
}

/**
 * 获取请求的IP地址
 */
export function getClientIp(request: Request): string | undefined {
  // 尝试从各种headers获取真实IP
  const headers = [
    'x-real-ip',
    'x-forwarded-for',
    'cf-connecting-ip', // Cloudflare
    'x-client-ip',
  ]

  for (const header of headers) {
    const value = request.headers.get(header)
    if (value) {
      // x-forwarded-for可能包含多个IP，取第一个
      return value.split(',')[0].trim()
    }
  }

  return undefined
}

/**
 * 获取User-Agent
 */
export function getUserAgent(request: Request): string | undefined {
  return request.headers.get('user-agent') || undefined
}

/**
 * 记录创建操作
 */
export async function logCreate(
  request: Request,
  userId: number,
  module: AuditModule,
  targetId: number,
  targetName: string,
  data: any
) {
  return createAuditLog({
    userId,
    action: 'CREATE',
    module,
    targetId,
    targetName,
    changes: { created: data },
    ip: getClientIp(request),
    userAgent: getUserAgent(request),
  })
}

/**
 * 记录更新操作
 */
export async function logUpdate(
  request: Request,
  userId: number,
  module: AuditModule,
  targetId: number,
  targetName: string,
  before: any,
  after: any
) {
  return createAuditLog({
    userId,
    action: 'UPDATE',
    module,
    targetId,
    targetName,
    changes: { before, after },
    ip: getClientIp(request),
    userAgent: getUserAgent(request),
  })
}

/**
 * 记录删除操作
 */
export async function logDelete(
  request: Request,
  userId: number,
  module: AuditModule,
  targetId: number,
  targetName: string,
  data: any
) {
  return createAuditLog({
    userId,
    action: 'DELETE',
    module,
    targetId,
    targetName,
    changes: { deleted: data },
    ip: getClientIp(request),
    userAgent: getUserAgent(request),
  })
}

/**
 * 记录登录操作
 */
export async function logLogin(
  request: Request,
  userId: number,
  username: string
) {
  return createAuditLog({
    userId,
    action: 'LOGIN',
    module: 'Auth',
    targetName: username,
    ip: getClientIp(request),
    userAgent: getUserAgent(request),
  })
}

/**
 * 记录登出操作
 */
export async function logLogout(
  request: Request,
  userId: number,
  username: string
) {
  return createAuditLog({
    userId,
    action: 'LOGOUT',
    module: 'Auth',
    targetName: username,
    ip: getClientIp(request),
    userAgent: getUserAgent(request),
  })
}

