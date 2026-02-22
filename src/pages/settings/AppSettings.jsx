import { useState } from 'react'
import Card from '../../components/common/Card'
import Badge from '../../components/common/Badge'
import Button from '../../components/common/Button'

const AppSettings = () => {
  const [activeTab, setActiveTab] = useState('preferences')
  const [settings, setSettings] = useState({
    theme: 'dark',
    language: 'en',
    codeEditor: 'monaco',
    fontSize: 'medium',
    autoSave: true,
    soundEffects: true,
    notifications: true,
    emailDigest: 'weekly',
    achievements: true,
    leaderboard: true,
  })

  const handleToggle = (key) => {
    setSettings({ ...settings, [key]: !settings[key] })
  }

  const handleSelect = (key, value) => {
    setSettings({ ...settings, [key]: value })
  }

  return (
    <div className="max-w-[1200px] mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
          App Settings
        </h1>
        <p className="text-slate-600 dark:text-text-secondary mt-1">
          Customize your CodeQuest experience
        </p>
      </div>

      {/* Tabs */}
      <Card variant="elevated" className="overflow-hidden">
        <div className="flex border-b border-slate-200 dark:border-border-dark overflow-x-auto pb-2">
          {['preferences', 'editor', 'notifications', 'privacy'].map((tab) => (
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
          {/* Preferences Tab */}
          {activeTab === 'preferences' && (
            <div className="space-y-6">
              {/* Theme */}
              <Card variant="bordered" className="p-6">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">
                  Appearance
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-3 block">
                      Theme
                    </label>
                    <div className="grid grid-cols-3 gap-3">
                      {['light', 'dark', 'auto'].map((theme) => (
                        <button
                          key={theme}
                          onClick={() => handleSelect('theme', theme)}
                          className={`p-4 rounded-xl border-2 transition-all capitalize ${
                            settings.theme === theme
                              ? 'border-primary bg-primary/5'
                              : 'border-slate-200 dark:border-border-dark hover:border-primary/50'
                          }`}
                        >
                          <span className="material-symbols-outlined text-2xl mb-2 block">
                            {theme === 'light' ? 'light_mode' : theme === 'dark' ? 'dark_mode' : 'contrast'}
                          </span>
                          {theme}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-3 block">
                      Language
                    </label>
                    <select
                      value={settings.language}
                      onChange={(e) => handleSelect('language', e.target.value)}
                      className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-[#282839] border border-slate-200 dark:border-border-dark text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary"
                    >
                      <option value="en">English</option>
                      <option value="es">Español</option>
                      <option value="fr">Français</option>
                      <option value="de">Deutsch</option>
                      <option value="ja">日本語</option>
                    </select>
                  </div>
                </div>
              </Card>

              {/* Sound & Effects */}
              <Card variant="bordered" className="p-6">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">
                  Sound & Effects
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-4 rounded-xl bg-slate-50 dark:bg-[#282839]">
                    <div>
                      <h4 className="font-bold text-slate-900 dark:text-white mb-1">
                        Sound Effects
                      </h4>
                      <p className="text-sm text-slate-600 dark:text-text-secondary">
                        Play sounds for actions and achievements
                      </p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={settings.soundEffects}
                        onChange={() => handleToggle('soundEffects')}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-slate-600 peer-checked:bg-primary"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between p-4 rounded-xl bg-slate-50 dark:bg-[#282839]">
                    <div>
                      <h4 className="font-bold text-slate-900 dark:text-white mb-1">
                        Auto-save
                      </h4>
                      <p className="text-sm text-slate-600 dark:text-text-secondary">
                        Automatically save your code while editing
                      </p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={settings.autoSave}
                        onChange={() => handleToggle('autoSave')}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-slate-600 peer-checked:bg-primary"></div>
                    </label>
                  </div>
                </div>
              </Card>
            </div>
          )}

          {/* Editor Tab */}
          {activeTab === 'editor' && (
            <div className="space-y-6">
              <Card variant="bordered" className="p-6">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">
                  Code Editor
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-3 block">
                      Editor Type
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                      {['monaco', 'codemirror'].map((editor) => (
                        <button
                          key={editor}
                          onClick={() => handleSelect('codeEditor', editor)}
                          className={`p-4 rounded-xl border-2 transition-all capitalize ${
                            settings.codeEditor === editor
                              ? 'border-primary bg-primary/5'
                              : 'border-slate-200 dark:border-border-dark hover:border-primary/50'
                          }`}
                        >
                          {editor}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-3 block">
                      Font Size
                    </label>
                    <div className="grid grid-cols-3 gap-3">
                      {['small', 'medium', 'large'].map((size) => (
                        <button
                          key={size}
                          onClick={() => handleSelect('fontSize', size)}
                          className={`p-4 rounded-xl border-2 transition-all capitalize ${
                            settings.fontSize === size
                              ? 'border-primary bg-primary/5'
                              : 'border-slate-200 dark:border-border-dark hover:border-primary/50'
                          }`}
                        >
                          {size}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </Card>

              <Card variant="bordered" className="p-6">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">
                  Editor Theme
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {['VS Dark', 'GitHub Light', 'Monokai', 'Dracula', 'Nord', 'Solarized'].map((theme) => (
                    <button
                      key={theme}
                      className="p-4 rounded-xl border-2 border-slate-200 dark:border-border-dark hover:border-primary/50 transition-all text-left"
                    >
                      <p className="font-medium text-slate-900 dark:text-white">{theme}</p>
                    </button>
                  ))}
                </div>
              </Card>
            </div>
          )}

          {/* Notifications Tab */}
          {activeTab === 'notifications' && (
            <div className="space-y-6">
              <Card variant="bordered" className="p-6">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">
                  Push Notifications
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-4 rounded-xl bg-slate-50 dark:bg-[#282839]">
                    <div>
                      <h4 className="font-bold text-slate-900 dark:text-white mb-1">
                        Enable Notifications
                      </h4>
                      <p className="text-sm text-slate-600 dark:text-text-secondary">
                        Receive push notifications
                      </p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={settings.notifications}
                        onChange={() => handleToggle('notifications')}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-slate-600 peer-checked:bg-primary"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between p-4 rounded-xl bg-slate-50 dark:bg-[#282839]">
                    <div>
                      <h4 className="font-bold text-slate-900 dark:text-white mb-1">
                        Achievement Notifications
                      </h4>
                      <p className="text-sm text-slate-600 dark:text-text-secondary">
                        Get notified when you unlock achievements
                      </p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={settings.achievements}
                        onChange={() => handleToggle('achievements')}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-slate-600 peer-checked:bg-primary"></div>
                    </label>
                  </div>
                </div>
              </Card>

              <Card variant="bordered" className="p-6">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">
                  Email Notifications
                </h3>
                <div>
                  <label className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-3 block">
                    Email Digest Frequency
                  </label>
                  <select
                    value={settings.emailDigest}
                    onChange={(e) => handleSelect('emailDigest', e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-[#282839] border border-slate-200 dark:border-border-dark text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    <option value="daily">Daily</option>
                    <option value="weekly">Weekly</option>
                    <option value="monthly">Monthly</option>
                    <option value="never">Never</option>
                  </select>
                </div>
              </Card>
            </div>
          )}

          {/* Privacy Tab */}
          {activeTab === 'privacy' && (
            <div className="space-y-6">
              <Card variant="bordered" className="p-6">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">
                  Profile Visibility
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-4 rounded-xl bg-slate-50 dark:bg-[#282839]">
                    <div>
                      <h4 className="font-bold text-slate-900 dark:text-white mb-1">
                        Show on Leaderboard
                      </h4>
                      <p className="text-sm text-slate-600 dark:text-text-secondary">
                        Display your profile on public leaderboards
                      </p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={settings.leaderboard}
                        onChange={() => handleToggle('leaderboard')}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-slate-600 peer-checked:bg-primary"></div>
                    </label>
                  </div>
                </div>
              </Card>

              <Card variant="bordered" className="p-6">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">
                  Data & Privacy
                </h3>
                <div className="space-y-3">
                  <Button variant="outline" icon="download" className="w-full">
                    Download My Data
                  </Button>
                  <Button variant="outline" icon="description" className="w-full">
                    View Privacy Policy
                  </Button>
                </div>
              </Card>
            </div>
          )}
        </div>
      </Card>

      {/* Save Button */}
      <div className="flex justify-end">
        <Button variant="primary" icon="check" size="lg">
          Save All Settings
        </Button>
      </div>
    </div>
  )
}

export default AppSettings
