"use client"

import { useTranslations } from "@/hooks/use-translations"
import type { Event } from "@/lib/types"
import { MapPin, Calendar, LinkIcon, Star } from "lucide-react"
import Image from "next/image"

interface EventHeaderProps {
  event: Event
}

export function EventHeader({ event }: EventHeaderProps) {
  const { t } = useTranslations()

  return (
    <div className="bg-mainBackgroundV1 p-6 rounded-sm shadow-sm">
      <div className="flex flex-col md:flex-row items-center gap-6">
        <div className="w-24 h-24 flex-shrink-0">
          <Image
            src={event.imageUrl || "/placeholder.svg?height=96&width=96"}
            alt={event.title}
            width={96}
            height={96}
            className="w-full h-full object-contain"
          />
        </div>
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-[#0f1923] uppercase mb-2">{event.title}</h1>
          <div className="flex flex-wrap gap-4 text-sm text-gray-600">
            {event.location && (
              <div className="flex items-center gap-1">
                <MapPin className="w-4 h-4" />
                <span>{event.location}</span>
              </div>
            )}
            {event.date && (
              <div className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                <span>{event.date}</span>
              </div>
            )}
            {event.url && (
              <div className="flex items-center gap-1">
                <LinkIcon className="w-4 h-4" />
                <a href={event.url} target="_blank" rel="noopener noreferrer" className="text-mainNavyText hover:underline">
                  {new URL(event.url).hostname}
                </a>
              </div>
            )}
          </div>
        </div>
        <div className="flex-shrink-0">
          <button className="flex items-center gap-1 bg-mainNavyText text-mainBackgroundV1 px-4 py-2 rounded-sm hover:bg-blue-700 transition-colors">
            <Star className="w-4 h-4" />
            <span>See Best of</span>
          </button>
        </div>
      </div>
    </div>
  )
}
