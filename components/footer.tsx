"use client"

import Link from "next/link"
import Image from "next/image"
import { useTranslations } from "@/hooks/use-translations"
import { Facebook, Instagram, Twitter } from "lucide-react"

export function Footer() {
  const { t } = useTranslations()

  return (
    <footer className="bg-sportograf-navyblue text-gray-400 pt-12 pb-6">
      <div className="max-w-[1200px] mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {/* Payment Methods */}
          <div className="flex flex-col">
            <div className="grid grid-cols-4 gap-3 mb-6">
              <Image
                src="/placeholder.svg?height=30&width=50"
                alt="PayPal"
                width={50}
                height={30}
                className="bg-white p-1 rounded"
              />
              <Image
                src="/placeholder.svg?height=30&width=50"
                alt="Visa"
                width={50}
                height={30}
                className="bg-white p-1 rounded"
              />
              <Image
                src="/placeholder.svg?height=30&width=50"
                alt="Mastercard"
                width={50}
                height={30}
                className="bg-white p-1 rounded"
              />
              <Image
                src="/placeholder.svg?height=30&width=50"
                alt="Maestro"
                width={50}
                height={30}
                className="bg-white p-1 rounded"
              />
              <Image
                src="/placeholder.svg?height=30&width=50"
                alt="American Express"
                width={50}
                height={30}
                className="bg-white p-1 rounded"
              />
              <Image
                src="/placeholder.svg?height=30&width=50"
                alt="Apple Pay"
                width={50}
                height={30}
                className="bg-white p-1 rounded"
              />
              <Image
                src="/placeholder.svg?height=30&width=50"
                alt="Google Pay"
                width={50}
                height={30}
                className="bg-white p-1 rounded"
              />
              <Image
                src="/placeholder.svg?height=30&width=50"
                alt="Klarna"
                width={50}
                height={30}
                className="bg-white p-1 rounded"
              />
            </div>
          </div>

          {/* Navigation Links */}
          <div className="grid grid-cols-2 gap-8">
            <div>
              <nav className="flex flex-col space-y-3">
                <Link href="/" className="hover:text-white text-xs uppercase">
                  HOME
                </Link>
                <Link href="/faq" className="hover:text-white text-xs uppercase">
                  FAQ
                </Link>
                <Link href="/blog" className="hover:text-white text-xs uppercase">
                  BLOG
                </Link>
                <Link href="/newsletter" className="hover:text-white text-xs uppercase">
                  NEWSLETTER
                </Link>
                <Link href="/jobs" className="hover:text-white text-xs uppercase">
                  JOBS
                </Link>
                <Link href="/about-us" className="hover:text-white text-xs uppercase">
                  ABOUT US
                </Link>
              </nav>
            </div>
            <div>
              <nav className="flex flex-col space-y-3">
                <Link href="/contact" className="hover:text-white text-xs uppercase">
                  CONTACT
                </Link>
                <Link href="/legal" className="hover:text-white text-xs uppercase">
                  LEGAL
                </Link>
                <Link href="/terms-and-conditions" className="hover:text-white text-xs uppercase">
                  TERMS AND CONDITIONS
                </Link>
                <Link href="/privacy" className="hover:text-white text-xs uppercase">
                  PRIVACY
                </Link>
                <Link href="/cookies" className="hover:text-white text-xs uppercase">
                  COOKIES
                </Link>
              </nav>
            </div>
          </div>

          {/* Social Media */}
          <div className="flex justify-end">
            <div className="flex space-x-4">
              <Link href="https://instagram.com" aria-label="Instagram" className="hover:text-white">
                <Instagram className="h-6 w-6" />
              </Link>
              <Link href="https://facebook.com" aria-label="Facebook" className="hover:text-white">
                <Facebook className="h-6 w-6" />
              </Link>
              <Link href="https://twitter.com" aria-label="Twitter" className="hover:text-white">
                <Twitter className="h-6 w-6" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
