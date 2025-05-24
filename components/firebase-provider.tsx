"use client"

import { getApps, initializeApp, type FirebaseApp } from "firebase/app"
import { browserLocalPersistence, getAuth, setPersistence, type Auth } from "firebase/auth"
import { getFirestore, type Firestore } from "firebase/firestore"
import { getStorage } from "firebase/storage"
import { createContext, useContext, useEffect, useState, type ReactNode } from "react"

interface FirebaseContextType {
  app: FirebaseApp | null
  auth: Auth | null
  db: Firestore | null
  storage: any | null
  isInitialized: boolean
}

const FirebaseContext = createContext<FirebaseContextType>({
  app: null,
  auth: null,
  db: null,
  storage: null,
  isInitialized: false,
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
  })

  useEffect(() => {
    // Only initialize Firebase on client side
    if (typeof window === "undefined") return

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

    const initializeFirebase = async () => {
      try {
        // Initialize Firebase
        let app
        if (!getApps().length) {
          app = initializeApp(firebaseConfig)
        } else {
          app = getApps()[0]
        }

        // Initialize services
        const auth = getAuth(app)
        
        // Set persistence to LOCAL
        await setPersistence(auth, browserLocalPersistence)
        
        const db = getFirestore(app)
        const storage = getStorage(app)

        setFirebaseState({
          app,
          auth,
          db,
          storage,
          isInitialized: true,
        })
      } catch (error) {
        console.error("Firebase initialization error:", error)
      }
    }

    initializeFirebase()
  }, [])

  return <FirebaseContext.Provider value={firebaseState}>{children}</FirebaseContext.Provider>
}
