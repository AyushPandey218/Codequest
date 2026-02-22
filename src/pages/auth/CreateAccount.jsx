import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import Button from '../../components/common/Button'
import Input from '../../components/common/Input'

const CreateAccount = () => {
  const navigate = useNavigate()
  const { signup } = useAuth()
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const getPasswordStrength = (password) => {
    if (!password) return { strength: 'None', color: 'text-gray-500' }
    if (password.length < 4) return { strength: 'Weak', color: 'text-red-500' }
    if (password.length < 8) return { strength: 'Medium', color: 'text-yellow-500' }
    return { strength: 'Strong', color: 'text-green-500' }
  }

  const passwordStrength = getPasswordStrength(formData.password)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match')
      return
    }

    if (formData.password.length < 8) {
      setError('Password must be at least 8 characters')
      return
    }

    setIsLoading(true)
    const result = await signup(formData.username, formData.email, formData.password)
    
    if (result.success) {
      navigate('/auth/email-verification-sent')
    } else {
      setError(result.error || 'Signup failed. Please try again.')
    }
    
    setIsLoading(false)
  }

  return (
    <div className="layout-content-container flex flex-col w-full max-w-[500px]">
      <div className="glass-card border border-[#3b3b54] rounded-xl shadow-2xl overflow-hidden flex flex-col">
        {/* Progress Header */}
        <div className="bg-[#282839]/50 p-6 border-b border-[#3b3b54]">
          <div className="flex flex-col gap-3">
            <div className="flex gap-6 justify-between items-end">
              <p className="text-white text-sm font-bold uppercase tracking-wider">Quest Progress</p>
              <div className="flex items-center gap-2">
                <span className="text-[#9d9db9] text-xs font-mono">// Step 1 of 2</span>
              </div>
            </div>
            <div className="rounded-full bg-[#3b3b54] h-2 w-full overflow-hidden">
              <div className="h-full rounded-full bg-gradient-to-r from-blue-500 to-primary w-1/2 relative">
                <div className="absolute right-0 top-0 bottom-0 w-2 bg-white/30"></div>
              </div>
            </div>
            <div className="flex justify-between items-center">
              <p className="text-white text-xs font-medium leading-normal">Account Setup</p>
              <p className="text-[#9d9db9] text-xs font-normal">Next: Profile Customization</p>
            </div>
          </div>
        </div>

        {/* Form Content */}
        <div className="p-6 md:p-8 flex flex-col gap-6">
          <div className="text-center space-y-2 mb-2">
            <h1 className="text-white tracking-tight text-[28px] font-bold leading-tight">
              Create your Account
            </h1>
            <p className="text-[#9d9db9] text-base font-normal leading-normal">
              Join the quest and start your coding journey.
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-500 text-sm flex items-center gap-2">
              <span className="material-symbols-outlined text-lg">error</span>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            {/* Username */}
            <div className="flex flex-col gap-2">
              <label className="text-white text-sm font-medium">Username</label>
              <div className="relative group">
                <input
                  name="username"
                  className="w-full rounded-lg bg-[#1c1c27] border border-[#3b3b54] text-white h-12 px-4 pl-11 placeholder:text-[#585873] focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all font-normal"
                  placeholder="Choose a username"
                  type="text"
                  value={formData.username}
                  onChange={handleChange}
                  required
                />
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[#9d9db9] group-focus-within:text-primary transition-colors text-[20px]">
                  person
                </span>
              </div>
            </div>

            {/* Email */}
            <div className="flex flex-col gap-2">
              <label className="text-white text-sm font-medium">University Email</label>
              <div className="relative group">
                <input
                  name="email"
                  className="w-full rounded-lg bg-[#1c1c27] border border-[#3b3b54] text-white h-12 px-4 pl-11 placeholder:text-[#585873] focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all font-normal"
                  placeholder="student@university.edu"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[#9d9db9] group-focus-within:text-primary transition-colors text-[20px]">
                  school
                </span>
              </div>
            </div>

            {/* Password Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="flex flex-col gap-2">
                <label className="text-white text-sm font-medium">Password</label>
                <div className="relative group">
                  <input
                    name="password"
                    className="w-full rounded-lg bg-[#1c1c27] border border-[#3b3b54] text-white h-12 px-4 pl-11 placeholder:text-[#585873] focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all font-normal"
                    placeholder="8+ chars"
                    type="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                  />
                  <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[#9d9db9] group-focus-within:text-primary transition-colors text-[20px]">
                    lock
                  </span>
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-white text-sm font-medium">Confirm</label>
                <div className="relative group">
                  <input
                    name="confirmPassword"
                    className="w-full rounded-lg bg-[#1c1c27] border border-[#3b3b54] text-white h-12 px-4 pl-11 placeholder:text-[#585873] focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all font-normal"
                    placeholder="Repeat"
                    type="password"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    required
                  />
                  <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[#9d9db9] group-focus-within:text-primary transition-colors text-[20px]">
                    lock_reset
                  </span>
                </div>
              </div>
            </div>

            {/* Password Strength */}
            <p className="text-[#585873] text-xs font-mono pl-1">
              <span className="text-green-500 font-bold">✔</span> Password strength:{' '}
              <span className={passwordStrength.color}>{passwordStrength.strength}</span>
            </p>

            {/* Submit Button */}
            <Button
              type="submit"
              variant="primary"
              size="lg"
              isLoading={isLoading}
              icon="arrow_forward"
              className="w-full mt-2"
            >
              Start Quest
            </Button>

            {/* Divider */}
            <div className="relative flex py-2 items-center">
              <div className="flex-grow border-t border-[#3b3b54]"></div>
              <span className="flex-shrink mx-4 text-[#9d9db9] text-xs uppercase tracking-widest font-medium">
                Or
              </span>
              <div className="flex-grow border-t border-[#3b3b54]"></div>
            </div>

            {/* Social Buttons */}
            <div className="grid grid-cols-2 gap-4">
              <button
                type="button"
                className="flex items-center justify-center gap-2 h-11 rounded-lg bg-[#282839] border border-[#3b3b54] hover:bg-[#3b3b54] hover:border-white/20 transition-all text-white text-sm font-medium group"
              >
                <svg className="w-5 h-5 fill-white/80 group-hover:fill-white transition-colors" viewBox="0 0 24 24">
                  <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
                </svg>
                <span>GitHub</span>
              </button>
              <button
                type="button"
                className="flex items-center justify-center gap-2 h-11 rounded-lg bg-[#282839] border border-[#3b3b54] hover:bg-[#3b3b54] hover:border-white/20 transition-all text-white text-sm font-medium group"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                </svg>
                <span>Google</span>
              </button>
            </div>
          </form>
        </div>

        {/* Footer */}
        <div className="p-4 bg-[#111118]/50 border-t border-[#3b3b54] text-center">
          <p className="text-[#585873] text-xs leading-relaxed">
            By creating an account, you agree to our{' '}
            <Link to="/legal/terms" className="text-[#9d9db9] hover:text-primary underline decoration-dotted">
              Terms of Service
            </Link>{' '}
            and{' '}
            <Link to="/legal/privacy" className="text-[#9d9db9] hover:text-primary underline decoration-dotted">
              Privacy Policy
            </Link>
            .
          </p>
        </div>
      </div>
    </div>
  )
}

export default CreateAccount
