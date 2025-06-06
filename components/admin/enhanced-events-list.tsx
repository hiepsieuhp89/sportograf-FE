"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { getCountryByCode } from "@/lib/countries"
import { auth, db, isAdmin, isPhotographer } from "@/lib/firebase"
import type { Event, EventType, Photographer } from "@/lib/types"
import { format } from "date-fns"
import { collection, deleteDoc, doc, getDocs, orderBy, query } from "firebase/firestore"
import { Calendar, CheckCircle, Clock, Edit, Eye, MapPin, Plus, Trash2, Users, XCircle } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useEffect, useState } from "react"

export function EnhancedEventsList() {
  const [events, setEvents] = useState<Event[]>([])
  const [eventTypes, setEventTypes] = useState<EventType[]>([])
  const [photographers, setPhotographers] = useState<Photographer[]>([])
  const [loading, setLoading] = useState(true)
  const [userRole, setUserRole] = useState<"admin" | "photographer" | null>(null)
  const [userId, setUserId] = useState<string | null>(null)

  useEffect(() => {
    const checkUserRole = async () => {
      const currentUser = auth.currentUser
      console.log("Checking user role in enhanced-events-list:", {
        userEmail: currentUser?.email,
        uid: currentUser?.uid
      })
      
      if (currentUser) {
        setUserId(currentUser.uid)
        if (await isAdmin(currentUser.uid)) {
          setUserRole("admin")
          console.log("User role set to admin")
        } else if (await isPhotographer(currentUser.uid)) {
          setUserRole("photographer")
          console.log("User role set to photographer")
        }
      } else {
        console.log("No current user found")
      }
    }

    // Wait a bit for auth to be ready, then check
    const timer = setTimeout(checkUserRole, 100)
    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    const fetchData = async () => {
      console.log("fetching data for userRole", userRole, "and userId", userId)
      if (!userRole || !userId) return

      try {
        // Fetch events
        console.log("fetching events")
        const eventsQuery = query(collection(db, "events"), orderBy("date", "desc"))
        const eventsSnapshot = await getDocs(eventsQuery)
        let eventsList = eventsSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Event[]

        console.log("eventsList: ", JSON.stringify(eventsList))

        // If photographer, filter events assigned to them
        if (userRole === "photographer") {
          eventsList = eventsList.filter((event) => 
            event.photographerIds && event.photographerIds.includes(userId)
          )
        }

        setEvents(eventsList)

        // Fetch event types
        const eventTypesQuery = query(collection(db, "eventTypes"), orderBy("name"))
        const eventTypesSnapshot = await getDocs(eventTypesQuery)
        const eventTypesList = eventTypesSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as EventType[]
        setEventTypes(eventTypesList)

        // Fetch photographers
        const photographersQuery = query(collection(db, "photographers"), orderBy("name"))
        const photographersSnapshot = await getDocs(photographersQuery)
        const photographersList = photographersSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Photographer[]
        setPhotographers(photographersList)

      } catch (error) {
        console.error("Error fetching data:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [userRole, userId])

  const handleDeleteEvent = async (eventId: string) => {
    if (!confirm("Are you sure you want to delete this event?")) return

    try {
      await deleteDoc(doc(db, "events", eventId))
      setEvents(events.filter((event) => event.id !== eventId))
    } catch (error) {
      console.error("Error deleting event:", error)
    }
  }

  const getEventType = (eventTypeId: string) => {
    return eventTypes.find(et => et.id === eventTypeId)
  }

  const getPhotographerConfirmationStatus = (event: Event, photographerId: string) => {
    if (!event.photographerConfirmations) return "pending"
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

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Events</h1>
          <p className="text-gray-600 mt-1">
            {userRole === "admin" ? "Manage all events" : "Your assigned events"}
          </p>
        </div>
        {userRole === "admin" && (
          <Link href="/admin/events/create">
            <Button className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Create Event
            </Button>
          </Link>
        )}
      </div>

      {events.length === 0 ? (
        <Card>
          <CardContent className="p-6 text-center">
            <p className="text-gray-500">No events found.</p>
            {userRole === "admin" && (
              <Link href="/admin/events/create">
                <Button className="mt-4">
                  Create your first event
                </Button>
              </Link>
            )}
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Event</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Photographers</TableHead>
                  {userRole === "photographer" && (
                    <TableHead>Status</TableHead>
                  )}
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {events.map((event) => {
                  const eventType = getEventType(event.eventTypeId)
                  const country = getCountryByCode(event.country)
                  
                  return (
                    <TableRow key={event.id}>
                      <TableCell>
                        <div className="flex items-center space-x-3">
                          <div className="flex-shrink-0 h-12 w-12 relative">
                            <Image
                              src={event.imageUrl || "/placeholder.svg"}
                              alt={event.title}
                              width={48}
                              height={48}
                              className="rounded-md object-cover"
                            />
                          </div>
                          <div>
                            <div className="font-medium text-gray-900">{event.title}</div>
                            {event.tags && event.tags.length > 0 && (
                              <div className="flex flex-wrap gap-1 mt-1">
                                {event.tags.slice(0, 2).map((tag) => (
                                  <Badge key={tag} variant="outline" className="text-xs">
                                    {tag}
                                  </Badge>
                                ))}
                                {event.tags.length > 2 && (
                                  <Badge variant="outline" className="text-xs">
                                    +{event.tags.length - 2}
                                  </Badge>
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                      </TableCell>
                      
                      <TableCell>
                        {eventType && (
                          <div className="flex items-center gap-2">
                            <div
                              className="w-3 h-3 rounded-full"
                              style={{ backgroundColor: eventType.color }}
                            />
                            <span className="text-sm">{eventType.name}</span>
                          </div>
                        )}
                      </TableCell>
                      
                      <TableCell>
                        <div className="flex items-center text-sm">
                          <Calendar className="h-4 w-4 mr-1 text-gray-400" />
                          <div>
                            <div>{format(new Date(event.date), "MMM dd, yyyy")}</div>
                            {event.endDate && (
                              <div className="text-xs text-gray-500">
                                to {format(new Date(event.endDate), "MMM dd, yyyy")}
                              </div>
                            )}
                            {event.time && (
                              <div className="text-xs text-gray-500">{event.time}</div>
                            )}
                          </div>
                        </div>
                      </TableCell>
                      
                      <TableCell>
                        <div className="flex items-center text-sm">
                          <MapPin className="h-4 w-4 mr-1 text-gray-400" />
                          <div>
                            <div>{event.location}</div>
                            {country && (
                              <div className="text-xs text-gray-500">{country.name}</div>
                            )}
                          </div>
                        </div>
                      </TableCell>
                      
                      <TableCell>
                        <TooltipProvider>
                          <div className="flex items-center space-x-2">
                            <Users className="h-4 w-4 text-gray-400" />
                            <span className="text-sm">{event.photographerIds?.length || 0}</span>
                            {userRole === "admin" && event.photographerIds && event.photographerIds.length > 0 && (
                              <div className="flex space-x-1">
                                {event.photographerIds.slice(0, 3).map((photographerId) => {
                                  const photographer = photographers.find(p => p.id === photographerId)
                                  const status = getConfirmationStatus(event, photographerId)
                                  
                                  return (
                                    <Tooltip key={photographerId}>
                                      <TooltipTrigger>
                                        {getConfirmationIcon(status)}
                                      </TooltipTrigger>
                                      <TooltipContent>
                                        <p>{photographer?.name}: {getConfirmationText(status)}</p>
                                      </TooltipContent>
                                    </Tooltip>
                                  )
                                })}
                                {event.photographerIds.length > 3 && (
                                  <span className="text-xs text-gray-500">
                                    +{event.photographerIds.length - 3}
                                  </span>
                                )}
                              </div>
                            )}
                          </div>
                        </TooltipProvider>
                      </TableCell>
                      
                      {userRole === "photographer" && (
                        <TableCell>
                          <div className="flex items-center gap-2">
                            {getConfirmationIcon(getPhotographerConfirmationStatus(event, userId!))}
                            <span className="text-sm">
                              {getConfirmationText(getPhotographerConfirmationStatus(event, userId!))}
                            </span>
                          </div>
                        </TableCell>
                      )}
                      
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Link href={`/admin/events/${event.id}`}>
                                  <Button variant="outline" size="sm">
                                    <Eye className="h-4 w-4" />
                                  </Button>
                                </Link>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>View Details</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                          
                          {userRole === "admin" && (
                            <>
                              <TooltipProvider>
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <Link href={`/admin/events/${event.id}/edit`}>
                                      <Button variant="outline" size="sm">
                                        <Edit className="h-4 w-4" />
                                      </Button>
                                    </Link>
                                  </TooltipTrigger>
                                  <TooltipContent>
                                    <p>Edit Event</p>
                                  </TooltipContent>
                                </Tooltip>
                              </TooltipProvider>
                              
                              <TooltipProvider>
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <Button 
                                      variant="outline" 
                                      size="sm"
                                      onClick={() => handleDeleteEvent(event.id)}
                                      className="text-red-600 hover:text-red-900"
                                    >
                                      <Trash2 className="h-4 w-4" />
                                    </Button>
                                  </TooltipTrigger>
                                  <TooltipContent>
                                    <p>Delete Event</p>
                                  </TooltipContent>
                                </Tooltip>
                              </TooltipProvider>
                            </>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

function getConfirmationStatus(event: Event, photographerId: string): string {
  if (!event.photographerConfirmations) return "pending"
  return event.photographerConfirmations[photographerId] ? "confirmed" : "declined"
} 