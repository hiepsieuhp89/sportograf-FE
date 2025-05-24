"use client"

import Link from "next/link"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { useTranslations } from "@/hooks/use-translations"
import type { Event } from "@/lib/types"
import { Calendar } from "lucide-react"
import { useEventStore } from "@/lib/store"

interface EventCardProps {
  event: Event
}

export function EventCard({ event }: EventCardProps) {
  const { t } = useTranslations()
  const router = useRouter()
  const { setSelectedEvent } = useEventStore()

  // Format date as DD/MM/YYYY
  const formatEventDate = (dateString: string) => {
    if (!dateString) return ""

    try {
      const date = new Date(dateString)
      return `${date.getDate().toString().padStart(2, "0")}/${(date.getMonth() + 1).toString().padStart(2, "0")}/${date.getFullYear()}`
    } catch (error) {
      return dateString
    }
  }

  const handleEventClick = () => {
    setSelectedEvent(event)
    router.push(`/events/${event.id}`)
  }

  return (
    <div className="group relative overflow-hidden rounded-lg shadow-md transition-all duration-300 hover:shadow-xl bg-white border-[2px] border-gray-50 hover:border-mainDarkBackgroundV1 cursor-pointer">
      {/* Image container with overlay effect */}
      <div className="relative h-40 overflow-hidden bg-gray-100">
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10"></div>
        <Image
          src={event.imageUrl || ""}
          alt={event.title}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-110"
        />
      </div>

      {/* Content */}
      <div className="p-4">
        <div className="flex items-center text-xs text-gray-500 mb-2">
          <Calendar className="h-3 w-3 mr-1" />
          <span>{formatEventDate(event.date)}</span>
        </div>

        <h3 className="font-semibold text-sm mb-3 line-clamp-2 h-10 text-gray-800 group-hover:text-mainNavyText transition-colors">
          {event.title}
        </h3>

        <button
          onClick={handleEventClick}
          className="block w-full py-2 px-4 text-sm font-medium border bg-mainDarkBackgroundV1 text-mainActiveV1 hover:text-mainBackgroundV1 transition-all duration-300 uppercase text-center h-10"
        >
          {t("showPhotos")}
        </button>
      </div>

      {/* Hover effect overlay */}
      <div className="absolute inset-0 bg-mainNavyText/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
    </div>
  )
}
