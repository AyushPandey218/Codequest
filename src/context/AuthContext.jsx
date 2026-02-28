import { createContext, useContext, useState, useEffect } from 'react'
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  updateProfile as firebaseUpdateProfile,
  sendEmailVerification
} from 'firebase/auth'
import { doc, getDoc, setDoc, updateDoc, serverTimestamp, arrayUnion, increment } from 'firebase/firestore'
import { auth, db, googleProvider } from '../config/firebase'
import { STORAGE_KEYS } from '../utils/constants'
import { checkAchievements } from '../utils/achievementChecker'
import { Capacitor } from '@capacitor/core'
import { FirebaseAuthentication } from '@capacitor-firebase/authentication'

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
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        // Fetch additional user data from Firestore
        const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid))
        const userData = userDoc.exists() ? userDoc.data() : null

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
      } else {
        setUser(null)
        setIsAuthenticated(false)
        localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN)
        localStorage.removeItem(STORAGE_KEYS.USER_DATA)
      }
      setIsLoading(false)
    })

    return () => unsubscribe()
  }, [])

  const login = async (email, password) => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password)
      const firebaseUser = userCredential.user

      const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid))
      const userData = userDoc.exists() ? userDoc.data() : null

      return {
        success: true,
        isAdmin: userData?.role === 'admin'
      }
    } catch (error) {
      console.error('Login error:', error)
      return { success: false, error: error.message }
    }
  }

  const signup = async (username, email, password) => {
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
        createdAt: serverTimestamp(),
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${username}`
      }

      await setDoc(doc(db, 'users', firebaseUser.uid), initialUserData)

      return { success: true }
    } catch (error) {
      console.error('Signup error:', error)
      return { success: false, error: error.message }
    }
  }

  const resendVerification = async () => {
    try {
      if (auth.currentUser && !auth.currentUser.emailVerified) {
        await sendEmailVerification(auth.currentUser)
        return { success: true }
      }
      return { success: false, error: 'User not found or already verified.' }
    } catch (error) {
      console.error('Resend verification error:', error)
      return { success: false, error: error.message }
    }
  }

  const loginWithGoogle = async () => {
    try {
      let firebaseUser

      if (Capacitor.isNativePlatform()) {
        const result = await FirebaseAuthentication.signInWithGoogle()
        firebaseUser = result.user
      } else {
        const result = await signInWithPopup(auth, googleProvider)
        firebaseUser = result.user
      }

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
      return { success: false, error: error.message }
    }
  }

  const logout = async () => {
    try {
      await signOut(auth)
    } catch (error) {
      console.error('Logout error:', error)
    }
  }

  const updateProfile = async (updates) => {
    if (!user?.uid) return

    try {
      await updateDoc(doc(db, 'users', user.uid), updates)
      setUser(prev => ({ ...prev, ...updates }))
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
      setUser(prev => ({ ...prev, xp: (prev.xp || 0) + xpAmount }))
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
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
