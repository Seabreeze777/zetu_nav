/**
 * Toggle Switch 组件
 * 漂亮的开关按钮，用于替代难看的checkbox
 */

'use client'

interface ToggleSwitchProps {
  checked: boolean
  onChange: (checked: boolean) => void
  label?: string
  disabled?: boolean
  size?: 'sm' | 'md' | 'lg'
}

export default function ToggleSwitch({
  checked,
  onChange,
  label,
  disabled = false,
  size = 'md',
}: ToggleSwitchProps) {
  const sizeClasses = {
    sm: 'w-9 h-5',
    md: 'w-11 h-6',
    lg: 'w-14 h-7',
  }

  const dotSizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6',
  }

  const dotTranslateClasses = {
    sm: 'translate-x-4',
    md: 'translate-x-5',
    lg: 'translate-x-7',
  }

  return (
    <label className="flex items-center gap-3 cursor-pointer">
      <div className="relative">
        <input
          type="checkbox"
          className="sr-only"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          disabled={disabled}
        />
        <div
          className={`
            ${sizeClasses[size]}
            ${checked ? 'bg-indigo-600' : 'bg-gray-300'}
            ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
            rounded-full transition-colors duration-200 ease-in-out
          `}
        >
          <div
            className={`
              ${dotSizeClasses[size]}
              ${checked ? dotTranslateClasses[size] : 'translate-x-0.5'}
              absolute top-0.5 left-0.5
              bg-white rounded-full
              shadow-md transform transition-transform duration-200 ease-in-out
            `}
          />
        </div>
      </div>
      {label && (
        <span className={`text-sm font-medium ${disabled ? 'text-gray-400' : 'text-gray-700'}`}>
          {label}
        </span>
      )}
    </label>
  )
}

