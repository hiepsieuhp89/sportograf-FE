"use client"

import Link from "next/link"
import { useTranslations } from "@/hooks/use-translations"
import { LanguageSwitcher } from "./language-switcher"
import { Facebook, Instagram, Twitter } from "lucide-react"

export function Header() {
  const { t } = useTranslations()

  return (
    <header className="w-full">
      {/* Main navigation */}
      <div className="bg-transparent absolute top-12 left-0 right-0 z-10">
       <div className="bg-transparent text-white py-2 px-4">
        <div className="max-w-[1200px] mx-auto flex justify-between items-center">
          <div className="flex space-x-6 text-sm">
            <Link href="/contact" className="hover:underline uppercase font-medium">
              CONTACT
            </Link>
            <Link href="/legal" className="hover:underline uppercase font-medium">
              LEGAL
            </Link>
            <Link href="/privacy" className="hover:underline uppercase font-medium">
              PRIVACY
            </Link>
            <Link href="/terms-and-conditions" className="hover:underline uppercase font-medium">
              TERMS AND CONDITIONS
            </Link>
            <Link href="/newsletter" className="hover:underline uppercase font-medium">
              NEWSLETTER
            </Link>
            <Link href="/faq" className="hover:underline uppercase font-medium">
              FAQ
            </Link>
          </div>
          <div className="flex space-x-3">
            <Link href="https://facebook.com" aria-label="Facebook">
              <Facebook className="h-5 w-5 hover:text-gray-300" />
            </Link>
            <Link href="https://instagram.com" aria-label="Instagram">
              <Instagram className="h-5 w-5 hover:text-gray-300" />
            </Link>
            <Link href="https://twitter.com" aria-label="Twitter">
              <Twitter className="h-5 w-5 hover:text-gray-300" />
            </Link>
          </div>
        </div>
        </div>
        <div className="max-w-[1200px] mx-auto flex justify-between items-center px-4 py-4">
          <Link href="/" className="flex items-center">
            <div className="flex items-center space-x-2">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-red-600 rounded flex items-center justify-center">
                <span className="text-white font-bold text-lg">S</span>
              </div>
              <span className="text-white font-bold text-2xl">SPORTOGRAF</span>
            </div>
          </Link>
          <nav className="flex items-center space-x-8">
            <Link href="/" className="text-white hover:text-gray-300 uppercase font-medium">
              HOME
            </Link>
            <Link href="/login" className="text-white hover:text-gray-300 uppercase font-medium">
              LOGIN
            </Link>
            <Link href="/about-us" className="text-white hover:text-gray-300 uppercase font-medium">
              ABOUT US
            </Link>
            <div className="ml-4">
              <LanguageSwitcher />
            </div>
          </nav>
        </div>
      </div>
    </header>
  )
}
