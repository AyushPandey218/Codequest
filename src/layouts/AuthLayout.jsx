import { Outlet } from 'react-router-dom'

/**
 * Auth Layout - Layout for authentication pages
 * Used for: Login, Signup, Password Recovery, Email Verification, etc.
 */
const AuthLayout = () => {
  return (
    <div className="h-screen bg-[#0a0a0c] relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[1000px] bg-primary/10 rounded-full blur-[160px]"></div>
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[120px] translate-x-1/4 -translate-y-1/4"></div>
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-purple-500/5 rounded-full blur-[100px] -translate-x-1/4 translate-y-1/4"></div>
      </div>

      {/* Main content area */}
      <main className="relative z-10 h-full flex items-center justify-center p-4 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  )
}

export default AuthLayout
