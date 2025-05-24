"use client"

import { useState, useEffect } from "react"
import { collection, getDocs, query, orderBy, limit } from "firebase/firestore"
import { db } from "@/lib/firebase"
import type { Event } from "@/lib/types"
import { useTranslations } from "@/hooks/use-translations"
import { Skeleton } from "@/components/ui/skeleton"
import { EventCard } from "./event-card"
import { useEventStore } from "@/lib/store"

export function EventGrid() {
  const [loading, setLoading] = useState(true)
  const { t } = useTranslations()
  const { events, setEvents } = useEventStore()

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const eventsQuery = query(
          collection(db, "events"), 
          orderBy("date", "desc"), 
          limit(24)
        )

        const snapshot = await getDocs(eventsQuery)
        const eventsList = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Event[]

        setEvents(eventsList)
      } catch (error) {
        console.error("Error fetching events:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchEvents()
  }, [setEvents])

  if (loading) {
    return (
      <div className="py-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 px-4 sm:px-6 lg:px-8">
          {[...Array(12)].map((_, index) => (
            <div key={index} className="rounded-lg overflow-hidden shadow-md bg-mainBackgroundV1 border border-gray-100">
              <div className="relative h-40 sm:h-48 bg-gray-100">
                <Skeleton className="h-full w-full" />
              </div>
              <div className="p-4">
                <Skeleton className="h-4 w-20 mb-2" />
                <Skeleton className="h-10 w-full mb-3" />
                <Skeleton className="h-10 w-full rounded-sm" />
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="py-12 sm:py-16 lg:py-20">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 px-4 sm:px-6 lg:px-8">
        {events.map((event) => (
          <EventCard key={event.id} event={event} />
        ))}
      </div>
      <div className="mt-8 text-center px-4">
        <button className="w-full sm:w-auto bg-mainActiveV1 text-sm font-montserrat font-medium h-10 uppercase hover:bg-gray-300 text-gray-800 py-2 px-6 rounded-none transition-colors">
          {t("loadMore")}
        </button>
      </div>
    </div>
  )
}
