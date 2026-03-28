import { createContext, useContext, useState, useEffect } from 'react'
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  updateProfile as firebaseUpdateProfile,
  sendEmailVerification,
  sendPasswordResetEmail,
  confirmPasswordReset
} from 'firebase/auth'
import { doc, getDoc, setDoc, updateDoc, serverTimestamp, arrayUnion, increment, onSnapshot as firestoreSnapshot } from 'firebase/firestore'
import { auth, db, googleProvider, isDemoMode } from '../config/firebase'
import { STORAGE_KEYS } from '../utils/constants'
import { checkAchievements } from '../utils/achievementChecker'
import { getAuthErrorMessage } from '../utils/errorHandlers'

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

  useEffect(() => {
    let unsubscribeUser = null;

    const unsubscribeAuth = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        // Setup real-time listener for user document
        unsubscribeUser = firestoreSnapshot(doc(db, 'users', firebaseUser.uid), (docSnap) => {
          if (docSnap.exists()) {
            const userData = docSnap.data()
            
            if (userData?.status === 'suspended') {
              signOut(auth)
              return
            }

            const mergedUser = {
              uid: firebaseUser.uid,
              email: firebaseUser.email,
              displayName: firebaseUser.displayName,
              photoURL: firebaseUser.photoURL,
              bio: userData?.bio || '',
              university: userData?.university || '',
              website: userData?.website || '',
              ...userData
            }

            setUser(mergedUser)
            setIsAuthenticated(true)
            localStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(mergedUser))
          }
        })
      } else {
        // If in demo mode and no Firebase user, check for local mock user
        if (isDemoMode) {
          const storedUser = localStorage.getItem(STORAGE_KEYS.USER_DATA)
          if (storedUser) {
            setUser(JSON.parse(storedUser))
            setIsAuthenticated(true)
          } else {
            setUser(null)
            setIsAuthenticated(false)
          }
        } else {
          if (unsubscribeUser) unsubscribeUser();
          setUser(null)
          setIsAuthenticated(false)
          localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN)
          localStorage.removeItem(STORAGE_KEYS.USER_DATA)
        }
      }
      setIsLoading(false)
    })

    return () => {
      unsubscribeAuth()
      if (unsubscribeUser) unsubscribeUser();
    }
  }, [])

  const login = async (email, password) => {
    // Demo Mode Mock Login
    if (isDemoMode) {
      const demoEmail = import.meta.env.VITE_DEMO_EMAIL || 'demo@codequest.com'
      const demoPassword = import.meta.env.VITE_DEMO_PASSWORD || 'demo123'

      if (email === demoEmail && password === demoPassword) {
        const mockUser = {
          uid: 'demo-user-123',
          email: demoEmail,
          displayName: 'Demo Adventurer',
          username: 'demo_user',
          role: 'admin',
          level: 10,
          xp: 2500,
          streak: 5,
          rating: 1200,
          avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=Demo`
        }
        setUser(mockUser)
        setIsAuthenticated(true)
        localStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(mockUser))
        localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, 'demo-token-123')
        return { success: true, isAdmin: true }
      } else {
        return { success: false, error: 'Invalid demo credentials. Use demo@codequest.com / demo123' }
      }
    }

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password)
      const firebaseUser = userCredential.user

      const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid))
      const userData = userDoc.exists() ? userDoc.data() : null

      if (userData?.status === 'suspended') {
        throw new Error("Your account has been suspended. Please contact support.")
      }

      return {
        success: true,
        isAdmin: userData?.role === 'admin'
      }
    } catch (error) {
      console.error('Login error:', error)
      return { success: false, error: getAuthErrorMessage(error.code) }
    }
  }

  const signup = async (username, email, password) => {
    if (isDemoMode) {
      return { success: false, error: 'Signup is disabled in Demo Mode. Please use the Demo Login.' }
    }
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password)
      const firebaseUser = userCredential.user

      // Set initial profile in Firebase Auth
      await firebaseUpdateProfile(firebaseUser, {
        displayName: username,
        photoURL: `https://api.dicebear.com/7.x/avataaars/svg?seed=${username}`
      })

      // Send the verification email immediately
      await sendEmailVerification(firebaseUser)

      // Create user document in Firestore
      const initialUserData = {
        username: username,
        email: email,
        role: 'user',
        level: 1,
        xp: 0,
        streak: 0,
        rating: 1000,
        clashesTotal: 0,
        clashesWon: 0,
        createdAt: serverTimestamp(),
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${username}`,
        status: 'active'
      }

      await setDoc(doc(db, 'users', firebaseUser.uid), initialUserData)

      return { success: true }
    } catch (error) {
      console.error('Signup error:', error)
      return { success: false, error: getAuthErrorMessage(error.code) }
    }
  }

  const resendVerification = async () => {
    try {
      if (auth.currentUser && !auth.currentUser.emailVerified) {
        const actionCodeSettings = {
          url: `${window.location.origin}/auth/login`,
          handleCodeInApp: true,
        };
        await sendEmailVerification(auth.currentUser, actionCodeSettings)
        return { success: true }
      }
      return { success: false, error: 'User not found or already verified.' }
    } catch (error) {
      console.error('Resend verification error:', error)
      return { success: false, error: getAuthErrorMessage(error.code) }
    }
  }

  const loginWithGoogle = async () => {
    if (isDemoMode) {
      // Mock Google Login
      const mockUser = {
        uid: 'demo-google-user',
        email: 'google-demo@codequest.com',
        displayName: 'Google Demo User',
        username: 'google_demo',
        role: 'user',
        level: 5,
        xp: 1200,
        streak: 2,
        rating: 1050,
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=Google`
      }
      setUser(mockUser)
      setIsAuthenticated(true)
      localStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(mockUser))
      localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, 'demo-token-google')
      return { success: true, isAdmin: false }
    }
    try {
      const result = await signInWithPopup(auth, googleProvider)
      const firebaseUser = result.user

      // Check if user document exists in Firestore
      const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid))

      let isAdmin = false
      if (!userDoc.exists()) {
        // Create initial profile for new Google user
        const username = firebaseUser.displayName || firebaseUser.email.split('@')[0]
        const initialUserData = {
          username: username,
          email: firebaseUser.email,
          role: 'user',
          level: 1,
          xp: 0,
          streak: 0,
          rating: 1000,
          clashesTotal: 0,
          clashesWon: 0,
          createdAt: serverTimestamp(),
          avatar: firebaseUser.photoURL || `https://api.dicebear.com/7.x/avataaars/svg?seed=${username}`,
          bio: '',
          university: '',
          website: ''
        }
        await setDoc(doc(db, 'users', firebaseUser.uid), initialUserData)
      } else {
        isAdmin = userDoc.data()?.role === 'admin'
        // Sync Google photoURL to avatar if it changed or is missing
        if (firebaseUser.photoURL && userDoc.data()?.avatar !== firebaseUser.photoURL) {
          await updateDoc(doc(db, 'users', firebaseUser.uid), {
            avatar: firebaseUser.photoURL
          })
        }
      }

      return { success: true, isAdmin }
    } catch (error) {
      console.error('Google login error:', error)
      return { success: false, error: getAuthErrorMessage(error.code) }
    }
  }

  const logout = async () => {
    try {
      if (!isDemoMode || auth.currentUser) {
        await signOut(auth)
      }
      setUser(null)
      setIsAuthenticated(false)
      localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN)
      localStorage.removeItem(STORAGE_KEYS.USER_DATA)
    } catch (error) {
      console.error('Logout error:', error)
    }
  }

  const updateProfile = async (updates) => {
    if (!user?.uid) return

    try {
      await updateDoc(doc(db, 'users', user.uid), updates)
      // Local state is now handled by the onSnapshot listener
    } catch (error) {
      console.error('Update profile error:', error)
    }
  }

  const updateXP = async (xpAmount) => {
    if (!user?.uid) return
    try {
      await updateDoc(doc(db, 'users', user.uid), {
        xp: increment(xpAmount)
      })
    } catch (error) {
      console.error('Update XP error:', error)
    }
  }

  const completeLesson = async (moduleId, lessonId, xpReward = 50) => {
    if (!user?.uid) return

    try {
      const progressRef = doc(db, 'moduleProgress', `${user.uid}_${moduleId}`)
      const progressDoc = await getDoc(progressRef)

      if (!progressDoc.exists()) {
        await setDoc(progressRef, {
          uid: user.uid,
          moduleId: moduleId,
          completedLessons: [lessonId],
          status: 'started',
          lastUpdated: serverTimestamp()
        })
        await updateXP(xpReward)
      } else {
        const data = progressDoc.data()
        if (!data.completedLessons.includes(lessonId)) {
          await updateDoc(progressRef, {
            completedLessons: arrayUnion(lessonId),
            lastUpdated: serverTimestamp()
          })
          await updateXP(xpReward)
        }
      }
    } catch (error) {
      console.error('Complete lesson error:', error)
    }
  }

  const resetPassword = async (email) => {
    try {
      const actionCodeSettings = {
        url: `${window.location.origin}/auth/reset-password`,
        handleCodeInApp: true,
      };
      await sendPasswordResetEmail(auth, email, actionCodeSettings)
      return { success: true }
    } catch (error) {
      console.error('Reset password error:', error)
      return { success: false, error: getAuthErrorMessage(error.code) }
    }
  }
  
  const confirmReset = async (oobCode, newPassword) => {
    try {
      await confirmPasswordReset(auth, oobCode, newPassword)
      return { success: true }
    } catch (error) {
      console.error('Confirm reset error:', error)
      return { success: false, error: getAuthErrorMessage(error.code) }
    }
  }

  const isAdmin = user?.role === 'admin'

  const value = {
    user,
    isAuthenticated,
    isAdmin,
    isLoading,
    login,
    signup,
    loginWithGoogle,
    logout,
    updateProfile,
    resendVerification,
    updateXP,
    completeLesson,
    resetPassword,
    confirmReset,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
