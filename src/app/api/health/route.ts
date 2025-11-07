import { NextResponse } from 'next/server'

// 健康检查接口 - GET /api/health
export async function GET() {
  return NextResponse.json({
    status: 'ok',
    message: 'API 服务运行正常',
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  })
}

