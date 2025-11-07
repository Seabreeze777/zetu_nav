'use client'

interface ConfirmDialogProps {
  isOpen: boolean
  title: string
  message: string
  confirmText?: string
  cancelText?: string
  onConfirm: () => void
  onCancel: () => void
  type?: 'danger' | 'warning' | 'info'
}

export default function ConfirmDialog({
  isOpen,
  title,
  message,
  confirmText = '确认',
  cancelText = '取消',
  onConfirm,
  onCancel,
  type = 'danger',
}: ConfirmDialogProps) {
  if (!isOpen) return null

  const colors = {
    danger: {
      icon: 'text-red-600',
      bg: 'bg-red-100',
      button: 'bg-red-600 hover:bg-red-700 focus:ring-red-500',
    },
    warning: {
      icon: 'text-yellow-600',
      bg: 'bg-yellow-100',
      button: 'bg-yellow-600 hover:bg-yellow-700 focus:ring-yellow-500',
    },
    info: {
      icon: 'text-blue-600',
      bg: 'bg-blue-100',
      button: 'bg-blue-600 hover:bg-blue-700 focus:ring-blue-500',
    },
  }

  const icons = {
    danger: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
      </svg>
    ),
    warning: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
      </svg>
    ),
    info: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  }

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
      {/* 背景遮罩 */}
      <div 
        className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
        onClick={onCancel}
      />

      {/* 对话框容器 */}
      <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
        <div className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
          <div className="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
            <div className="sm:flex sm:items-start">
              {/* 图标 */}
              <div className={`mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full ${colors[type].bg} sm:mx-0 sm:h-10 sm:w-10`}>
                <div className={colors[type].icon}>
                  {icons[type]}
                </div>
              </div>

              {/* 内容 */}
              <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left flex-1">
                <h3 className="text-base font-semibold leading-6 text-gray-900" id="modal-title">
                  {title}
                </h3>
                <div className="mt-2">
                  <p className="text-sm text-gray-500">
                    {message}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* 按钮 */}
          <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6 gap-2">
            <button
              type="button"
              onClick={onConfirm}
              className={`inline-flex w-full justify-center rounded-md px-3 py-2 text-sm font-semibold text-white shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 sm:w-auto ${colors[type].button}`}
            >
              {confirmText}
            </button>
            <button
              type="button"
              onClick={onCancel}
              className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
            >
              {cancelText}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

