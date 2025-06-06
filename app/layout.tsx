"use client"

import type React from "react"
import { Inter, Montserrat } from "next/font/google"
import "./globals.css"
import "@fortawesome/fontawesome-svg-core/styles.css"
import "flag-icons/css/flag-icons.min.css"
import { LanguageProvider } from "@/components/language-provider"
import { ThemeProvider } from "@/components/theme-provider"
import { FirebaseProvider } from "@/components/firebase-provider"
import { ClientOnly } from "@/components/client-only"
import { UserProvider } from "@/contexts/user-context"

const inter = Inter({ subsets: ["latin"] })

// Add Montserrat font with extra bold weight
const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
  variable: "--font-montserrat",
})

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${montserrat.variable}`} suppressHydrationWarning>
      <body className={inter.className} suppressHydrationWarning>
        <ClientOnly>
          <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
            <FirebaseProvider>
              <UserProvider>
                <LanguageProvider>{children}</LanguageProvider>
              </UserProvider>
            </FirebaseProvider>
          </ThemeProvider>
        </ClientOnly>
      </body>
    </html>
  )
}
