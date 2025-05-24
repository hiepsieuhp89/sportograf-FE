"use client"

import React, { useEffect, useState } from "react"
import { db } from "@/lib/firebase"
import { PhotosNotReady } from "@/components/photos-not-ready"
import { EventDetail } from "@/components/event-detail"
import { StaticPageLayout } from "@/components/static-page-layout"
import type { Event } from "@/lib/types"
import { doc, getDoc } from "firebase/firestore"

export default function EventPage({ params }: { params: { id: string } }) {
  const [event, setEvent] = useState<Event | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const eventDoc = await getDoc(doc(db, "events", params.id))
        if (!eventDoc.exists()) {
          setError("Event not found")
          return
        }

        const eventData = { 
          id: eventDoc.id, 
          ...eventDoc.data() 
        } as Event
        
        setEvent(eventData)
      } catch (error) {
        console.error("Error fetching event:", error)
        setError("Failed to load event details")
      } finally {
        setLoading(false)
      }
    }

    fetchEvent()
  }, [params.id])

  const isEventNotStarted = (event: Event) => {
    // Parse event date and time
    const [hours, minutes] = event.time.split(":").map(Number)
    const eventDateTime = new Date(event.date)
    eventDateTime.setHours(hours, minutes, 0, 0)

    // Get current date and time
    const now = new Date()

    console.log("eventDateTime", eventDateTime)
    console.log("now", now)
    return eventDateTime > now
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
        <div className="bg-red-100 text-red-700 p-4 rounded-sm">
          {error || "Event not found"}
        </div>
      </StaticPageLayout>
    )
  }

  console.log("event", event)
  console.log("isEventNotStarted", isEventNotStarted(event))
  return (
    <StaticPageLayout>
      {isEventNotStarted(event) ? (
        <PhotosNotReady event={event} />
      ) : (
        <EventDetail event={event} />
      )}
    </StaticPageLayout>
  )
}
