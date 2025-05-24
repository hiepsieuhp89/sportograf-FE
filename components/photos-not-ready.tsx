import Image from "next/image"
import { Calendar, MapPin, ExternalLink, Clock, Tag as TagIcon, Info } from "lucide-react"
import type { Event, EventType } from "@/lib/types"
import { Badge } from "@/components/ui/badge"
import { RichTextPreview } from "@/components/ui/rich-text-preview"
import { useEffect, useState } from "react"
import { doc, getDoc } from "firebase/firestore"
import { db } from "@/lib/firebase"

interface PhotosNotReadyProps {
    event: Event
}

export function PhotosNotReady({ event }: PhotosNotReadyProps) {
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

    return (
        <div className="min-h-screen bg-white">
            {/* Header */}
            <div className="bg-[#F8FAFB] text-mainNavyText">
                <div className="max-w-7xl mx-auto">
                    <div className="flex flex-col sm:flex-row items-center justify-between w-full p-6">
                        <div className="flex flex-col sm:flex-row items-center flex-1 w-full sm:w-auto gap-6">
                            {/* Event Image */}
                            <div className="w-44 h-44 relative flex-shrink-0">
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
            </div>

            {/* Not Ready Message */}
            <div className="flex-1 flex items-center justify-center pt-12">
                <div className="text-center max-w-md mx-auto px-4 sm:px-0 pt-4 w-full sm:w-[470px]">
                    {/* Loading Icon */}
                    <div className="mb-8 flex justify-center">
                        <div className="relative w-24 h-24">
                            <div className="absolute inset-0 border-4 border-gray-200 rounded-full"></div>
                            <div className="absolute inset-0 border-4 border-transparent border-t-mainNavyText rounded-full animate-spin"></div>
                            <div className="absolute inset-4 flex items-center justify-center">
                                <div className="grid grid-cols-2 gap-1">
                                    <div className="w-3 h-3 bg-mainNavyText rounded-sm"></div>
                                    <div className="w-3 h-3 bg-gray-300 rounded-sm"></div>
                                    <div className="w-3 h-3 bg-gray-300 rounded-sm"></div>
                                    <div className="w-3 h-3 bg-mainNavyText rounded-sm"></div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Message */}
                    <h2 className="text-3xl text-mainNavyText mb-6 tracking-wide">
                        WE ARE ON IT!
                    </h2>
                    <p className="text-mainNavyText text-sm mb-2">
                        The photos are not online yet.
                    </p>
                    <p className="text-mainNavyText mb-8 text-sm">
                        Get a notification as soon as your pictures are online.
                    </p>
                    <button className="bg-mainNavyText hover:bg-mainNavyText/80 text-white font-semibold text-sm uppercase transition-colors duration-200 w-full h-12 flex items-center justify-center">
                        Notify me
                    </button>
                </div>
            </div>
            {/* Tags */}
            {event.tags && event.tags.length > 0 && (
                <div className="max-w-7xl mx-auto p-6 space-y-2 mt-12">
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
    )
} 