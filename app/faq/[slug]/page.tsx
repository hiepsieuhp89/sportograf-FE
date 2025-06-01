"use client"

import { StaticPageLayout } from "@/components/static-page-layout"
import { useTranslations } from "@/hooks/use-translations"
import { useClientTranslation } from "@/hooks/use-client-translation"
import { getApprovedFAQs, getFAQById } from "@/lib/faq-service"
import type { FAQ } from "@/lib/types"
import { ArrowLeft, ThumbsDown, ThumbsUp } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useParams } from "next/navigation"
import { useEffect, useState } from "react"

// Component for related FAQ link with client-side translation
function RelatedFAQLink({ faq, language }: { faq: FAQ; language: string }) {
  const { translatedContent, isTranslating } = useClientTranslation(
    faq.title,
    faq.question,
    faq.answer || '',
    language as any
  )

  return (
    <Link
      href={`/faq/${faq.id}`}
      className="flex items-start p-4 bg-white rounded-lg border border-gray-200 hover:border-blue-300 hover:shadow-sm transition-all group"
    >
      <span className="mr-3 mt-1 text-gray-400 group-hover:text-blue-600 transition-colors">📄</span>
      <span className="text-gray-700 group-hover:text-blue-600 transition-colors text-sm leading-relaxed">
        {isTranslating ? (
          <span className="flex items-center">
            <div className="animate-spin rounded-full h-3 w-3 border-t border-b border-gray-400 mr-2"></div>
            {faq.title}
          </span>
        ) : (
          translatedContent.title
        )}
      </span>
    </Link>
  )
}

