import { Outlet } from 'react-router-dom'

/**
 * Root Layout - Base layout for all pages
 * Wraps all routes and provides global styling
 */
const RootLayout = () => {
  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark text-slate-900 dark:text-white antialiased">
      <Outlet />
    </div>
  )
}

export default RootLayout
