"use client"

import { useContext } from "react"
import { LanguageContext } from "@/components/language-provider"
import { translations } from "@/lib/translations"

export function useTranslations() {
  const { language, isLoaded } = useContext(LanguageContext)

  const t = (key: keyof typeof translations.en) => {
    return translations[language][key] || translations.en[key]
  }

  return { t, language, isLoaded }
}
