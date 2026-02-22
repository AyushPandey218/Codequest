import { Link } from 'react-router-dom'
import Button from '../../components/common/Button'

const PasswordRecoveryConfirmation = () => {
  const handleResend = () => {
    // TODO: Implement resend functionality
    alert('Password reset link resent!')
  }

  return (
    <div className="w-full max-w-md">
      <div className="bg-white dark:bg-[#1c1c27] rounded-xl border border-slate-200 dark:border-[#3b3b54] shadow-2xl overflow-hidden p-6 md:p-8 flex flex-col gap-6">
        <div className="flex flex-col items-center text-center gap-4">
          <div className="size-16 rounded-full bg-primary/10 flex items-center justify-center mb-2">
            <span className="material-symbols-outlined text-primary text-3xl">mark_email_read</span>
          </div>
          <div className="space-y-2">
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
              Check your mail
            </h1>
            <p className="text-slate-500 dark:text-[#9d9db9] text-sm md:text-base leading-relaxed">
              We have sent a password reset link to{' '}
              <span className="font-medium text-slate-900 dark:text-white">student@university.edu</span>
            </p>
          </div>
        </div>

        <div className="bg-slate-50 dark:bg-[#111118] border border-slate-200 dark:border-[#3b3b54] rounded-lg p-4 flex gap-3 items-start text-left">
          <span className="material-symbols-outlined text-slate-400 text-xl mt-0.5 shrink-0">info</span>
          <p className="text-sm text-slate-600 dark:text-slate-400 leading-normal">
            If you don't see the email within a few minutes, check your <strong>spam folder</strong> or junk mail.
          </p>
        </div>

        <div className="flex flex-col gap-4">
          <Link to="/auth/login">
            <Button variant="primary" size="lg" className="w-full">
              Return to Login
            </Button>
          </Link>

          <div className="text-center">
            <p className="text-sm text-slate-500 dark:text-[#9d9db9]">
              Didn't receive the email?{' '}
              <button
                onClick={handleResend}
                className="font-semibold text-primary hover:text-blue-500 transition-colors ml-1"
              >
                Click to resend
              </button>
            </p>
          </div>
        </div>
      </div>

      <p className="text-center text-xs text-slate-400 dark:text-[#6a6a8b] mt-8">
        Need help?{' '}
        <Link to="/app/support" className="underline hover:text-primary transition-colors">
          Contact Support
        </Link>
      </p>
    </div>
  )
}

export default PasswordRecoveryConfirmation
