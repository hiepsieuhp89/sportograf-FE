"use client"

import Image from "next/image"
import { Calendar, MapPin, Clock, Users, Camera, ExternalLink } from "lucide-react"
import type { Event } from "@/lib/types"
import { useTranslations } from "@/hooks/use-translations"
import { RichTextPreview } from "@/components/ui/rich-text-preview"

interface EventDetailProps {
    event: Event
}

export function EventDetail({ event }: EventDetailProps) {
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
            <div className="bg-[#F8FAFB] text-mainNavyText max-w-7xl mx-auto">
                <div className="flex flex-col sm:flex-row items-center justify-between w-full">
                    <div className="flex flex-col sm:flex-row items-center flex-1 w-full sm:w-auto">
                        {/* Logo */}
                        <Image
                            src={event.imageUrl || ""}
                            alt={event.title}
                            draggable={false}
                            quality={100}
                            width={100}
                            height={100}
                            className="h-[80px] sm:h-[100px] flex-shrink-0 w-auto object-contain"
                        />
                        <div className="flex flex-col justify-between h-auto sm:h-[100px] p-4 flex-1">
                            <h1 className="text-xl sm:text-2xl font-normal tracking-wide text-center sm:text-left mb-4 sm:mb-0">
                                {event.title.toUpperCase()}
                            </h1>
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-4">
                                {/* Location */}
                                <div className="flex items-center gap-2 justify-center sm:justify-start">
                                    <MapPin className="h-4 w-4" />
                                    <span className="text-sm">{event.location}</span>
                                </div>
                                {/* Date */}
                                <div className="flex items-center gap-2 justify-center sm:justify-start">
                                    <Calendar className="h-4 w-4" />
                                    <span className="text-sm">{formatEventDate(event.date)}</span>
                                </div>
                                {/* Website */}
                                {event.url && (
                                    <div className="flex items-center gap-2 justify-center sm:justify-start">
                                        <ExternalLink className="h-4 w-4" />
                                        <a 
                                            href={event.url} 
                                            target="_blank" 
                                            rel="noopener noreferrer"
                                            className="text-sm hover:underline"
                                        >
                                            {new URL(event.url).hostname}
                                        </a>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-7xl mx-auto p-6">
                {/* Description */}
                {event.description && (
                    <div className="mb-8">
                        <h2 className="text-xl font-semibold mb-4">About the Event</h2>
                        <RichTextPreview content={event.description} />
                    </div>
                )}

                {/* Event Embed */}
                {event.geoSnapshotEmbed && (
                    <div className="mb-8">
                        <h2 className="text-xl font-semibold mb-4">Event Photos</h2>
                        <div 
                            className="w-full"
                            dangerouslySetInnerHTML={{ __html: event.geoSnapshotEmbed }}
                        />
                    </div>
                )}

                {/* Best of Images */}
                {event.bestOfImageUrls && event.bestOfImageUrls.length > 0 && (
                    <div className="mb-8">
                        <h2 className="text-xl font-semibold mb-4">Best of Images</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {event.bestOfImageUrls.map((imageUrl, index) => (
                                <div key={index} className="relative aspect-video">
                                    <Image
                                        src={imageUrl}
                                        alt={`Best of ${index + 1}`}
                                        fill
                                        className="object-cover rounded-lg"
                                    />
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
} 