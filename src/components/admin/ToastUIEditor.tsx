/**
 * TOAST UI Editor 组件
 * 专业的Markdown编辑器，支持所见即所得和Markdown双模式
 */

'use client'

import { useRef, useEffect } from 'react'
import '@toast-ui/editor/dist/toastui-editor.css'
import '@toast-ui/editor/dist/theme/toastui-editor-dark.css'
import '@toast-ui/editor/dist/i18n/zh-cn' // 中文语言包
import 'prismjs/themes/prism.css'
import '@toast-ui/editor-plugin-code-syntax-highlight/dist/toastui-editor-plugin-code-syntax-highlight.css'

interface ToastUIEditorProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  height?: string
}

export default function ToastUIEditor({ value, onChange, placeholder, height = '600px' }: ToastUIEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null)
  const editorInstanceRef = useRef<any>(null)
  const isInitializedRef = useRef(false)

  useEffect(() => {
    if (typeof window === 'undefined' || !editorRef.current || isInitializedRef.current) {
      return
    }

    // 动态导入 TOAST UI Editor（客户端渲染）
    import('@toast-ui/editor').then(({ default: Editor }) => {
      import('prismjs').then(() => {
        import('@toast-ui/editor-plugin-code-syntax-highlight').then(({ default: codeSyntaxHighlight }) => {
          if (!editorRef.current || editorInstanceRef.current) return

          // 创建编辑器实例
          const editorInstance = new Editor({
            el: editorRef.current,
            height: height,
            initialEditType: 'markdown',
            previewStyle: 'vertical', // 左右分屏
            placeholder: placeholder || '开始写作...支持 Markdown 语法',
            initialValue: value || '',
            usageStatistics: false,
            hideModeSwitch: false, // 显示模式切换按钮
            language: 'zh-CN', // 中文界面
            toolbarItems: [
              ['heading', 'bold', 'italic', 'strike'],
              ['hr', 'quote'],
              ['ul', 'ol', 'task', 'indent', 'outdent'],
              ['table', 'image', 'link'],
              ['code', 'codeblock'],
              ['scrollSync'],
            ],
            plugins: [[codeSyntaxHighlight, { highlighter: (window as any).Prism }]],
            hooks: {
              addImageBlobHook: async (blob: Blob, callback: (url: string, altText: string) => void) => {
                // 自定义图片上传
                try {
                  const formData = new FormData()
                  formData.append('file', blob)
                  formData.append('folder', 'articles')

                  const res = await fetch('/api/upload', {
                    method: 'POST',
                    body: formData,
                  })

                  const data = await res.json()
                  if (data.success && data.url) {
                    callback(data.url, 'image')
                  } else {
                    alert('图片上传失败：' + (data.error || '未知错误'))
                    callback('', '')
                  }
                } catch (error) {
                  console.error('图片上传失败:', error)
                  alert('图片上传失败，请稍后重试')
                  callback('', '')
                }
              },
            },
          })

          // 监听内容变化
          editorInstance.on('change', () => {
            const markdown = editorInstance.getMarkdown()
            onChange(markdown)
          })

          editorInstanceRef.current = editorInstance
          isInitializedRef.current = true
        })
      })
    })

    // 清理函数
    return () => {
      if (editorInstanceRef.current) {
        editorInstanceRef.current.destroy()
        editorInstanceRef.current = null
        isInitializedRef.current = false
      }
    }
  }, [])

  // 当外部value变化时，更新编辑器内容（仅在初始化时）
  useEffect(() => {
    if (editorInstanceRef.current && value && !editorInstanceRef.current.getMarkdown()) {
      editorInstanceRef.current.setMarkdown(value)
    }
  }, [value])

  return (
    <div className="border border-gray-300 rounded-xl overflow-hidden">
      <div ref={editorRef} />
    </div>
  )
}

