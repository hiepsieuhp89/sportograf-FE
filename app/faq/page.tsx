"use client"

import { StaticPageLayout } from "@/components/static-page-layout"
import { useTranslations } from "@/hooks/use-translations"
import Link from "next/link"
import { useState, useEffect } from "react"
import { Search, Plus, Send } from "lucide-react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { getApprovedFAQs, submitFAQ, initializeFAQs, groupFAQsByCategory } from "@/lib/faq-service"
import { getTranslatedContent } from "@/lib/translation-utils"
import type { FAQ } from "@/lib/types"

const categories = [
  "Getting started",
  "Login", 
  "Find your own photos",
  "Order",
  "Payment",
  "Download",
  "FAQ",
  "Use of the photos, copyright, press",
  "Press",
  "Join the team",
  "Photographer",
  "Number - and Face recognition"
]

export default function FAQPage() {
  const { t, language } = useTranslations()
  const [searchTerm, setSearchTerm] = useState("")
  const [expandedCategories, setExpandedCategories] = useState<string[]>([])
  const [faqs, setFAQs] = useState<FAQ[]>([])
  const [loading, setLoading] = useState(true)
  const [showSubmitForm, setShowSubmitForm] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [submitSuccess, setSubmitSuccess] = useState(false)

  // Form state
  const [formData, setFormData] = useState({
    title: "",
    question: "",
    category: "",
    submitterName: "",
    submitterEmail: ""
  })

  useEffect(() => {
    const loadFAQs = async () => {
      try {
        // Initialize FAQs if none exist
        await initializeFAQs()
        
        // Load approved FAQs
        const approvedFAQs = await getApprovedFAQs()
        setFAQs(approvedFAQs)
      } catch (error) {
        console.error("Error loading FAQs:", error)
      } finally {
        setLoading(false)
      }
    }

    loadFAQs()
  }, [])

  const groupedFAQs = groupFAQsByCategory(faqs)

  const filteredData = Object.entries(groupedFAQs).map(([categoryName, categoryFAQs]) => ({
    title: categoryName,
    count: categoryFAQs.length,
    items: categoryFAQs.filter(faq => {
      const translatedContent = getTranslatedContent(faq.translations, language)
      const title = translatedContent?.title || faq.title
      const question = translatedContent?.question || faq.question
      
      return title.toLowerCase().includes(searchTerm.toLowerCase()) ||
             question.toLowerCase().includes(searchTerm.toLowerCase())
    }).map(faq => {
      const translatedContent = getTranslatedContent(faq.translations, language)
      return {
        id: faq.id,
        title: translatedContent?.title || faq.title
      }
    })
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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (value: string) => {
    setFormData(prev => ({ ...prev, category: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)

    try {
      await submitFAQ({
        title: formData.title,
        question: formData.question,
        category: formData.category,
        submitterName: formData.submitterName,
        submitterEmail: formData.submitterEmail
      })

      setSubmitSuccess(true)
      setFormData({
        title: "",
        question: "",
        category: "",
        submitterName: "",
        submitterEmail: ""
      })

      setTimeout(() => {
        setShowSubmitForm(false)
        setSubmitSuccess(false)
      }, 2000)
    } catch (error) {
      console.error("Error submitting FAQ:", error)
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <StaticPageLayout>
        <div className="flex justify-center items-center min-h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-mainNavyText"></div>
        </div>
      </StaticPageLayout>
    )
  }

  return (
    <StaticPageLayout>
      <div className="bg-gray-50 min-h-screen">
        {/* Hero Section */}
        <div className="bg-white py-16 px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-light text-gray-800 mb-8">
              {t("howCanWeHelpYou")}
            </h1>
            
            {/* Search Bar */}
            <div className="relative max-w-2xl mx-auto mb-8">
              <div className="relative">
                <input
                  type="text"
                  placeholder={t("enterSearchTerm")}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-6 py-4 text-lg border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent pr-12"
                />
                <Search className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-6 h-6" />
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Dialog open={showSubmitForm} onOpenChange={setShowSubmitForm}>
                <DialogTrigger asChild>
                  <Button className="inline-flex items-center px-6 py-3 bg-mainNavyText hover:bg-mainNavyText/80 text-white rounded-lg transition-colors">
                    <Plus className="w-5 h-5 mr-2" />
                    {t("submitNewFAQ")}
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>{t("submitNewFAQ")}</DialogTitle>
                  </DialogHeader>
                  
                  {submitSuccess ? (
                    <div className="text-center py-8">
                      <div className="text-green-600 text-6xl mb-4">✓</div>
                      <h3 className="text-xl font-semibold text-green-600 mb-2">
                        {t("thankYouForSubmission")}
                      </h3>
                      <p className="text-gray-600">
                        {t("questionSubmittedSuccessfully")}
                      </p>
                    </div>
                  ) : (
                    <form onSubmit={handleSubmit} className="space-y-4">
                      <div>
                        <Label htmlFor="title">{t("faqTitle")} *</Label>
                        <Input
                          id="title"
                          name="title"
                          value={formData.title}
                          onChange={handleInputChange}
                          required
                          placeholder={t("faqTitle")}
                        />
                      </div>

                      <div>
                        <Label htmlFor="category">{t("faqCategory")} *</Label>
                        <Select value={formData.category} onValueChange={handleSelectChange} required>
                          <SelectTrigger>
                            <SelectValue placeholder={t("faqCategory")} />
                          </SelectTrigger>
                          <SelectContent>
                            {categories.map((category) => (
                              <SelectItem key={category} value={category}>
                                {category}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <Label htmlFor="question">{t("yourQuestion")} *</Label>
                        <Textarea
                          id="question"
                          name="question"
                          value={formData.question}
                          onChange={handleInputChange}
                          required
                          placeholder={t("questionDetails")}
                          rows={4}
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="submitterName">{t("name")}</Label>
                          <Input
                            id="submitterName"
                            name="submitterName"
                            value={formData.submitterName}
                            onChange={handleInputChange}
                            placeholder={t("name")}
                          />
                        </div>
                        <div>
                          <Label htmlFor="submitterEmail">{t("email")}</Label>
                          <Input
                            id="submitterEmail"
                            name="submitterEmail"
                            type="email"
                            value={formData.submitterEmail}
                            onChange={handleInputChange}
                            placeholder={t("email")}
                          />
                        </div>
                      </div>

                      <Button type="submit" disabled={submitting} className="w-full">
                        {submitting ? (
                          <div className="flex items-center">
                            <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></div>
                            {t("submit")}...
                          </div>
                        ) : (
                          <>
                            <Send className="w-4 h-4 mr-2" />
                            {t("submitQuestion")}
                          </>
                        )}
                      </Button>
                    </form>
                  )}
                </DialogContent>
              </Dialog>

              <button className="inline-flex items-center px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors">
                <Plus className="w-5 h-5 mr-2" />
                {t("newSupportTicket")}
              </button>
            </div>
          </div>
        </div>

        {/* Knowledge Base Section */}
        <div className="max-w-6xl mx-auto px-4 py-12">
          <h2 className="text-3xl font-light text-gray-800 mb-8">{t("knowledgeBase")}</h2>
          
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
                            ? t("viewLess")
                            : `${t("viewAll")} ${category.count}`
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
                    <p className="text-gray-500 text-sm">{t("noFAQsFound")}</p>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Payment Methods Section */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
            <h3 className="text-xl font-medium text-gray-800 mb-6">{t("paymentMethods")}</h3>
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