export default function FAQArticlePage() {
  const { t, language } = useTranslations()
  const params = useParams()
  const slug = params.slug as string
  const [faq, setFAQ] = useState<FAQ | null>(null)
  const [relatedFAQs, setRelatedFAQs] = useState<FAQ[]>([])
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)

  // Client-side translation for the main FAQ
  const { translatedContent, isTranslating } = useClientTranslation(
    faq?.title || '',
    faq?.question || '',
    faq?.answer || '',
    language as any
  )

  useEffect(() => {
    const loadFAQ = async () => {
      try {
        const faqData = await getFAQById(slug)
        if (faqData && faqData.status === "approved") {
          setFAQ(faqData)
          
          // Load related FAQs from the same category
          const allFAQs = await getApprovedFAQs()
          const related = allFAQs
            .filter(f => f.id !== faqData.id && f.category === faqData.category)
            .slice(0, 6)
          setRelatedFAQs(related)
        } else {
          setNotFound(true)
        }
      } catch (error) {
        console.error("Error loading FAQ:", error)
        setNotFound(true)
      } finally {
        setLoading(false)
      }
    }

    loadFAQ()
  }, [slug])

  if (loading) {
    return (
      <StaticPageLayout>
        <div className="flex justify-center items-center min-h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-mainNavyText"></div>
        </div>
      </StaticPageLayout>
    )
  }

  if (notFound || !faq) {
    return (
      <StaticPageLayout>
        <div className="bg-gray-50 min-h-screen">
          <div className="max-w-4xl mx-auto px-4 py-12">
            <h1 className="text-2xl font-semibold mb-4">{t("articleNotFound")}</h1>
            <Link href="/faq" className="text-blue-600 hover:underline flex items-center">
              <ArrowLeft className="w-4 h-4 mr-2" />
              {t("backToFAQ")}
            </Link>
          </div>
        </div>
      </StaticPageLayout>
    )
  }

  return (
    <StaticPageLayout>
      <div className="bg-gray-50 min-h-screen">
        <div className="bg-white">
          <div className="max-w-4xl mx-auto px-4 py-8">
            {/* Back to FAQ */}
            <Link href="/faq" className="text-gray-600 hover:text-gray-900 flex items-center mb-8 text-sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              {t("solutionHome")}
            </Link>

            {/* Article Content - Now with client-side translation */}
            <article className="mb-12">
              <h1 className="text-2xl md:text-3xl font-medium text-gray-900 mb-8 leading-tight">
                {isTranslating ? (
                  <span className="flex items-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-t border-b border-gray-400 mr-3"></div>
                    {faq.title}
                  </span>
                ) : (
                  translatedContent.title
                )}
              </h1>
              <div className="prose max-w-none">
                <p className="text-gray-700 leading-relaxed text-lg whitespace-pre-wrap">
                  {isTranslating ? (
                    <span className="flex items-center">
                      <div className="animate-spin rounded-full h-4 w-4 border-t border-b border-gray-400 mr-2"></div>
                      {faq.answer || ''}
                    </span>
                  ) : (
                    translatedContent.answer
                  )}
                </p>
              </div>
            </article>

            {/* Author Info */}
            <div className="mb-12 flex items-start gap-4 bg-gray-50 p-6 rounded-lg">
              <div className="w-12 h-12 bg-purple-200 rounded-full flex items-center justify-center text-purple-700 font-medium text-lg flex-shrink-0">
                S
              </div>
              <div className="flex-1">
                <p className="text-gray-700 mb-3">
                  <span className="font-medium">{t("support")}</span> {t("authoredBy")}
                </p>
                <div className="flex items-center gap-4">
                  <span className="text-gray-600 text-sm">{t("didYouFindItHelpful")}</span>
                  <button className="flex items-center gap-2 text-blue-600 hover:text-blue-800 text-sm font-medium transition-colors">
                    <ThumbsUp className="w-4 h-4" />
                    {t("yes")}
                  </button>
                  <button className="flex items-center gap-2 text-blue-600 hover:text-blue-800 text-sm font-medium transition-colors">
                    <ThumbsDown className="w-4 h-4" />
                    {t("no")}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Related Articles */}
        {relatedFAQs.length > 0 && (
          <div className="max-w-4xl mx-auto px-4 py-12">
            <h2 className="text-2xl font-medium text-gray-900 mb-8">{t("relatedArticles")}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {relatedFAQs.map((relatedFAQ) => (
                <RelatedFAQLink
                  key={relatedFAQ.id}
                  faq={relatedFAQ}
                  language={language}
                />
              ))}
            </div>
          </div>
        )}

        {/* Payment Methods Section - Updated to match footer */}
        <div className="bg-white border-t border-gray-200">
          <div className="max-w-4xl mx-auto px-4 py-12">
            <h3 className="text-xl font-medium text-gray-800 mb-6 text-center">
              {t("paymentMethods")} - {t("securePayments")}
            </h3>
            <div className="flex flex-wrap justify-center items-center gap-4 md:gap-6">
              {/* Visa */}
              <div className="rounded-md p-2 h-10 flex items-center justify-center min-w-[60px] opacity-60">
                <Image
                  src="https://upload.wikimedia.org/wikipedia/commons/5/5e/Visa_Inc._logo.svg"
                  alt="Visa"
                  width={40}
                  height={24}
                  className="h-6 w-auto object-contain filter grayscale"
                />
              </div>
              
              {/* Mastercard */}
              <div className="rounded-md p-2 h-10 flex items-center justify-center min-w-[60px] opacity-60">
                <Image
                  src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg"
                  alt="Mastercard"
                  width={40}
                  height={24}
                  className="h-6 w-auto object-contain filter grayscale"
                />
              </div>
              
              {/* PayPal */}
              <div className="rounded-md p-2 h-10 flex items-center justify-center min-w-[60px] opacity-60">
                <Image
                  src="https://upload.wikimedia.org/wikipedia/commons/b/b5/PayPal.svg"
                  alt="PayPal"
                  width={60}
                  height={24}
                  className="h-6 w-auto object-contain filter grayscale"
                />
              </div>
              
              {/* American Express */}
              <div className="rounded-md p-2 h-10 flex items-center justify-center min-w-[60px] opacity-60">
                <Image
                  src="https://upload.wikimedia.org/wikipedia/commons/f/fa/American_Express_logo_%282018%29.svg"
                  alt="American Express"
                  width={40}
                  height={24}
                  className="h-6 w-auto object-contain filter grayscale"
                />
              </div>
              
              {/* Apple Pay */}
              <div className="rounded-md p-2 h-10 flex items-center justify-center min-w-[60px] opacity-60">
                <Image
                  src="https://upload.wikimedia.org/wikipedia/commons/b/b0/Apple_Pay_logo.svg"
                  alt="Apple Pay"
                  width={50}
                  height={24}
                  className="h-6 w-auto object-contain filter grayscale"
                />
              </div>
              
              {/* Google Pay */}
              <div className="rounded-md p-2 h-10 flex items-center justify-center min-w-[60px] opacity-60">
                <Image
                  src="https://upload.wikimedia.org/wikipedia/commons/f/f2/Google_Pay_Logo.svg"
                  alt="Google Pay"
                  width={50}
                  height={24}
                  className="h-6 w-auto object-contain filter grayscale"
                />
              </div>
              
              {/* Stripe */}
              <div className="rounded-md p-2 h-10 flex items-center justify-center min-w-[60px] opacity-60">
                <Image
                  src="https://upload.wikimedia.org/wikipedia/commons/b/ba/Stripe_Logo%2C_revised_2016.svg"
                  alt="Stripe"
                  width={50}
                  height={24}
                  className="h-6 w-auto object-contain filter grayscale"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </StaticPageLayout>
  )
} 