"use client"

import { StaticPageLayout } from "@/components/static-page-layout"
import { useTranslations } from "@/hooks/use-translations"

export default function LegalPage() {
  const { t } = useTranslations()

  return (
    <StaticPageLayout>
      <div className="bg-white mx-auto py-12 sm:py-16 lg:py-20 text-mainNavyText">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-lg sm:text-xl font-bold mb-6">{t("legalNotice")}</h1>
          <div className="mb-6 sm:mb-8">
            <p className="mb-1 text-sm font-bold">{t("companyAddress")}</p>
            <p className="mb-1 text-sm font-bold">Süsterfeldstrasse 170</p>
            <p className="mb-1 text-sm font-bold">52072 Aachen - {t("germany")}</p>
            <p className="mb-4 text-sm font-bold">
              {t("email")}:{" "}
              <a href="mailto:legal@sportograf.com" className="text-mainNavyText hover:underline">
                legal@sportograf.com
              </a>
            </p>

            <p className="mb-4 text-sm">
              {t("toContactSupport")}{" "}
              <a href="#" className="text-mainNavyText hover:underline">
                {t("useContactForm")}
              </a>
              .
            </p>
          </div>
          <div className="mb-6 sm:mb-8">
            <h2 className="text-sm font-semibold mb-4">{t("managingDirectors")}</h2>
            <p className="mb-4 text-sm">Tom Janas, Hans-Peter Zurbrügg</p>
          </div>
          <div className="mb-6 sm:mb-8">
            <p className="mb-2 text-sm">{t("localCourt")}</p>
            <p className="mb-4 text-sm">{t("salesTaxId")}</p>
          </div>

          <div className="mb-6 sm:mb-8">
            <p className="mb-4 text-sm">
              {t("onlineDisputeResolution")}
            </p>
            <p className="mb-4 text-sm">
              {t("consumerDisputes")}
            </p>
          </div>
        </div>
      </div>
    </StaticPageLayout>
  )
}
