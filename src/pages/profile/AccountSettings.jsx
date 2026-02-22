import { useState } from 'react'
import { useAuth } from '../../context/AuthContext'
import Card from '../../components/common/Card'
import Badge from '../../components/common/Badge'
import Button from '../../components/common/Button'
import Input from '../../components/common/Input'

const AccountSettings = () => {
  const { user } = useAuth()
  const [activeTab, setActiveTab] = useState('security')
  const [isSaving, setIsSaving] = useState(false)

  const [passwords, setPasswords] = useState({
    current: '',
    new: '',
    confirm: '',
  })

  const handlePasswordChange = async (e) => {
    e.preventDefault()
    setIsSaving(true)
    await new Promise(resolve => setTimeout(resolve, 1000))
    setIsSaving(false)
    setPasswords({ current: '', new: '', confirm: '' })
    alert('Password changed successfully!')
  }

  const sessions = [
    {
      device: 'Chrome on macOS',
      location: 'San Francisco, CA',
      lastActive: 'Active now',
      isCurrent: true,
    },
    {
      device: 'Safari on iPhone',
      location: 'San Francisco, CA',
      lastActive: '2 hours ago',
      isCurrent: false,
    },
    {
      device: 'Firefox on Windows',
      location: 'New York, NY',
      lastActive: '3 days ago',
      isCurrent: false,
    },
  ]

  const loginHistory = [
    { date: '2024-01-30 14:32', location: 'San Francisco, CA', device: 'Chrome on macOS', status: 'success' },
    { date: '2024-01-30 09:15', location: 'San Francisco, CA', device: 'Safari on iPhone', status: 'success' },
    { date: '2024-01-29 18:45', location: 'New York, NY', device: 'Firefox on Windows', status: 'success' },
    { date: '2024-01-28 12:22', location: 'Los Angeles, CA', device: 'Unknown', status: 'failed' },
  ]

  return (
    <div className="max-w-[1200px] mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
          Account Settings
        </h1>
        <p className="text-slate-600 dark:text-text-secondary mt-1">
          Manage your account security and preferences
        </p>
      </div>

      {/* Tabs */}
      <Card variant="elevated" className="overflow-hidden">
        <div className="flex border-b border-slate-200 dark:border-border-dark overflow-x-auto pb-2">
          {['security', 'sessions', 'activity', 'danger'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-3 font-medium text-sm capitalize whitespace-nowrap transition-colors ${
                activeTab === tab
                  ? 'text-primary border-b-2 border-primary bg-primary/5'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="p-6">
          {/* Security Tab */}
          {activeTab === 'security' && (
            <div className="space-y-6">
              {/* Change Password */}
              <Card variant="bordered" className="p-6">
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4">
                  Change Password
                </h3>
                <form onSubmit={handlePasswordChange} className="space-y-4">
                  <Input
                    label="Current Password"
                    type="password"
                    value={passwords.current}
                    onChange={(e) => setPasswords({ ...passwords, current: e.target.value })}
                    icon="lock"
                    required
                  />
                  <Input
                    label="New Password"
                    type="password"
                    value={passwords.new}
                    onChange={(e) => setPasswords({ ...passwords, new: e.target.value })}
                    icon="lock_reset"
                    required
                  />
                  <Input
                    label="Confirm New Password"
                    type="password"
                    value={passwords.confirm}
                    onChange={(e) => setPasswords({ ...passwords, confirm: e.target.value })}
                    icon="lock_reset"
                    required
                  />
                  <Button
                    type="submit"
                    variant="primary"
                    isLoading={isSaving}
                    icon="check"
                  >
                    Update Password
                  </Button>
                </form>
              </Card>

              {/* Two-Factor Authentication */}
              <Card variant="bordered" className="p-6">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
                      Two-Factor Authentication
                    </h3>
                    <p className="text-sm text-slate-600 dark:text-text-secondary mb-4">
                      Add an extra layer of security to your account
                    </p>
                    <Badge variant="warning">Not Enabled</Badge>
                  </div>
                  <Button variant="primary" icon="security">
                    Enable 2FA
                  </Button>
                </div>
              </Card>

              {/* Email Verification */}
              <Card variant="bordered" className="p-6">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
                      Email Verification
                    </h3>
                    <p className="text-sm text-slate-600 dark:text-text-secondary mb-4">
                      {user?.email}
                    </p>
                    <Badge variant="success" icon="check_circle">
                      Verified
                    </Badge>
                  </div>
                  <Button variant="outline" icon="mail">
                    Change Email
                  </Button>
                </div>
              </Card>
            </div>
          )}

          {/* Sessions Tab */}
          {activeTab === 'sessions' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                    Active Sessions
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-text-secondary mt-1">
                    Manage devices where you're currently logged in
                  </p>
                </div>
                <Button variant="outline" size="sm" icon="refresh">
                  Refresh
                </Button>
              </div>

              {sessions.map((session, index) => (
                <Card key={index} variant="bordered" className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="size-12 rounded-xl bg-slate-100 dark:bg-[#282839] flex items-center justify-center">
                        <span className="material-symbols-outlined text-slate-600 dark:text-slate-300">
                          devices
                        </span>
                      </div>
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-bold text-slate-900 dark:text-white">
                            {session.device}
                          </h4>
                          {session.isCurrent && (
                            <Badge variant="success" size="sm">Current</Badge>
                          )}
                        </div>
                        <p className="text-sm text-slate-600 dark:text-text-secondary">
                          {session.location} • {session.lastActive}
                        </p>
                      </div>
                    </div>
                    {!session.isCurrent && (
                      <Button variant="outline" size="sm" icon="logout">
                        Sign Out
                      </Button>
                    )}
                  </div>
                </Card>
              ))}

              <Button variant="danger" icon="logout" className="w-full">
                Sign Out All Other Sessions
              </Button>
            </div>
          )}

          {/* Activity Tab */}
          {activeTab === 'activity' && (
            <div className="space-y-4">
              <div className="mb-4">
                <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                  Login History
                </h3>
                <p className="text-sm text-slate-600 dark:text-text-secondary mt-1">
                  Recent login attempts to your account
                </p>
              </div>

              {loginHistory.map((login, index) => (
                <Card key={index} variant="bordered" className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className={`size-10 rounded-full flex items-center justify-center ${
                        login.status === 'success'
                          ? 'bg-green-100 dark:bg-green-900/20'
                          : 'bg-red-100 dark:bg-red-900/20'
                      }`}>
                        <span className={`material-symbols-outlined text-lg ${
                          login.status === 'success'
                            ? 'text-green-600 dark:text-green-400'
                            : 'text-red-600 dark:text-red-400'
                        }`}>
                          {login.status === 'success' ? 'check_circle' : 'cancel'}
                        </span>
                      </div>
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <p className="font-medium text-slate-900 dark:text-white">
                            {login.device}
                          </p>
                          <Badge
                            variant={login.status === 'success' ? 'success' : 'danger'}
                            size="sm"
                          >
                            {login.status}
                          </Badge>
                        </div>
                        <p className="text-sm text-slate-600 dark:text-text-secondary">
                          {login.location} • {login.date}
                        </p>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}

          {/* Danger Zone Tab */}
          {activeTab === 'danger' && (
            <div className="space-y-6">
              <Card variant="bordered" className="p-6 border-red-200 dark:border-red-900/50 bg-red-50 dark:bg-red-900/10">
                <div className="flex items-start gap-4">
                  <span className="material-symbols-outlined text-red-600 dark:text-red-400 text-3xl">
                    warning
                  </span>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
                      Danger Zone
                    </h3>
                    <p className="text-sm text-slate-700 dark:text-slate-300 mb-4">
                      These actions are permanent and cannot be undone. Please proceed with caution.
                    </p>
                  </div>
                </div>
              </Card>

              <Card variant="bordered" className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-bold text-slate-900 dark:text-white mb-1">
                      Deactivate Account
                    </h4>
                    <p className="text-sm text-slate-600 dark:text-text-secondary">
                      Temporarily disable your account. You can reactivate it anytime.
                    </p>
                  </div>
                  <Button variant="outline" icon="pause">
                    Deactivate
                  </Button>
                </div>
              </Card>

              <Card variant="bordered" className="p-6 border-red-200 dark:border-red-900/50">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-bold text-red-600 dark:text-red-400 mb-1">
                      Delete Account
                    </h4>
                    <p className="text-sm text-slate-600 dark:text-text-secondary">
                      Permanently delete your account and all associated data. This cannot be undone.
                    </p>
                  </div>
                  <Button variant="danger" icon="delete">
                    Delete Account
                  </Button>
                </div>
              </Card>
            </div>
          )}
        </div>
      </Card>
    </div>
  )
}

export default AccountSettings
