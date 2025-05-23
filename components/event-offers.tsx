"use client"

import { useTranslations } from "@/hooks/use-translations"

export function EventOffers() {
  const { t } = useTranslations()

  return (
    <div className="mt-8">
      <h2 className="text-xl font-bold mb-6">{t("offer")}</h2>
      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-[#1e3a52] text-white rounded-md overflow-hidden">
          <div className="p-6 text-center">
            <h3 className="text-lg font-bold mb-2">FOTO-FLAT</h3>
            <div className="text-3xl font-bold mb-4">US$39.99</div>
            <ul className="space-y-4 mb-6">
              <li>All personal digital photos (JPG)</li>
              <li>All digital impressions (JPG)</li>
            </ul>
          </div>
        </div>
        <div className="bg-[#1e3a52] text-white rounded-md overflow-hidden">
          <div className="p-6 text-center">
            <h3 className="text-lg font-bold mb-2">{t("otherProducts")}</h3>
            <ul className="space-y-4 mb-6">
              <li className="flex justify-between">
                <span>1 personal digital photo (JPG)</span>
                <span className="font-bold">US$19.99</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
