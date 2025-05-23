"use client"

import Image from "next/image"

export function SponsorLogos() {
  return (
    <div className="py-6">
      <div className="grid grid-cols-4 gap-4">
        <div className="flex justify-center">
          <Image
            src="/placeholder.svg?height=60&width=120"
            alt="Sponsor 1"
            width={120}
            height={60}
            className="object-contain"
          />
        </div>
        <div className="flex justify-center">
          <Image
            src="/placeholder.svg?height=60&width=120"
            alt="Sponsor 2"
            width={120}
            height={60}
            className="object-contain"
          />
        </div>
        <div className="flex justify-center">
          <Image
            src="/placeholder.svg?height=60&width=120"
            alt="Sponsor 3"
            width={120}
            height={60}
            className="object-contain"
          />
        </div>
        <div className="flex justify-center">
          <Image
            src="/placeholder.svg?height=60&width=120"
            alt="Sponsor 4"
            width={120}
            height={60}
            className="object-contain"
          />
        </div>
      </div>
    </div>
  )
}
