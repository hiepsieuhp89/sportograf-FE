"use client"

import { StaticPageLayout } from "@/components/static-page-layout"
import Link from "next/link"
import { useState } from "react"
import { Search, Plus } from "lucide-react"
import Image from "next/image"

interface FAQItem {
  id: string
  title: string
}

interface FAQCategory {
  title: string
  count: number
  items: FAQItem[]
}

const faqData: FAQCategory[] = [
  {
    title: "Getting started",
    count: 3,
    items: [
      { id: "who-is-sportograf", title: "Who is Sportograf?" },
      { id: "what-is-foto-flat", title: "What is a Foto-Flat?" },
      { id: "how-it-works", title: "How it works" }
    ]
  },
  {
    title: "Login",
    count: 4,
    items: [
      { id: "what-is-magic-link", title: "What is a Magic Link?" },
      { id: "validation-failed", title: "My validation for an event has failed. What to do?" },
      { id: "access-photos-duration", title: "How long can I access my photos?" },
      { id: "2fa-authentication", title: "How does the 2-Factor-Authentication (2FA) work?" }
    ]
  },
  {
    title: "Find your own photos",
    count: 7,
    items: [
      { id: "search-selfie-face", title: "Search by selfie/face recognition" },
      { id: "find-mark-photos", title: "How do I find and mark more photos of myself?" },
      { id: "cant-find-pictures", title: "Why can't I find pictures of myself?" },
      { id: "photos-strangers", title: "There are one or more photos of strangers in my Foto-Flat" },
      { id: "number-photos-flat", title: "Number of photos in the Foto-Flat" }
    ]
  },
  {
    title: "Order",
    count: 9,
    items: [
      { id: "order-foto-flat", title: "How do I order my Foto-Flat?" },
      { id: "preordered-before-event", title: "I pre-ordered my Photo Package before the event" },
      { id: "preordered-spartan", title: "Pre-ordered Photo Package - Spartan" },
      { id: "preordered-hyrox", title: "Pre-ordered Photo Package - HYROX" },
      { id: "order-single-photos", title: "Can I also order single photos?" }
    ]
  },
  {
    title: "Payment",
    count: 5,
    items: [
      { id: "payment-methods", title: "What payment methods are available?" },
      { id: "bank-transfer-payment", title: "I would like to pay by bank transfer. How can I do?" },
      { id: "paid-twice", title: "I paid twice. What can I do?" },
      { id: "find-invoice", title: "Where do I find the invoice for my purchases?" },
      { id: "bank-details", title: "Where can I find your bank details?" }
    ]
  },
  {
    title: "Download",
    count: 3,
    items: [
      { id: "where-is-order", title: "Where is my order?" },
      { id: "zip-download", title: "ZIP download" },
      { id: "download-area", title: "Your Download Area" }
    ]
  },
  {
    title: "FAQ",
    count: 1,
    items: [
      { id: "no-answer-found", title: "I have read the FAQ but did not find an answer to my question" }
    ]
  },
  {
    title: "Use of the photos, copyright, press",
    count: 0,
    items: []
  },
  {
    title: "Press",
    count: 2,
    items: [
      { id: "publish-social-media", title: "Can I publish photos I have bought on social media?" },
      { id: "rights-purchase", title: "Did I acquire the rights to further use with the purchase?" }
    ]
  },
  {
    title: "Join the team",
    count: 0,
    items: []
  },
  {
    title: "Photographer",
    count: 1,
    items: [
      { id: "become-sportografer", title: "How to become a Sportografer?" }
    ]
  },
  {
    title: "Number - and Face recognition",
    count: 1,
    items: [
      { id: "recognition-work", title: "How does your recognition work?" }
    ]
  }
]

export default function FAQPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [expandedCategories, setExpandedCategories] = useState<string[]>([])

  const filteredData = faqData.map(category => ({
    ...category,
    items: category.items.filter(item =>
      item.title.toLowerCase().includes(searchTerm.toLowerCase())
    )
  })).filter(category => 
    searchTerm === "" || 
    category.items.length > 0 || 
    category.title.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const toggleCategory = (categoryTitle: string) => {
    setExpandedCategories(prev =>
      prev.includes(categoryTitle)
        ? prev.filter(title => title !== categoryTitle)
        : [...prev, categoryTitle]
    )
  }

  return (
    <StaticPageLayout>
      <div className="bg-gray-50 min-h-screen">
        {/* Hero Section */}
        <div className="bg-white py-16 px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-light text-gray-800 mb-8">
              How can we help you today?
            </h1>
            
            {/* Search Bar */}
            <div className="relative max-w-2xl mx-auto mb-8">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Enter your search term here..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-6 py-4 text-lg border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent pr-12"
                />
                <Search className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-6 h-6" />
              </div>
            </div>

            {/* New Support Ticket Button */}
            <button className="inline-flex items-center px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors">
              <Plus className="w-5 h-5 mr-2" />
              New Support Ticket
            </button>
          </div>
        </div>

        {/* Knowledge Base Section */}
        <div className="max-w-6xl mx-auto px-4 py-12">
          <h2 className="text-3xl font-light text-gray-800 mb-8">Knowledge base</h2>
          
          {/* FAQ Categories Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
            {filteredData.map((category) => (
              <div key={category.title} className="bg-white rounded-lg shadow-sm border border-gray-200">
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-medium text-gray-800">
                      {category.title}
                    </h3>
                    {category.count > 0 && (
                      <span className="text-gray-500 text-sm">({category.count})</span>
                    )}
                  </div>
                  
                  {category.items.length > 0 ? (
                    <div className="space-y-3">
                      {category.items.slice(0, 5).map((item) => (
                        <Link
                          key={item.id}
                          href={`/faq/${item.id}`}
                          className="flex items-start text-gray-600 hover:text-blue-600 transition-colors group"
                        >
                          <span className="mr-3 mt-1 text-gray-400 group-hover:text-blue-600">📄</span>
                          <span className="text-sm leading-relaxed">{item.title}</span>
                        </Link>
                      ))}
                      
                      {category.items.length > 5 && (
                        <button
                          onClick={() => toggleCategory(category.title)}
                          className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                        >
                          {expandedCategories.includes(category.title) 
                            ? `View less` 
                            : `View all ${category.count}`
                          }
                        </button>
                      )}
                      
                      {expandedCategories.includes(category.title) && category.items.length > 5 && (
                        <div className="space-y-3 pt-2">
                          {category.items.slice(5).map((item) => (
                            <Link
                              key={item.id}
                              href={`/faq/${item.id}`}
                              className="flex items-start text-gray-600 hover:text-blue-600 transition-colors group"
                            >
                              <span className="mr-3 mt-1 text-gray-400 group-hover:text-blue-600">📄</span>
                              <span className="text-sm leading-relaxed">{item.title}</span>
                            </Link>
                          ))}
                        </div>
                      )}
                    </div>
                  ) : (
                    <p className="text-gray-500 text-sm">No articles in this category yet.</p>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Payment Methods Section */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
            <h3 className="text-xl font-medium text-gray-800 mb-6">Payment Methods</h3>
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