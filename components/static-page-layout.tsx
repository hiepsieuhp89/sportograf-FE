"use client"

import type React from "react"
import Link from "next/link"
import { useTranslations } from "@/hooks/use-translations"
import { LanguageSwitcher } from "./language-switcher"
import { Facebook, Instagram, Twitter, LogOut, User } from "lucide-react"
import { Footer } from "./footer"
import Image from "next/image"
import ButtonShapeTabs from "./ui/menu-tabs"
import { MobileMenu } from "./mobile-menu"
import { useUser } from "@/contexts/user-context"
import { useFirebase } from "./firebase-provider"
import { signOut } from "firebase/auth"
import { useRouter } from "next/navigation"

interface StaticPageLayoutProps {
  children: React.ReactNode
}

export function StaticPageLayout({ children }: StaticPageLayoutProps) {
  const { t } = useTranslations()
  const { userData, loading, initialized } = useUser()
  const { auth } = useFirebase()
  const router = useRouter()

  const handleLogout = async () => {
    try {
      if (auth) {
        await signOut(auth)
        router.push("/")
      }
    } catch (error) {
      console.error("Error signing out:", error)
    }
  }

  const mainTabs = [
    { text: "CONTACT", href: "/contact" },
    { text: "LEGAL", href: "/legal" },
    { text: "PRIVACY", href: "/privacy" },
    { text: "TERMS AND CONDITIONS", href: "/terms-and-conditions" },
    { text: "NEWSLETTER", href: "/newsletter" },
    { text: "FAQ", href: "/faq" },
  ]

  // Dynamically set auth-related tabs based on user state
  const extraTabs = [
    { text: "HOME", href: "/" },
    ...(initialized && !loading && !userData
      ? [{ text: "LOGIN", href: "/login" }]
      : [
          { text: "PROFILE", href: "/profile" },
          {
            text: "LOGOUT",
            href: "#",
            onClick: handleLogout,
          },
        ]),
    { text: "ABOUT US", href: "/about-us" },
    { text: "JOBS", href: "/jobs" },
  ]

  return (
    <main className="bg-mainBackgroundV1 min-h-screen">
      {/* Static Header */}
      <header className="w-full bg-mainDarkBackgroundV1">
        <div className="bg-transparent text-mainBackgroundV1 py-2 px-4 md:px-8 w-full">
          <div className="max-w-7xl mx-auto flex justify-between items-center">
            <div className="flex items-center text-sm w-fit gap-4">
              <Link href="/">
                <Image 
                  src="https://www.sportograf.com/images/sg-logo-new-no-text.png" 
                  alt="Logo" 
                  width={1000} 
                  height={1000} 
                  className="h-8 md:h-12 flex-shrink-0 w-auto" 
                  quality={100} 
                  draggable={false} 
                />
              </Link>
              <div className="hidden lg:block">
                <ButtonShapeTabs tabs={mainTabs} />
              </div>
            </div>
            <div className="flex items-center">
              <div className="hidden lg:flex space-x-4 items-center">
                <ButtonShapeTabs tabs={extraTabs} />
                <LanguageSwitcher />
                {initialized && !loading && userData && (
                  <Link href="/profile" className="flex items-center space-x-2 hover:text-gray-300">
                    {userData.profileImageUrl ? (
                      <Image
                        src={userData.profileImageUrl}
                        alt="Profile"
                        width={32}
                        height={32}
                        className="rounded-full"
                      />
                    ) : (
                      <User className="h-5 w-5" />
                    )}
                  </Link>
                )}
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
              <MobileMenu 
                mainTabs={mainTabs} 
                extraTabs={extraTabs} 
                userData={userData}
                onLogout={handleLogout}
              />
            </div>
          </div>
        </div>
      </header>
      <div className="flex-1">{children}</div>
      <Footer />
    </main>
  )
}
