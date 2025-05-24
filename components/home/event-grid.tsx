"use client"

import { useState, useEffect } from "react"
import { collection, getDocs, query, orderBy, limit } from "firebase/firestore"
import { db } from "@/lib/firebase"
import type { Event } from "@/lib/types"
import { useTranslations } from "@/hooks/use-translations"
// Add this import at the top
import { Skeleton } from "@/components/ui/skeleton"
import { EventCard } from "./event-card"

export function EventGrid() {
  const [events, setEvents] = useState<Event[]>([])
  const [loading, setLoading] = useState(true)
  const { t } = useTranslations()

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const eventsQuery = query(collection(db , "events"), orderBy("date", "desc"), limit(24))

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
  }, [])

  if (loading) {
    return (
      <div className="py-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[...Array(12)].map((_, index) => (
            <div key={index} className="rounded-lg overflow-hidden shadow-md bg-mainBackgroundV1 border border-gray-100">
              <div className="relative h-40 bg-gray-100">
                <Skeleton className="h-full w-full" />
              </div>
              <div className="p-4">
                <Skeleton className="h-4 w-20 mb-2" />
                <Skeleton className="h-10 w-full mb-3" />
                <Skeleton className="h-10 w-full rounded-md" />
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  const placeholderEvents = [
    {
      id: "15000",
      title: "HYROX Bangkok 2025",
      date: "2025-05-24",
      imageUrl: "https://www.sportograf.com/logos/15000.jpeg",
      description: "",
      bestOfImageUrl: "",
      location: "Bangkok, Thailand",
      time: "",
      photographerIds: [],
    },
    {
      id: "13506",
      title: "Runaway Noosa Marathon & Swim Noosa 2025",
      date: "2025-05-24",
      imageUrl: "https://www.sportograf.com/logos/13506.jpg",
      description: "",
      bestOfImageUrl: "",
      location: "Noosa, Australia",
      time: "",
      photographerIds: [],
    },
    {
      id: "15540",
      title: "IRONMAN 70.3 Shanghai Chongming 2025",
      date: "2025-05-25",
      imageUrl: "https://www.sportograf.com/logos/15540.png",
      description: "",
      bestOfImageUrl: "",
      location: "Shanghai, China",
      time: "",
      photographerIds: [],
    },
    {
      id: "13954",
      title: "IRONMAN 70.3 Kraichgau 2025",
      date: "2025-05-25",
      imageUrl: "https://www.sportograf.com/logos/13954.png",
      description: "",
      bestOfImageUrl: "",
      location: "Kraichgau, Germany",
      time: "",
      photographerIds: [],
    },
    {
      id: "13960",
      title: "5150 Kraichgau 2025",
      date: "2025-05-25",
      imageUrl: "https://www.sportograf.com/logos/13960.jpg",
      description: "",
      bestOfImageUrl: "",
      location: "Kraichgau, Germany",
      time: "",
      photographerIds: [],
    },
    {
      id: "14187",
      title: "IRONMAN 70.3 Desaru Coast 2025",
      date: "2025-05-25",
      imageUrl: "https://www.sportograf.com/logos/14187.png",
      description: "",
      bestOfImageUrl: "",
      location: "Desaru Coast, Malaysia",
      time: "",
      photographerIds: [],
    },
    {
      id: "14220",
      title: "5150 Desaru Coast 2025",
      date: "2025-05-24",
      imageUrl: "https://www.sportograf.com/logos/14220.jpg",
      description: "",
      bestOfImageUrl: "",
      location: "Desaru Coast, Malaysia",
      time: "",
      photographerIds: [],
    },
    {
      id: "13791",
      title: "Desaru Coast Sprint Triathlon 2025",
      date: "2025-05-24",
      imageUrl: "https://www.sportograf.com/logos/13791.png",
      description: "",
      bestOfImageUrl: "",
      location: "Desaru Coast, Malaysia",
      time: "",
      photographerIds: [],
    },
    {
      id: "13588",
      title: "XLETIX Challenge BERLIN 2025 presented by MaxiNutrition",
      date: "2025-05-24",
      imageUrl: "https://www.sportograf.com/logos/13588.png",
      description: "",
      bestOfImageUrl: "",
      location: "Berlin, Germany",
      time: "",
      photographerIds: [],
    },
    {
      id: "14010",
      title: "schauinsland Muddy Angel Run OFFENBACH 2025",
      date: "2025-05-24",
      imageUrl: "https://www.sportograf.com/logos/14010.gif",
      description: "",
      bestOfImageUrl: "",
      location: "Offenbach, Germany",
      time: "",
      photographerIds: [],
    },
    {
      id: "14188",
      title: "XLETIX Kids OFFENBACH 2025",
      date: "2025-05-25",
      imageUrl: "https://www.sportograf.com/logos/14188.jpg",
      description: "",
      bestOfImageUrl: "",
      location: "Offenbach, Germany",
      time: "",
      photographerIds: [],
    },
    {
      id: "13969",
      title: "Mountain Ultra-Trail by UTMB 2025",
      date: "2025-05-23",
      imageUrl: "https://www.sportograf.com/logos/13969.png",
      description: "",
      bestOfImageUrl: "",
      location: "Mountain, USA",
      time: "",
      photographerIds: [],
    },
  ]

  const displayEvents = events.length > 0 ? events : placeholderEvents

  return (
    <div className="py-8">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {displayEvents.map((event) => (
          <EventCard key={event.id} event={event} />
        ))}
      </div>
      <div className="mt-8 text-center">
        <button className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-2 px-6 rounded-md transition-colors">
          {t("loadMore")}
        </button>
      </div>
    </div>
  )
}
