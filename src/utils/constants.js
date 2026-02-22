// Application Constants

// Colors
export const COLORS = {
  primary: '#2b2bee',
  backgroundLight: '#f6f6f8',
  backgroundDark: '#101022',
  cardDark: '#1c1c27',
  borderDark: '#282839',
  textSecondary: '#9d9db9',
}

// Routes
export const ROUTES = {
  // Auth Routes
  LOGIN: '/auth/login',
  SIGNUP: '/auth/signup',
  CREATE_ACCOUNT: '/auth/create-account',
  EMAIL_VERIFICATION_SENT: '/auth/email-verification-sent',
  EMAIL_VERIFIED: '/auth/email-verified',
  PASSWORD_RECOVERY: '/auth/password-recovery',
  PASSWORD_RECOVERY_CONFIRMATION: '/auth/password-recovery-confirmation',
  PASSWORD_CHANGED: '/auth/password-changed',
  
  // App Routes
  DASHBOARD: '/app/dashboard',
  PROGRESS: '/app/progress',
  LEADERBOARD: '/app/leaderboard',
  
  // Quest Routes
  QUESTS: '/app/quests',
  QUEST_DETAIL: '/app/quests/:questId',
  QUEST_WALKTHROUGH: '/app/quests/:questId/walkthrough',
  QUEST_DEBUG: '/app/quests/:questId/debug',
  MODULES: '/app/modules',
  
  // Clash Routes
  CLASH_LOBBY: '/app/clash',
  CLASH_LIVE: '/app/clash/:clashId/live',
  CLASH_RESULTS: '/app/clash/:clashId/results',
  
  // Profile Routes
  PROFILE: '/app/profile/:userId',
  EDIT_PROFILE: '/app/profile/edit',
  ACCOUNT_SETTINGS: '/app/settings/account',
  APP_SETTINGS: '/app/settings/app',
  
  // Community Routes
  COMMUNITY: '/app/community',
  SUPPORT: '/app/support',
  
  // Legal Routes
  TERMS: '/legal/terms',
  PRIVACY: '/legal/privacy',
}

// Local Storage Keys
export const STORAGE_KEYS = {
  AUTH_TOKEN: 'codequest_auth_token',
  USER_DATA: 'codequest_user_data',
  THEME: 'codequest_theme',
}

// API Endpoints (for future use)
export const API_ENDPOINTS = {
  BASE_URL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api',
  LOGIN: '/auth/login',
  SIGNUP: '/auth/signup',
  LOGOUT: '/auth/logout',
  USER_PROFILE: '/user/profile',
  QUESTS: '/quests',
  LEADERBOARD: '/leaderboard',
}
