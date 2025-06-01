"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { StaticPageLayout } from "@/components/static-page-layout"
import { useTranslations } from "@/hooks/use-translations"
import { sendSignInLinkToEmail } from "firebase/auth"
import { useFirebase } from "@/components/firebase-provider"
// import { auth } from "@/lib/firebase"

export default function LoginPage() {
  const { t } = useTranslations()
  const { auth } = useFirebase()
  const [email, setEmail] = useState("")
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState("")
  const [isClient, setIsClient] = useState(false)
  const [showMagicLinkExplanation, setShowMagicLinkExplanation] = useState(false)
  const [subscribeToNewsletter, setSubscribeToNewsletter] = useState(false)
  const [subscribing, setSubscribing] = useState(false)

  // Check if we're on the client side
  useEffect(() => {
    setIsClient(true)
  }, [])

  const handleNewsletterSubscription = async (email: string) => {
    if (!subscribeToNewsletter) return

    setSubscribing(true)
    try {
      const response = await fetch('/api/newsletter/subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          language: 'en' // You can get this from your language context
        }),
      })

      const result = await response.json()
      if (!result.success && result.message !== 'alreadySubscribed') {
        console.warn('Newsletter subscription failed:', result.message)
      }
    } catch (error) {
      console.error('Newsletter subscription error:', error)
    } finally {
      setSubscribing(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      if (!auth) {
        throw new Error("Authentication is not initialized")
      }

      // Configure ActionCodeSettings with more specific settings
      const actionCodeSettings = {
        // This URL must be whitelisted in the Firebase Console
        url: `${window.location.origin}/login/confirm`,
        handleCodeInApp: true,
        // Add these settings to make it more robust
        dynamicLinkDomain: window.location.hostname,
        iOS: {
          bundleId: 'com.yourapp.ios'
        },
        android: {
          packageName: 'com.yourapp.android',
          installApp: true,
          minimumVersion: '12'
        }
      }

      // Send sign-in link
      await sendSignInLinkToEmail(auth, email, actionCodeSettings)

      // Save email to localStorage for confirmation page
      window.localStorage.setItem("emailForSignIn", email)

      // Handle newsletter subscription
      await handleNewsletterSubscription(email)

      setSuccess(true)
    } catch (error: any) {
      console.error("Error sending magic link:", error)
      setError(error.message || t("failedToSendMagicLink"))
    } finally {
      setLoading(false)
    }
  }

  return (
    <StaticPageLayout>
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-br from-mainDarkBackgroundV1/90 via-mainDarkBackgroundV1/80 to-black/70"></div>
        
        <div className="relative max-w-md mx-auto px-4 py-12" style={{ minHeight: "calc(100vh - 64px)" }}>
          <div className="bg-white/10 backdrop-blur-md p-8 rounded-xl shadow-2xl border border-white/20">
            <h1 className="text-2xl font-bold mb-6 text-center text-white drop-shadow-lg">{t("signupLogin")}</h1>

            {success ? (
              <div className="text-center">
                <div className="mb-4 p-4 bg-green-500/20 text-green-200 rounded-lg border border-green-500/30 backdrop-blur-sm">
                  {t("magicLinkSent")} {t("checkEmailToComplete")}
                </div>
                <p className="text-white/80">{t("magicLinkSentTo")} {email}.</p>
                {subscribeToNewsletter && (
                  <p className="text-white/60 text-sm mt-2">
                    {subscribing ? t("subscribing") : t("subscriptionSuccessful")}
                  </p>
                )}
              </div>
            ) : (
              <>
                {error && <div className="mb-4 p-4 bg-red-500/20 text-red-200 rounded-lg border border-red-500/30 backdrop-blur-sm">{error}</div>}

                <form onSubmit={handleSubmit}>
                  <div className="mb-6">
                    <label htmlFor="email" className="block text-xs text-white/80 mb-2 font-medium">
                      {t("enterYourEmail")}
                    </label>
                    <input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full px-4 py-3 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-mainActiveV1 focus:border-transparent bg-white/10 backdrop-blur-sm text-white placeholder-white/50"
                      required
                    />
                  </div>

                  {/* Newsletter Subscription Checkbox */}
                  <div className="mb-6">
                    <label className="flex items-center text-white/80 text-sm">
                      <input
                        type="checkbox"
                        checked={subscribeToNewsletter}
                        onChange={(e) => setSubscribeToNewsletter(e.target.checked)}
                        className="mr-3 rounded border-white/20 bg-white/10 text-mainActiveV1 focus:ring-mainActiveV1 focus:ring-offset-0"
                      />
                      {t("subscribeToNewsletter")}
                    </label>
                  </div>

                  <button
                    type="submit"
                    disabled={loading || !isClient}
                    className="w-full bg-mainActiveV1 text-black py-3 rounded-lg hover:bg-mainActiveV1/80 transition-colors disabled:bg-mainActiveV1/50 shadow-lg backdrop-blur-sm font-medium"
                  >
                    {loading ? t("sending") : t("sendMagicLink")}
                  </button>
                </form>

                {/* Magic Link Explanation Section */}
                <div className="mt-4 text-center">
                  <button 
                    onClick={() => setShowMagicLinkExplanation(!showMagicLinkExplanation)}
                    className="text-sm text-white/80 hover:text-white transition-colors"
                  >
                    {t("magicLinkExplanation")}
                  </button>
                </div>

                {showMagicLinkExplanation && (
                  <div className="mt-4 p-4 bg-white/5 backdrop-blur-sm rounded-lg border border-white/10">
                    <h3 className="text-white font-medium mb-2">{t("magicLinkBenefits")}</h3>
                    <ul className="text-white/80 text-sm space-y-1">
                      <li>• {t("noPasswordNeeded")}</li>
                      <li>• {t("secureLogin")}</li>
                      <li>• {t("oneClickAccess")}</li>
                    </ul>
                  </div>
                )}

                <div className="mt-8 text-center text-xs text-white/60">
                  {t("dataProtectionInfo")}{" "}
                  <a href="/privacy" className="text-mainActiveV1 hover:text-mainActiveV1/80 transition-colors">
                    {t("privacyPolicy")}
                  </a>
                  .
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </StaticPageLayout>
  )
}
