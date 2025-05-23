"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { isSignInWithEmailLink, signInWithEmailLink } from "firebase/auth"
import { auth } from "@/lib/firebase"
import { StaticPageLayout } from "@/components/static-page-layout"

export default function ConfirmLoginPage() {
  const router = useRouter()
  const [status, setStatus] = useState<"loading" | "error" | "success">("loading")
  const [error, setError] = useState("")
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  useEffect(() => {
    if (!isClient || !auth) return

    const completeSignIn = async () => {
      try {
        if (isSignInWithEmailLink(auth, window.location.href)) {
          let email = localStorage.getItem("emailForSignIn")

          // If email is missing, prompt user
          if (!email) {
            email = window.prompt("Please provide your email for confirmation")
          }

          if (!email) {
            setStatus("error")
            setError("Email is required to complete sign in")
            return
          }

          await signInWithEmailLink(auth, email, window.location.href)

          // Clear email from storage
          localStorage.removeItem("emailForSignIn")

          setStatus("success")

          // Redirect after successful login
          setTimeout(() => {
            router.push("/")
          }, 2000)
        } else {
          setStatus("error")
          setError("Invalid sign in link")
        }
      } catch (error: any) {
        console.error("Error signing in with email link:", error)
        setStatus("error")
        setError(error.message || "Failed to complete sign in")
      }
    }

    completeSignIn()
  }, [router, isClient])

  return (
    <StaticPageLayout>
      <div className="max-w-md mx-auto px-4 py-12">
        <div className="bg-white p-8 rounded-lg shadow-sm">
          <h1 className="text-2xl font-bold mb-6 text-center">Completing Login</h1>

          {status === "loading" && (
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto mb-4"></div>
              <p className="text-gray-600">Verifying your login...</p>
            </div>
          )}

          {status === "success" && (
            <div className="text-center">
              <div className="mb-4 p-4 bg-green-100 text-green-700 rounded-md">Login successful!</div>
              <p className="text-gray-600">You are now signed in. Redirecting...</p>
            </div>
          )}

          {status === "error" && (
            <div className="text-center">
              <div className="mb-4 p-4 bg-red-100 text-red-700 rounded-md">{error}</div>
              <p className="text-gray-600">Please try logging in again or contact support if the problem persists.</p>
              <button
                onClick={() => router.push("/login")}
                className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                Back to Login
              </button>
            </div>
          )}
        </div>
      </div>
    </StaticPageLayout>
  )
}
