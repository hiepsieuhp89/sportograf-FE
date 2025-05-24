"use client"

import Image from "next/image"
import { Calendar, MapPin, Clock, Tag as TagIcon, ExternalLink, Info } from "lucide-react"
import type { Event, EventType } from "@/lib/types"
import { useTranslations } from "@/hooks/use-translations"
import { RichTextPreview } from "@/components/ui/rich-text-preview"
import { Badge } from "@/components/ui/badge"
import { useEffect, useState } from "react"
import { doc, getDoc } from "firebase/firestore"
import { db } from "@/lib/firebase"

interface EventDetailProps {
    event: Event
}

export function EventDetail({ event }: EventDetailProps) {
    const { t } = useTranslations()
    const [eventType, setEventType] = useState<EventType | null>(null)

    useEffect(() => {
        const fetchEventType = async () => {
            if (!event.eventTypeId) return
            try {
                const eventTypeDoc = await getDoc(doc(db, "eventTypes", event.eventTypeId))
                if (eventTypeDoc.exists()) {
                    setEventType({ ...eventTypeDoc.data(), id: eventTypeDoc.id } as EventType)
                }
            } catch (error) {
                console.error("Error fetching event type:", error)
            }
        }

        fetchEventType()
    }, [event.eventTypeId])

    // Format date as DD/MM/YYYY
    const formatEventDate = (dateString: string) => {
        if (!dateString) return ""
        try {
            const date = new Date(dateString)
            return date.toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            })
        } catch (error) {
            return dateString
        }
    }

    // Format date for display with day name
    const formatEventDateLong = (dateString: string) => {
        if (!dateString) return ""
        try {
            const date = new Date(dateString)
            return date.toLocaleDateString('en-US', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            })
        } catch (error) {
            return dateString
        }
    }

    return (
        <div className="min-h-screen bg-white">
            {/* Header */}
            <div className="bg-[#F8FAFB] text-mainNavyText">
                <div className="max-w-7xl mx-auto">
                    <div className="flex flex-col sm:flex-row items-center justify-between w-full p-6">
                        <div className="flex flex-col sm:flex-row items-center flex-1 w-full sm:w-auto gap-6">
                            {/* Event Image */}
                            <div className="w-32 h-32 relative flex-shrink-0">
                                <Image
                                    src={event.imageUrl || ""}
                                    alt={event.title}
                                    fill
                                    className="object-contain"
                                    quality={100}
                                />
                            </div>

                            {/* Event Info */}
                            <div className="flex-1 space-y-4 text-center sm:text-left">
                                <div className="space-y-2">
                                    <h1 className="text-2xl sm:text-3xl font-semibold">
                                        {event.title}
                                    </h1>
                                    {eventType && (
                                        <Badge
                                            variant="secondary"
                                            style={{ backgroundColor: eventType.color }}
                                            className="text-white"
                                        >
                                            {eventType.name}
                                        </Badge>
                                    )}
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                                    <div className="flex items-center gap-2 justify-center sm:justify-start">
                                        <Calendar className="h-5 w-5 text-gray-500" />
                                        <div className="space-y-1">
                                            <p className="font-medium">Date</p>
                                            <p className="text-sm text-gray-600">
                                                {formatEventDate(event.date)}
                                                {event.endDate && ` - ${formatEventDate(event.endDate)}`}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-2 justify-center sm:justify-start">
                                        <Clock className="h-5 w-5 text-gray-500" />
                                        <div className="space-y-1">
                                            <p className="font-medium">Time</p>
                                            <p className="text-sm text-gray-600">{event.time || "TBA"}</p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-2 justify-center sm:justify-start">
                                        <MapPin className="h-5 w-5 text-gray-500" />
                                        <div className="space-y-1">
                                            <p className="font-medium">Location</p>
                                            <p className="text-sm text-gray-600">
                                                {event.location}
                                                {event.country && (
                                                    <span className="block text-gray-500">
                                                        {event.country}
                                                    </span>
                                                )}
                                            </p>
                                        </div>
                                    </div>

                                    {event.url && (
                                        <div className="flex items-center gap-2 justify-center sm:justify-start">
                                            <ExternalLink className="h-5 w-5 text-gray-500" />
                                            <div className="space-y-1">
                                                <p className="font-medium">Website</p>
                                                <a
                                                    href={event.url}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="text-sm text-blue-600 hover:underline"
                                                >
                                                    Visit Website
                                                </a>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-7xl mx-auto p-6 space-y-8">
                {/* Description */}
                {event.description && (
                    <div className="bg-white rounded-lg p-6 shadow-sm">
                        <RichTextPreview content={event.description} />
                    </div>
                )}

                {/* Best of Images */}
                {event.bestOfImageUrls && event.bestOfImageUrls.length > 0 && (
                    <div>
                        <h2 className="text-xl font-semibold mb-4">Best Photos</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {event.bestOfImageUrls.map((imageUrl, index) => (
                                <div key={index} className="relative aspect-video rounded-lg overflow-hidden shadow-md">
                                    <Image
                                        src={imageUrl}
                                        alt={`Best of ${index + 1}`}
                                        fill
                                        className="object-cover hover:scale-105 transition-transform duration-300"
                                    />
                                </div>
                            ))}
                        </div>
                    </div>
                )}
                {/* Tags */}
                {event.tags && event.tags.length > 0 && (
                    <div className="space-y-2 mt-12">
                        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                            <TagIcon className="h-5 w-5" />
                            Tags
                        </h2>
                        <div className="flex flex-wrap gap-2">
                            {event.tags.map((tag) => (
                                <Badge key={tag} variant="secondary">
                                    #{tag}
                                </Badge>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
} 