"use client"

import React, { useEffect, useState } from "react"
import { db } from "@/lib/firebase"
import { PhotosNotReady } from "@/components/photos-not-ready"
import { EventDetail } from "@/components/event-detail"
import { StaticPageLayout } from "@/components/static-page-layout"
import { useEventStore } from "@/lib/store"
import type { Event } from "@/lib/types"
import { doc, getDoc } from "firebase/firestore"

export default function EventPage({ params }: { params: { id: string } }) {
  const [event, setEvent] = useState<Event | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const { selectedEvent, getEventById } = useEventStore()

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        // First try to get from store
        if (selectedEvent && selectedEvent.id === params.id) {
          setEvent(selectedEvent)
          setLoading(false)
          return
        }

        const storeEvent = getEventById(params.id)
        if (storeEvent) {
          setEvent(storeEvent)
          setLoading(false)
          return
        }

        // If not in store, fetch from Firestore
        const eventDoc = await getDoc(doc(db, "events", params.id))
        if (!eventDoc.exists()) {
          setError("Event not found")
          setLoading(false)
          return
        }

        const eventData = { id: eventDoc.id, ...eventDoc.data() } as Event
        setEvent(eventData)
      } catch (error) {
        console.error("Error fetching event:", error)
        setError("Failed to load event details")
      } finally {
        setLoading(false)
      }
    }

    fetchEvent()
  }, [params.id, selectedEvent, getEventById])

  const isEventCompleted = (event: Event) => {
    const eventDate = new Date(event.date)
    const today = new Date()
    return eventDate < today
  }

  if (loading) {
    return (
      <StaticPageLayout>
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-mainNavyText"></div>
        </div>
      </StaticPageLayout>
    )
  }

  if (error || !event) {
    return (
      <StaticPageLayout>
        <div className="bg-red-100 text-red-700 p-4 rounded-sm">{error || "Event not found"}</div>
      </StaticPageLayout>
    )
  }

  return (
    <StaticPageLayout>
      {isEventCompleted(event) ? (
        <EventDetail event={event} />
      ) : (
        <PhotosNotReady event={event} />
      )}
    </StaticPageLayout>
  )
}
