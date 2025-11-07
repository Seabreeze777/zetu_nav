'use client'

import { useState } from 'react'

export default function TestAPIPage() {
  const [results, setResults] = useState<any>({})

  const testAPI = async (endpoint: string, name: string) => {
    try {
      const res = await fetch(endpoint)
      const data = await res.json()
      setResults((prev: any) => ({
        ...prev,
        [name]: { success: res.ok, data }
      }))
    } catch (error: any) {
      setResults((prev: any) => ({
        ...prev,
        [name]: { success: false, error: error.message }
      }))
    }
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">API 测试页面</h1>

      <div className="space-y-4">
        <button
          onClick={() => testAPI('/api/categories', 'categories')}
          className="px-4 py-2 bg-blue-500 text-white rounded mr-2"
        >
          测试 /api/categories
        </button>

        <button
          onClick={() => testAPI('/api/websites', 'websites')}
          className="px-4 py-2 bg-green-500 text-white rounded mr-2"
        >
          测试 /api/websites
        </button>

        <button
          onClick={() => testAPI('/api/admin/categories?type=navigation', 'adminCategories')}
          className="px-4 py-2 bg-purple-500 text-white rounded"
        >
          测试 /api/admin/categories
        </button>
      </div>

      <div className="mt-8">
        <h2 className="text-xl font-bold mb-4">测试结果：</h2>
        <pre className="bg-gray-100 p-4 rounded overflow-auto max-h-96">
          {JSON.stringify(results, null, 2)}
        </pre>
      </div>
    </div>
  )
}

