"use client"

import Link from "next/link"
import Image from "next/image"
import { useTranslations } from "@/hooks/use-translations"
import { Facebook, Instagram, Twitter } from "lucide-react"

export function Footer() {
  const { t } = useTranslations()

  return (
    <footer className="bg-sportograf-navyblue text-gray-400">
      <div className="max-w-7xl mx-auto px-4">
        {/* Main Footer Content */}
        <div className="pt-12 pb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            {/* Navigation Links */}
            <div className="grid grid-cols-2 gap-8">
              <div>
                <nav className="flex flex-col space-y-4">
                  <Link href="/" className="hover:text-mainBackgroundV1 text-xs uppercase">
                    {t("home")}
                  </Link>
                  <Link href="https://helpdesk.sportograf.com/en/support/home" target="_blank" rel="noreferrer noopener" className="hover:text-mainBackgroundV1 text-xs uppercase">
                    {t("faq")}
                  </Link>
                  <Link href="https://blog.sportograf.com" target="_blank" rel="noreferrer noopener" className="hover:text-mainBackgroundV1 text-xs uppercase">
                    {t("blog")}
                  </Link>
                  <Link href="/newsletter" className="hover:text-mainBackgroundV1 text-xs uppercase">
                    {t("newsletter")}
                  </Link>
                  {/* <Link href="/jobs" className="hover:text-mainBackgroundV1 text-xs uppercase">
                    {t("jobs")}
                  </Link> */}
                  <Link href="/about" className="hover:text-mainBackgroundV1 text-xs uppercase">
                    {t("aboutUs")}
                  </Link>
                </nav>
              </div>
              <div>
                <nav className="flex flex-col space-y-4">
                  <Link href="/contact" className="hover:text-mainBackgroundV1 text-xs uppercase">
                    {t("contact")}
                  </Link>
                  <Link href="/legal" className="hover:text-mainBackgroundV1 text-xs uppercase">
                    {t("legal")}
                  </Link>
                  <Link href="/agb" className="hover:text-mainBackgroundV1 text-xs uppercase">
                    {t("termsAndConditions")}
                  </Link>
                  <Link href="/privacy" className="hover:text-mainBackgroundV1 text-xs uppercase">
                    {t("privacy")}
                  </Link>
                  <Link href="/cookies" className="hover:text-mainBackgroundV1 text-xs uppercase">
                    {t("cookies")}
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

        {/* Payment Methods Section */}
        <div className="border-t border-gray-600 py-6">
          <div className="text-center">
            <h3 className="text-sm font-semibold text-gray-300 mb-4 uppercase tracking-wide">
              {t("paymentMethods")} - {t("securePayments")}
            </h3>
            <div className="flex flex-wrap justify-center items-center gap-4 md:gap-6">
              {/* Visa */}
              <div className="bg-white rounded-md p-2 h-10 flex items-center justify-center min-w-[60px]">
                <Image
                  src="https://upload.wikimedia.org/wikipedia/commons/5/5e/Visa_Inc._logo.svg"
                  alt="Visa"
                  width={40}
                  height={24}
                  className="h-6 w-auto object-contain"
                />
              </div>
              
              {/* Mastercard */}
              <div className="bg-white rounded-md p-2 h-10 flex items-center justify-center min-w-[60px]">
                <Image
                  src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg"
                  alt="Mastercard"
                  width={40}
                  height={24}
                  className="h-6 w-auto object-contain"
                />
              </div>
              
              {/* PayPal */}
              <div className="bg-white rounded-md p-2 h-10 flex items-center justify-center min-w-[60px]">
                <Image
                  src="https://upload.wikimedia.org/wikipedia/commons/b/b5/PayPal.svg"
                  alt="PayPal"
                  width={60}
                  height={24}
                  className="h-6 w-auto object-contain"
                />
              </div>
              
              {/* American Express */}
              <div className="bg-white rounded-md p-2 h-10 flex items-center justify-center min-w-[60px]">
                <Image
                  src="https://upload.wikimedia.org/wikipedia/commons/f/fa/American_Express_logo_%282018%29.svg"
                  alt="American Express"
                  width={40}
                  height={24}
                  className="h-6 w-auto object-contain"
                />
              </div>
              
              {/* Apple Pay */}
              <div className="bg-white rounded-md p-2 h-10 flex items-center justify-center min-w-[60px]">
                <Image
                  src="https://upload.wikimedia.org/wikipedia/commons/b/b0/Apple_Pay_logo.svg"
                  alt="Apple Pay"
                  width={50}
                  height={24}
                  className="h-6 w-auto object-contain"
                />
              </div>
              
              {/* Google Pay */}
              <div className="bg-white rounded-md p-2 h-10 flex items-center justify-center min-w-[60px]">
                <Image
                  src="https://upload.wikimedia.org/wikipedia/commons/f/f2/Google_Pay_Logo.svg"
                  alt="Google Pay"
                  width={50}
                  height={24}
                  className="h-6 w-auto object-contain"
                />
              </div>
              
              {/* Stripe */}
              <div className="bg-white rounded-md p-2 h-10 flex items-center justify-center min-w-[60px]">
                <Image
                  src="https://upload.wikimedia.org/wikipedia/commons/b/ba/Stripe_Logo%2C_revised_2016.svg"
                  alt="Stripe"
                  width={50}
                  height={24}
                  className="h-6 w-auto object-contain"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
