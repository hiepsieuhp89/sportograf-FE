"use client"

import { useState, useEffect } from "react"
import { StaticPageLayout } from "@/components/static-page-layout"
import { useTranslations } from "@/hooks/use-translations"

export default function NewsletterPage() {
  const { t } = useTranslations()
  const [email, setEmail] = useState("")
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState("")
  const [isSubscribed, setIsSubscribed] = useState(false)
  const [checkingStatus, setCheckingStatus] = useState(false)

  // Check subscription status when email changes
  useEffect(() => {
    const checkSubscriptionStatus = async () => {
      if (!email || !email.includes('@')) return

      setCheckingStatus(true)
      try {
        const response = await fetch(`/api/newsletter/subscribe?email=${encodeURIComponent(email)}`)
        const result = await response.json()
        
        if (result.success) {
          setIsSubscribed(result.isSubscribed)
        }
      } catch (error) {
        console.error('Error checking subscription status:', error)
      } finally {
        setCheckingStatus(false)
      }
    }

    const timeoutId = setTimeout(checkSubscriptionStatus, 500) // Debounce
    return () => clearTimeout(timeoutId)
  }, [email])

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

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

      if (result.success) {
        setSuccess(true)
        setIsSubscribed(true)
      } else {
        setError(t(result.message) || result.message)
      }
    } catch (error) {
      console.error('Newsletter subscription error:', error)
      setError(t("subscriptionError"))
    } finally {
      setLoading(false)
    }
  }

  const handleUnsubscribe = async () => {
    setLoading(true)
    setError("")

    try {
      const response = await fetch('/api/newsletter/unsubscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      })

      const result = await response.json()

      if (result.success) {
        setSuccess(true)
        setIsSubscribed(false)
      } else {
        setError(t(result.message) || result.message)
      }
    } catch (error) {
      console.error('Newsletter unsubscription error:', error)
      setError(t("unsubscriptionError"))
    } finally {
      setLoading(false)
    }
  }

  return (
    <StaticPageLayout>
      <div className="relative">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundSize: "cover",
            backgroundImage:
              "url('/images/news-letter.JPG')",
          }}
        ></div>
        <div className="absolute inset-0 bg-black bg-opacity-50"></div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16" style={{ minHeight: "calc(100vh - 64px)" }}>
          <div className="flex flex-col md:flex-row items-start md:items-center gap-8">
            <div className="w-full md:w-1/2">
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-mainBackgroundV1 mb-4">
                SPORTOGRAF
                <br />
                <span className="text-mainNavyText">{t("sportografRaceletter")}</span>
              </h1>
              <div className="bg-mainNavyText text-mainBackgroundV1 p-4 sm:p-6 lg:p-8 rounded-lg w-full max-w-md">
                <h2 className="text-lg sm:text-xl font-bold mb-4 uppercase">{t("joinSportografRaceletter")}</h2>
                <p className="mb-6 text-sm sm:text-base">
                  {t("newsletterDescription")}
                </p>

                {success ? (
                  <div className="text-center">
                    <div className="mb-4 p-4 bg-green-500/20 text-green-200 rounded-lg border border-green-500/30">
                      {isSubscribed ? t("subscriptionSuccessful") : t("unsubscriptionSuccessful")}
                    </div>
                    <button
                      onClick={() => {
                        setSuccess(false)
                        setEmail("")
                      }}
                      className="text-sm text-mainBackgroundV1/80 hover:text-mainBackgroundV1 transition-colors"
                    >
                      {t("manageSubscription")}
                    </button>
                  </div>
                ) : (
                  <>
                    {error && (
                      <div className="mb-4 p-4 bg-red-500/20 text-red-200 rounded-lg border border-red-500/30">
                        {error}
                      </div>
                    )}

                    <form onSubmit={handleSubscribe} className="space-y-4">
                      <div>
                        <input
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder={t("enterYourEmailPlaceholder")}
                          className="w-full px-3 sm:px-4 py-2 border border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-mainNavyText text-gray-800 text-sm sm:text-base"
                          required
                        />
                        {checkingStatus && (
                          <p className="text-xs text-mainBackgroundV1/60 mt-1">
                            {t("subscriptionStatus")}...
                          </p>
                        )}
                        {email && !checkingStatus && (
                          <p className="text-xs mt-1">
                            {isSubscribed ? (
                              <span className="text-green-300">{t("subscribed")}</span>
                            ) : (
                              <span className="text-mainBackgroundV1/60">{t("unsubscribed")}</span>
                            )}
                          </p>
                        )}
                      </div>

                      <div>
                        <label className="flex items-start text-xs sm:text-sm">
                          <input type="checkbox" className="mt-1 mr-2" required />
                          <span>
                            {t("newsletterAgreement")}
                          </span>
                        </label>
                      </div>

                      <div className="flex gap-2">
                        {!isSubscribed ? (
                          <button
                            type="submit"
                            disabled={loading}
                            className="flex-1 bg-red-600 text-mainBackgroundV1 py-2 px-4 rounded-sm hover:bg-red-700 transition-colors text-sm sm:text-base disabled:bg-red-600/50"
                          >
                            {loading ? t("subscribing") : t("subscribe")}
                          </button>
                        ) : (
                          <button
                            type="button"
                            onClick={handleUnsubscribe}
                            disabled={loading}
                            className="flex-1 bg-gray-600 text-mainBackgroundV1 py-2 px-4 rounded-sm hover:bg-gray-700 transition-colors text-sm sm:text-base disabled:bg-gray-600/50"
                          >
                            {loading ? t("unsubscribing") : t("unsubscribeFromNewsletter")}
                          </button>
                        )}
                      </div>
                    </form>
                  </>
                )}
              </div>
            </div>

            <div className="w-full md:w-1/2 md:pl-8 lg:pl-12">
              <div className="text-mainBackgroundV1">
                <h2 className="text-xl sm:text-2xl font-bold mb-6">{t("whyJoinNewsletter")}</h2>
                <ul className="space-y-4 sm:space-y-6">
                  <li className="flex items-start">
                    <div className="mr-2 mt-1 text-mainNavyText">✓</div>
                    <div>
                      <strong className="block text-base sm:text-lg">{t("eventAlerts")}</strong>
                      <p className="text-sm sm:text-base">{t("eventAlertsDescription")}</p>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <div className="mr-2 mt-1 text-mainNavyText">✓</div>
                    <div>
                      <strong className="block text-base sm:text-lg">{t("specialOffers")}</strong>
                      <p className="text-sm sm:text-base">{t("specialOffersDescription")}</p>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <div className="mr-2 mt-1 text-mainNavyText">✓</div>
                    <div>
                      <strong className="block text-base sm:text-lg">{t("photographyTips")}</strong>
                      <p className="text-sm sm:text-base">{t("photographyTipsDescription")}</p>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <div className="mr-2 mt-1 text-mainNavyText">✓</div>
                    <div>
                      <strong className="block text-base sm:text-lg">{t("athleteStories")}</strong>
                      <p className="text-sm sm:text-base">{t("athleteStoriesDescription")}</p>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </StaticPageLayout>
  )
}
