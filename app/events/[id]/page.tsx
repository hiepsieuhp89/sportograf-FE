"use client"

import { useState, useEffect } from "react"
import { doc, getDoc } from "firebase/firestore"
import { db } from "@/lib/firebase"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { EventHeader } from "@/components/event-header"
import { EventOffers } from "@/components/event-offers"
import { PaymentMethods } from "@/components/payment-methods"
import type { Event } from "@/lib/types"

export default function EventPage({ params }: { params: { id: string } }) {
  const [event, setEvent] = useState<Event | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const eventDoc = await getDoc(doc(db, "events", params.id))
        if (eventDoc.exists()) {
          setEvent({ id: eventDoc.id, ...eventDoc.data() } as Event)
        } else {
          setError("Event not found")
        }
      } catch (error) {
        console.error("Error fetching event:", error)
        setError("Failed to load event data")
      } finally {
        setLoading(false)
      }
    }

    fetchEvent()
  }, [params.id])

  return (
    <main>
      <Header />
      <div className="container mx-auto px-4 py-8">
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : error ? (
          <div className="bg-red-100 text-red-700 p-4 rounded-md">{error}</div>
        ) : event ? (
          <div>
            <EventHeader event={event} />
            <EventOffers />
            <PaymentMethods />
          </div>
        ) : null}
      </div>
      <Footer />
    </main>
  )
}
