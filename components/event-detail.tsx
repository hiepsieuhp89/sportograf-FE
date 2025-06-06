"use client"

import Image from "next/image"
import { Calendar, MapPin, Clock, Tag as TagIcon, ExternalLink, Info, X } from "lucide-react"
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
                    <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between w-full p-4 sm:p-6 gap-6">
                        <div className="flex flex-col lg:flex-row items-center flex-1 w-full gap-6">
                            {/* Event Image - Better responsive sizing */}
                            <div className="w-full h-64 sm:h-48 lg:w-64 lg:h-64 xl:w-72 xl:h-72 relative flex-shrink-0 rounded-lg overflow-hidden shadow-md">
                                <Image
                                    src={event.imageUrl || ""}
                                    alt={event.title}
                                    fill
                                    className="object-cover"
                                    quality={100}
                                />
                            </div>

                            {/* Event Info - Better desktop layout */}
                            <div className="flex-1 space-y-4 text-center lg:text-left w-full">
                                <div className="space-y-3">
                                    <h1 className="text-2xl sm:text-3xl lg:text-4xl font-semibold break-words leading-tight">
                                        {event.title}
                                    </h1>
                                    {eventType && (
                                        <div className="flex justify-center lg:justify-start">
                                            <Badge
                                                variant="secondary"
                                                style={{ backgroundColor: eventType.color }}
                                                className="text-white text-sm px-3 py-1"
                                            >
                                                {eventType.name}
                                            </Badge>
                                        </div>
                                    )}
                                </div>

                                {/* Event Details Grid - Better desktop layout */}
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                                    <div className="flex items-start gap-3 bg-white/70 p-4 rounded-lg shadow-sm">
                                        <Calendar className="h-5 w-5 text-gray-500 flex-shrink-0 mt-0.5" />
                                        <div className="space-y-1 text-left min-w-0 flex-1">
                                            <p className="font-medium text-sm">{t("eventDate")}</p>
                                            <div className="text-sm text-gray-600">
                                                <p className="break-words">{formatEventDate(event.date)}</p>
                                                {event.endDate && (
                                                    <p className="text-gray-500 mt-1">
                                                        to {formatEventDate(event.endDate)}
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-3 bg-white/70 p-4 rounded-lg shadow-sm">
                                        <Clock className="h-5 w-5 text-gray-500 flex-shrink-0 mt-0.5" />
                                        <div className="space-y-1 text-left min-w-0 flex-1">
                                            <p className="font-medium text-sm">{t("eventTime")}</p>
                                            <p className="text-sm text-gray-600 break-words">{event.time || "TBA"}</p>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-3 bg-white/70 p-4 rounded-lg shadow-sm sm:col-span-2 lg:col-span-1">
                                        <MapPin className="h-5 w-5 text-gray-500 flex-shrink-0 mt-0.5" />
                                        <div className="space-y-1 text-left min-w-0 flex-1">
                                            <p className="font-medium text-sm">{t("eventLocation")}</p>
                                            <div className="text-sm text-gray-600">
                                                <p className="break-words">{event.location}</p>
                                                {event.country && (
                                                    <p className="text-gray-500 mt-1 break-words">
                                                        {event.country}
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    {event.url && (
                                        <div className="flex items-start gap-3 bg-white/70 p-4 rounded-lg shadow-sm">
                                            <ExternalLink className="h-5 w-5 text-gray-500 flex-shrink-0 mt-0.5" />
                                            <div className="space-y-1 text-left min-w-0 flex-1">
                                                <p className="font-medium text-sm">{t("website")}</p>
                                                <a
                                                    href={event.url}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="text-sm text-blue-600 hover:underline break-all"
                                                >
                                                    {t("visitWebsite")}
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

            {/* Main Content - Better spacing and desktop optimization */}
            <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 space-y-8">
                {/* Description */}
                {event.description && (
                    <div className="bg-white rounded-lg p-4 sm:p-6 lg:p-8 shadow-sm border border-gray-100">
                        <RichTextPreview content={event.description} />
                    </div>
                )}

                {/* Best of Images - Better desktop grid */}
                {event.bestOfImageUrls && event.bestOfImageUrls.length > 0 && (
                    <div className="space-y-6">
                        <h2 className="text-xl sm:text-2xl lg:text-3xl font-semibold text-center sm:text-left">{t("bestPhotos")}</h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 lg:gap-6">
                            {event.bestOfImageUrls.map((imageUrl, index) => (
                                <div key={index} className="relative aspect-video rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300">
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

                {/* Geo Snapshot or Loading State */}
                {event.geoSnapshotEmbed ? (
                    <div className="bg-white rounded-lg shadow-sm border border-gray-100">
                        <RichTextPreview content={event.geoSnapshotEmbed} />
                    </div>
                ) : (
                    <div className="flex items-center justify-center py-16 lg:py-24">
                        <div className="text-center max-w-md mx-auto px-4">
                            {/* Loading Icon */}
                            <div className="mb-8 flex justify-center">
                                <div className="relative w-20 h-20 lg:w-24 lg:h-24">
                                    <div className="absolute inset-0 border-4 border-gray-200 rounded-full"></div>
                                    <div className="absolute inset-0 border-4 border-transparent border-t-mainNavyText rounded-full animate-spin"></div>
                                    <div className="absolute inset-3 flex items-center justify-center">
                                        <div className="grid grid-cols-2 gap-1">
                                            <div className="w-2.5 h-2.5 lg:w-3 lg:h-3 bg-mainNavyText rounded-sm"></div>
                                            <div className="w-2.5 h-2.5 lg:w-3 lg:h-3 bg-gray-300 rounded-sm"></div>
                                            <div className="w-2.5 h-2.5 lg:w-3 lg:h-3 bg-gray-300 rounded-sm"></div>
                                            <div className="w-2.5 h-2.5 lg:w-3 lg:h-3 bg-mainNavyText rounded-sm"></div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Message */}
                            <h2 className="text-2xl sm:text-3xl lg:text-4xl text-mainNavyText mb-6 tracking-wide font-medium">
                                {t("weAreOnIt")}
                            </h2>
                            <p className="text-mainNavyText text-sm lg:text-base mb-2 leading-relaxed">
                                {t("photosNotOnlineYet")}
                            </p>
                            <p className="text-mainNavyText mb-8 text-sm lg:text-base leading-relaxed">
                                {t("getNotificationWhenReady")}
                            </p>
                            <button className="bg-mainNavyText hover:bg-mainNavyText/90 text-white font-semibold text-sm lg:text-base uppercase transition-colors duration-200 w-full max-w-xs h-12 lg:h-14 flex items-center justify-center rounded-md shadow-md hover:shadow-lg">
                                {t("notifyMe")}
                            </button>
                        </div>
                    </div>
                )}

                {/* Tags */}
                {event.tags && event.tags.length > 0 && (
                    <div className="space-y-4 lg:space-y-6">
                        <h2 className="text-xl sm:text-2xl lg:text-3xl font-semibold flex items-center gap-2 text-center sm:text-left justify-center sm:justify-start">
                            <TagIcon className="h-5 w-5 lg:h-6 lg:w-6" />
                            {t("tags")}
                        </h2>
                        <div className="flex flex-wrap gap-2 lg:gap-3 justify-center sm:justify-start">
                            {event.tags.map((tag) => (
                                <Badge key={tag} variant="secondary" className="text-sm lg:text-base px-3 py-1 lg:px-4 lg:py-2">
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