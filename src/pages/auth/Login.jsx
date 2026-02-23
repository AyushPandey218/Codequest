import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import Button from '../../components/common/Button'
import Input from '../../components/common/Input'
import Badge from '../../components/common/Badge'
import FloatingCodeBackground from '../../components/auth/FloatingCodeBackground'
import MouseTrail from '../../components/auth/MouseTrail'
import MouseReactiveGlow from '../../components/auth/MouseReactiveGlow'
import WarpGrid from '../../components/auth/WarpGrid'

const Login = () => {
  const navigate = useNavigate()
  const { login } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const handleDemoLogin = () => {
    setEmail('demo@codequest.com')
    setPassword('demo123')
  }

  const handleAdminLogin = () => {
    setEmail('admin@codequest.com')
    setPassword('admin123')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    const result = await login(email, password)

    if (result.success) {
      navigate('/app/dashboard')
    } else {
      setError(result.error || 'Login failed. Please try again.')
    }

    setIsLoading(false)
  }

  return (
    <div className="flex w-full min-h-screen flex-row overflow-hidden bg-transparent">
      <div className="relative hidden w-1/2 flex-col justify-between bg-gradient-to-r from-[#0d0d11] to-[#0a0a0c] lg:flex overflow-hidden">
        <div className="absolute inset-0 z-0" style={{ maskImage: 'linear-gradient(to left, transparent, black 25%)', WebkitMaskImage: 'linear-gradient(to left, transparent, black 25%)' }}>
          <FloatingCodeBackground />
          <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] bg-primary/20 rounded-full blur-[120px] opacity-40 animate-pulse"></div>
          <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-purple-600/10 rounded-full blur-[100px] opacity-30"></div>
          <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>
          <div className="absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-[#0a0a0c] to-transparent z-10"></div>
        </div>

        <div className="relative z-10 p-12">
          <Link to="/" className="flex items-center gap-3 text-white group">
            <div className="flex size-10 items-center justify-center rounded-xl bg-primary shadow-lg shadow-primary/25 group-hover:scale-110 transition-transform">
              <span className="material-symbols-outlined text-2xl">terminal</span>
            </div>
            <h2 className="text-2xl font-black tracking-tight">Code<span className="text-primary tracking-tighter">Quest</span></h2>
          </Link>
        </div>

        <div className="relative z-10 p-12 mb-12">
          <Badge color="bg-primary/10 text-primary" className="mb-6 animate-fade-in">
            Next-Gen Learning Platform
          </Badge>
          <h1 className="mb-6 text-5xl font-black leading-[1.1] tracking-tighter text-white xl:text-7xl animate-slide-up">
            Master the <br />
            <span className="text-gradient">Logic</span>.
          </h1>
          <p className="max-w-md text-lg text-text-secondary animate-slide-up animate-delay-100">
            Join the elite circle of builders. Experience high-density coding challenges designed to push your limit.
          </p>

          <div className="mt-12 grid grid-cols-2 gap-4 animate-slide-up animate-delay-200">
            <div className="glass-card rounded-2xl p-4 border border-white/5">
              <span className="material-symbols-outlined text-primary mb-2">bolt</span>
              <p className="text-sm font-bold">Fast-track XP</p>
              <p className="text-xs text-text-secondary">Earn rewards instantly</p>
            </div>
            <div className="glass-card rounded-2xl p-4 border border-white/5">
              <span className="material-symbols-outlined text-purple-400 mb-2">groups</span>
              <p className="text-sm font-bold">Live Clashes</p>
              <p className="text-xs text-text-secondary">Compete with the best</p>
            </div>
          </div>
        </div>

        <div className="relative z-10 p-12 text-xs text-text-secondary font-medium">
          © 2026 CodeQuest Labs. Built for Champions.
        </div>
      </div>

      <div className="flex w-full flex-col justify-center px-4 py-12 lg:w-1/2 lg:px-20 xl:px-32 relative bg-[#0a0a0c]">
        <div className="absolute inset-0 z-0" style={{ maskImage: 'linear-gradient(to right, transparent, black 25%)', WebkitMaskImage: 'linear-gradient(to right, transparent, black 25%)' }}>
          <WarpGrid />
        </div>
        <MouseReactiveGlow />
        <MouseTrail />

        <div className="flex lg:hidden justify-center mb-12 relative z-10">
          <Link to="/" className="flex items-center gap-3 text-white">
            <div className="flex size-12 items-center justify-center rounded-xl bg-primary">
              <span className="material-symbols-outlined text-2xl text-white">terminal</span>
            </div>
            <h2 className="text-3xl font-black tracking-tight">CodeQuest</h2>
          </Link>
        </div>

        <div className="mx-auto w-full max-w-[440px] animate-scale-in relative z-10">
          <div className="mb-10">
            <h2 className="text-4xl font-black tracking-tight text-white mb-3">
              Welcome <span className="text-gradient">Back</span>
            </h2>
            <p className="text-text-secondary font-medium">
              Enter your credentials to continue your journey.
            </p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-2xl text-red-400 text-sm flex items-center gap-3 animate-shake">
              <span className="material-symbols-outlined">error</span>
              <span className="font-medium">{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            <div className="space-y-4">
              <Input
                label="Email Address"
                type="email"
                icon="mail"
                placeholder="hunter@codequest.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="bg-white/5 border-white/10 backdrop-blur-xl h-14 rounded-2xl focus:border-primary/50 focus:ring-primary/20 transition-all placeholder:text-white/10"
              />

              <div className="flex flex-col gap-2">
                <div className="flex justify-between items-center px-1">
                  <label className="text-sm font-bold text-text-secondary">
                    Password
                  </label>
                  <Link
                    to="/auth/password-recovery"
                    className="text-xs font-bold text-primary hover:text-blue-400 transition-colors"
                  >
                    Forgot?
                  </Link>
                </div>
                <div className="relative group">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 text-text-secondary group-focus-within:text-primary transition-colors">
                    <span className="material-symbols-outlined text-[20px]">lock_open</span>
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    className="w-full rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl py-3.5 pl-12 pr-12 text-base text-white placeholder:text-white/20 focus:border-primary/50 focus:outline-none focus:ring-1 focus:ring-primary/50 transition-all h-14 font-medium"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 flex items-center pr-4 text-text-secondary hover:text-white transition-colors"
                  >
                    <span className="material-symbols-outlined text-[20px]">
                      {showPassword ? 'visibility' : 'visibility_off'}
                    </span>
                  </button>
                </div>
              </div>
            </div>

            <Button
              type="submit"
              variant="primary"
              size="lg"
              isLoading={isLoading}
              className="w-full h-14 rounded-2xl text-lg font-black shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all"
            >
              Start Coding
            </Button>

            <div className="relative flex items-center py-4">
              <div className="flex-grow border-t border-white/5"></div>
              <span className="flex-shrink-0 px-4 text-[10px] font-black uppercase tracking-[0.2em] text-text-secondary">
                Developer Access
              </span>
              <div className="flex-grow border-t border-white/5"></div>
            </div>

            <button
              type="button"
              onClick={handleDemoLogin}
              className="group flex h-14 items-center justify-center gap-3 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md px-4 text-base font-bold text-white transition-all hover:bg-white/10 hover:border-white/20 active:scale-[0.98] shadow-lg hover:shadow-primary/5"
            >
              <span className="material-symbols-outlined text-primary group-hover:animate-pulse">terminal</span>
              <span>Use Demo Credentials</span>
            </button>

            <button
              type="button"
              onClick={handleAdminLogin}
              className="group flex h-14 items-center justify-center gap-3 rounded-2xl border border-amber-500/20 bg-amber-500/5 backdrop-blur-md px-4 text-base font-bold text-amber-400 transition-all hover:bg-amber-500/10 hover:border-amber-500/30 active:scale-[0.98] shadow-lg hover:shadow-amber-500/10"
            >
              <span className="material-symbols-outlined text-amber-400 group-hover:animate-pulse">admin_panel_settings</span>
              <span>Admin Access</span>
            </button>
          </form>

          <p className="mt-10 text-center text-sm font-medium text-text-secondary">
            New to the Arena?{' '}
            <Link to="/auth/signup" className="font-bold text-primary hover:text-blue-400 hover:underline transition-all">
              Join the Quest
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default Login
