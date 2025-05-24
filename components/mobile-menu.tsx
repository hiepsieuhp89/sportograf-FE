"use client"

import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { Menu } from "lucide-react"
import Link from "next/link"
import { LanguageSwitcher } from "./language-switcher"
import { Facebook, Instagram, Twitter } from "lucide-react"

interface MobileMenuProps {
  mainTabs: Array<{ text: string; href: string }>
  extraTabs: Array<{ text: string; href: string }>
}

export function MobileMenu({ mainTabs, extraTabs }: MobileMenuProps) {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="lg:hidden">
          <Menu className="h-6 w-6" />
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-[300px] sm:w-[400px]">
        <div className="flex flex-col h-full">
          <div className="flex-1 py-4">
            <div className="mb-8">
              {extraTabs.map((tab) => (
                <Link
                  key={tab.href}
                  href={tab.href}
                  className="block py-2 px-4 hover:bg-gray-100 rounded-lg"
                >
                  {tab.text}
                </Link>
              ))}
            </div>
            <div className="mb-8">
              {mainTabs.map((tab) => (
                <Link
                  key={tab.href}
                  href={tab.href}
                  className="block py-2 px-4 hover:bg-gray-100 rounded-lg"
                >
                  {tab.text}
                </Link>
              ))}
            </div>
          </div>
          <div className="border-t py-4">
            <div className="flex items-center justify-between px-4">
              <LanguageSwitcher />
              <div className="flex space-x-4">
                <Link href="https://facebook.com" aria-label="Facebook">
                  <Facebook className="h-5 w-5" />
                </Link>
                <Link href="https://instagram.com" aria-label="Instagram">
                  <Instagram className="h-5 w-5" />
                </Link>
                <Link href="https://twitter.com" aria-label="Twitter">
                  <Twitter className="h-5 w-5" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
} 