import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import Card from '../../components/common/Card'
import Badge from '../../components/common/Badge'
import Avatar from '../../components/common/Avatar'
import Button from '../../components/common/Button'
import Input from '../../components/common/Input'

const EditProfile = () => {
  const navigate = useNavigate()
  const { user, updateProfile } = useAuth()
  
  const [formData, setFormData] = useState({
    username: user?.username || '',
    email: user?.email || '',
    bio: 'Passionate developer learning algorithms and data structures. Love competitive programming!',
    location: 'San Francisco, CA',
    website: 'https://github.com/alexdev',
    twitter: '@alexdev',
    linkedin: 'linkedin.com/in/alexdev',
  })

  const [avatar, setAvatar] = useState(user?.avatar || '')
  const [isSaving, setIsSaving] = useState(false)

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleAvatarChange = () => {
    // In a real app, this would open a file picker
    const newSeed = Math.random().toString(36).substring(7)
    setAvatar(`https://api.dicebear.com/7.x/avataaars/svg?seed=${newSeed}`)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSaving(true)

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))

    updateProfile({
      username: formData.username,
      email: formData.email,
      avatar: avatar,
    })

    setIsSaving(false)
    navigate(`/app/profile/${formData.username}`)
  }

  return (
    <div className="max-w-[900px] mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
            Edit Profile
          </h1>
          <p className="text-slate-600 dark:text-text-secondary mt-1">
            Update your profile information
          </p>
        </div>
        <Button
          variant="outline"
          onClick={() => navigate(`/app/profile/${user?.username}`)}
        >
          Cancel
        </Button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Avatar Section */}
        <Card variant="elevated" className="p-6">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4">
            Profile Picture
          </h2>
          <div className="flex flex-col md:flex-row items-center gap-6">
            <Avatar
              src={avatar}
              name={formData.username}
              size="xl"
              ring
              ringColor="ring-primary"
              className="size-32"
            />
            <div className="flex-1 text-center md:text-left">
              <h3 className="font-bold text-slate-900 dark:text-white mb-2">
                Change Avatar
              </h3>
              <p className="text-sm text-slate-600 dark:text-text-secondary mb-4">
                Click the button to generate a new random avatar
              </p>
              <div className="flex gap-2 justify-center md:justify-start">
                <Button
                  type="button"
                  variant="primary"
                  size="sm"
                  onClick={handleAvatarChange}
                  icon="refresh"
                >
                  Generate New
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  icon="upload"
                >
                  Upload Image
                </Button>
              </div>
            </div>
          </div>
        </Card>

        {/* Basic Information */}
        <Card variant="elevated" className="p-6">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4">
            Basic Information
          </h2>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Username"
                name="username"
                value={formData.username}
                onChange={handleChange}
                icon="person"
                required
              />
              <Input
                label="Email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                icon="mail"
                required
              />
            </div>

            <div>
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2 block">
                Bio
              </label>
              <textarea
                name="bio"
                value={formData.bio}
                onChange={handleChange}
                rows="4"
                className="w-full rounded-xl border border-slate-300 dark:border-[#3b3b54] bg-white dark:bg-[#1c1c27] text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-[#9d9db9] p-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary transition-all resize-none"
                placeholder="Tell us about yourself..."
              />
              <p className="text-xs text-slate-500 dark:text-slate-500 mt-1">
                {formData.bio.length}/500 characters
              </p>
            </div>

            <Input
              label="Location"
              name="location"
              value={formData.location}
              onChange={handleChange}
              icon="location_on"
              placeholder="City, Country"
            />
          </div>
        </Card>

        {/* Social Links */}
        <Card variant="elevated" className="p-6">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4">
            Social Links
          </h2>
          <div className="space-y-4">
            <Input
              label="Website"
              name="website"
              type="url"
              value={formData.website}
              onChange={handleChange}
              icon="link"
              placeholder="https://yourwebsite.com"
            />
            <Input
              label="Twitter"
              name="twitter"
              value={formData.twitter}
              onChange={handleChange}
              icon="tag"
              placeholder="@username"
            />
            <Input
              label="LinkedIn"
              name="linkedin"
              value={formData.linkedin}
              onChange={handleChange}
              icon="business"
              placeholder="linkedin.com/in/username"
            />
          </div>
        </Card>

        {/* Privacy Settings */}
        <Card variant="elevated" className="p-6">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4">
            Privacy Settings
          </h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 rounded-xl bg-slate-50 dark:bg-[#282839]">
              <div>
                <h3 className="font-bold text-slate-900 dark:text-white mb-1">
                  Public Profile
                </h3>
                <p className="text-sm text-slate-600 dark:text-text-secondary">
                  Allow others to view your profile
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" defaultChecked />
                <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-slate-600 peer-checked:bg-primary"></div>
              </label>
            </div>

            <div className="flex items-center justify-between p-4 rounded-xl bg-slate-50 dark:bg-[#282839]">
              <div>
                <h3 className="font-bold text-slate-900 dark:text-white mb-1">
                  Show Activity
                </h3>
                <p className="text-sm text-slate-600 dark:text-text-secondary">
                  Display your recent activity on your profile
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" defaultChecked />
                <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-slate-600 peer-checked:bg-primary"></div>
              </label>
            </div>

            <div className="flex items-center justify-between p-4 rounded-xl bg-slate-50 dark:bg-[#282839]">
              <div>
                <h3 className="font-bold text-slate-900 dark:text-white mb-1">
                  Show Stats
                </h3>
                <p className="text-sm text-slate-600 dark:text-text-secondary">
                  Display your rank and statistics
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" defaultChecked />
                <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-slate-600 peer-checked:bg-primary"></div>
              </label>
            </div>
          </div>
        </Card>

        {/* Action Buttons */}
        <Card variant="elevated" className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-slate-900 dark:text-white mb-1">
                Ready to save?
              </h3>
              <p className="text-sm text-slate-600 dark:text-text-secondary">
                Your changes will be visible immediately
              </p>
            </div>
            <div className="flex gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate(`/app/profile/${user?.username}`)}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="primary"
                isLoading={isSaving}
                icon="check"
              >
                Save Changes
              </Button>
            </div>
          </div>
        </Card>
      </form>
    </div>
  )
}

export default EditProfile
