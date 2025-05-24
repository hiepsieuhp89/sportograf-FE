import type React from "react"
import type { Metadata } from "next"
import { Inter, Montserrat } from "next/font/google"
import "./globals.css"
import { LanguageProvider } from "@/components/language-provider"
import { ThemeProvider } from "@/components/theme-provider"
import { FirebaseProvider } from "@/components/firebase-provider"
import { ClientOnly } from "@/components/client-only"

const inter = Inter({ subsets: ["latin"] })

// Add Montserrat font with extra bold weight
const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
  variable: "--font-montserrat",
})

export const metadata: Metadata = {
  title: "Sportograf - Photography for the love of sport",
  description: "Find your event photos from sports events around the world",
    generator: 'v0.dev'
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${montserrat.variable}`} suppressHydrationWarning>
      <body className={inter.className} suppressHydrationWarning>
        <ClientOnly>
          <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
            <FirebaseProvider>
              <LanguageProvider>{children}</LanguageProvider>
            </FirebaseProvider>
          </ThemeProvider>
        </ClientOnly>
      </body>
    </html>
  )
}
