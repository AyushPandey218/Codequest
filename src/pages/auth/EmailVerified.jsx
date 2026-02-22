import { Link } from 'react-router-dom'
import Button from '../../components/common/Button'

const EmailVerified = () => {
  return (
    <div className="flex-1 flex items-center justify-center relative overflow-hidden p-6">
      {/* Abstract Background Elements */}
      <div className="absolute inset-0 bg-grid-pattern opacity-[0.15] pointer-events-none"></div>
      <div className="absolute top-[-20%] right-[-10%] w-[600px] h-[600px] bg-primary/10 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-purple-500/10 rounded-full blur-[100px] pointer-events-none"></div>

      {/* Central Success Card */}
      <div className="layout-content-container flex flex-col max-w-[560px] w-full relative z-10">
        <div className="flex flex-col items-center gap-8 bg-white dark:bg-card-dark p-8 md:p-12 rounded-2xl border border-slate-200 dark:border-border-dark shadow-2xl animate-glow">
          {/* Success Icon with Rings */}
          <div className="relative flex items-center justify-center">
            <div className="absolute inset-0 bg-primary/20 rounded-full scale-150 animate-pulse"></div>
            <div className="relative bg-primary text-white rounded-full p-6 flex items-center justify-center shadow-lg shadow-primary/40">
              <span className="material-symbols-outlined !text-5xl">check_circle</span>
            </div>
          </div>

          {/* Text Content */}
          <div className="flex flex-col items-center gap-3 text-center">
            <h1 className="text-3xl md:text-4xl font-bold leading-tight tracking-tight text-slate-900 dark:text-white">
              Verification Complete!
            </h1>
            <p className="text-slate-600 dark:text-slate-400 text-base md:text-lg font-normal leading-relaxed max-w-[420px]">
              Welcome to CodeQuest. Your email has been successfully verified. You have unlocked full access to the platform.
            </p>
          </div>

          {/* Gamification Element: Achievement Unlocked */}
          <div className="w-full bg-slate-100 dark:bg-[#15151e] border border-slate-200 dark:border-border-dark rounded-xl p-4 flex items-center gap-4">
            <div className="h-12 w-12 rounded-lg bg-gradient-to-br from-yellow-400 to-orange-600 flex items-center justify-center text-white shadow-md">
              <span className="material-symbols-outlined">lock_open</span>
            </div>
            <div className="flex flex-col flex-1">
              <span className="text-xs font-bold text-primary uppercase tracking-wider">
                Achievement Unlocked
              </span>
              <span className="text-slate-900 dark:text-white font-bold">Verified Coder</span>
              <span className="text-xs text-slate-500 dark:text-slate-500">
                +50 XP added to your profile
              </span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col gap-4 w-full pt-2">
            <Button
              variant="primary"
              size="lg"
              icon="arrow_forward"
              className="w-full group"
              onClick={() => window.location.href = '/app/dashboard'}
            >
              Enter Dashboard
            </Button>

            <Link
              to="/auth/login"
              className="text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white text-sm font-medium text-center transition-colors"
            >
              Return to Login
            </Link>
          </div>
        </div>

        {/* Contextual Help */}
        <div className="mt-8 text-center">
          <p className="text-slate-500 dark:text-slate-600 text-sm">
            Didn't verify this email?{' '}
            <Link to="/app/support" className="underline hover:text-primary transition-colors">
              Contact Support
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default EmailVerified
