"use client"

import { useEffect, useRef, useState } from "react"
import { useTranslations } from "@/hooks/use-translations"
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion"
import { useInView } from "react-intersection-observer"
import { collection, getDocs, query, orderBy, where } from "firebase/firestore"
import { db } from "@/lib/firebase"
import type { Event, EventType } from "@/lib/types"
import { getCountryByCode } from "@/lib/countries"
import { format } from "date-fns"
import { Search, Calendar, MapPin, Tag, X, Filter } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import Image from "next/image"
import Link from "next/link"

// Video sources array
const videoSources = [
  "https://videos.pexels.com/video-files/4274798/4274798-uhd_2560_1440_25fps.mp4",
  "https://videos.pexels.com/video-files/856132/856132-hd_1920_1080_30fps.mp4",
  "https://videos.pexels.com/video-files/4761711/4761711-uhd_2732_1440_25fps.mp4",
]

export function HeroCarousel() {
  const { t } = useTranslations()
  const containerRef = useRef<HTMLDivElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const previewVideoRef = useRef<HTMLVideoElement>(null)
  const parallaxSectionRef = useRef<HTMLDivElement>(null)
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [showLens, setShowLens] = useState(false)
  const [lensSize, setLensSize] = useState(window.innerWidth < 768 ? 100 : 150)
  const [hoverTimeout, setHoverTimeout] = useState<NodeJS.Timeout | null>(null)
  const { ref: inViewRef, inView } = useInView({
    threshold: 0.1,
    triggerOnce: false,
  })

  // Search functionality state
  const [searchQuery, setSearchQuery] = useState("")
  const [searchResults, setSearchResults] = useState<Event[]>([])
  const [allEvents, setAllEvents] = useState<Event[]>([])
  const [eventTypes, setEventTypes] = useState<EventType[]>([])
  const [showSearchResults, setShowSearchResults] = useState(false)
  const [isSearching, setIsSearching] = useState(false)
  const [selectedEventType, setSelectedEventType] = useState<string>("")
  const [selectedCountry, setSelectedCountry] = useState<string>("")
  const [showFilters, setShowFilters] = useState(false)

  // Fetch events and event types
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch events
        const eventsQuery = query(
          collection(db, "events"), 
          orderBy("date", "desc")
        )
        const eventsSnapshot = await getDocs(eventsQuery)
        const eventsList = eventsSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Event[]
        setAllEvents(eventsList)

        // Fetch event types
        const eventTypesQuery = query(
          collection(db, "eventTypes"), 
          orderBy("name")
        )
        const eventTypesSnapshot = await getDocs(eventTypesQuery)
        const eventTypesList = eventTypesSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as EventType[]
        setEventTypes(eventTypesList)
      } catch (error) {
        console.error("Error fetching data:", error)
      }
    }

    fetchData()
  }, [])

  // Search functionality
  const performSearch = (query: string, eventTypeFilter?: string, countryFilter?: string) => {
    if (!query.trim() && !eventTypeFilter && !countryFilter) {
      setSearchResults([])
      setShowSearchResults(false)
      return
    }

    setIsSearching(true)
    
    let filteredEvents = allEvents

    // Filter by search query
    if (query.trim()) {
      const searchTerm = query.toLowerCase()
      filteredEvents = filteredEvents.filter(event => 
        event.title.toLowerCase().includes(searchTerm) ||
        event.description.toLowerCase().includes(searchTerm) ||
        event.location.toLowerCase().includes(searchTerm) ||
        event.tags?.some(tag => tag.toLowerCase().includes(searchTerm))
      )
    }

    // Filter by event type
    if (eventTypeFilter) {
      filteredEvents = filteredEvents.filter(event => 
        event.eventTypeId === eventTypeFilter
      )
    }

    // Filter by country
    if (countryFilter) {
      filteredEvents = filteredEvents.filter(event => 
        event.country === countryFilter
      )
    }

    // Sort by date (upcoming events first)
    filteredEvents.sort((a, b) => {
      const dateA = new Date(a.date)
      const dateB = new Date(b.date)
      const now = new Date()
      
      // Upcoming events first
      const aIsUpcoming = dateA >= now
      const bIsUpcoming = dateB >= now
      
      if (aIsUpcoming && !bIsUpcoming) return -1
      if (!aIsUpcoming && bIsUpcoming) return 1
      
      // Then sort by date
      return aIsUpcoming ? dateA.getTime() - dateB.getTime() : dateB.getTime() - dateA.getTime()
    })

    setSearchResults(filteredEvents.slice(0, 10)) // Limit to 10 results
    setShowSearchResults(true)
    setIsSearching(false)
  }

  // Handle search input change
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value
    setSearchQuery(query)
    
    // Debounce search
    const timeoutId = setTimeout(() => {
      performSearch(query, selectedEventType, selectedCountry)
    }, 300)

    return () => clearTimeout(timeoutId)
  }

  // Handle search form submit
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    performSearch(searchQuery, selectedEventType, selectedCountry)
  }

  // Handle filter changes
  const handleEventTypeFilter = (value: string) => {
    setSelectedEventType(value)
    performSearch(searchQuery, value, selectedCountry)
  }

  const handleCountryFilter = (value: string) => {
    setSelectedCountry(value)
    performSearch(searchQuery, selectedEventType, value)
  }

  // Clear search
  const clearSearch = () => {
    setSearchQuery("")
    setSelectedEventType("")
    setSelectedCountry("")
    setSearchResults([])
    setShowSearchResults(false)
  }

  // Get unique countries from events
  const getUniqueCountries = () => {
    const countries = [...new Set(allEvents.map(event => event.country))]
    return countries.map(countryCode => {
      const country = getCountryByCode(countryCode)
      return { code: countryCode, name: country?.name || countryCode }
    }).sort((a, b) => a.name.localeCompare(b.name))
  }

  // Get event type by ID
  const getEventType = (eventTypeId: string) => {
    return eventTypes.find(et => et.id === eventTypeId)
  }

  // Format date for display
  const formatEventDate = (dateString: string) => {
    try {
      return format(new Date(dateString), "MMM dd, yyyy")
    } catch {
      return dateString
    }
  }

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return
    
    const rect = containerRef.current.getBoundingClientRect()
    // Direct mouse tracking for better responsiveness
    setMousePosition({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    })
  }

  const handleMouseEnter = () => {
    // Clear any existing timeout
    if (hoverTimeout) {
      clearTimeout(hoverTimeout)
    }
    
    // Reduce delay for better responsiveness
    const timeout = setTimeout(() => {
      setShowLens(true)
    }, 100) // 100ms delay
    
    setHoverTimeout(timeout)
  }

  const handleMouseLeave = () => {
    // Clear timeout if user leaves before delay completes
    if (hoverTimeout) {
      clearTimeout(hoverTimeout)
      setHoverTimeout(null)
    }
    
    // Immediately hide lens
    setShowLens(false)
  }

  const handleLensClick = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    
    const nextIndex = (currentVideoIndex + 1) % videoSources.length
    console.log(`Switching video from ${currentVideoIndex} to ${nextIndex}`)
    setCurrentVideoIndex(nextIndex)
    
    // Add a subtle feedback effect
    setLensSize(prev => prev * 1.1)
    setTimeout(() => {
      setLensSize(150)
    }, 150)
  }

  const handleWheel = (e: React.WheelEvent) => {
    if (showLens) {
      e.preventDefault()
      const delta = e.deltaY * -0.2
      setLensSize(prev => Math.min(Math.max(prev + delta, 150), 350))
    }
  }

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  })

  const { scrollYProgress: parallaxScrollProgress } = useScroll({
    target: parallaxSectionRef,
    offset: ["start end", "end start"],
  })

  const scale = useTransform(scrollYProgress, [0, 1], [1, 0.8])
  const rotateX = useTransform(scrollYProgress, [0, 1], [0, 15])
  const rotateY = useTransform(scrollYProgress, [0, 1], [0, -5])
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0])
  const translateY = useTransform(scrollYProgress, [0, 1], [0, -100])
  const borderRadius = useTransform(scrollYProgress, [0, 1], [0, 24])

  const titleY = useTransform(scrollYProgress, [0, 1], [0, -50])
  const searchY = useTransform(scrollYProgress, [0, 1], [0, -30])
  
  // Fade out/in effects for text and input
  const textOpacity = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [1, 0.3, 0.3, 1])
  const inputOpacity = useTransform(scrollYProgress, [0, 0.4, 0.6, 1], [1, 0.2, 0.2, 1])
  
  // 3D effects from left to right
  const titleRotateY = useTransform(scrollYProgress, [0, 0.5, 1], [0, -15, 0])
  const titleTranslateX = useTransform(scrollYProgress, [0, 0.5, 1], [0, -100, 0])
  const titleTranslateZ = useTransform(scrollYProgress, [0, 0.5, 1], [0, -50, 0])
  
  const inputRotateY = useTransform(scrollYProgress, [0, 0.5, 1], [0, -10, 0])
  const inputTranslateX = useTransform(scrollYProgress, [0, 0.5, 1], [0, -80, 0])
  const inputTranslateZ = useTransform(scrollYProgress, [0, 0.5, 1], [0, -30, 0])

  useEffect(() => {
    if (videoRef.current) {
      if (inView) {
        videoRef.current.play().catch((error) => {
          console.error("Video play failed:", error)
        })
      } else {
        videoRef.current.pause()
      }
    }
  }, [inView, currentVideoIndex])

  // Play preview video when lens is shown
  useEffect(() => {
    if (previewVideoRef.current && showLens) {
      previewVideoRef.current.play().catch(error => {
        console.error("Preview video play failed:", error)
      })
    }
  }, [showLens])

  // Get next video index for preview
  const previewVideoIndex = (currentVideoIndex + 1) % videoSources.length

  // Set up interval for lens pulse effect
  useEffect(() => {
    let pulseInterval: NodeJS.Timeout | null = null
    
    if (showLens) {
      pulseInterval = setInterval(() => {
        setLensSize(prev => {
          const variation = Math.sin(Date.now() / 800) * 5 // Slower, smaller pulse
          return 150 + variation
        })
      }, 100) // Less frequent updates
    }
    
    return () => {
      if (pulseInterval) clearInterval(pulseInterval)
    }
  }, [showLens])

  // Cleanup hover timeout on unmount
  useEffect(() => {
    return () => {
      if (hoverTimeout) {
        clearTimeout(hoverTimeout)
      }
    }
  }, [hoverTimeout])

  return (
    <>
      <div
        ref={(el) => {
          containerRef.current = el
          inViewRef(el)
        }}
        className="relative h-screen overflow-hidden cursor-crosshair"
        style={{ perspective: "1000px" }}
        onMouseMove={handleMouseMove}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onWheel={handleWheel}
      >
        <motion.div
          className="absolute inset-0 w-full h-full overflow-hidden"
          style={{
            scale,
            rotateX,
            rotateY,
            opacity,
            translateY,
            borderRadius: useTransform(borderRadius, (value) => `${value}px`),
            transformOrigin: "center center",
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/70 z-10"></div>
          <video 
            ref={videoRef} 
            key={currentVideoIndex} // Force re-render when video changes
            className="absolute inset-0 w-full h-full object-cover" 
            autoPlay 
            muted 
            loop 
            playsInline
            src={videoSources[currentVideoIndex]}
          >
            Your browser does not support the video tag.
          </video>
          
          {/* Lens/Mask Effect */}
          <AnimatePresence>
            {showLens && (
              <motion.div
                className="absolute z-50 rounded-sm overflow-hidden cursor-pointer"
                style={{
                  width: lensSize,
                  height: lensSize,
                  left: mousePosition.x - lensSize / 2,
                  top: mousePosition.y - lensSize / 2,
                  transformStyle: "preserve-3d",
                  perspective: "800px",
                  pointerEvents: "all"
                }}
                initial={{ 
                  scale: 0.5, 
                  opacity: 0, 
                  rotateZ: -10
                }}
                animate={{ 
                  scale: 1, 
                  opacity: 1, 
                  rotateZ: 0
                }}
                exit={{ 
                  scale: 0.5, 
                  opacity: 0, 
                  rotateZ: 10
                }}
                transition={{ 
                  type: "spring", 
                  stiffness: 300, 
                  damping: 25,
                  duration: 0.4
                }}
                whileHover={{
                  scale: 1.1,
                  transition: { duration: 0.2 }
                }}
                whileTap={{
                  scale: 0.9,
                  transition: { duration: 0.1 }
                }}
                onClick={handleLensClick}
              >
                {/* Magnifying glass frame */}
                <div 
                  className="absolute inset-0 rounded-sm"
                  style={{ 
                    border: "2px solid #ffffff50",
                    background: "rgba(255,255,255,0.1)",
                    boxShadow: "0 0 0 2000px rgba(0,0,0,0.6), 0 0 20px rgba(255,255,255,0.3)"
                  }}
                />
                
                {/* Lens handle */}
                <div
                  className="absolute -bottom-4 -right-4 w-6 h-6 rounded-sm bg-white"
                  style={{
                    border: "2px solid #ffffff",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.3)"
                  }}
                />
                
                {/* Preview video */}
                <div 
                  className="w-full h-full rounded-sm overflow-hidden"
                >
                  <div className="w-full h-full rounded-sm overflow-hidden relative">
                    <video
                      ref={previewVideoRef}
                      key={previewVideoIndex}
                      className="w-full h-full object-cover"
                      autoPlay
                      muted
                      loop
                      playsInline
                      src={videoSources[previewVideoIndex]}
                    >
                      Your browser does not support the video tag.
                    </video>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        <div className="relative z-50 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex flex-col justify-center items-start">
          <motion.div className="mt-20" style={{ y: titleY }}>
            <motion.h1
              className="text-mainBackgroundV1 text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-[900] mb-4 sm:mb-8 leading-tight tracking-tight"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.8 }}
              style={{ 
                fontFamily: "'Montserrat', sans-serif", 
                fontWeight: 900,
                opacity: textOpacity,
                rotateY: titleRotateY,
                x: titleTranslateX,
                z: titleTranslateZ,
                transformStyle: "preserve-3d",
                transformOrigin: "left center"
              }}
            >
              <span className="text-4xl sm:text-5xl md:text-6xl lg:text-8xl">PHOTOGRAPHY</span>
              <br />
              <span className="text-mainActiveV1">FOR THE LOVE OF SPORT</span>
            </motion.h1>
            
            {/* Enhanced Search Form */}
            <motion.div
              className="w-full max-w-2xl relative"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.8 }}
              style={{ 
                y: searchY,
                opacity: inputOpacity,
                rotateY: inputRotateY,
                x: inputTranslateX,
                z: inputTranslateZ,
                transformStyle: "preserve-3d",
                transformOrigin: "left center"
              }}
            >
              <form onSubmit={handleSearchSubmit} className="relative w-full px-4 sm:px-0">
                <div className="relative">
                  <Input
                    type="text"
                    placeholder={t("searchPlaceholder")}
                    value={searchQuery}
                    onChange={handleSearchChange}
                    className="w-full py-3 sm:py-4 px-4 sm:px-6 pr-20 rounded-none border-0 focus:outline-none focus:ring-2 focus:ring-mainBackgroundV1 text-gray-700 placeholder-gray-500 text-base"
                  />
                  <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex items-center gap-2">
                    {(searchQuery || selectedEventType || selectedCountry) && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={clearSearch}
                        className="h-8 w-8 p-0 hover:bg-gray-100"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    )}
                    <Popover open={showFilters} onOpenChange={setShowFilters}>
                      <PopoverTrigger asChild>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0 hover:bg-gray-100"
                        >
                          <Filter className="h-4 w-4" />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-80 p-4" align="end">
                        <div className="space-y-4">
                          <h4 className="font-medium">Filter Events</h4>
                          
                          <div className="space-y-2">
                            <label className="text-sm font-medium">Event Type</label>
                            <Select value={selectedEventType} onValueChange={handleEventTypeFilter}>
                              <SelectTrigger>
                                <SelectValue placeholder="All event types" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="">All event types</SelectItem>
                                {eventTypes.map((eventType) => (
                                  <SelectItem key={eventType.id} value={eventType.id}>
                                    <div className="flex items-center gap-2">
                                      <div
                                        className="w-3 h-3 rounded-full"
                                        style={{ backgroundColor: eventType.color }}
                                      />
                                      {eventType.name}
                                    </div>
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>

                          <div className="space-y-2">
                            <label className="text-sm font-medium">Country</label>
                            <Select value={selectedCountry} onValueChange={handleCountryFilter}>
                              <SelectTrigger>
                                <SelectValue placeholder="All countries" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="">All countries</SelectItem>
                                {getUniqueCountries().map((country) => (
                                  <SelectItem key={country.code} value={country.code}>
                                    {country.name}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                      </PopoverContent>
                    </Popover>
                    <Button
                      type="submit"
                      size="sm"
                      className="h-8 w-8 p-0"
                    >
                      <Search className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </form>

              {/* Search Results */}
              <AnimatePresence>
                {showSearchResults && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="absolute top-full left-0 right-0 mt-2 z-50 px-4 sm:px-0"
                  >
                    <Card className="max-h-96 overflow-y-auto shadow-lg">
                      <CardContent className="p-0">
                        {isSearching ? (
                          <div className="p-4 text-center">
                            <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-mainNavyText mx-auto"></div>
                          </div>
                        ) : searchResults.length === 0 ? (
                          <div className="p-4 text-center text-gray-500">
                            No events found. Try adjusting your search or filters.
                          </div>
                        ) : (
                          <div className="divide-y">
                            {searchResults.map((event) => {
                              const eventType = getEventType(event.eventTypeId)
                              const country = getCountryByCode(event.country)
                              
                              return (
                                <Link
                                  key={event.id}
                                  href={`/events/${event.id}`}
                                  className="block p-4 hover:bg-gray-50 transition-colors"
                                  onClick={() => setShowSearchResults(false)}
                                >
                                  <div className="flex items-center space-x-3">
                                    <div className="flex-shrink-0 h-16 w-16 relative">
                                      <Image
                                        src={event.imageUrl || "/placeholder.svg"}
                                        alt={event.title}
                                        width={64}
                                        height={64}
                                        className="rounded-md object-cover w-full h-full"
                                      />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                      <div className="flex items-center gap-2 mb-1">
                                        <h4 className="font-medium text-gray-900 truncate">
                                          {event.title}
                                        </h4>
                                        {eventType && (
                                          <Badge
                                            variant="secondary"
                                            className="text-xs"
                                            style={{ backgroundColor: eventType.color, color: 'white' }}
                                          >
                                            {eventType.name}
                                          </Badge>
                                        )}
                                      </div>
                                      <div className="flex items-center gap-4 text-sm text-gray-500">
                                        <div className="flex items-center gap-1">
                                          <Calendar className="h-3 w-3" />
                                          {formatEventDate(event.date)}
                                        </div>
                                        <div className="flex items-center gap-1">
                                          <MapPin className="h-3 w-3" />
                                          <span className="truncate">{event.location}</span>
                                        </div>
                                      </div>
                                      {event.tags && event.tags.length > 0 && (
                                        <div className="flex flex-wrap gap-1 mt-1">
                                          {event.tags.slice(0, 3).map((tag) => (
                                            <Badge key={tag} variant="outline" className="text-xs">
                                              {tag}
                                            </Badge>
                                          ))}
                                          {event.tags.length > 3 && (
                                            <Badge variant="outline" className="text-xs">
                                              +{event.tags.length - 3}
                                            </Badge>
                                          )}
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                </Link>
                              )
                            })}
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </motion.div>
        </div>

        <motion.div
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1, duration: 1, repeat: Number.POSITIVE_INFINITY, repeatType: "reverse" }}
        >
          <div className="w-8 h-12 border-2 border-white rounded-full flex items-center justify-center">
            <div className="w-1.5 h-3 bg-white rounded-full animate-bounce"></div>
          </div>
        </motion.div>
      </div>
    </>
  )
}
