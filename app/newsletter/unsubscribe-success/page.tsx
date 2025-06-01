"use client"

import { StaticPageLayout } from "@/components/static-page-layout"
import { useTranslations } from "@/hooks/use-translations"
import Link from "next/link"

export default function UnsubscribeSuccessPage() {
  const { t } = useTranslations()

  return (
    <StaticPageLayout>
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-br from-mainDarkBackgroundV1/90 via-mainDarkBackgroundV1/80 to-black/70"></div>
        
        <div className="relative max-w-md mx-auto px-4 py-12" style={{ minHeight: "calc(100vh - 64px)" }}>
          <div className="bg-white/10 backdrop-blur-md p-8 rounded-xl shadow-2xl border border-white/20 text-center">
            <div className="mb-6">
              <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h1 className="text-2xl font-bold text-white drop-shadow-lg mb-2">
                {t("unsubscriptionSuccessful")}
              </h1>
              <p className="text-white/80">
                You have been successfully unsubscribed from our newsletter.
              </p>
            </div>

            <div className="space-y-4">
              <p className="text-white/60 text-sm">
                You will no longer receive email notifications about new events.
              </p>
              
              <div className="pt-4">
                <Link 
                  href="/newsletter"
                  className="inline-block bg-mainActiveV1 text-black py-2 px-6 rounded-lg hover:bg-mainActiveV1/80 transition-colors font-medium"
                >
                  {t("manageSubscription")}
                </Link>
              </div>

              <div className="pt-2">
                <Link 
                  href="/"
                  className="text-sm text-white/80 hover:text-white transition-colors"
                >
                  Return to Homepage
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </StaticPageLayout>
  )
} 