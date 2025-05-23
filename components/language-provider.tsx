"use client"

import { createContext, useState, useEffect, type ReactNode } from "react"
import type { Language } from "@/lib/types"

interface LanguageContextType {
  language: Language
  setLanguage: (lang: Language) => void
}

export const LanguageContext = createContext<LanguageContextType>({
  language: "en",
  setLanguage: () => {},
})

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>("en")

  useEffect(() => {
    // Check if there's a saved language preference in localStorage
    const savedLanguage = localStorage.getItem("language") as Language
    if (savedLanguage && ["en", "de", "fr", "es"].includes(savedLanguage)) {
      setLanguage(savedLanguage)
    } else {
      // If no saved preference, try to detect browser language
      const browserLang = navigator.language.split("-")[0] as Language
      if (["en", "de", "fr", "es"].includes(browserLang)) {
        setLanguage(browserLang)
      }
    }
  }, [])

  const handleSetLanguage = (lang: Language) => {
    setLanguage(lang)
    localStorage.setItem("language", lang)
  }

  return (
    <LanguageContext.Provider value={{ language, setLanguage: handleSetLanguage }}>{children}</LanguageContext.Provider>
  )
}
