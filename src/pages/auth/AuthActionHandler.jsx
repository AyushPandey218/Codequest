import { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

const AuthActionHandler = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const { verifyEmailCode } = useAuth()
  const [status, setStatus] = useState('processing') // 'processing', 'success', 'error'
  const [error, setError] = useState('')

  useEffect(() => {
    const params = new URLSearchParams(location.search)
    const mode = params.get('mode')
    const oobCode = params.get('oobCode')

    if (!mode || !oobCode) {
      setStatus('error')
      setError('Invalid request. Missing parameters.')
      return
    }

    const handleAction = async () => {
      try {
        switch (mode) {
          case 'verifyEmail':
            const result = await verifyEmailCode(oobCode)
            if (result.success) {
              navigate('/auth/email-verified')
            } else {
              setStatus('error')
              setError(result.error || 'Failed to verify email.')
            }
            break
          case 'resetPassword':
            // Important: We redirect to the specific page but keep the code
            navigate(`/auth/reset-password?oobCode=${oobCode}`)
            break
          case 'recoverEmail':
            setStatus('error')
            setError('Email recovery is not yet implemented. Please contact support.')
            break
          default:
            setStatus('error')
            setError('Unsupported authentication mode.')
        }
      } catch (err) {
        console.error('[AuthActionHandler] Error:', err)
        setStatus('error')
        setError('A technical error occurred during processing.')
      }
    }

    handleAction()
  }, [location, verifyEmailCode, navigate])

  return (
    <div className="flex-1 flex items-center justify-center relative overflow-hidden p-6">
      {/* Abstract Background Elements */}
      <div className="absolute inset-0 bg-grid-pattern opacity-[0.15] pointer-events-none"></div>
      <div className="absolute top-[-20%] right-[-10%] w-[600px] h-[600px] bg-primary/10 rounded-full blur-[120px] pointer-events-none"></div>
      
      <div className="layout-content-container flex flex-col max-w-[560px] w-full relative z-10">
        <div className="flex flex-col items-center gap-8 bg-white dark:bg-[#1c1c2e] p-8 md:p-12 rounded-2xl border border-slate-200 dark:border-[#2f3042] shadow-2xl transition-all duration-300">
          
          {status === 'processing' ? (
            <>
              {/* Processing Spinner */}
              <div className="relative flex items-center justify-center">
                <div className="absolute inset-0 bg-primary/20 rounded-full scale-150 animate-pulse"></div>
                <div className="relative w-20 h-20 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
              </div>

              <div className="flex flex-col items-center gap-3 text-center">
                <h1 className="text-3xl font-bold leading-tight tracking-tight text-slate-900 dark:text-white">
                  Securing Your Account
                </h1>
                <p className="text-slate-600 dark:text-[#9d9db9] text-base font-normal leading-relaxed">
                  Please wait a moment while we process your request and update your account security.
                </p>
              </div>
            </>
          ) : (
            <>
              {/* Error State */}
              <div className="relative flex items-center justify-center">
                <div className="absolute inset-0 bg-red-500/20 rounded-full scale-150 animate-pulse"></div>
                <div className="relative bg-red-500 text-white rounded-full p-6 flex items-center justify-center shadow-lg shadow-red-500/40">
                  <span className="material-symbols-outlined !text-5xl">warning</span>
                </div>
              </div>

              <div className="flex flex-col items-center gap-3 text-center">
                <h1 className="text-3xl font-bold leading-tight tracking-tight text-slate-900 dark:text-white">
                  Action Failed
                </h1>
                <p className="text-red-500 dark:text-red-400 text-base font-normal leading-relaxed">
                  {error}
                </p>
              </div>

              <button
                onClick={() => navigate('/auth/login')}
                className="w-full py-3 px-6 bg-primary hover:bg-primary/90 text-white rounded-xl font-bold transition-all duration-200 shadow-lg shadow-primary/25"
              >
                Return to Login
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default AuthActionHandler
