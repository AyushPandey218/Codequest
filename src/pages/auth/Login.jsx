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

const SuspendedView = ({ onBack }) => (
  <div className="mx-auto w-full max-w-[440px] animate-scale-in relative z-10">
    <div className="bg-red-500/10 border border-red-500/20 rounded-[2.5rem] p-10 backdrop-blur-3xl shadow-3xl relative overflow-hidden group">
      <div className="absolute top-0 right-0 size-48 bg-red-500/10 blur-[60px] -mr-24 -mt-24 group-hover:bg-red-500/15 transition-colors"></div>
      
      <div className="relative z-10 flex flex-col items-center text-center">
        <div className="size-20 rounded-3xl bg-red-500/20 border border-red-500/30 flex items-center justify-center mb-8 shadow-inner animate-pulse">
          <span className="material-symbols-outlined text-4xl text-red-500 drop-shadow-[0_0_12px_rgba(239,68,68,0.5)]">gpp_maybe</span>
        </div>
        
        <h2 className="text-3xl font-black text-white uppercase tracking-tighter mb-4">
          Protocol <span className="text-red-500">Terminated</span>
        </h2>
        
        <div className="space-y-4">
          <p className="text-slate-400 font-medium leading-relaxed">
            Administrative action has been taken on your account. Access to the CodeQuest ecosystem is currently <strong className="text-red-400">Suspended</strong>.
          </p>
          
          <div className="p-4 bg-black/40 rounded-2xl border border-white/5 space-y-2">
            <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-widest text-slate-500">
              <span>Status:</span>
              <span className="text-red-500">Locked</span>
            </div>
            <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-widest text-slate-500">
              <span>Reason:</span>
              <span className="text-slate-300">Policy Violation</span>
            </div>
          </div>
          
          <p className="text-xs text-slate-500 font-bold uppercase tracking-widest pt-2">
            Please contact support or appeals at:
            <br />
            <span className="text-primary mt-1 block">security@codequest.com</span>
          </p>
        </div>

        <button 
          onClick={onBack}
          className="mt-10 w-full py-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl text-[11px] font-black text-white uppercase tracking-[0.3em] transition-all active:scale-95 flex items-center justify-center gap-3"
        >
          <span className="material-symbols-outlined text-base">arrow_back</span>
          Return to Interface
        </button>
      </div>
    </div>
  </div>
)

const Login = () => {
  const navigate = useNavigate()
  const { login, loginWithGoogle } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [showSuspendedUI, setShowSuspendedUI] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    const result = await login(email, password)

    if (result.success) {
      navigate(result.isAdmin ? '/admin/dashboard' : '/app/dashboard')
    } else {
      if (result.error?.toLowerCase().includes('suspended')) {
        setShowSuspendedUI(true)
      } else {
        setError(result.error || 'Login failed. Please try again.')
      }
    }

    setIsLoading(false)
  }

  const handleGoogleLogin = async () => {
    setError('')
    setIsLoading(true)
    const result = await loginWithGoogle()
    if (result.success) {
      navigate(result.isAdmin ? '/admin/dashboard' : '/app/dashboard')
    } else {
      if (result.error?.toLowerCase().includes('suspended')) {
        setShowSuspendedUI(true)
      } else {
        setError(result.error || 'Google login failed.')
      }
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
            <div className="flex size-10 items-center justify-center group-hover:scale-110 transition-transform">
              <img src="/logo.png" alt="CodeQuest Logo" className="w-full h-full object-contain drop-shadow-[0_0_8px_rgba(59,130,246,0.6)]" />
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
            <div className="flex size-12 items-center justify-center">
              <img src="/logo.png" alt="CodeQuest Logo" className="w-full h-full object-contain drop-shadow-[0_0_8px_rgba(59,130,246,0.6)]" />
            </div>
            <h2 className="text-3xl font-black tracking-tight">CodeQuest</h2>
          </Link>
        </div>

        {showSuspendedUI ? (
          <SuspendedView onBack={() => setShowSuspendedUI(false)} />
        ) : (
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
                  Or continue with
                </span>
                <div className="flex-grow border-t border-white/5"></div>
              </div>

              <button
                type="button"
                onClick={handleGoogleLogin}
                className="w-full flex items-center justify-center gap-2 h-14 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md px-4 text-base font-bold text-white transition-all hover:bg-white/10 hover:border-white/20 active:scale-[0.98] shadow-lg"
              >
                <svg className="w-5 h-5 flex-shrink-0" viewBox="0 0 24 24">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.47 2.18 7.07L10.66 11l-.81-.62c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                </svg>
                <span>Continue with Google</span>
              </button>
            </form>

            <p className="mt-10 text-center text-sm font-medium text-text-secondary">
              New to the Arena?{' '}
              <Link to="/auth/signup" className="font-bold text-primary hover:text-blue-400 hover:underline transition-all">
                Join the Quest
              </Link>
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

export default Login
