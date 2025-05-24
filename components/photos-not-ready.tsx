import Image from "next/image"
import { Calendar, MapPin, ExternalLink, Gift } from "lucide-react"
import type { Event } from "@/lib/types"

interface PhotosNotReadyProps {
    event: Event
}

export function PhotosNotReady({ event }: PhotosNotReadyProps) {
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
        <div className="min-h-screen bg-white">
            <div className="bg-[#F8FAFB] text-mainNavyText max-w-7xl mx-auto">
                <div className="flex flex-col sm:flex-row items-center justify-between w-full">
                    <div className="flex flex-col sm:flex-row items-center flex-1 w-full sm:w-auto">
                        {/* Logo */}
                        <Image
                            src={event.imageUrl || ""}
                            alt="Sportograf Logo"
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
                                <div className="flex items-center gap-2 justify-center sm:justify-start">
                                    <ExternalLink className="h-4 w-4" />
                                    <span className="text-sm">hyrox.com/</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right side - See Extras */}
                    <div className="flex flex-col items-center gap-2 justify-center bg-mainBackgroundV1/80 cursor-pointer h-[80px] sm:h-[100px] w-full sm:w-[100px] mt-4 sm:mt-0">
                        <Gift className="h-5 w-5" />
                        <span className="text-sm">See Extras</span>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 flex items-center justify-center pt-6 sm:pt-10">
                <div className="text-center max-w-md mx-auto px-4 sm:px-0 pt-4 w-full sm:w-[470px] bg-mainBackgroundV1">
                    {/* Loading Icon */}
                    <div className="mb-6 sm:mb-8 flex justify-center">
                        <div className="relative w-16 sm:w-24 h-16 sm:h-24">
                            {/* Outer circle with rotating segments */}
                            <div className="absolute inset-0 border-4 border-gray-200 rounded-full"></div>
                            <div className="absolute inset-0 border-4 border-transparent border-t-mainNavyText rounded-full animate-spin"></div>

                            {/* Inner squares */}
                            <div className="absolute inset-4 flex items-center justify-center">
                                <div className="grid grid-cols-2 gap-1">
                                    <div className="w-2 sm:w-3 h-2 sm:h-3 bg-mainNavyText rounded-sm"></div>
                                    <div className="w-2 sm:w-3 h-2 sm:h-3 bg-gray-300 rounded-sm"></div>
                                    <div className="w-2 sm:w-3 h-2 sm:h-3 bg-gray-300 rounded-sm"></div>
                                    <div className="w-2 sm:w-3 h-2 sm:h-3 bg-mainNavyText rounded-sm"></div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Main Message */}
                    <h2 className="text-2xl sm:text-3xl text-mainNavyText mb-4 sm:mb-6 tracking-wide">
                        WE ARE ON IT!
                    </h2>
                    {/* Subtitle */}
                    <p className="text-mainNavyText text-sm px-4 sm:px-0">
                        The photos are not online yet.
                    </p>
                    {/* Description */}
                    <p className="text-mainNavyText mb-6 sm:mb-8 text-sm px-4 sm:px-0">
                        Get a notification as soon as your pictures are online.
                    </p>
                    {/* Notify Button */}
                    <button className="bg-mainNavyText hover:bg-mainNavyText/80 text-white font-semibold text-sm uppercase transition-colors duration-200 w-full h-10 sm:h-12 flex items-center justify-center">
                        Notify me
                    </button>
                </div>
            </div>
        </div>
    )
} 