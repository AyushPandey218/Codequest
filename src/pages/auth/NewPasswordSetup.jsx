import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Button from '../../components/common/Button'

const NewPasswordSetup = () => {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    newPassword: '',
    confirmPassword: ''
  })
  const [showPassword, setShowPassword] = useState({
    new: false,
    confirm: false
  })
  const [isLoading, setIsLoading] = useState(false)

  // Calculate password strength
  const getPasswordStrength = (password) => {
    if (!password) return { level: 0, text: '', color: '' }
    
    let strength = 0
    if (password.length >= 8) strength++
    if (password.length >= 12) strength++
    if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength++
    if (/\d/.test(password)) strength++
    if (/[^a-zA-Z0-9]/.test(password)) strength++

    if (strength <= 2) return { level: 33, text: 'Weak', color: 'bg-red-500' }
    if (strength <= 3) return { level: 60, text: 'Medium', color: 'bg-yellow-500' }
    return { level: 100, text: 'Strong', color: 'bg-green-500' }
  }

  const passwordStrength = getPasswordStrength(formData.newPassword)

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (formData.newPassword !== formData.confirmPassword) {
      alert('Passwords do not match')
      return
    }

    if (formData.newPassword.length < 8) {
      alert('Password must be at least 8 characters')
      return
    }

    setIsLoading(true)

    // TODO: Replace with actual API call
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    navigate('/auth/password-changed')
    setIsLoading(false)
  }

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  return (
    <div className="flex-grow flex items-center justify-center px-4 py-8 relative z-10 w-full">
      {/* Ambient Background Glow */}
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/20 rounded-full blur-[120px] pointer-events-none z-0"></div>

      <div className="w-full max-w-[480px] bg-white dark:bg-[#1c1c2e] rounded-xl shadow-2xl border border-slate-200 dark:border-[#2f3042] overflow-hidden transition-all duration-300 relative z-10">
        {/* Card Header */}
        <div className="p-8 pb-6 text-center">
          <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6 text-primary">
            <span className="material-symbols-outlined text-4xl">lock_reset</span>
          </div>
          <h1 className="text-3xl font-bold tracking-tight mb-3 text-slate-900 dark:text-white">
            Reset Your Password
          </h1>
          <p className="text-slate-500 dark:text-[#9d9db9] text-base font-normal leading-relaxed">
            Secure your coding journey. Please enter a unique password below.
          </p>
        </div>

        {/* Form Content */}
        <form className="px-8 pb-8 flex flex-col gap-5" onSubmit={handleSubmit}>
          {/* New Password Field */}
          <div className="flex flex-col gap-2">
            <label 
              className="text-slate-700 dark:text-white text-sm font-medium" 
              htmlFor="new-password"
            >
              New Password
            </label>
            <div className="flex w-full items-stretch rounded-lg border border-slate-200 dark:border-[#2f3042] bg-slate-50 dark:bg-[#13131f] focus-within:border-primary focus-within:ring-1 focus-within:ring-primary transition-all duration-200 overflow-hidden">
              <input
                className="flex-1 bg-transparent border-none text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-[#9d9db9] px-4 py-3 text-base focus:ring-0"
                id="new-password"
                name="newPassword"
                placeholder="Enter new password"
                type={showPassword.new ? 'text' : 'password'}
                value={formData.newPassword}
                onChange={handleChange}
                required
              />
              <button
                className="px-4 text-slate-400 dark:text-[#9d9db9] hover:text-slate-600 dark:hover:text-white transition-colors flex items-center justify-center"
                type="button"
                onClick={() => setShowPassword({ ...showPassword, new: !showPassword.new })}
              >
                <span className="material-symbols-outlined text-[20px]">
                  {showPassword.new ? 'visibility' : 'visibility_off'}
                </span>
              </button>
            </div>
          </div>

          {/* Password Strength Meter */}
          {formData.newPassword && (
            <div className="flex flex-col gap-2">
              <div className="flex justify-between items-center">
                <span className="text-xs font-medium text-slate-500 dark:text-[#9d9db9]">
                  Password Strength
                </span>
                <span className={`text-xs font-bold ${
                  passwordStrength.text === 'Weak' ? 'text-red-500' :
                  passwordStrength.text === 'Medium' ? 'text-yellow-500' :
                  'text-green-500'
                }`}>
                  {passwordStrength.text}
                </span>
              </div>
              <div className="h-1.5 w-full bg-slate-200 dark:bg-[#3b3b54] rounded-full overflow-hidden">
                <div 
                  className={`h-full ${passwordStrength.color} rounded-full shadow-[0_0_10px_rgba(234,179,8,0.5)] transition-all duration-300`}
                  style={{ width: `${passwordStrength.level}%` }}
                ></div>
              </div>
              <p className="text-xs text-slate-400 dark:text-slate-500">
                Must be at least 8 characters.
              </p>
            </div>
          )}

          {/* Confirm Password Field */}
          <div className="flex flex-col gap-2">
            <label 
              className="text-slate-700 dark:text-white text-sm font-medium" 
              htmlFor="confirm-password"
            >
              Confirm New Password
            </label>
            <div className="flex w-full items-stretch rounded-lg border border-slate-200 dark:border-[#2f3042] bg-slate-50 dark:bg-[#13131f] focus-within:border-primary focus-within:ring-1 focus-within:ring-primary transition-all duration-200 overflow-hidden">
              <input
                className="flex-1 bg-transparent border-none text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-[#9d9db9] px-4 py-3 text-base focus:ring-0"
                id="confirm-password"
                name="confirmPassword"
                placeholder="Repeat password"
                type={showPassword.confirm ? 'text' : 'password'}
                value={formData.confirmPassword}
                onChange={handleChange}
                required
              />
              <button
                className="px-4 text-slate-400 dark:text-[#9d9db9] hover:text-slate-600 dark:hover:text-white transition-colors flex items-center justify-center"
                type="button"
                onClick={() => setShowPassword({ ...showPassword, confirm: !showPassword.confirm })}
              >
                <span className="material-symbols-outlined text-[20px]">
                  {showPassword.confirm ? 'visibility' : 'visibility_off'}
                </span>
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            variant="primary"
            size="lg"
            isLoading={isLoading}
            className="w-full mt-2 group"
          >
            <span>Set New Password</span>
            <span className="material-symbols-outlined transition-transform group-hover:translate-x-1 text-[20px]">
              arrow_forward
            </span>
          </Button>

          {/* Footer Link */}
          <div className="text-center mt-2">
            <p className="text-sm text-slate-500 dark:text-[#9d9db9]">
              Remembered it?{' '}
              <Link 
                to="/auth/login" 
                className="text-primary hover:text-primary/80 font-bold ml-1 transition-colors"
              >
                Log in
              </Link>
            </p>
          </div>
        </form>
      </div>

      {/* Footer decorative pattern */}
      <div className="absolute bottom-0 w-full h-1 bg-gradient-to-r from-transparent via-primary/50 to-transparent"></div>
    </div>
  )
}

export default NewPasswordSetup
