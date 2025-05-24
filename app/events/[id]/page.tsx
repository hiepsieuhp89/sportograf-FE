"use client"

import React, { useState, useEffect } from "react"
import { doc, getDoc } from "firebase/firestore"
// import { db } from "@/lib/firebase"
import { PhotosNotReady } from "@/components/photos-not-ready"
import type { Event } from "@/lib/types"
import { useEventStore } from "@/lib/store"
import { StaticPageLayout } from "@/components/static-page-layout"

export default function EventPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = React.use(params)
  const [event, setEvent] = useState<Event | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const { selectedEvent, getEventById } = useEventStore()

  useEffect(() => {
    if (selectedEvent && selectedEvent.id === id) {
      setEvent(selectedEvent)
      setLoading(false)
      return
    }

    const foundEvent = getEventById(id)
    if (foundEvent) {
      setEvent(foundEvent)
      setLoading(false)
    } else {
      setError("Event not found")
      setLoading(false)
    }
  }, [id, selectedEvent, getEventById])

  return (
    <StaticPageLayout>
      {loading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-mainNavyText"></div>
        </div>
      ) : error ? (
        <div className="bg-red-100 text-red-700 p-4 rounded-sm">{error}</div>
      ) : event ? (
        <PhotosNotReady event={event} />
      ) : null}
    </StaticPageLayout>
  )
}
