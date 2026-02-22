import { createContext, useContext, useState, useEffect } from 'react'
import { STORAGE_KEYS } from '../utils/constants'

const AuthContext = createContext(null)

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  // Initialize auth state from localStorage
  useEffect(() => {
    const token = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN)
    const userData = localStorage.getItem(STORAGE_KEYS.USER_DATA)

    if (token && userData) {
      try {
        setUser(JSON.parse(userData))
        setIsAuthenticated(true)
      } catch (error) {
        console.error('Error parsing user data:', error)
        logout()
      }
    }

    setIsLoading(false)
  }, [])

  const login = async (email, password) => {
    try {
      // Demo user account
      let mockUser
      if (email === 'demo@codequest.com' && password === 'demo123') {
        mockUser = {
          id: 'demo-user-123',
          username: 'DemoUser',
          email: email,
          avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=demo',
          level: 12,
          xp: 2450,
          rank: 42,
          role: 'user'
        }
      }
      // Default user (for any other email)
      else {
        mockUser = {
          id: '1',
          username: email.split('@')[0],
          email: email,
          avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${email}`,
          level: 12,
          xp: 2450,
          rank: 42,
          role: 'user'
        }
      }

      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000))

      // Store auth data
      localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, 'mock_token_12345')
      localStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(mockUser))

      setUser(mockUser)
      setIsAuthenticated(true)

      return { success: true }
    } catch (error) {
      console.error('Login error:', error)
      return { success: false, error: error.message }
    }
  }

  const signup = async (username, email, password) => {
    try {
      // TODO: Replace with actual API call
      const mockUser = {
        id: Math.random().toString(36).substr(2, 9),
        username: username,
        email: email,
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${username}`,
        level: 1,
        xp: 0,
        rank: null,
      }

      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000))

      // Store auth data
      localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, 'mock_token_12345')
      localStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(mockUser))

      setUser(mockUser)
      setIsAuthenticated(true)

      return { success: true }
    } catch (error) {
      console.error('Signup error:', error)
      return { success: false, error: error.message }
    }
  }

  const logout = () => {
    localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN)
    localStorage.removeItem(STORAGE_KEYS.USER_DATA)
    setUser(null)
    setIsAuthenticated(false)
  }

  const updateProfile = (updates) => {
    const updatedUser = { ...user, ...updates }
    setUser(updatedUser)
    localStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(updatedUser))
  }

  const value = {
    user,
    isAuthenticated,
    isLoading,
    login,
    signup,
    logout,
    updateProfile,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
