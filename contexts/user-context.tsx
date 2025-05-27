"use client"

import { createContext, useContext, useEffect, useState } from "react"
import { onAuthStateChanged, User as FirebaseUser } from "firebase/auth"
import { doc, getDoc, setDoc } from "firebase/firestore"
import { useFirebase } from "@/components/firebase-provider"

export interface UserData {
  uid: string
  email: string
  name?: string
  role: "admin" | "photographer" | "client"
  profileImageUrl?: string
  bio?: string
  createdAt: string
}

interface UserContextType {
  user: FirebaseUser | null
  userData: UserData | null
  loading: boolean
  initialized: boolean
}

const UserContext = createContext<UserContextType>({
  user: null,
  userData: null,
  loading: true,
  initialized: false,
})

export function UserProvider({ children }: { children: React.ReactNode }) {
  const { auth, db, isInitialized } = useFirebase()
  const [user, setUser] = useState<FirebaseUser | null>(null)
  const [userData, setUserData] = useState<UserData | null>(null)
  const [loading, setLoading] = useState(true)
  const [initialized, setInitialized] = useState(false)

  useEffect(() => {
    // Wait for Firebase to be initialized
    if (!isInitialized || !auth || !db) {
      console.log("Waiting for Firebase to initialize...")
      return
    }

    console.log("Setting up auth state listener...")
    
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      console.log("Auth state changed:", firebaseUser?.email)
      setUser(firebaseUser)

      try {
        if (firebaseUser) {
          // Get user data from Firestore
          const userRef = doc(db, "users", firebaseUser.uid)
          const userSnap = await getDoc(userRef)

          if (!userSnap.exists()) {
            console.log("Creating new user document...")
            // Create new user document if it doesn't exist
            const newUserData: UserData = {
              uid: firebaseUser.uid,
              email: firebaseUser.email || "",
              role: "client",
              name: firebaseUser.displayName || "",
              profileImageUrl: firebaseUser.photoURL || "",
              createdAt: new Date().toISOString(),
            }
            await setDoc(userRef, newUserData)
            setUserData(newUserData)
          } else {
            console.log("User document exists, setting data...")
            const existingUserData = userSnap.data() as UserData
            setUserData(existingUserData)
          }
        } else {
          console.log("No user signed in, clearing user data...")
          setUserData(null)
        }
      } catch (error) {
        console.error("Error handling user data:", error)
        // Don't throw error here, just log it
      } finally {
        setLoading(false)
        setInitialized(true)
      }
    })

    // Cleanup subscription
    return () => {
      console.log("Cleaning up auth state listener...")
      unsubscribe()
    }
  }, [auth, db, isInitialized])

  // Debug logging
  useEffect(() => {
    console.log("UserContext state:", {
      initialized,
      loading,
      userEmail: user?.email,
      userData: userData?.email,
    })
  }, [initialized, loading, user, userData])

  return (
    <UserContext.Provider value={{ user, userData, loading, initialized }}>
      {children}
    </UserContext.Provider>
  )
}

export const useUser = () => {
  const context = useContext(UserContext)
  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider")
  }
  return context
} 