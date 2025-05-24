"use client"

import { useEffect, useState } from "react"
import Image from "next/image"

export function SponsorSlider() {
  const [currentSlide, setCurrentSlide] = useState(0)

  const sponsors = [
    { name: "Sponsor 1", logo: "/placeholder.svg?height=60&width=120" },
    { name: "Sponsor 2", logo: "/placeholder.svg?height=60&width=120" },
    { name: "Sponsor 3", logo: "/placeholder.svg?height=60&width=120" },
    { name: "Sponsor 4", logo: "/placeholder.svg?height=60&width=120" },
    { name: "Sponsor 5", logo: "/placeholder.svg?height=60&width=120" },
    { name: "Sponsor 6", logo: "/placeholder.svg?height=60&width=120" },
  ]

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % Math.ceil(sponsors.length / 4))
    }, 3000)

    return () => clearInterval(timer)
  }, [sponsors.length])

  return (
    <div className="bg-mainBackgroundV1 py-6 border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4">
        <div className="overflow-hidden">
          <div
            className="flex transition-transform duration-500 ease-in-out"
            style={{ transform: `translateX(-${currentSlide * 100}%)` }}
          >
            {Array.from({ length: Math.ceil(sponsors.length / 4) }).map((_, slideIndex) => (
              <div key={slideIndex} className="w-full flex-shrink-0">
                <div className="grid grid-cols-4 gap-8">
                  {sponsors.slice(slideIndex * 4, slideIndex * 4 + 4).map((sponsor, index) => (
                    <div key={index} className="flex justify-center items-center">
                      <Image
                        src={sponsor.logo || "/placeholder.svg"}
                        alt={sponsor.name}
                        width={120}
                        height={60}
                        className="object-contain opacity-70 hover:opacity-100 transition-opacity"
                      />
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
