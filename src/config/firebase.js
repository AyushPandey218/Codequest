import { initializeApp } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'
import { getAuth, GoogleAuthProvider } from 'firebase/auth'

// Firebase configuration
// Replace these with your actual Firebase project credentials
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
}

// Helper to check if a value is a placeholder
export const isPlaceholder = (val) => 
  !val || 
  val === 'your_api_key_here' || 
  val.includes('your_project') || 
  val.includes('your_') || 
  val.includes('your-') || 
  val === 'demo-api-key'

export const isDemoMode = isPlaceholder(firebaseConfig.apiKey)

// Validate config before initialization
const missingKeys = Object.entries(firebaseConfig)
  .filter(([_, value]) => isPlaceholder(value))
  .map(([key]) => key)

if (missingKeys.length > 0) {
  if (import.meta.env.PROD) {
    console.warn(`Missing or placeholder Firebase configuration keys: ${missingKeys.join(', ')}. Using demo fallbacks.`)
  }
}

// Apply demo fallbacks if needed
const finalConfig = {
  apiKey: isPlaceholder(firebaseConfig.apiKey) ? "demo-api-key" : firebaseConfig.apiKey,
  authDomain: isPlaceholder(firebaseConfig.authDomain) ? "codequest-demo.firebaseapp.com" : firebaseConfig.authDomain,
  projectId: isPlaceholder(firebaseConfig.projectId) ? "codequest-demo" : firebaseConfig.projectId,
  storageBucket: isPlaceholder(firebaseConfig.storageBucket) ? "codequest-demo.appspot.com" : firebaseConfig.storageBucket,
  messagingSenderId: isPlaceholder(firebaseConfig.messagingSenderId) ? "123456789" : firebaseConfig.messagingSenderId,
  appId: isPlaceholder(firebaseConfig.appId) ? "1:123456789:web:abcdef" : firebaseConfig.appId
}

// Initialize Firebase
const app = initializeApp(finalConfig)

// Initialize Firestore
export const db = getFirestore(app)

// Initialize Auth
export const auth = getAuth(app)
export const googleProvider = new GoogleAuthProvider()

if (import.meta.env.DEV) {
  console.info(`[Firebase] Running in ${isDemoMode ? '🚀 DEMO' : '🔥 REAL'} mode`)
}

export default app
