"use client"

import Link from "next/link"
import Image from "next/image"
import { useTranslations } from "@/hooks/use-translations"
import type { Event } from "@/lib/types"
import { Calendar } from "lucide-react"

interface EventCardProps {
  event: Event
}

export function EventCard({ event }: EventCardProps) {
  const { t } = useTranslations()

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

  return (
    <div className="group relative overflow-hidden rounded-lg shadow-md transition-all duration-300 hover:shadow-xl bg-white border border-gray-100">
      {/* Image container with overlay effect */}
      <div className="relative h-40 overflow-hidden bg-gray-100">
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10"></div>
        <Image
          src={event.imageUrl || "/placeholder.svg?height=160&width=300"}
          alt={event.title}
          fill
          className="object-contain p-4 transition-transform duration-500 group-hover:scale-110"
        />
      </div>

      {/* Content */}
      <div className="p-4">
        <div className="flex items-center text-xs text-gray-500 mb-2">
          <Calendar className="h-3 w-3 mr-1" />
          <span>{formatEventDate(event.date)}</span>
        </div>

        <h3 className="font-semibold text-sm mb-3 line-clamp-2 h-10 text-gray-800 group-hover:text-blue-600 transition-colors">
          {event.title}
        </h3>

        <Link
          href={`/events/${event.id}`}
          className="block w-full bg-white text-blue-600 py-2 px-4 text-sm font-semibold border border-blue-600 rounded-md hover:bg-blue-600 hover:text-white transition-all duration-300 uppercase text-center"
        >
          {t("showPhotos")}
        </Link>
      </div>

      {/* Hover effect overlay */}
      <div className="absolute inset-0 bg-blue-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
    </div>
  )
}
