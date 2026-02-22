import { Link } from 'react-router-dom'
import Button from '../../components/common/Button'

const PasswordChanged = () => {
  return (
    <div className="layout-container flex flex-col grow justify-center items-center p-4 md:p-6 bg-grid-pattern">
      <div className="w-full max-w-[900px] animate-fade-in-up">
        <div className="@container">
          <div className="flex flex-col items-stretch justify-start rounded-xl @xl:flex-row @xl:items-stretch shadow-[0_0_50px_rgba(43,43,238,0.15)] bg-surface-dark border border-[#282839] overflow-hidden min-h-[420px]">
            {/* Left Side - Image */}
            <div className="w-full @xl:w-5/12 bg-center bg-no-repeat bg-cover relative group overflow-hidden min-h-[200px] @xl:min-h-0">
              <div className="absolute inset-0 bg-primary/40 mix-blend-multiply"></div>
              <div className="absolute inset-0 bg-gradient-to-t from-surface-dark via-transparent to-transparent"></div>
              <div className="absolute inset-0 flex items-center justify-center p-6">
                <div className="bg-surface-dark/30 backdrop-blur-xl border border-white/10 p-6 rounded-full shadow-2xl transform transition duration-500 group-hover:scale-110">
                  <span className="material-symbols-outlined text-white text-6xl drop-shadow-[0_0_15px_rgba(43,43,238,0.8)]">
                    lock_open
                  </span>
                </div>
              </div>
            </div>

            {/* Right Side - Content */}
            <div className="flex w-full @xl:w-7/12 grow flex-col items-center justify-center gap-6 py-10 px-6 @xl:px-12 text-center @xl:text-left">
              <div className="w-full flex flex-col items-center @xl:items-start gap-4">
                <div className="size-12 rounded-full bg-green-500/20 flex items-center justify-center mb-2 @xl:hidden">
                  <span className="material-symbols-outlined text-green-500 text-3xl">check_circle</span>
                </div>
                <div className="space-y-2">
                  <h1 className="text-white text-3xl md:text-4xl font-bold leading-tight tracking-[-0.02em]">
                    Success! <br />
                    <span className="text-primary">You're back in.</span>
                  </h1>
                  <p className="text-text-secondary text-base md:text-lg font-normal leading-relaxed max-w-md">
                    Your password has been securely updated. You have successfully recovered your account and can now access your daily quests.
                  </p>
                </div>
              </div>

              <div className="w-full pt-6 flex flex-col gap-3 items-center @xl:items-start">
                <Link to="/auth/login" className="w-full @xl:max-w-xs">
                  <Button
                    variant="primary"
                    size="lg"
                    icon="arrow_forward"
                    className="w-full group"
                  >
                    Return to Login
                  </Button>
                </Link>

                <Link to="/app/dashboard" className="w-full @xl:max-w-xs">
                  <button className="flex w-full cursor-pointer items-center justify-center overflow-hidden rounded-xl h-12 px-6 bg-transparent border border-[#282839] hover:bg-[#282839] hover:border-transparent transition-all duration-200 text-text-secondary hover:text-white text-base font-medium leading-normal">
                    <span className="truncate">Go to Dashboard</span>
                  </button>
                </Link>

                <div className="flex items-center gap-2 text-text-secondary text-xs mt-3 opacity-60">
                  <span className="material-symbols-outlined text-sm">security</span>
                  <span>Account secured with 256-bit encryption</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-8 text-center">
        <p className="text-text-secondary text-sm font-normal leading-normal">
          Need help accessing your account?{' '}
          <Link to="/app/support" className="text-white underline hover:text-primary transition-colors">
            Contact Support
          </Link>
        </p>
      </div>
    </div>
  )
}

export default PasswordChanged
