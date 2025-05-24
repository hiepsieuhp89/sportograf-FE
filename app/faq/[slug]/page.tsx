"use client"

import { StaticPageLayout } from "@/components/static-page-layout"
import Link from "next/link"
import { useParams } from "next/navigation"
import { ArrowLeft, ThumbsUp, ThumbsDown } from "lucide-react"
import Image from "next/image"

interface FAQArticle {
  id: string
  title: string
  content: string
  relatedArticles: {
    id: string
    title: string
  }[]
}

const faqArticles: { [key: string]: FAQArticle } = {
  "payment-methods": {
    id: "payment-methods",
    title: "What payment methods are available?",
    content: "Depending on the venue of the event we offer the following payment methods: Bank Transfer, Paypal, Alipay, Visa, Mastercard, GiroPay, Sofortüberweisung, Klarna, Ideal, Postepay.",
    relatedArticles: [
      { id: "bank-transfer-payment", title: "I would like to pay by bank transfer. How can I do?" },
      { id: "bank-details", title: "Where can I find your bank details?" },
      { id: "where-is-order", title: "Where is my order?" },
      { id: "paid-twice", title: "I paid twice. What can I do?" },
      { id: "find-invoice", title: "Where do I find the invoice for my purchases?" },
      { id: "order-foto-flat", title: "How do I order my Foto-Flat?" },
      { id: "order-single-photos", title: "Can I also order single photos?" },
      { id: "preordered-hyrox", title: "Pre-ordered Photo Package - HYROX" },
      { id: "preordered-before-event", title: "I pre-ordered my Photo Package before the event" }
    ]
  },
  "bank-transfer-payment": {
    id: "bank-transfer-payment",
    title: "I would like to pay by bank transfer. How can I do?",
    content: "You can pay by bank transfer during the checkout process. Select 'Bank Transfer' as your payment method and you will receive our bank details to complete the payment. Please include your order number in the payment reference.",
    relatedArticles: [
      { id: "payment-methods", title: "What payment methods are available?" },
      { id: "bank-details", title: "Where can I find your bank details?" },
      { id: "find-invoice", title: "Where do I find the invoice for my purchases?" },
      { id: "where-is-order", title: "Where is my order?" }
    ]
  },
  "who-is-sportograf": {
    id: "who-is-sportograf",
    title: "Who is Sportograf?",
    content: "Sportograf is the world's leading digital sports photography service. We specialize in capturing and delivering high-quality photos of athletes during sporting events. Our photographers are positioned strategically throughout race courses to capture multiple shots of each participant.",
    relatedArticles: [
      { id: "what-is-foto-flat", title: "What is a Foto-Flat?" },
      { id: "how-it-works", title: "How it works" },
      { id: "become-sportografer", title: "How to become a Sportografer?" }
    ]
  },
  "what-is-foto-flat": {
    id: "what-is-foto-flat",
    title: "What is a Foto-Flat?",
    content: "A Foto-Flat is our photo package that includes all photos of you from an event. Instead of buying individual photos, you get access to all your photos from the event for one flat rate. This includes high-resolution downloads and print-ready files.",
    relatedArticles: [
      { id: "order-foto-flat", title: "How do I order my Foto-Flat?" },
      { id: "number-photos-flat", title: "Number of photos in the Foto-Flat" },
      { id: "order-single-photos", title: "Can I also order single photos?" }
    ]
  },
  "what-is-magic-link": {
    id: "what-is-magic-link",
    title: "What is a Magic Link?",
    content: "A Magic Link is a secure, one-time login link that we send to your email address. Instead of using a traditional password, you simply click the link in your email to access your photos. This provides enhanced security and convenience.",
    relatedArticles: [
      { id: "validation-failed", title: "My validation for an event has failed. What to do?" },
      { id: "access-photos-duration", title: "How long can I access my photos?" },
      { id: "2fa-authentication", title: "How does the 2-Factor-Authentication (2FA) work?" }
    ]
  },
  "search-selfie-face": {
    id: "search-selfie-face",
    title: "Search by selfie/face recognition",
    content: "Our advanced facial recognition technology allows you to find your photos by uploading a selfie. Simply upload a clear photo of yourself, and our system will automatically identify and show you all photos where you appear in the event.",
    relatedArticles: [
      { id: "recognition-work", title: "How does your recognition work?" },
      { id: "find-mark-photos", title: "How do I find and mark more photos of myself?" },
      { id: "cant-find-pictures", title: "Why can't I find pictures of myself?" }
    ]
  },
  "order-foto-flat": {
    id: "order-foto-flat",
    title: "How do I order my Foto-Flat?",
    content: "To order your Foto-Flat, first find your photos using our search function or facial recognition. Once you've identified your photos, click on 'Order Foto-Flat' and follow the checkout process. You can pay using various payment methods including credit card, PayPal, or bank transfer.",
    relatedArticles: [
      { id: "what-is-foto-flat", title: "What is a Foto-Flat?" },
      { id: "payment-methods", title: "What payment methods are available?" },
      { id: "preordered-before-event", title: "I pre-ordered my Photo Package before the event" }
    ]
  },
  "where-is-order": {
    id: "where-is-order",
    title: "Where is my order?",
    content: "You can check your order status by logging into your account and visiting the 'My Orders' section. You will also receive email notifications about your order status. Once your photos are ready for download, you'll receive a download link via email.",
    relatedArticles: [
      { id: "download-area", title: "Your Download Area" },
      { id: "zip-download", title: "ZIP download" },
      { id: "access-photos-duration", title: "How long can I access my photos?" }
    ]
  }
}

