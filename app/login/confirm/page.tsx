"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { isSignInWithEmailLink, signInWithEmailLink } from "firebase/auth"
import { useFirebase } from "@/components/firebase-provider"
import { StaticPageLayout } from "@/components/static-page-layout"
import { useTranslations } from "@/hooks/use-translations"

export default function ConfirmLoginPage() {
  const router = useRouter()
  const { auth } = useFirebase()
  const { t } = useTranslations()
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
            throw new Error(t("emailRequired"))
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
              throw new Error(t("expiredMagicLink"))
            }
            throw signInError
          }
        } else {
          throw new Error(t("invalidMagicLink"))
        }
      } catch (error: any) {
        console.error("Error signing in with email link:", error)
        setError(error.message || t("failedToCompleteSignIn"))
      } finally {
        setLoading(false)
      }
    }

    // Only run if auth is initialized
    if (auth) {
      handleEmailLink()
    }
  }, [auth, router, t])

  return (
    <StaticPageLayout>
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-br from-mainDarkBackgroundV1/90 via-mainDarkBackgroundV1/80 to-black/70"></div>
        
        <div className="relative max-w-md mx-auto px-4 py-12" style={{ minHeight: "calc(100vh - 64px)" }}>
          <div className="bg-white/10 backdrop-blur-md p-8 rounded-xl shadow-2xl border border-white/20">
            <h1 className="text-2xl font-bold mb-6 text-center text-white drop-shadow-lg">{t("completingSignIn")}</h1>

            {loading ? (
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-mainActiveV1 mx-auto mb-4"></div>
                <p className="text-white/80">{t("verifyingLogin")}</p>
              </div>
            ) : error ? (
              <div className="text-center">
                <div className="mb-4 p-4 bg-red-500/20 text-red-200 rounded-lg border border-red-500/30 backdrop-blur-sm">{error}</div>
                <button
                  onClick={() => router.push("/login")}
                  className="text-mainActiveV1 hover:text-mainActiveV1/80 transition-colors font-medium"
                >
                  {t("returnToLogin")}
                </button>
              </div>
            ) : (
              <div className="text-center">
                <div className="mb-4 p-4 bg-green-500/20 text-green-200 rounded-lg border border-green-500/30 backdrop-blur-sm">
                  {t("loginSuccessful")}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </StaticPageLayout>
  )
}
