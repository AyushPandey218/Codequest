import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Button from '../../components/common/Button'

const PasswordRecovery = () => {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)

    // TODO: Replace with actual API call
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    navigate('/auth/password-recovery-confirmation')
    setIsLoading(false)
  }

  return (
    <div className="w-full max-w-md">
      <div className="bg-white dark:bg-[#1c1c27] rounded-xl border border-slate-200 dark:border-[#3b3b54] shadow-2xl overflow-hidden p-6 md:p-8 flex flex-col gap-6">
        {/* Icon & Title */}
        <div className="flex flex-col items-center text-center gap-4">
          <div className="size-16 rounded-full bg-primary/10 flex items-center justify-center mb-2">
            <span className="material-symbols-outlined text-primary text-3xl">lock_reset</span>
          </div>
          <div className="space-y-2">
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
              Password Recovery
            </h1>
            <p className="text-slate-500 dark:text-[#9d9db9] text-sm md:text-base leading-relaxed">
              Enter the email associated with your CodeQuest account and we'll send you a magic link to reset it.
            </p>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-slate-700 dark:text-slate-300" htmlFor="email">
              Email Address
            </label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400 group-focus-within:text-primary transition-colors">
                <span className="material-symbols-outlined text-[20px]">mail</span>
              </div>
              <input
                id="email"
                type="email"
                className="block w-full rounded-lg border-slate-200 dark:border-[#3b3b54] bg-slate-50 dark:bg-[#111118] text-slate-900 dark:text-white pl-10 pr-4 py-3 text-sm focus:border-primary focus:ring-1 focus:ring-primary placeholder:text-slate-400 dark:placeholder:text-slate-600 transition-all duration-200"
                placeholder="student@university.edu"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          <Button
            type="submit"
            variant="primary"
            size="lg"
            isLoading={isLoading}
            icon="arrow_forward"
            className="w-full mt-2"
          >
            Send Reset Link
          </Button>
        </form>

        {/* Divider */}
        <div className="relative flex py-2 items-center">
          <div className="flex-grow border-t border-slate-200 dark:border-[#3b3b54]"></div>
          <span className="flex-shrink-0 mx-4 text-slate-400 text-xs uppercase font-medium tracking-wider">
            or
          </span>
          <div className="flex-grow border-t border-slate-200 dark:border-[#3b3b54]"></div>
        </div>

        {/* Back to Login */}
        <div className="text-center">
          <Link
            to="/auth/login"
            className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 dark:text-[#9d9db9] hover:text-primary dark:hover:text-white transition-colors group"
          >
            <span className="material-symbols-outlined text-lg group-hover:-translate-x-1 transition-transform duration-200">
              arrow_back
            </span>
            Back to Login
          </Link>
        </div>
      </div>

      {/* Footer Note */}
      <p className="text-center text-xs text-slate-400 dark:text-[#6a6a8b] mt-8">
        Need help?{' '}
        <Link to="/app/support" className="underline hover:text-primary transition-colors">
          Contact Support
        </Link>
      </p>
    </div>
  )
}

export default PasswordRecovery
