"use client"

import { createContext, useContext, useEffect, useState, type ReactNode } from "react"
import { initializeApp, getApps, type FirebaseApp } from "firebase/app"
import { type Auth, getAuth } from "firebase/auth"
import { type Firestore, getFirestore } from "firebase/firestore"
import { type Storage, getStorage } from "firebase/storage"

interface FirebaseContextType {
  app: FirebaseApp | null
  auth: Auth | null
  db: Firestore | null
  storage: Storage | null
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
  }, [])

  return <FirebaseContext.Provider value={firebaseState}>{children}</FirebaseContext.Provider>
}
