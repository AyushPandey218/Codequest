import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import Button from '../../components/common/Button'
import { useAuth } from '../../context/AuthContext'

const EmailVerificationSent = () => {
  const location = useLocation()
  const { resendVerification } = useAuth()
  const email = location.state?.email || 'your email address'
  const [isSending, setIsSending] = useState(false)
  const [message, setMessage] = useState('')

  const handleResendEmail = async () => {
    setIsSending(true)
    setMessage('')
    const result = await resendVerification()
    if (result.success) {
      setMessage('Verification email resent! Check your inbox.')
    } else {
      setMessage(result.error || 'Failed to resend. Please try again.')
    }
    setIsSending(false)
  }

  return (
    <div className="relative z-10 w-full max-w-[480px]">
      <div className="bg-white dark:bg-card-dark border border-slate-200 dark:border-[#282839] rounded-2xl shadow-2xl p-8 md:p-10 flex flex-col items-center text-center">
        {/* Hero Visual */}
        <div className="relative mb-8 group">
          <div className="absolute inset-0 bg-primary/20 rounded-full blur-xl scale-75 group-hover:scale-110 transition-transform duration-500"></div>
          <div className="relative w-24 h-24 bg-gradient-to-br from-[#1e1e2e] to-[#111118] border border-[#282839] rounded-full flex items-center justify-center shadow-inner">
            <span className="material-symbols-outlined text-5xl text-primary animate-pulse">
              mark_email_read
            </span>
            {/* Decorative checkmark badge */}
            <div className="absolute -bottom-1 -right-1 bg-green-500 border-4 border-white dark:border-card-dark rounded-full w-8 h-8 flex items-center justify-center">
              <span className="material-symbols-outlined text-white text-sm font-bold">check</span>
            </div>
          </div>
        </div>

        {/* Headline */}
        <h1 className="text-slate-900 dark:text-white tracking-tight text-[32px] font-bold leading-tight mb-3">
          Check your inbox!
        </h1>

        {/* Body Text */}
        <p className="text-slate-600 dark:text-slate-300 text-base font-normal leading-relaxed mb-6">
          We've sent a verification link to{' '}
          <strong className="text-slate-900 dark:text-white font-bold bg-slate-100 dark:bg-white/5 px-2 py-0.5 rounded">
            {email}
          </strong>
          . <br className="hidden sm:block" />
          Please click the link to unlock your coding journey.
        </p>

        {/* Gamification Banner */}
        <div className="w-full bg-primary/5 border border-primary/20 rounded-lg p-3 mb-6 flex items-center justify-center gap-2">
          <span className="material-symbols-outlined text-primary text-sm">emoji_events</span>
          <span className="text-sm font-medium text-primary">Your quest awaits activation...</span>
        </div>

        {/* Status Message */}
        {message && (
          <p className={`text-sm mb-6 ${message.includes('Failed') ? 'text-red-400' : 'text-green-400'}`}>
            {message}
          </p>
        )}

        {/* Buttons */}
        <div className="w-full flex flex-col gap-3">
          <Button
            variant="primary"
            size="lg"
            onClick={handleResendEmail}
            disabled={isSending}
            className="w-full flex justify-center items-center gap-2"
          >
            {isSending ? (
              <>
                <span className="material-symbols-outlined animate-spin text-lg">sync</span>
                Sending...
              </>
            ) : (
              'Resend Email'
            )}
          </Button>

          <Link
            to="/auth/login"
            className="flex w-full cursor-pointer items-center justify-center rounded-xl h-12 px-5 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/5 text-sm font-bold transition-all gap-2"
          >
            <span className="material-symbols-outlined text-lg">arrow_back</span>
            <span>Back to Sign In</span>
          </Link>
        </div>

        {/* Footer Note */}
        <div className="mt-8 pt-6 border-t border-slate-100 dark:border-[#282839] w-full">
          <p className="text-slate-400 text-xs flex items-center justify-center gap-1.5">
            <span className="material-symbols-outlined text-base">info</span>
            Can't find it? Check your spam folder.
          </p>
        </div>
      </div>
    </div>
  )
}

export default EmailVerificationSent
