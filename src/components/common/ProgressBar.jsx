import { cn } from '../../utils/helpers'

/**
 * Reusable Progress Bar Component
 * @param {number} value - Current value (0-100)
 * @param {number} max - Maximum value (default 100)
 * @param {string} variant - 'primary' | 'success' | 'warning' | 'danger'
 * @param {string} size - 'sm' | 'md' | 'lg'
 * @param {boolean} showLabel - Show percentage label
 * @param {boolean} animated - Animate the progress bar
 * @param {string} className - Additional classes
 */
const ProgressBar = ({
  value = 0,
  max = 100,
  variant = 'primary',
  size = 'md',
  showLabel = false,
  animated = false,
  className = '',
  ...props
}) => {
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100)
  
  const variants = {
    primary: 'bg-gradient-to-r from-blue-500 to-primary',
    success: 'bg-gradient-to-r from-green-400 to-green-600',
    warning: 'bg-gradient-to-r from-yellow-400 to-orange-500',
    danger: 'bg-gradient-to-r from-red-400 to-red-600',
  }
  
  const sizes = {
    sm: 'h-1.5',
    md: 'h-2',
    lg: 'h-3',
  }
  
  const variantStyle = variants[variant] || variants.primary
  const sizeStyle = sizes[size] || sizes.md
  
  return (
    <div className={cn('w-full', className)} {...props}>
      {showLabel && (
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
            Progress
          </span>
          <span className="text-sm font-bold text-slate-900 dark:text-white">
            {Math.round(percentage)}%
          </span>
        </div>
      )}
      
      <div className={cn(
        'w-full rounded-full bg-slate-200 dark:bg-[#3b3b54] overflow-hidden',
        sizeStyle
      )}>
        <div
          className={cn(
            'h-full rounded-full relative transition-all duration-500 ease-out',
            variantStyle,
            animated && 'animate-pulse'
          )}
          style={{ width: `${percentage}%` }}
        >
          {size !== 'sm' && (
            <div className="absolute right-0 top-0 bottom-0 w-2 bg-white/30"></div>
          )}
        </div>
      </div>
    </div>
  )
}

export default ProgressBar
