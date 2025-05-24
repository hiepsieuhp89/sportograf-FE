"use client"

import { useContext, useState } from "react"
import { LanguageContext } from "./language-provider"
import { ChevronDown } from "lucide-react"

export function LanguageSwitcher() {
  const { language, setLanguage } = useContext(LanguageContext)
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center text-mainBackgroundV1 hover:text-gray-300 bg-mainBackgroundV1 bg-opacity-20 px-3 py-1 h-6 rounded"
      >
        <span className="mr-1">🇬🇧</span>
        <span className="mr-2 font-medium">EN</span>
        <ChevronDown className="h-4 w-4" />
      </button>

      {isOpen && (
        <div className="absolute right-0 z-20 mt-2 w-32 origin-top-right rounded-md bg-mainBackgroundV1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
          <div className="py-1">
            <button
              onClick={() => {
                setLanguage("en")
                setIsOpen(false)
              }}
              className={`flex w-full items-center px-4 py-2 text-sm ${
                language === "en" ? "bg-gray-100 text-gray-900" : "text-gray-700"
              } hover:bg-gray-100`}
            >
              <span className="mr-2">🇬🇧</span> EN
            </button>
            <button
              onClick={() => {
                setLanguage("de")
                setIsOpen(false)
              }}
              className={`flex w-full items-center px-4 py-2 text-sm ${
                language === "de" ? "bg-gray-100 text-gray-900" : "text-gray-700"
              } hover:bg-gray-100`}
            >
              <span className="mr-2">🇩🇪</span> DE
            </button>
            <button
              onClick={() => {
                setLanguage("fr")
                setIsOpen(false)
              }}
              className={`flex w-full items-center px-4 py-2 text-sm ${
                language === "fr" ? "bg-gray-100 text-gray-900" : "text-gray-700"
              } hover:bg-gray-100`}
            >
              <span className="mr-2">🇫🇷</span> FR
            </button>
            <button
              onClick={() => {
                setLanguage("es")
                setIsOpen(false)
              }}
              className={`flex w-full items-center px-4 py-2 text-sm ${
                language === "es" ? "bg-gray-100 text-gray-900" : "text-gray-700"
              } hover:bg-gray-100`}
            >
              <span className="mr-2">🇪🇸</span> ES
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
