"use client"

import { createContext, useState, useEffect, type ReactNode } from "react"
import type { Language } from "@/lib/types"

interface LanguageContextType {
  language: Language
  setLanguage: (lang: Language) => void
  isLoaded: boolean
}

export const LanguageContext = createContext<LanguageContextType>({
  language: "en",
  setLanguage: () => {},
  isLoaded: false,
})

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>("en")
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    if (typeof window === "undefined") return
    const savedLanguage = localStorage.getItem("language") as Language
    if (savedLanguage && ["en", "de", "fr", "es"].includes(savedLanguage)) {
      setLanguage(savedLanguage)
    } else {
      const browserLang = navigator.language.split("-")[0] as Language
      if (["en", "de", "fr", "es"].includes(browserLang)) {
        setLanguage(browserLang)
      }
    }
    
    setIsLoaded(true)
  }, [])

  const handleSetLanguage = (lang: Language) => {
    setLanguage(lang)
    if (typeof window !== "undefined") {
      localStorage.setItem("language", lang)
    }
  }

  return (
    <LanguageContext.Provider value={{ language, setLanguage: handleSetLanguage, isLoaded }}>
      {children}
    </LanguageContext.Provider>
  )
}
