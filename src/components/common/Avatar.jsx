import { useState } from 'react'
import { cn } from '../../utils/helpers'
import { getInitials } from '../../utils/helpers'

/**
 * Reusable Avatar Component
 * @param {string} src - Image source URL
 * @param {string} alt - Alt text
 * @param {string} name - User name (for initials fallback)
 * @param {string} size - 'xs' | 'sm' | 'md' | 'lg' | 'xl'
 * @param {boolean} ring - Show ring border
 * @param {string} ringColor - Ring color class
 * @param {boolean} online - Show online status indicator
 * @param {string} className - Additional classes
 */
const Avatar = ({
  src,
  alt = 'Avatar',
  name = '',
  size = 'md',
  ring = false,
  ringColor = 'ring-primary',
  online = false,
  className = '',
  ...props
}) => {
  const [imageError, setImageError] = useState(false)

  const sizes = {
    xs: 'size-6 text-xs',
    sm: 'size-8 text-sm',
    md: 'size-10 text-base',
    lg: 'size-12 text-lg',
    xl: 'size-16 text-xl',
  }

  const sizeStyle = sizes[size] || sizes.md
  const ringStyle = ring ? `ring-2 ${ringColor}` : ''

  return (
    <div
      className={cn(
        'relative inline-flex shrink-0 items-center justify-center rounded-full overflow-hidden',
        sizeStyle,
        ringStyle,
        className
      )}
      {...props}
    >
      {(src && !imageError) ? (
        <img
          src={src}
          alt={alt}
          className="size-full object-cover"
          onError={() => setImageError(true)}
        />
      ) : (
        <div className="size-full bg-primary/20 flex items-center justify-center text-primary font-bold">
          {getInitials(name)}
        </div>
      )}

      {online && (
        <span className="absolute bottom-1 right-1 block size-3 rounded-full bg-green-500 ring-2 ring-white dark:ring-background-dark" />
      )}
    </div>
  )
}

export default Avatar
