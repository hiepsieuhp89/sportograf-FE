"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { StaticPageLayout } from "@/components/static-page-layout"
import { useTranslations } from "@/hooks/use-translations"
import { sendSignInLinkToEmail } from "firebase/auth"
// import { auth } from "@/lib/firebase"

export default function LoginPage() {
  const { t } = useTranslations()
  const [email, setEmail] = useState("")
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState("")
  const [isClient, setIsClient] = useState(false)

  // Check if we're on the client side
  useEffect(() => {
    setIsClient(true)
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      // if (!auth) {
      //   throw new Error("Authentication is not initialized")
      // }

      // Configure ActionCodeSettings
      const actionCodeSettings = {
        url: `${window.location.origin}/login/confirm`,
        handleCodeInApp: true,
      }

      // Send sign-in link
      // await sendSignInLinkToEmail(auth, email, actionCodeSettings)

      // Save email to localStorage for confirmation page
      localStorage.setItem("emailForSignIn", email)

      setSuccess(true)
    } catch (error: any) {
      console.error("Error sending magic link:", error)
      setError(error.message || "Failed to send magic link. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <StaticPageLayout>
      <div className="max-w-md mx-auto px-4 py-12">
        <div className="bg-mainBackgroundV1 p-8 rounded-lg shadow-sm">
          <h1 className="text-2xl font-bold mb-6 text-center">{t("signupLogin")}</h1>

          {success ? (
            <div className="text-center">
              <div className="mb-4 p-4 bg-green-100 text-green-700 rounded-sm">
                Magic link sent! Check your email to complete login.
              </div>
              <p className="text-gray-600">We've sent a login link to {email}.</p>
            </div>
          ) : (
            <>
              {error && <div className="mb-4 p-4 bg-red-100 text-red-700 rounded-sm">{error}</div>}

              <form onSubmit={handleSubmit}>
                <div className="mb-6">
                  <label htmlFor="email" className="block text-xs text-gray-500 mb-2">
                    {t("enterYourEmail")}
                  </label>
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-none focus:outline-none focus:ring-2 focus:ring-mainNavyText"
                    required
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading || !isClient}
                  className="w-full bg-mainNavyText text-mainBackgroundV1 py-3 rounded-none hover:bg-blue-700 transition-colors disabled:bg-blue-300"
                >
                  {loading ? "Sending..." : t("sendMagicLink")}
                </button>
              </form>

              <div className="mt-4 text-center">
                <button className="text-sm text-mainNavyText hover:underline">{t("whatIsAMagicLink")}</button>
              </div>

              <div className="mt-8 text-center text-xs text-gray-500">
                For more information on data protection, please see our{" "}
                <a href="/privacy" className="text-mainNavyText hover:underline">
                  {t("privacyPolicy")}
                </a>
                .
              </div>
            </>
          )}
        </div>
      </div>
    </StaticPageLayout>
  )
}
