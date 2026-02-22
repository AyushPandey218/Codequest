import { forwardRef } from 'react'
import { cn } from '../../utils/helpers'

/**
 * Reusable Input Component
 * @param {string} label - Input label
 * @param {string} error - Error message
 * @param {string} icon - Material icon name
 * @param {string} type - Input type
 * @param {boolean} disabled - Disable input
 * @param {string} className - Additional classes
 */
const Input = forwardRef(({
  label,
  error,
  icon,
  type = 'text',
  disabled = false,
  className = '',
  placeholder,
  ...props
}, ref) => {
  const baseInputStyles = 'w-full rounded-xl border bg-white dark:bg-[#1c1c27] text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-[#585873] focus:outline-none focus:ring-1 transition-all'
  
  const normalStyles = 'border-slate-300 dark:border-[#3b3b54] focus:border-primary focus:ring-primary'
  const errorStyles = 'border-red-500 focus:border-red-500 focus:ring-red-500'
  
  const inputStyles = cn(
    baseInputStyles,
    error ? errorStyles : normalStyles,
    icon ? 'pl-11 pr-4' : 'px-4',
    'py-3.5 h-14',
    disabled && 'opacity-50 cursor-not-allowed',
    className
  )

  return (
    <div className="flex flex-col gap-2">
      {label && (
        <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
          {label}
        </label>
      )}
      
      <div className="relative group">
        {icon && (
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 text-slate-400 group-focus-within:text-primary transition-colors">
            <span className="material-symbols-outlined text-[20px]">{icon}</span>
          </div>
        )}
        
        <input
          ref={ref}
          type={type}
          className={inputStyles}
          disabled={disabled}
          placeholder={placeholder}
          {...props}
        />
      </div>
      
      {error && (
        <p className="text-sm text-red-500 flex items-center gap-1">
          <span className="material-symbols-outlined text-sm">error</span>
          {error}
        </p>
      )}
    </div>
  )
})

Input.displayName = 'Input'

export default Input
