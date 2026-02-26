import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { getProgressSummary } from '../../utils/progressStorage'
import Card from '../../components/common/Card'
import Badge from '../../components/common/Badge'
import Avatar from '../../components/common/Avatar'
import Button from '../../components/common/Button'
import Input from '../../components/common/Input'

/**
 * Edit Profile Page - Revamped to match the premium dark theme design
 * Features Sidebar status and structured account settings
 */
const EditProfile = () => {
  const navigate = useNavigate()
  const { user, updateProfile } = useAuth()

  // Real progress for sidebar status
  const [progress, setProgress] = useState(() => getProgressSummary())
  const [isSaving, setIsSaving] = useState(false)

  // Form state
  const [formData, setFormData] = useState({
    username: user?.username || '',
    displayName: user?.displayName || user?.username || '',
    email: user?.email || '',
    bio: 'Computer Science student passionate about AI and Web Development. Always looking for a coding buddy for the next hackathon! 🚀',
    university: 'Tech State University',
    website: 'https://',
  })

  const [avatar, setAvatar] = useState(user?.avatar || '')

  const handleChange = (e) => {
    const { name, value } = e.target
    // Bio limit check (250 chars per mockup)
    if (name === 'bio' && value.length > 250) return
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleAvatarChange = () => {
    // Mock avatar generation
    const newSeed = Math.random().toString(36).substring(7)
    setAvatar(`https://api.dicebear.com/7.x/avataaars/svg?seed=${newSeed}`)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSaving(true)

    // Simulate save
    await new Promise(resolve => setTimeout(resolve, 800))

    updateProfile({
      ...user,
      username: formData.username,
      displayName: formData.displayName,
      avatar: avatar
    })

    setIsSaving(false)
    navigate(`/app/profile/${formData.username}`)
  }

  const handleCancel = () => {
    navigate(-1)
  }

  return (
    <div className="max-w-[1280px] mx-auto p-4 lg:p-8 min-h-screen bg-background-dark text-white selection:bg-primary/30">
      {/* Breadcrumbs */}
      <div className="flex items-center gap-2 text-xs font-bold text-slate-500 mb-6 uppercase tracking-widest">
        <Link to="/app/profile" className="hover:text-primary transition-colors">Profile</Link>
        <span className="material-symbols-outlined text-xs">chevron_right</span>
        <span className="text-slate-300">Edit Profile</span>
      </div>

      {/* Header */}
      <div className="mb-10 animate-fade-in">
        <h1 className="text-4xl font-bold mb-2">Edit Profile</h1>
        <p className="text-slate-400">Customize your identity and account settings on CodeQuest.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

        {/* --- SIDEBAR (Left Column) --- */}
        <div className="lg:col-span-4 space-y-6 animate-slide-in-left">
          {/* User Preview & Avatar Management */}
          <Card className="bg-panel-dark border-white/5 p-8 flex flex-col items-center relative group">
            <Avatar
              src={avatar}
              name={formData.displayName}
              size="xl"
              className="size-32 border-4 border-[#282839] mb-6 relative z-10"
            />
            <div className="absolute top-[138px] size-6 bg-green-500 border-4 border-[#12122a] rounded-full z-20"></div>

            <div className="text-center mb-8">
              <h3 className="text-xl font-bold mb-1">{formData.displayName}</h3>
              <p className="text-slate-500 text-sm font-medium">@{formData.username?.toLowerCase()}</p>
            </div>

            <div className="w-full space-y-3">
              <Button
                type="button"
                variant="primary"
                className="w-full h-12 flex items-center justify-center gap-2"
                onClick={handleAvatarChange}
              >
                <span className="material-symbols-outlined text-xl">upload</span>
                Upload New Picture
              </Button>
              <button
                type="button"
                className="w-full text-xs font-bold text-red-500/80 hover:text-red-500 transition-colors py-2 uppercase tracking-widest"
                onClick={() => setAvatar('')}
              >
                Remove Picture
              </button>
            </div>
          </Card>

          {/* Current Status Sidebar Card */}
          <Card className="bg-panel-dark border-white/5 p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-sm font-bold uppercase tracking-widest text-slate-400">Current Status</h3>
              <span className="material-symbols-outlined text-primary text-xl">military_tech</span>
            </div>

            <div className="mb-6">
              <div className="flex justify-between items-end mb-2">
                <span className="text-sm font-bold">Level {progress.level}</span>
                <span className="text-[11px] font-bold text-primary">
                  {progress.xp.toLocaleString()} / {(progress.level * 200 + 200).toLocaleString()} XP
                </span>
              </div>
              <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                <div
                  className="h-full bg-primary shadow-[0_0_10px_rgba(79,70,229,0.5)] transition-all duration-1000"
                  style={{ width: `${progress.levelProgress * 100}%` }}
                ></div>
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              <Badge variant="primary" className="bg-primary/10 text-[10px] py-1 px-3 uppercase tracking-tighter">Python Pro</Badge>
              <Badge variant="success" className="bg-green-500/10 text-[10px] py-1 px-3 uppercase tracking-tighter">Bug Hunter</Badge>
              <Badge variant="warning" className="bg-orange-500/10 text-[10px] py-1 px-3 uppercase tracking-tighter">{progress.streak} Day Streak</Badge>
            </div>
          </Card>
        </div>

        {/* --- FORM CONTENT (Right Columns) --- */}
        <form onSubmit={handleSubmit} className="lg:col-span-8 animate-slide-in-right">
          <Card className="bg-panel-dark border-white/5 p-0 overflow-hidden">
            {/* Section 1: Public Profile */}
            <div className="p-8 border-b border-white/5">
              <div className="flex items-center gap-3 mb-8">
                <span className="material-symbols-outlined text-primary">person</span>
                <h2 className="text-lg font-bold">Public Profile</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Username</label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-4 flex items-center text-slate-600 group-focus-within:text-primary transition-colors">
                      <span className="text-sm font-bold">@</span>
                    </div>
                    <input
                      name="username"
                      value={formData.username}
                      onChange={handleChange}
                      className="w-full h-12 bg-input-dark border border-white/5 rounded-xl pl-10 pr-4 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary shadow-inner autofill:bg-transparent transition-all"
                      placeholder="username"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Display Name</label>
                  <input
                    name="displayName"
                    value={formData.displayName}
                    onChange={handleChange}
                    className="w-full h-12 bg-input-dark border border-white/5 rounded-xl px-4 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary shadow-inner transition-all"
                    placeholder="Full Name"
                  />
                </div>
              </div>

              <div className="space-y-2 mb-8">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Bio</label>
                <div className="relative">
                  <textarea
                    name="bio"
                    value={formData.bio}
                    onChange={handleChange}
                    rows="4"
                    className="w-full bg-input-dark border border-white/5 rounded-xl p-4 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary transition-all resize-none shadow-inner leading-relaxed"
                    placeholder="Tell us about yourself..."
                  />
                  <div className="text-[10px] font-bold text-slate-600 text-right mt-1 uppercase tracking-widest">
                    {formData.bio.length} / 250 characters
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">University / Institution</label>
                  <div className="relative">
                    <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-600 text-lg">school</span>
                    <input
                      name="university"
                      value={formData.university}
                      onChange={handleChange}
                      className="w-full h-12 bg-input-dark border border-white/5 rounded-xl pl-12 pr-4 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary shadow-inner transition-all"
                      placeholder="Where do you study?"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Personal Website</label>
                  <div className="relative">
                    <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-600 text-lg">link</span>
                    <input
                      name="website"
                      value={formData.website}
                      onChange={handleChange}
                      className="w-full h-12 bg-input-dark border border-white/5 rounded-xl pl-12 pr-4 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary shadow-inner transition-all"
                      placeholder="https://"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Section 2: Account Settings */}
            <div className="p-8 pb-12">
              <div className="flex items-center gap-3 mb-8">
                <span className="material-symbols-outlined text-primary">settings</span>
                <h2 className="text-lg font-bold">Account Settings</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Email Address</label>
                  <div className="relative group">
                    <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-600 text-lg group-hover:text-primary transition-colors">mail</span>
                    <input
                      name="email"
                      value={formData.email}
                      readOnly
                      className="w-full h-12 bg-input-dark/50 border border-white/5 rounded-xl pl-12 pr-12 text-sm font-medium text-slate-500 cursor-not-allowed opacity-70"
                    />
                    <span className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 text-slate-600 text-lg">lock</span>
                  </div>
                  <p className="text-[10px] font-bold text-slate-600 ml-1 uppercase tracking-tighter">Contact support to update your email.</p>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Password</label>
                  <button
                    type="button"
                    className="w-full h-12 bg-input-dark border border-white/5 rounded-xl px-4 flex items-center justify-between hover:bg-[#282839] transition-all group"
                  >
                    <div className="flex items-center gap-3 text-slate-400 group-hover:text-white transition-colors">
                      <span className="material-symbols-outlined text-lg">key</span>
                      <span className="text-sm font-bold">Change Password</span>
                    </div>
                    <span className="material-symbols-outlined text-slate-600 group-hover:text-primary group-hover:translate-x-1 transition-all">arrow_forward</span>
                  </button>
                  <p className="text-[10px] font-bold text-slate-600 ml-1 uppercase tracking-tighter italic">Last changed 3 months ago.</p>
                </div>
              </div>
            </div>

            {/* Sticky/Bottom Actions */}
            <div className="p-6 bg-[#0f0f1d] border-t border-white/5 flex items-center justify-end gap-4">
              <Button
                type="button"
                variant="secondary"
                className="bg-transparent border border-white/10 hover:bg-white/5 px-8"
                onClick={handleCancel}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="primary"
                className="px-10 h-12 flex items-center gap-2 shadow-xl shadow-primary/20"
                isLoading={isSaving}
              >
                <span className="material-symbols-outlined text-xl">save</span>
                Save Changes
              </Button>
            </div>
          </Card>
        </form>
      </div>
    </div>
  )
}

export default EditProfile
