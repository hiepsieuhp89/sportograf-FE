"use client"

import Link from "next/link"
import { useTranslations } from "@/hooks/use-translations"
import { LanguageSwitcher } from "./language-switcher"
import { Facebook, Instagram, Twitter, User, LogOut } from "lucide-react"
import ButtonShapeTabs from "./ui/menu-tabs"
import Image from "next/image"
import { MobileMenu } from "./mobile-menu"
import { useUser } from "@/contexts/user-context"
import { useFirebase } from "./firebase-provider"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export function Header() {
  const { t } = useTranslations()
  const { userData, loading } = useUser()
  const { auth } = useFirebase()

  const mainTabs = [
    { text: t("contact"), href: "/contact" },
    { text: t("legal"), href: "/legal" },
    { text: t("privacy"), href: "/privacy" },
    { text: t("termsAndConditions"), href: "/terms-and-conditions" },
    { text: t("newsletter"), href: "/newsletter" },
    { text: t("faq"), href: "/faq" },
  ]

  const getExtraTabs = () => {
    const baseTabs = [
      { text: t("home"), href: "/" },
      { text: t("aboutUs"), href: "/about-us" },
      // { text: t("jobs"), href: "/jobs" },
    ]

    if (loading) return baseTabs
    if (!userData) return [...baseTabs, { text: t("login"), href: "/login" }]
    return baseTabs
  }

  const handleLogout = async () => {
    try {
      await auth?.signOut()
    } catch (error) {
      console.error("Error signing out:", error)
    }
  }

  return (
    <header className="w-full bg-mainDarkBackgroundV1">
      <div className="bg-transparent text-mainBackgroundV1 py-2 px-4 md:px-8">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-8">
            <Link href="/" className="flex-shrink-0">
              <Image 
                src="https://www.sportograf.com/images/sg-logo-new-no-text.png" 
                alt="Logo" 
                width={48}
                height={48}
                className="h-8 md:h-12 w-auto" 
                quality={100} 
                draggable={false} 
              />
            </Link>
            <div className="hidden lg:block">
              <ButtonShapeTabs tabs={mainTabs} />
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <div className="hidden lg:flex items-center space-x-4">
              <ButtonShapeTabs tabs={getExtraTabs()} />
              {userData && (
                <DropdownMenu>
                  <DropdownMenuTrigger className="flex items-center space-x-2 px-3 py-2 rounded-lg hover:bg-white/10 transition-colors backdrop-blur-sm border border-white/20">
                    <div className="flex items-center space-x-2">
                      {userData.profileImageUrl ? (
                        <Image
                          src={userData.profileImageUrl}
                          alt="Profile"
                          width={32}
                          height={32}
                          className="rounded-full border-2 border-white/30"
                        />
                      ) : (
                        <div className="w-8 h-8 rounded-full bg-mainActiveV1 flex items-center justify-center">
                          <User className="h-4 w-4 text-white" />
                        </div>
                      )}
                      <span className="max-w-[150px] truncate text-white font-medium">
                        {userData.name || userData.email}
                      </span>
                    </div>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56 bg-white/95 backdrop-blur-md border border-white/20 shadow-xl">
                    <DropdownMenuItem className="hover:bg-mainActiveV1/10 focus:bg-mainActiveV1/10">
                      <Link href="/profile" className="flex items-center space-x-2 w-full text-gray-800">
                        <User className="h-4 w-4" />
                        <span>{t("editProfile")}</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={handleLogout} className="hover:bg-red-50 focus:bg-red-50">
                      <div className="flex items-center space-x-2 text-red-600 w-full">
                        <LogOut className="h-4 w-4" />
                        <span>{t("logout")}</span>
                      </div>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
              <LanguageSwitcher />
              <div className="flex items-center space-x-3">
                <Link href="https://facebook.com" aria-label="Facebook" className="hover:text-gray-300">
                  <Facebook className="h-5 w-5" />
                </Link>
                <Link href="https://instagram.com" aria-label="Instagram" className="hover:text-gray-300">
                  <Instagram className="h-5 w-5" />
                </Link>
                <Link href="https://twitter.com" aria-label="Twitter" className="hover:text-gray-300">
                  <Twitter className="h-5 w-5" />
                </Link>
              </div>
            </div>
            <MobileMenu 
              mainTabs={mainTabs} 
              extraTabs={getExtraTabs()} 
              userData={userData}
              onLogout={handleLogout}
            />
          </div>
        </div>
      </div>
    </header>
  )
}
