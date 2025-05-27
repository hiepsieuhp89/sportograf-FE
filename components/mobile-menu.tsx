"use client"

import { useState } from "react"
import { Menu, X, User } from "lucide-react"
import Link from "next/link"
import { LanguageSwitcher } from "./language-switcher"
import { UserData } from "@/contexts/user-context"
import Image from "next/image"

interface Tab {
  text: string
  href: string
  onClick?: () => void
}

interface MobileMenuProps {
  mainTabs: Tab[]
  extraTabs: Tab[]
  userData: UserData | null
  onLogout: () => void
}

export function MobileMenu({ mainTabs, extraTabs, userData, onLogout }: MobileMenuProps) {
  const [isOpen, setIsOpen] = useState(false)

  const toggleMenu = () => {
    setIsOpen(!isOpen)
  }

  const handleTabClick = (tab: Tab) => {
    if (tab.onClick) {
      tab.onClick()
    }
    setIsOpen(false)
  }

  return (
    <div className="lg:hidden">
      <button
        onClick={toggleMenu}
        className="p-2 text-mainBackgroundV1 hover:text-gray-300"
        aria-label="Toggle menu"
      >
        {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 bg-mainDarkBackgroundV1">
          <div className="flex flex-col h-full">
            <div className="flex justify-between items-center p-4">
              {userData && (
                <div className="flex items-center space-x-3">
                  {userData.profileImageUrl ? (
                    <Image
                      src={userData.profileImageUrl}
                      alt="Profile"
                      width={40}
                      height={40}
                      className="rounded-full"
                    />
                  ) : (
                    <User className="h-8 w-8 text-mainBackgroundV1" />
                  )}
                  <span className="text-mainBackgroundV1">{userData.name || userData.email}</span>
                </div>
              )}
              <button
                onClick={toggleMenu}
                className="p-2 text-mainBackgroundV1 hover:text-gray-300"
                aria-label="Close menu"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto">
              <nav className="px-4 py-2">
                {mainTabs.map((tab) => (
                  <Link
                    key={tab.text}
                    href={tab.href}
                    onClick={() => handleTabClick(tab)}
                    className="block py-2 text-mainBackgroundV1 hover:text-gray-300"
                  >
                    {tab.text}
                  </Link>
                ))}
                <div className="border-t border-gray-700 my-4"></div>
                {extraTabs.map((tab) => (
                  <Link
                    key={tab.text}
                    href={tab.href}
                    onClick={() => handleTabClick(tab)}
                    className="block py-2 text-mainBackgroundV1 hover:text-gray-300"
                  >
                    {tab.text}
                  </Link>
                ))}
              </nav>
            </div>

            <div className="p-4 border-t border-gray-700">
              <LanguageSwitcher />
            </div>
          </div>
        </div>
      )}
    </div>
  )
} 