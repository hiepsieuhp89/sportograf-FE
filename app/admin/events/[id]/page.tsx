"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { doc, getDoc, getDocs, collection, query, orderBy } from "firebase/firestore"
import { db } from "@/lib/firebase"
import type { Event, EventType, Photographer } from "@/lib/types"
import { getCountryByCode } from "@/lib/countries"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { 
  Calendar, 
  MapPin, 
  Users, 
  Tag, 
  Globe, 
  MessageSquare, 
  Edit, 
  ArrowLeft,
  CheckCircle,
  XCircle,
  Clock
} from "lucide-react"
import Image from "next/image"
import { format } from "date-fns"
import Link from "next/link"

export default function ViewEventPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [event, setEvent] = useState<Event | null>(null)
  const [eventType, setEventType] = useState<EventType | null>(null)
  const [photographers, setPhotographers] = useState<Photographer[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch event
        const eventDoc = await getDoc(doc(db, "events", params.id))
        if (!eventDoc.exists()) {
          setError("Event not found")
          setLoading(false)
          return
        }

        const eventData = { ...eventDoc.data(), id: eventDoc.id } as Event
        setEvent(eventData)

        // Fetch event type
        if (eventData.eventTypeId) {
          const eventTypeDoc = await getDoc(doc(db, "eventTypes", eventData.eventTypeId))
          if (eventTypeDoc.exists()) {
            setEventType({ ...eventTypeDoc.data(), id: eventTypeDoc.id } as EventType)
          }
        }

        // Fetch photographers
        const photographersQuery = query(collection(db, "photographers"), orderBy("name"))
        const photographersSnapshot = await getDocs(photographersQuery)
        const photographersList = photographersSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Photographer[]
        setPhotographers(photographersList)

      } catch (error) {
        console.error("Error fetching event:", error)
        setError("Failed to load event details")
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [params.id])

  const getPhotographerConfirmationStatus = (photographerId: string) => {
    if (!event?.photographerConfirmations) return "pending"
    return event.photographerConfirmations[photographerId] ? "confirmed" : "declined"
  }

  const getConfirmationIcon = (status: string) => {
    switch (status) {
      case "confirmed":
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case "declined":
        return <XCircle className="h-4 w-4 text-red-500" />
      default:
        return <Clock className="h-4 w-4 text-yellow-500" />
    }
  }

  const getConfirmationText = (status: string) => {
    switch (status) {
      case "confirmed":
        return "Confirmed"
      case "declined":
        return "Declined"
      default:
        return "Pending"
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center p-8">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-mainNavyText"></div>
      </div>
    )
  }

  if (error || !event) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="outline" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
        </div>
        <Card>
          <CardContent className="p-6 text-center">
            <p className="text-red-600">{error || "Event not found"}</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  const country = getCountryByCode(event.country)
  const assignedPhotographers = photographers.filter(p => 
    event.photographerIds?.includes(p.id)
  )

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="outline" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <h1 className="text-3xl font-bold">Event Details</h1>
        </div>
        <Link href={`/admin/events/${event.id}/edit`}>
          <Button className="flex items-center gap-2">
            <Edit className="h-4 w-4" />
            Edit Event
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Event Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="text-xl font-semibold">{event.title}</h3>
                {eventType && (
                  <div className="flex items-center gap-2 mt-2">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: eventType.color }}
                    />
                    <span className="text-sm text-gray-600">{eventType.name}</span>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center text-sm text-gray-600">
                  <Calendar className="h-4 w-4 mr-2" />
                  <div>
                    <div>{format(new Date(event.date), "EEEE, MMMM dd, yyyy")}</div>
                    {event.time && (
                      <div className="text-xs">at {event.time}</div>
                    )}
                  </div>
                </div>

                <div className="flex items-center text-sm text-gray-600">
                  <MapPin className="h-4 w-4 mr-2" />
                  <div>
                    <div>{event.location}</div>
                    {country && (
                      <div className="text-xs">{country.name}</div>
                    )}
                  </div>
                </div>
              </div>

              {event.tags && event.tags.length > 0 && (
                <div>
                  <h4 className="font-medium mb-2 flex items-center gap-2">
                    <Tag className="h-4 w-4" />
                    Tags
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {event.tags.map((tag) => (
                      <Badge key={tag} variant="secondary">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {event.url && (
                <div>
                  <h4 className="font-medium mb-2 flex items-center gap-2">
                    <Globe className="h-4 w-4" />
                    Event URL
                  </h4>
                  <a
                    href={event.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline"
                  >
                    {event.url}
                  </a>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Description */}
          {event.description && (
            <Card>
              <CardHeader>
                <CardTitle>Description</CardTitle>
              </CardHeader>
              <CardContent>
                <div
                  className="prose max-w-none"
                  dangerouslySetInnerHTML={{ __html: event.description }}
                />
              </CardContent>
            </Card>
          )}

          {/* Note to Photographer */}
          {event.noteToPhotographer && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageSquare className="h-5 w-5" />
                  Note to Photographers
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="bg-blue-50 p-4 rounded-md">
                  <p className="text-blue-900">{event.noteToPhotographer}</p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Images */}
          <Card>
            <CardHeader>
              <CardTitle>Images</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {event.imageUrl && (
                <div>
                  <p className="text-sm font-medium mb-2">Event Image</p>
                  <Image
                    src={event.imageUrl}
                    alt={event.title}
                    width={300}
                    height={200}
                    className="rounded-md object-cover w-full"
                  />
                </div>
              )}
              {event.bestOfImageUrl && (
                <div>
                  <p className="text-sm font-medium mb-2">Best of Image</p>
                  <Image
                    src={event.bestOfImageUrl}
                    alt="Best of"
                    width={300}
                    height={200}
                    className="rounded-md object-cover w-full"
                  />
                </div>
              )}
            </CardContent>
          </Card>

          {/* Photographers */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Assigned Photographers ({assignedPhotographers.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              {assignedPhotographers.length === 0 ? (
                <p className="text-gray-500 text-sm">No photographers assigned</p>
              ) : (
                <div className="space-y-3">
                  {assignedPhotographers.map((photographer) => {
                    const status = getPhotographerConfirmationStatus(photographer.id)
                    return (
                      <div key={photographer.id} className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                            <span className="text-sm font-medium">
                              {photographer.name.charAt(0).toUpperCase()}
                            </span>
                          </div>
                          <div>
                            <p className="font-medium text-sm">{photographer.name}</p>
                            <p className="text-xs text-gray-500">{photographer.email}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          {getConfirmationIcon(status)}
                          <span className="text-xs">{getConfirmationText(status)}</span>
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
} 