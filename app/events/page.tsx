"use client"

import { useState, useEffect } from "react"
import { collection, getDocs, query, orderBy } from "firebase/firestore"
import { db } from "@/lib/firebase"
import { StaticPageLayout } from "@/components/static-page-layout"
import { useTranslations } from "@/hooks/use-translations"
import { EventCard } from "@/components/home/event-card"
import { Skeleton } from "@/components/ui/skeleton"
import type { Event } from "@/lib/types"

export default function EventsPage() {
  const { t } = useTranslations()
  const [events, setEvents] = useState<Event[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")

  useEffect(() => {
    const fetchAllEvents = async () => {
      try {
        const eventsQuery = query(
          collection(db, "events"), 
          orderBy("date", "desc")
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

    fetchAllEvents()
  }, [])

  const filteredEvents = events.filter(event =>
    event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    event.location.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <StaticPageLayout>
      <div className="relative">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundSize: "cover",
            backgroundImage: "url('/images/events-bg.jpg')",
          }}
        ></div>
        <div className="absolute inset-0 bg-gradient-to-br from-mainDarkBackgroundV1/90 via-mainDarkBackgroundV1/80 to-black/70"></div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16" style={{ minHeight: "calc(100vh - 64px)" }}>
          {/* Header Section */}
          <div className="text-center mb-8 sm:mb-12">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4 drop-shadow-lg">
              {t("events").toUpperCase()}
            </h1>
            <p className="text-lg sm:text-xl text-white/90 mb-6 max-w-2xl mx-auto drop-shadow-md">
              {t("photographyForTheLoveOfSport")}
            </p>
            
            {/* Search Bar */}
            <div className="max-w-md mx-auto">
              <input
                type="text"
                placeholder={t("searchPlaceholder")}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-3 bg-white/95 backdrop-blur-sm border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-mainActiveV1 focus:border-transparent text-gray-800 placeholder-gray-500 shadow-lg"
              />
            </div>
          </div>

          {/* Events Grid */}
          <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 sm:p-8 border border-white/20 shadow-2xl">
            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {[...Array(12)].map((_, index) => (
                  <div key={index} className="rounded-lg overflow-hidden shadow-md bg-white/20 backdrop-blur-sm border border-white/10">
                    <div className="relative h-40 sm:h-48 bg-gray-200/50">
                      <Skeleton className="h-full w-full bg-gray-300/30" />
                    </div>
                    <div className="p-4">
                      <Skeleton className="h-4 w-20 mb-2 bg-gray-300/30" />
                      <Skeleton className="h-10 w-full mb-3 bg-gray-300/30" />
                      <Skeleton className="h-10 w-full rounded-sm bg-gray-300/30" />
                    </div>
                  </div>
                ))}
              </div>
            ) : filteredEvents.length > 0 ? (
              <>
                <div className="mb-6">
                  <p className="text-white/80 text-sm font-medium">
                    {filteredEvents.length} {filteredEvents.length === 1 ? t("eventFound") : t("eventsFound")}
                    {searchTerm && ` ${t("forSearchTerm")} "${searchTerm}"`}
                  </p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {filteredEvents.map((event) => (
                    <EventCard key={event.id} event={event} />
                  ))}
                </div>
              </>
            ) : (
              <div className="text-center py-12">
                <p className="text-white/70 text-lg mb-4">
                  {searchTerm ? `${t("noEventsFound")} "${searchTerm}"` : t("noEventsFound")}
                </p>
                {searchTerm && (
                  <button
                    onClick={() => setSearchTerm("")}
                    className="text-mainActiveV1 hover:text-white transition-colors duration-200 font-medium"
                  >
                    {t("clearSearch")}
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </StaticPageLayout>
  )
} 