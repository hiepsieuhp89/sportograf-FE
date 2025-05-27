"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { isSignInWithEmailLink, signInWithEmailLink } from "firebase/auth"
import { useFirebase } from "@/components/firebase-provider"
import { StaticPageLayout } from "@/components/static-page-layout"

export default function ConfirmLoginPage() {
  const router = useRouter()
  const { auth } = useFirebase()
  const [error, setError] = useState<string>("")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const handleEmailLink = async () => {
      try {
        if (!auth) {
          console.log("Auth not initialized yet")
          return
        }

        // Add debug logging
        console.log("Current URL:", window.location.href)
        console.log("Is sign in link:", isSignInWithEmailLink(auth, window.location.href))

        // Check if the link is a sign-in link
        if (isSignInWithEmailLink(auth, window.location.href)) {
          // Get the email from localStorage
          let email = window.localStorage.getItem("emailForSignIn")
          console.log("Retrieved email from storage:", email)

          if (!email) {
            // If email is not found in localStorage, prompt user
            email = window.prompt("Please provide your email for confirmation")
            console.log("Prompted email:", email)
          }

          if (!email) {
            throw new Error("Email is required to complete sign in")
          }

          try {
            // Complete the sign-in process
            const result = await signInWithEmailLink(auth, email, window.location.href)
            console.log("Sign in successful:", result)

            // Clear email from storage
            window.localStorage.removeItem("emailForSignIn")

            // Show success message before redirect
            setLoading(false)
            setError("")

            // Add a small delay before redirect to show success state
            setTimeout(() => {
              router.push("/")
            }, 1500)
          } catch (signInError: any) {
            console.error("Specific sign in error:", signInError)
            if (signInError.code === 'auth/invalid-action-code') {
              throw new Error("This login link has expired or already been used. Please request a new one.")
            }
            throw signInError
          }
        } else {
          throw new Error("Invalid magic link. Please ensure you're using the link from your email.")
        }
      } catch (error: any) {
        console.error("Error signing in with email link:", error)
        setError(error.message || "Failed to complete sign in. Please try requesting a new login link.")
      } finally {
        setLoading(false)
      }
    }

    // Only run if auth is initialized
    if (auth) {
      handleEmailLink()
    }
  }, [auth, router])

  return (
    <StaticPageLayout>
      <div className="max-w-md mx-auto px-4 py-12">
        <div className="bg-mainBackgroundV1 p-8 rounded-lg shadow-sm">
          <h1 className="text-2xl font-bold mb-6 text-center">Completing Sign In</h1>

          {loading ? (
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-mainNavyText mx-auto mb-4"></div>
              <p>Verifying your login...</p>
            </div>
          ) : error ? (
            <div className="text-center">
              <div className="mb-4 p-4 bg-red-100 text-red-700 rounded-sm">{error}</div>
              <button
                onClick={() => router.push("/login")}
                className="text-mainNavyText hover:underline"
              >
                Return to login
              </button>
            </div>
          ) : (
            <div className="text-center">
              <div className="mb-4 p-4 bg-green-100 text-green-700 rounded-sm">
                Login successful! Redirecting...
              </div>
            </div>
          )}
        </div>
      </div>
    </StaticPageLayout>
  )
}
