"use client"

import Image from "next/image"
import { Calendar, MapPin, Clock, Users, Camera } from "lucide-react"
import type { Event } from "@/lib/types"
import { useTranslations } from "@/hooks/use-translations"

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

    return (<div className="bg-gradient-to-br from-mainBackgroundV1 to-white">
        {/* Hero Section */}
        <div className="relative h-[60vh] min-h-[400px] overflow-hidden">
            {/* Background Image */}
            <div className="absolute inset-0">
                <Image
                    src={event.imageUrl}
                    alt={event.title}
                    fill
                    className="object-cover"
                    priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/20" />
            </div>

            {/* Content Overlay */}
            <div className="relative h-full flex items-end">
                <div className="container mx-auto px-4 pb-12">
                    <div className="max-w-4xl">
                        {/* Event Category/Type */}
                        <div className="mb-4">
                            <span className="inline-block px-4 py-2 bg-mainActiveV1/95 text-mainDarkBackgroundV1 text-sm font-semibold rounded-full backdrop-blur-sm">                  Sports Event                </span>
                        </div>

                        {/* Event Title */}
                        <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
                            {event.title}
                        </h1>

                        {/* Event Meta Info */}
                        <div className="flex flex-wrap gap-6 text-white/90">
                            <div className="flex items-center gap-2">
                                <Calendar className="h-5 w-5 text-mainActiveV1" />
                                <span className="font-medium">{formatEventDateLong(event.date)}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <MapPin className="h-5 w-5 text-mainActiveV1" />
                                <span className="font-medium">{event.location}</span>
                            </div>
                            {event.time && (
                                <div className="flex items-center gap-2">
                                    <Clock className="h-5 w-5 text-mainActiveV1" />
                                    <span className="font-medium">{event.time}</span>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>

        {/* Event Details Section */}
        <div className="container mx-auto px-4 py-16">
            <div className="max-w-6xl mx-auto">
                <div className="grid lg:grid-cols-3 gap-12">
                    {/* Main Content */}
                    <div className="lg:col-span-2">
                        {/* Description */}
                        <div className="mb-12">
                            <h2 className="text-3xl font-bold text-gray-900 mb-6">About This Event</h2>
                            <div className="prose prose-lg max-w-none">
                                <p className="text-gray-700 leading-relaxed text-lg">
                                    {event.description || "Join us for an incredible sporting experience that will challenge your limits and create unforgettable memories. This event brings together athletes from around the world to compete in a spectacular setting."}
                                </p>
                            </div>
                        </div>

                        {/* Event Highlights */}
                        <div className="mb-12">
                            <h3 className="text-2xl font-bold text-gray-900 mb-6">Event Highlights</h3>
                            <div className="grid md:grid-cols-2 gap-6">
                                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                                    <div className="flex items-center gap-3 mb-3">
                                        <div className="p-2 bg-mainActiveV1/20 rounded-lg">                    <Camera className="h-5 w-5 text-mainSecondaryActiveV1" />                  </div>
                                        <h4 className="font-semibold text-gray-900">Professional Photography</h4>
                                    </div>
                                    <p className="text-gray-600">High-quality photos captured throughout the event by professional photographers.</p>
                                </div>

                                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                                    <div className="flex items-center gap-3 mb-3">
                                        <div className="p-2 bg-mainSuccessV1/20 rounded-lg">                      <Users className="h-5 w-5 text-mainSuccessV1" />                    </div>
                                        <h4 className="font-semibold text-gray-900">Community Experience</h4>
                                    </div>
                                    <p className="text-gray-600">Connect with fellow athletes and be part of an amazing sporting community.</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Sidebar */}
                    <div className="lg:col-span-1">
                        {/* Event Info Card */}
                        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8 sticky top-8">
                            <h3 className="text-xl font-bold text-gray-900 mb-6">Event Information</h3>

                            <div className="space-y-6">
                                <div className="flex items-start gap-3">
                                    <Calendar className="h-5 w-5 text-mainActiveV1 mt-1" />
                                    <div>
                                        <p className="font-medium text-gray-900">Date</p>
                                        <p className="text-gray-600">{formatEventDate(event.date)}</p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-3">
                                    <MapPin className="h-5 w-5 text-mainActiveV1 mt-1" />
                                    <div>
                                        <p className="font-medium text-gray-900">Location</p>
                                        <p className="text-gray-600">{event.location}</p>
                                    </div>
                                </div>

                                {event.time && (
                                    <div className="flex items-start gap-3">
                                        <Clock className="h-5 w-5 text-mainActiveV1 mt-1" />
                                        <div>
                                            <p className="font-medium text-gray-900">Start Time</p>
                                            <p className="text-gray-600">{event.time}</p>
                                        </div>
                                    </div>
                                )}

                                <div className="flex items-start gap-3">
                                    <Camera className="h-5 w-5 text-mainActiveV1 mt-1" />
                                    <div>
                                        <p className="font-medium text-gray-900">Photography</p>
                                        <p className="text-gray-600">Professional coverage available</p>
                                    </div>
                                </div>
                            </div>

                            {/* CTA Button */}
                            <div className="mt-8 pt-6 border-t border-gray-100">
                                <button className="w-full bg-mainDarkBackgroundV1 text-mainActiveV1 hover:bg-gray-800 hover:text-white font-semibold py-4 px-6 rounded-xl transition-all duration-300 uppercase tracking-wide">
                                    View Photos
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    )
} 