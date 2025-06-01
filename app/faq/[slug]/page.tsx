"use client"

import { StaticPageLayout } from "@/components/static-page-layout"
import { useTranslations } from "@/hooks/use-translations"
import Link from "next/link"
import { useParams } from "next/navigation"
import { ArrowLeft, ThumbsUp, ThumbsDown } from "lucide-react"
import Image from "next/image"
import { useState, useEffect } from "react"
import { getFAQById, getApprovedFAQs } from "@/lib/faq-service"
import { getTranslatedContent } from "@/lib/translation-utils"
import type { FAQ } from "@/lib/types"

export default function FAQArticlePage() {
  const { t, language } = useTranslations()
  const params = useParams()
  const slug = params.slug as string
  const [faq, setFAQ] = useState<FAQ | null>(null)
  const [relatedFAQs, setRelatedFAQs] = useState<FAQ[]>([])
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)

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

  const translatedContent = getTranslatedContent(faq.translations, language)
  const title = translatedContent?.title || faq.title
  const question = translatedContent?.question || faq.question
  const answer = translatedContent?.answer || faq.answer || ""

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

            {/* Article Content */}
            <article className="mb-12">
              <h1 className="text-2xl md:text-3xl font-medium text-gray-900 mb-8 leading-tight">
                {title}
              </h1>
              <div className="prose max-w-none">
                <p className="text-gray-700 leading-relaxed text-lg whitespace-pre-wrap">{answer}</p>
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
              {relatedFAQs.map((relatedFAQ) => {
                const relatedTranslatedContent = getTranslatedContent(relatedFAQ.translations, language)
                const relatedTitle = relatedTranslatedContent?.title || relatedFAQ.title
                
                return (
                  <Link
                    key={relatedFAQ.id}
                    href={`/faq/${relatedFAQ.id}`}
                    className="flex items-start p-4 bg-white rounded-lg border border-gray-200 hover:border-blue-300 hover:shadow-sm transition-all group"
                  >
                    <span className="mr-3 mt-1 text-gray-400 group-hover:text-blue-600 transition-colors">📄</span>
                    <span className="text-gray-700 group-hover:text-blue-600 transition-colors text-sm leading-relaxed">
                      {relatedTitle}
                    </span>
                  </Link>
                )
              })}
            </div>
          </div>
        )}

        {/* Payment Methods Section */}
        <div className="bg-white border-t border-gray-200">
          <div className="max-w-4xl mx-auto px-4 py-12">
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-6 items-center">
              <div className="flex justify-center opacity-60">
                <Image src="/mastercard.svg" alt="Mastercard" width={60} height={40} className="h-8 w-auto filter grayscale" />
              </div>
              <div className="flex justify-center opacity-60">
                <Image src="/visa.svg" alt="Visa" width={60} height={40} className="h-8 w-auto filter grayscale" />
              </div>
              <div className="flex justify-center opacity-60">
                <div className="bg-gray-100 px-3 py-2 rounded">
                  <span className="text-gray-600 font-bold text-sm">Klarna.</span>
                </div>
              </div>
              <div className="flex justify-center opacity-60">
                <div className="bg-gray-600 text-white px-2 py-1 rounded text-xs font-bold">
                  iDEAL
                </div>
              </div>
              <div className="flex justify-center opacity-60">
                <Image src="/paypal.svg" alt="PayPal" width={60} height={40} className="h-8 w-auto filter grayscale" />
              </div>
              <div className="flex justify-center opacity-60">
                <div className="bg-gray-400 text-black px-2 py-1 rounded text-xs font-bold">
                  postepay
                </div>
              </div>
              <div className="flex justify-center opacity-60">
                <Image src="/bank-transfer.svg" alt="Bank Transfer" width={60} height={40} className="h-8 w-auto filter grayscale" />
              </div>
              <div className="flex justify-center opacity-60">
                <div className="bg-gray-500 text-white px-2 py-1 rounded text-xs font-bold">
                  Alipay
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </StaticPageLayout>
  )
} 