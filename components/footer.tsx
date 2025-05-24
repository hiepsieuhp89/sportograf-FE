"use client"

import Link from "next/link"
import Image from "next/image"
import { useTranslations } from "@/hooks/use-translations"
import { Facebook, Instagram, Twitter } from "lucide-react"

export function Footer() {
  const { t } = useTranslations()

  return (
    <footer className="bg-sportograf-navyblue text-gray-400 pt-12 pb-6">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          {/* Navigation Links */}
          <div className="grid grid-cols-2 gap-8">
            <div>
              <nav className="flex flex-col space-y-4">
                <Link href="/" className="hover:text-mainBackgroundV1 text-xs uppercase">
                  Home
                </Link>
                <Link href="https://helpdesk.sportograf.com/en/support/home" target="_blank" rel="noreferrer noopener" className="hover:text-mainBackgroundV1 text-xs uppercase">
                  FAQ
                </Link>
                <Link href="https://blog.sportograf.com" target="_blank" rel="noreferrer noopener" className="hover:text-mainBackgroundV1 text-xs uppercase">
                  Blog
                </Link>
                <Link href="/newsletter" className="hover:text-mainBackgroundV1 text-xs uppercase">
                  Newsletter
                </Link>
                <Link href="/jobs" className="hover:text-mainBackgroundV1 text-xs uppercase">
                  Jobs
                </Link>
                <Link href="/about" className="hover:text-mainBackgroundV1 text-xs uppercase">
                  About Us
                </Link>
              </nav>
            </div>
            <div>
              <nav className="flex flex-col space-y-4">
                <Link href="/contact" className="hover:text-mainBackgroundV1 text-xs uppercase">
                  Contact
                </Link>
                <Link href="/legal" className="hover:text-mainBackgroundV1 text-xs uppercase">
                  Legal
                </Link>
                <Link href="/agb" className="hover:text-mainBackgroundV1 text-xs uppercase">
                  Terms and Conditions
                </Link>
                <Link href="/privacy" className="hover:text-mainBackgroundV1 text-xs uppercase">
                  Privacy
                </Link>
                <Link href="/cookies" className="hover:text-mainBackgroundV1 text-xs uppercase">
                  Cookies
                </Link>
              </nav>
            </div>
          </div>

          {/* Social Media */}
          <div className="flex justify-end">
            <div className="flex space-x-4">
              <Link href="https://www.instagram.com/sportograf/" aria-label="Instagram" className="hover:text-mainBackgroundV1">
                <Instagram className="h-6 w-6" />
              </Link>
              <Link href="https://www.facebook.com/sportograf/" aria-label="Facebook" className="hover:text-mainBackgroundV1">
                <Facebook className="h-6 w-6" />
              </Link>
              <Link href="https://twitter.com/sportograf" aria-label="Twitter" className="hover:text-mainBackgroundV1">
                <Twitter className="h-6 w-6" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
