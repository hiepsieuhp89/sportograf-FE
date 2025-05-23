"use client"

import Image from "next/image"

export function PaymentMethods() {
  return (
    <div className="mt-8 flex flex-wrap justify-center gap-4">
      <Image src="/placeholder.svg?height=40&width=60" alt="SEPA" width={60} height={40} />
      <Image src="/placeholder.svg?height=40&width=60" alt="Visa" width={60} height={40} />
      <Image src="/placeholder.svg?height=40&width=60" alt="Mastercard" width={60} height={40} />
      <Image src="/placeholder.svg?height=40&width=60" alt="PayPal" width={60} height={40} />
      <Image src="/placeholder.svg?height=40&width=60" alt="Klarna" width={60} height={40} />
      <Image src="/placeholder.svg?height=40&width=60" alt="iDEAL" width={60} height={40} />
      <Image src="/placeholder.svg?height=40&width=60" alt="Sofort" width={60} height={40} />
      <Image src="/placeholder.svg?height=40&width=60" alt="Giropay" width={60} height={40} />
      <Image src="/placeholder.svg?height=40&width=60" alt="Apple Pay" width={60} height={40} />
    </div>
  )
}
