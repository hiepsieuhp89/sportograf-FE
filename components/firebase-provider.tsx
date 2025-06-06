"use client"

import { getApps, initializeApp, type FirebaseApp } from "firebase/app"
import { 
  browserLocalPersistence, 
  getAuth, 
  setPersistence, 
  initializeAuth,
  indexedDBLocalPersistence,
  onAuthStateChanged,
  type Auth,
  type User
} from "firebase/auth"
import { getFirestore, type Firestore } from "firebase/firestore"
import { getStorage } from "firebase/storage"
import { createContext, useContext, useEffect, useState, type ReactNode } from "react"

interface FirebaseContextType {
  app: FirebaseApp | null
  auth: Auth | null
  db: Firestore | null
  storage: any | null
  isInitialized: boolean
  user: User | null
}

const FirebaseContext = createContext<FirebaseContextType>({
  app: null,
  auth: null,
  db: null,
  storage: null,
  isInitialized: false,
  user: null,
})

export const useFirebase = () => useContext(FirebaseContext)

interface FirebaseProviderProps {
  children: ReactNode
}

export function FirebaseProvider({ children }: FirebaseProviderProps) {
  const [firebaseState, setFirebaseState] = useState<FirebaseContextType>({
    app: null,
    auth: null,
    db: null,
    storage: null,
    isInitialized: false,
    user: null,
  })

  useEffect(() => {
    const initializeFirebase = async () => {
      try {
        // Firebase configuration
        const firebaseConfig = {
          apiKey: "AIzaSyBwNujju8j0ReZiZyEmXZNzDgjjvVvVJfc",
          authDomain: "pix-4d40e.firebaseapp.com",
          projectId: "pix-4d40e",
          storageBucket: "pix-4d40e.firebasestorage.app",
          messagingSenderId: "701410865281",
          appId: "1:701410865281:web:1bd3b6015951f7acb75d80",
          measurementId: "G-YL95JKXST4",
        }

        // Initialize Firebase
        let app
        if (!getApps().length) {
          app = initializeApp(firebaseConfig)
        } else {
          app = getApps()[0]
        }

        // Initialize Auth with persistence
        let auth: Auth
        try {
          auth = initializeAuth(app, {
            persistence: [indexedDBLocalPersistence, browserLocalPersistence]
          })
        } catch (error) {
          // If auth is already initialized, get the instance
          auth = getAuth(app)
        }

        // Set persistence to LOCAL
        await setPersistence(auth, browserLocalPersistence)
        
        const db = getFirestore(app)
        const storage = getStorage(app)

        setFirebaseState(prev => ({
          ...prev,
          app,
          auth,
          db,
          storage,
          isInitialized: true,
        }))

        // Monitor auth state changes
        const unsubscribe = onAuthStateChanged(auth, (user) => {
          console.log("Auth state changed:", user?.email || "No user")
          setFirebaseState(prev => ({
            ...prev,
            user,
          }))
        })

        console.log("Firebase initialized with persistence")

        // Cleanup function
        return () => {
          unsubscribe()
        }
      } catch (error) {
        console.error("Firebase initialization error:", error)
      }
    }

    let cleanup: (() => void) | undefined

    const initFirebase = async () => {
      cleanup = await initializeFirebase()
    }

    initFirebase()
    
    return () => {
      if (cleanup) {
        cleanup()
      }
    }
  }, [])

  return <FirebaseContext.Provider value={firebaseState}>{children}</FirebaseContext.Provider>
}
