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

// Validate config before initialization
const missingKeys = Object.entries(firebaseConfig)
  .filter(([_, value]) => !value)
  .map(([key]) => key)

if (missingKeys.length > 0 && import.meta.env.PROD) {
  console.warn(`Missing Firebase configuration keys: ${missingKeys.join(', ')}. Using demo fallbacks.`)
}

// Apply demo fallbacks if needed
const finalConfig = {
  apiKey: firebaseConfig.apiKey || "demo-api-key",
  authDomain: firebaseConfig.authDomain || "codequest-demo.firebaseapp.com",
  projectId: firebaseConfig.projectId || "codequest-demo",
  storageBucket: firebaseConfig.storageBucket || "codequest-demo.appspot.com",
  messagingSenderId: firebaseConfig.messagingSenderId || "123456789",
  appId: firebaseConfig.appId || "1:123456789:web:abcdef"
}

// Initialize Firebase
const app = initializeApp(finalConfig)

// Initialize Firestore
export const db = getFirestore(app)

// Initialize Auth
export const auth = getAuth(app)
export const googleProvider = new GoogleAuthProvider()

export default app
