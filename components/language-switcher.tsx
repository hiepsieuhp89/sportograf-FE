"use client"

import { useContext, useState, useEffect, useRef } from "react"
import { LanguageContext } from "./language-provider"
import { ChevronDown } from "lucide-react"
import type { Language } from "@/lib/types"

const languages = [
  { code: "en" as Language, name: "English", flagCode: "gb" },
  { code: "de" as Language, name: "Deutsch", flagCode: "de" },
  { code: "fr" as Language, name: "Français", flagCode: "fr" },
  { code: "es" as Language, name: "Español", flagCode: "es" },
]

export function LanguageSwitcher() {
  const { language, setLanguage } = useContext(LanguageContext)
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  const currentLanguage = languages.find(lang => lang.code === language) || languages[0]

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  // Close dropdown on escape key
  useEffect(() => {
    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setIsOpen(false)
      }
    }

    document.addEventListener("keydown", handleEscape)
    return () => {
      document.removeEventListener("keydown", handleEscape)
    }
  }, [])

  const handleLanguageChange = (langCode: Language) => {
    setLanguage(langCode)
    setIsOpen(false)
  }

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center text-mainBackgroundV1 hover:text-gray-300 bg-mainBackgroundV1 bg-opacity-20 px-3 py-1 rounded-md transition-all duration-200 hover:bg-opacity-30 focus:outline-none focus:ring-2 focus:ring-mainBackgroundV1 focus:ring-opacity-50"
        aria-label="Select language"
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        <span className={`fi fi-${currentLanguage.flagCode} mr-2`} style={{ fontSize: '18px' }}></span>
        <span className="mr-2 font-medium text-sm uppercase">{currentLanguage.code}</span>
        <ChevronDown 
          className={`h-4 w-4 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} 
        />
      </button>

      {isOpen && (
        <div className="absolute right-0 z-50 mt-2 w-40 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none animate-in fade-in-0 zoom-in-95 duration-100">
          <div className="py-1">
            {languages.map((lang) => (
              <button
                key={lang.code}
                onClick={() => handleLanguageChange(lang.code)}
                className={`flex w-full items-center px-4 py-3 text-sm transition-colors duration-150 ${
                  language === lang.code 
                    ? "bg-mainNavyText text-white" 
                    : "text-gray-700 hover:bg-gray-100"
                }`}
                role="menuitem"
              >
                <span className={`fi fi-${lang.flagCode} mr-3`} style={{ fontSize: '18px' }}></span>
                <div className="flex flex-col items-start">
                  <span className="font-medium">{lang.name}</span>
                  <span className="text-xs opacity-70 uppercase">{lang.code}</span>
                </div>
                {language === lang.code && (
                  <span className="ml-auto text-xs">✓</span>
                )}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
