"use client"

import type React from "react"

import { useState } from "react"
import { signInWithEmailAndPassword, AuthError, browserLocalPersistence, setPersistence } from "firebase/auth"
import { auth, createUserInFirestore, isFirstUser } from "@/lib/firebase"
import { useRouter } from "next/navigation"
import { useAuthStore } from "@/lib/store/auth-store"

export function AdminLogin() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const { setUser, setIsAdmin } = useAuthStore()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    try {
      if (!auth) {
        throw new Error("Firebase auth is not initialized")
      }

      // Set persistence to LOCAL (persists even after browser restart)
      await setPersistence(auth, browserLocalPersistence)
      
      // Sign in with email and password
      const userCredential = await signInWithEmailAndPassword(auth, email, password)
      const user = userCredential.user

      // Check if this is the first user
      const isFirstAdmin = await isFirstUser()
      if (isFirstAdmin) {
        // Create the first user as admin in Firestore
        await createUserInFirestore(user.uid, user.email || '', 'admin')
        setIsAdmin(true)
      }

      // Store user in Zustand
      setUser(user)
      
      router.push("/admin")
    } catch (error) {
      const authError = error as AuthError
      console.error("Login error:", authError)
      
      if (authError.code === 'auth/invalid-credential') {
        setError("Invalid email or password")
      } else {
        setError(`Authentication error: ${authError.message}`)
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-md mx-auto p-6 bg-mainBackgroundV1 rounded-lg shadow-md">
      <h1 className="text-2xl font-bold mb-6 text-center">Admin Login</h1>

      {error && <div className="mb-4 p-4 bg-red-100 text-red-700 rounded-sm">{error}</div>}

      <form onSubmit={handleLogin}>
        <div className="mb-4">
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
            Email
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-mainNavyText"
            required
          />
        </div>

        <div className="mb-6">
          <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
            Password
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-mainNavyText"
            required
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-mainNavyText text-mainBackgroundV1 py-2 px-4 rounded-sm hover:bg-blue-700 transition-colors disabled:bg-blue-300"
        >
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>
    </div>
  )
}
