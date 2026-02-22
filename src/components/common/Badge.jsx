import { cn } from '../../utils/helpers'

/**
 * Reusable Badge Component
 * @param {string} variant - 'primary' | 'success' | 'warning' | 'danger' | 'info' | 'default'
 * @param {string} size - 'sm' | 'md' | 'lg'
 * @param {string} icon - Material icon name
 * @param {string} className - Additional classes
 */
const Badge = ({
  children,
  variant = 'default',
  size = 'md',
  icon = null,
  className = '',
  ...props
}) => {
  const baseStyles = 'inline-flex items-center gap-1.5 font-medium rounded-lg border'
  
  const variants = {
    primary: 'bg-primary/10 text-primary border-primary/20',
    success: 'bg-green-500/10 text-green-600 dark:text-green-400 border-green-500/20',
    warning: 'bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 border-yellow-500/20',
    danger: 'bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20',
    info: 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20',
    default: 'bg-[#232348] text-[#9292c9] border-[#323267]',
  }
  
  const sizes = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-2.5 py-1 text-sm',
    lg: 'px-3 py-1.5 text-base',
  }
  
  const variantStyle = variants[variant] || variants.default
  const sizeStyle = sizes[size] || sizes.md
  
  return (
    <span
      className={cn(
        baseStyles,
        variantStyle,
        sizeStyle,
        className
      )}
      {...props}
    >
      {icon && (
        <span className="material-symbols-outlined text-[1em]">{icon}</span>
      )}
      {children}
    </span>
  )
}

export default Badge
