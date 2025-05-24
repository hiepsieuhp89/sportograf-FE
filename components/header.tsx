"use client"

import Link from "next/link"
import { useTranslations } from "@/hooks/use-translations"
import { LanguageSwitcher } from "./language-switcher"
import { Facebook, Instagram, Twitter } from "lucide-react"
import ButtonShapeTabs from "./ui/menu-tabs"
import Image from "next/image"

export function Header() {
  const { t } = useTranslations()
  const mainTabs = [
    { text: "CONTACT", href: "/contact" },
    { text: "LEGAL", href: "/legal" },
    { text: "PRIVACY", href: "/privacy" },
    { text: "TERMS AND CONDITIONS", href: "/terms-and-conditions" },
    { text: "NEWSLETTER", href: "/newsletter" },
    { text: "FAQ", href: "/faq" },
  ]
  const extraTabs = [
    { text: "HOME", href: "/" },
    { text: "LOGIN", href: "/login" },
    { text: "ABOUT US", href: "/about-us" },
  ]

  return (
    <header className="w-full">
      {/* Main navigation */}
      <div className="bg-transparent absolute top-4 left-0 right-0 z-10 w-full">
        <div className="bg-transparent text-mainBackgroundV1 py-2 px-8 w-full">
          <div className="max-w-8xl mx-auto flex justify-between items-center">
            <div className="flex items-center text-sm w-fit gap-4">
              <Link href="/">
                <Image src="https://www.sportograf.com/images/sg-logo-new-no-text.png" alt="Logo" width={1000} height={1000} className="h-12 flex-shrink-0 w-auto" quality={100} draggable={false} />
              </Link>
              <ButtonShapeTabs tabs={mainTabs} />
            </div>
            <div className="flex space-x-4 items-center">
              <ButtonShapeTabs tabs={extraTabs} />
              <LanguageSwitcher />
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
      </div>
    </header>
  )
}
