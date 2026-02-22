import { cn } from '../../utils/helpers'

/**
 * Reusable Card Component
 * @param {string} variant - 'default' | 'glass' | 'elevated' | 'bordered'
 * @param {boolean} hover - Enable hover effect
 * @param {string} className - Additional classes
 */
const Card = ({
  children,
  variant = 'default',
  hover = false,
  className = '',
  onClick,
  ...props
}) => {
  const baseStyles = 'rounded-xl transition-all'
  
  const variants = {
    default: 'bg-white dark:bg-card-dark border border-slate-200 dark:border-border-dark',
    glass: 'bg-[#1c1c27]/85 backdrop-blur-xl border border-[#3b3b54]',
    elevated: 'bg-white dark:bg-card-dark shadow-2xl border border-slate-200 dark:border-border-dark',
    bordered: 'bg-transparent border-2 border-slate-200 dark:border-border-dark',
  }
  
  const hoverStyles = hover ? 'hover:border-primary/50 hover:shadow-lg cursor-pointer' : ''
  
  const variantStyle = variants[variant] || variants.default
  
  return (
    <div
      className={cn(
        baseStyles,
        variantStyle,
        hoverStyles,
        className
      )}
      onClick={onClick}
      {...props}
    >
      {children}
    </div>
  )
}

export default Card
