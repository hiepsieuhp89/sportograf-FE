"use client"

import { useTranslations } from "@/hooks/use-translations"
import { SearchBar } from "./search-bar"

export function HeroSection() {
  const { t } = useTranslations()

  return (
    <div
      className="relative h-[500px] bg-cover bg-center"
      style={{
        backgroundImage: "url('/images/hero-bg.png')",
        backgroundPosition: "center center",
      }}
    >
      <div className="absolute inset-0 bg-black bg-opacity-20">
        <div className="max-w-[1200px] mx-auto px-4 h-full flex flex-col justify-center items-start">
          <div className="mt-20">
            <h1 className="text-white text-5xl md:text-6xl font-bold mb-8 leading-tight">
              PHOTOGRAPHY
              <br />
              FOR THE LOVE OF SPORT
            </h1>
            <div className="w-full max-w-md">
              <SearchBar />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
