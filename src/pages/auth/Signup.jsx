import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Button from '../../components/common/Button'
import Input from '../../components/common/Input'
import FloatingCodeBackground from '../../components/auth/FloatingCodeBackground'
import MouseTrail from '../../components/auth/MouseTrail'
import MouseReactiveGlow from '../../components/auth/MouseReactiveGlow'
import WarpGrid from '../../components/auth/WarpGrid'

const Signup = () => {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')

  const handleSignupInitiation = (e) => {
    e.preventDefault()
    if (email) {
      navigate('/auth/create-account', { state: { email } })
    }
  }

  return (
    <div className="flex min-h-screen w-full flex-row overflow-hidden">
      {/* Left Panel: Hero/Visual (Desktop only) */}
      <div className="relative hidden w-1/2 flex-col justify-between bg-gradient-to-r from-[#0d0d11] to-[#0a0a0c] lg:flex overflow-hidden">
        <div className="absolute inset-0 z-0" style={{ maskImage: 'linear-gradient(to left, transparent, black 25%)', WebkitMaskImage: 'linear-gradient(to left, transparent, black 25%)' }}>
          <FloatingCodeBackground />
          <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] bg-primary/20 rounded-full blur-[120px] opacity-40 animate-pulse"></div>
          <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-purple-600/10 rounded-full blur-[100px] opacity-30"></div>
          <div className="absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-[#0a0a0c] to-transparent z-10"></div>
        </div>

        <div className="relative z-10 p-12">
          <Link to="/" className="flex items-center gap-3 text-white">
            <div className="flex size-10 items-center justify-center">
              <img src="/logo.png" alt="CodeQuest" className="w-full h-full object-contain drop-shadow-[0_0_8px_rgba(59,130,246,0.6)]" />
            </div>
            <h2 className="text-2xl font-bold tracking-tight">CodeQuest</h2>
          </Link>
        </div>

        <div className="relative z-10 p-12 mb-12">
          <h1 className="mb-6 text-4xl font-bold leading-tight tracking-tight text-white xl:text-5xl">
            Level up your <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-purple-400">
              coding skills
            </span>
          </h1>
          <p className="max-w-md text-lg text-slate-400">
            Join over 50,000 students mastering Python, JavaScript, and more through gamified challenges.
          </p>
          <div className="mt-8 flex gap-4">
            <div className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 backdrop-blur-md">
              <div className="size-2 rounded-full bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.5)]"></div>
              <span className="text-sm font-medium text-slate-300">1.2k Online</span>
            </div>
            <div className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 backdrop-blur-md">
              <span className="material-symbols-outlined text-sm text-yellow-400">trophy</span>
              <span className="text-sm font-medium text-slate-300">Daily Challenges</span>
            </div>
          </div>
        </div>
      </div>

      {/* Right Panel: Signup Form */}
      <div className="flex w-full flex-col justify-center px-4 py-12 lg:w-1/2 lg:px-20 xl:px-32 relative bg-[#0a0a0c]">
        <div className="absolute inset-0 z-0" style={{ maskImage: 'linear-gradient(to right, transparent, black 25%)', WebkitMaskImage: 'linear-gradient(to right, transparent, black 25%)' }}>
          <WarpGrid />
        </div>
        <MouseReactiveGlow />
        <MouseTrail />
        <div className="flex lg:hidden justify-center mb-8">
          <Link to="/" className="flex items-center gap-3 text-slate-900 dark:text-white">
            <div className="flex size-10 items-center justify-center">
              <img src="/logo.png" alt="CodeQuest" className="w-full h-full object-contain drop-shadow-[0_0_8px_rgba(59,130,246,0.6)]" />
            </div>
            <h2 className="text-2xl font-bold tracking-tight">CodeQuest</h2>
          </Link>
        </div>

        <div className="mx-auto w-full max-w-[480px]">
          <div className="mb-8 text-center">
            <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">Welcome back</h2>
            <p className="mt-2 text-slate-500 dark:text-slate-400">Please enter your details to sign in.</p>
          </div>

          {/* Tabs */}
          <div className="mb-8 rounded-xl bg-slate-200 p-1 dark:bg-slate-800/50 border border-slate-300 dark:border-slate-700/50">
            <div className="grid grid-cols-2 gap-1">
              <Link
                to="/auth/login"
                className="flex items-center justify-center rounded-lg py-2.5 text-sm font-medium text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
              >
                Log In
              </Link>
              <button className="relative flex items-center justify-center rounded-lg bg-white dark:bg-slate-700 py-2.5 text-sm font-bold shadow-sm ring-1 ring-black/5 dark:ring-white/10 transition-all">
                <span className="text-slate-900 dark:text-white">Sign Up</span>
              </button>
            </div>
          </div>

          <form onSubmit={handleSignupInitiation} className="space-y-4">
            <div>
              <Input
                type="email"
                placeholder="Enter your email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full text-lg py-4"
                icon="mail"
              />
            </div>

            <Button
              type="submit"
              variant="primary"
              className="w-full h-14 text-base mt-2 shadow-lg shadow-primary/25"
            >
              Continue with Email
            </Button>
          </form>

          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-200 dark:border-slate-700/50"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="bg-background-light dark:bg-background-dark px-4 text-slate-500">
                Or continue with
              </span>
            </div>
          </div>

          <Button
            variant="secondary"
            className="w-full bg-white dark:bg-card-dark text-slate-700 dark:text-slate-300 border-slate-200 dark:border-white/10 hover:bg-slate-50 dark:hover:bg-white/5"
            onClick={() => { }}
          >
            <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" className="h-5 w-5 mr-2" />
            Continue with Google
          </Button>

          <p className="mt-8 text-center text-sm text-slate-500 dark:text-slate-400">
            Already have an account?{' '}
            <Link to="/auth/login" className="font-bold text-primary hover:text-blue-500 hover:underline transition-colors">
              Log in
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default Signup
