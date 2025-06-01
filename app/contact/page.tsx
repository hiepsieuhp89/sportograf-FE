"use client"

import { StaticPageLayout } from "@/components/static-page-layout"
import { useTranslations } from "@/hooks/use-translations"
import { Send } from "lucide-react"

export default function ContactPage() {
  const { t } = useTranslations()

  return (
    <StaticPageLayout>
      <div className="min-h-screen text-mainNavyText">
        <div className="max-w-7xl mx-auto py-20 px-16">
          <div className="mb-4">
            <h1 className="text-2xl font-bold mb-6">{t("contact")}</h1>
            <h2 className="text-xl font-bold uppercase mb-6">{t("howToContactUs")}</h2>
          </div>

          <div className="mb-8">
            <p className="font-semibold mb-1">{t("companyAddress")}</p>
            <p className="mb-1">Süsterfeldstr 170</p>
            <p className="mb-1">52072 Aachen</p>
            <p className="mb-4">{t("germany")}</p>

            <p className="mb-4">
              {t("toContactSupport")}{" "}
              <a href="#" className="text-mainNavyText hover:underline">
                {t("useContactForm")}
              </a>
              .
            </p>
          </div>

          <div className="bg-white p-6 shadow-sm mb-8">
            <h3 className="text-lg font-semibold mb-4">{t("contactForm")}</h3>
            <form>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                    {t("name")} <span className="text-red-500">{t("required")}</span>
                  </label>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    required
                    className="w-full px-4 py-2 bg-white border border-gray-300 focus:outline-none focus:ring-2 focus:ring-mainActiveV1 focus:border-transparent transition-all duration-200"
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                    {t("email")} <span className="text-red-500">{t("required")}</span>
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    className="w-full px-4 py-2 bg-white border border-gray-300 focus:outline-none focus:ring-2 focus:ring-mainActiveV1 focus:border-transparent transition-all duration-200"
                  />
                </div>
              </div>
              <div className="mb-6">
                <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">
                  {t("subject")} <span className="text-red-500">{t("required")}</span>
                </label>
                <input
                  id="subject"
                  name="subject"
                  type="text"
                  required
                  className="w-full px-4 py-2 bg-white border border-gray-300 focus:outline-none focus:ring-2 focus:ring-mainActiveV1 focus:border-transparent transition-all duration-200"
                />
              </div>
              <div className="mb-6">
                <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                  {t("message")} <span className="text-red-500">{t("required")}</span>
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows={6}
                  required
                  className="w-full px-4 py-2 bg-white border border-gray-300 focus:outline-none focus:ring-2 focus:ring-mainActiveV1 focus:border-transparent transition-all duration-200"
                ></textarea>
              </div>
              <button
                type="submit"
                className="px-6 py-3 bg-mainDarkBackgroundV1 text-white font-normal hover:bg-mainDarkBackgroundV1/90 transition-colors duration-200 flex items-center space-x-2 group shadow-lg hover:shadow-xl"
              >
                <span>{t("sendMessage")}</span>
                <Send className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" />
              </button>
            </form>
          </div>
        </div>
      </div>
    </StaticPageLayout>
  )
}