export default function FAQArticlePage() {
  const params = useParams()
  const slug = params.slug as string
  const article = faqArticles[slug]

  if (!article) {
    return (
      <StaticPageLayout>
        <div className="bg-gray-50 min-h-screen">
          <div className="max-w-4xl mx-auto px-4 py-12">
            <h1 className="text-2xl font-semibold mb-4">Article not found</h1>
            <Link href="/faq" className="text-blue-600 hover:underline flex items-center">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to FAQ
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
              Solution home
            </Link>

            {/* Article Content */}
            <article className="mb-12">
              <h1 className="text-2xl md:text-3xl font-medium text-gray-900 mb-8 leading-tight">
                {article.title}
              </h1>
              <div className="prose max-w-none">
                <p className="text-gray-700 leading-relaxed text-lg">{article.content}</p>
              </div>
            </article>

            {/* Author Info */}
            <div className="mb-12 flex items-start gap-4 bg-gray-50 p-6 rounded-lg">
              <div className="w-12 h-12 bg-purple-200 rounded-full flex items-center justify-center text-purple-700 font-medium text-lg flex-shrink-0">
                S
              </div>
              <div className="flex-1">
                <p className="text-gray-700 mb-3">
                  <span className="font-medium">Support</span> is the author of this solution article.
                </p>
                <div className="flex items-center gap-4">
                  <span className="text-gray-600 text-sm">Did you find it helpful?</span>
                  <button className="flex items-center gap-2 text-blue-600 hover:text-blue-800 text-sm font-medium transition-colors">
                    <ThumbsUp className="w-4 h-4" />
                    Yes
                  </button>
                  <button className="flex items-center gap-2 text-blue-600 hover:text-blue-800 text-sm font-medium transition-colors">
                    <ThumbsDown className="w-4 h-4" />
                    No
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Related Articles */}
        {article.relatedArticles.length > 0 && (
          <div className="max-w-4xl mx-auto px-4 py-12">
            <h2 className="text-2xl font-medium text-gray-900 mb-8">Related Articles</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {article.relatedArticles.map((related) => (
                <Link
                  key={related.id}
                  href={`/faq/${related.id}`}
                  className="flex items-start p-4 bg-white rounded-lg border border-gray-200 hover:border-blue-300 hover:shadow-sm transition-all group"
                >
                  <span className="mr-3 mt-1 text-gray-400 group-hover:text-blue-600 transition-colors">📄</span>
                  <span className="text-gray-700 group-hover:text-blue-600 transition-colors text-sm leading-relaxed">
                    {related.title}
                  </span>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Payment Methods Section */}
        <div className="bg-white border-t border-gray-200">
          <div className="max-w-4xl mx-auto px-4 py-12">
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-6 items-center">
              <div className="flex justify-center">
                <Image src="/mastercard.svg" alt="Mastercard" width={60} height={40} className="h-8 w-auto" />
              </div>
              <div className="flex justify-center">
                <Image src="/visa.svg" alt="Visa" width={60} height={40} className="h-8 w-auto" />
              </div>
              <div className="flex justify-center">
                <div className="bg-pink-100 px-3 py-2 rounded">
                  <span className="text-pink-600 font-bold text-sm">Klarna.</span>
                </div>
              </div>
              <div className="flex justify-center">
                <div className="bg-purple-600 text-white px-2 py-1 rounded text-xs font-bold">
                  iDEAL
                </div>
              </div>
              <div className="flex justify-center">
                <Image src="/paypal.svg" alt="PayPal" width={60} height={40} className="h-8 w-auto" />
              </div>
              <div className="flex justify-center">
                <div className="bg-yellow-400 text-black px-2 py-1 rounded text-xs font-bold">
                  postepay
                </div>
              </div>
              <div className="flex justify-center">
                <Image src="/bank-transfer.svg" alt="Bank Transfer" width={60} height={40} className="h-8 w-auto" />
              </div>
              <div className="flex justify-center">
                <div className="bg-blue-500 text-white px-2 py-1 rounded text-xs font-bold">
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