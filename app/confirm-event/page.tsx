"use client"

import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { doc, getDoc, updateDoc, query, collection, where, getDocs } from "firebase/firestore"
import { db } from "@/lib/firebase"
import type { Event } from "@/lib/types"
import type { UserData } from "@/contexts/user-context"
import { getCountryByCode } from "@/lib/countries"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { CheckCircle, XCircle, Calendar, MapPin, Clock, Users, MessageSquare, Home, Shield } from "lucide-react"
import Image from "next/image"
import { format } from "date-fns"

interface PhotographerData extends UserData {
  id: string
}

export default function ConfirmEventPage() {
  const searchParams = useSearchParams()
  const eventId = searchParams.get("eventId")
  const photographerId = searchParams.get("photographerId")

  const [event, setEvent] = useState<Event | null>(null)
  const [photographer, setPhotographer] = useState<PhotographerData | null>(null)
  const [loading, setLoading] = useState(true)
  const [confirming, setConfirming] = useState(false)
  const [confirmed, setConfirmed] = useState<boolean | null>(null)
  const [error, setError] = useState("")

  useEffect(() => {
    const fetchData = async () => {
      if (!eventId || !photographerId) {
        setError("Invalid confirmation link")
        setLoading(false)
        return
      }

      try {
        // Fetch event
        const eventDoc = await getDoc(doc(db, "events", eventId))
        if (!eventDoc.exists()) {
          setError("Event not found")
          setLoading(false)
          return
        }

        const eventData = eventDoc.data() as Event
        setEvent({ ...eventData, id: eventDoc.id })

        // Check if photographer is assigned to this event
        if (!eventData.photographerIds?.includes(photographerId)) {
          setError("You are not assigned to this event")
          setLoading(false)
          return
        }

        // Fetch photographer from users collection
        const photographerQuery = query(
          collection(db, "users"), 
          where("uid", "==", photographerId)
        )
        const photographerSnapshot = await getDocs(photographerQuery)
        
        if (photographerSnapshot.empty) {
          setError("Photographer not found")
          setLoading(false)
          return
        }

        const photographerData = photographerSnapshot.docs[0].data() as UserData
        setPhotographer({ 
          ...photographerData, 
          id: photographerSnapshot.docs[0].id 
        })

        // Check if already confirmed
        if (eventData.photographerConfirmations && eventData.photographerConfirmations[photographerId] !== undefined) {
          setConfirmed(eventData.photographerConfirmations[photographerId])
        }

      } catch (error) {
        console.error("Error fetching data:", error)
        setError("Failed to load event details")
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [eventId, photographerId])

  const handleConfirmation = async (confirm: boolean) => {
    if (!eventId || !photographerId) return

    setConfirming(true)
    try {
      await updateDoc(doc(db, "events", eventId), {
        [`photographerConfirmations.${photographerId}`]: confirm
      })

      setConfirmed(confirm)
    } catch (error) {
      console.error("Error updating confirmation:", error)
      setError("Failed to update confirmation. Please try again.")
    } finally {
      setConfirming(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-mainNavyText"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="max-w-md">
          <CardContent className="p-6 text-center">
            <XCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-2">Error</h2>
            <p className="text-gray-600">{error}</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!event || !photographer) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="max-w-md">
          <CardContent className="p-6 text-center">
            <p className="text-gray-600">Event or photographer data not found.</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  const country = getCountryByCode(event.country)

  if (confirmed !== null) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Card className="max-w-md">
          <CardContent className="p-6 text-center">
            {confirmed ? (
              <>
                <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
                <h2 className="text-xl font-semibold mb-2">Confirmed!</h2>
                <p className="text-gray-600 mb-6">
                  Thank you for confirming your participation in "{event.title}".
                </p>
              </>
            ) : (
              <>
                <XCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
                <h2 className="text-xl font-semibold mb-2">Declined</h2>
                <p className="text-gray-600 mb-6">
                  You have declined to participate in "{event.title}".
                </p>
              </>
            )}
            
            {/* Navigation Buttons */}
            <div className="space-y-3">
              <Button
                onClick={() => window.location.href = '/'}
                className="w-full bg-mainNavyText hover:bg-mainNavyText/90 text-white"
              >
                <Home className="h-4 w-4 mr-2" />
                Return to Homepage
              </Button>
              <Button
                onClick={() => window.location.href = '/admin'}
                variant="outline"
                className="w-full border-mainNavyText text-mainNavyText hover:bg-mainNavyText/10"
              >
                <Shield className="h-4 w-4 mr-2" />
                Photographer Login
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-center">Event Confirmation</CardTitle>
            <p className="text-center text-gray-600">
              Hi {photographer.name}, you've been invited to photograph this event
            </p>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Event Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-semibold mb-4">Event Details</h3>
                
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium text-gray-900">{event.title}</h4>
                    {event.tags && event.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-1">
                        {event.tags.map((tag) => (
                          <Badge key={tag} variant="outline" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>

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

                  <div className="flex items-center text-sm text-gray-600">
                    <Users className="h-4 w-4 mr-2" />
                    <span>{event.photographerIds?.length || 0} photographer(s) assigned</span>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-4">Event Image</h3>
                {event.imageUrl && (
                  <Image
                    src={event.imageUrl}
                    alt={event.title}
                    width={400}
                    height={300}
                    className="rounded-md object-cover w-full"
                  />
                )}
              </div>
            </div>

            {/* Description */}
            {event.description && (
              <div>
                <h3 className="text-lg font-semibold mb-2">Description</h3>
                <div
                  className="prose max-w-none text-sm"
                  dangerouslySetInnerHTML={{ __html: event.description }}
                />
              </div>
            )}

            {/* Note to Photographer */}
            {event.noteToPhotographer && (
              <div>
                <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
                  <MessageSquare className="h-5 w-5" />
                  Special Instructions
                </h3>
                <div className="bg-blue-50 p-4 rounded-md">
                  <p className="text-sm text-blue-900">{event.noteToPhotographer}</p>
                </div>
              </div>
            )}

            <Separator />

            {/* Confirmation Buttons */}
            <div className="text-center space-y-4">
              <h3 className="text-lg font-semibold">Will you be able to photograph this event?</h3>
              <div className="flex justify-center gap-4">
                <Button
                  onClick={() => handleConfirmation(true)}
                  disabled={confirming}
                  className="bg-green-600 hover:bg-green-700 text-white px-8 py-2"
                >
                  {confirming ? "Confirming..." : "Yes, I'll be there"}
                </Button>
                <Button
                  variant="outline"
                  onClick={() => handleConfirmation(false)}
                  disabled={confirming}
                  className="border-red-300 text-red-600 hover:bg-red-50 px-8 py-2"
                >
                  {confirming ? "Updating..." : "Sorry, I can't make it"}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 