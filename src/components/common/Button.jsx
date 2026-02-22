import { cn } from '../../utils/helpers'

/**
 * Reusable Button Component
 * @param {string} variant - 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger'
 * @param {string} size - 'sm' | 'md' | 'lg'
 * @param {boolean} isLoading - Show loading state
 * @param {boolean} disabled - Disable button
 * @param {string} icon - Material icon name
 * @param {string} iconPosition - 'left' | 'right'
 * @param {string} className - Additional classes
 */
const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  disabled = false,
  icon = null,
  iconPosition = 'right',
  className = '',
  type = 'button',
  onClick,
  ...props
}) => {
  const baseStyles = 'inline-flex items-center justify-center gap-2 font-bold rounded-xl transition-all focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 dark:focus:ring-offset-background-dark disabled:opacity-50 disabled:cursor-not-allowed'
  
  const variants = {
    primary: 'bg-primary hover:bg-blue-600 text-white shadow-lg shadow-primary/25 hover:shadow-primary/40 hover:scale-[1.01] active:scale-[0.98]',
    secondary: 'bg-[#282839] hover:bg-[#3b3b54] text-white border border-[#3b3b54]',
    outline: 'border-2 border-primary text-primary hover:bg-primary/10',
    ghost: 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/5',
    danger: 'bg-red-500 hover:bg-red-600 text-white shadow-lg shadow-red-500/25',
  }
  
  const sizes = {
    sm: 'h-9 px-4 text-sm',
    md: 'h-12 px-6 text-base',
    lg: 'h-14 px-8 text-lg',
  }
  
  const variantStyle = variants[variant] || variants.primary
  const sizeStyle = sizes[size] || sizes.md
  
  return (
    <button
      type={type}
      className={cn(
        baseStyles,
        variantStyle,
        sizeStyle,
        className
      )}
      disabled={disabled || isLoading}
      onClick={onClick}
      {...props}
    >
      {isLoading ? (
        <>
          <span className="material-symbols-outlined animate-spin text-xl">progress_activity</span>
          <span>Loading...</span>
        </>
      ) : (
        <>
          {icon && iconPosition === 'left' && (
            <span className="material-symbols-outlined text-xl">{icon}</span>
          )}
          {children}
          {icon && iconPosition === 'right' && (
            <span className="material-symbols-outlined text-xl">{icon}</span>
          )}
        </>
      )}
    </button>
  )
}

export default Button
