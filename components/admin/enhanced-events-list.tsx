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
import type { Event, EventType } from "@/lib/types"
import type { UserData } from "@/contexts/user-context"
import { format } from "date-fns"
import { collection, deleteDoc, doc, getDocs, orderBy, query, where, updateDoc } from "firebase/firestore"
import { Calendar, CheckCircle, Clock, Edit, Eye, MapPin, Plus, Trash2, Users, XCircle } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useEffect, useState } from "react"

interface PhotographerData extends UserData {
  id: string
}

const getEventStatus = (event: Event) => {
  const now = new Date()
  const startDate = new Date(event.date)
  const endDate = event.endDate ? new Date(event.endDate) : new Date(event.date)
  endDate.setHours(23, 59, 59) // Set end of day

  if (now < startDate) {
    return { status: "upcoming", color: "bg-blue-100 text-blue-800" }
  } else if (now > endDate) {
    return { status: "past", color: "bg-gray-100 text-gray-800" }
  } else {
    return { status: "ongoing", color: "bg-green-100 text-green-800" }
  }
}

export function EnhancedEventsList() {
  const [events, setEvents] = useState<Event[]>([])
  const [eventTypes, setEventTypes] = useState<EventType[]>([])
  const [photographers, setPhotographers] = useState<PhotographerData[]>([])
  const [loading, setLoading] = useState(true)
  const [userRole, setUserRole] = useState<"admin" | "photographer" | null>(null)
  const [userId, setUserId] = useState<string | null>(null)
  const [confirmingEvents, setConfirmingEvents] = useState<Set<string>>(new Set())

  useEffect(() => {
    const checkUserRole = async () => {
      const currentUser = auth.currentUser
      console.log("Checking user role in enhanced-events-list:", {
        userEmail: currentUser?.email,
        uid: currentUser?.uid
      })
      
      if (currentUser) {
        setUserId(currentUser.uid)
        try {
          const adminCheck = await isAdmin(currentUser.uid)
          const photographerCheck = await isPhotographer(currentUser.uid)
          
          console.log("Role check results:", { adminCheck, photographerCheck })
          
          if (adminCheck) {
            setUserRole("admin")
            console.log("User role set to admin")
          } else if (photographerCheck) {
            setUserRole("photographer")
            console.log("User role set to photographer")
          } else {
            console.log("User has no valid role")
            setUserRole(null)
          }
        } catch (error) {
          console.error("Error checking user role:", error)
          setUserRole(null)
        }
      } else {
        console.log("No current user found")
        setUserId(null)
        setUserRole(null)
      }
    }

    // Check immediately if user is already loaded
    if (auth.currentUser) {
      checkUserRole()
    }

    // Also listen for auth state changes
    const unsubscribe = auth.onAuthStateChanged((user) => {
      console.log("Auth state changed:", user?.uid)
      if (user) {
        checkUserRole()
      } else {
        setUserId(null)
        setUserRole(null)
      }
    })

    return () => unsubscribe()
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

        console.log("Total events fetched:", eventsList.length)
        console.log("eventsList: ", JSON.stringify(eventsList.map(e => ({ id: e.id, title: e.title, photographerIds: e.photographerIds }))))

        // If photographer, filter events assigned to them
        if (userRole === "photographer") {
          const originalCount = eventsList.length
          eventsList = eventsList.filter((event) => 
            event.photographerIds && event.photographerIds.includes(userId)
          )
          console.log(`Photographer ${userId} - Filtered from ${originalCount} to ${eventsList.length} events`)
          console.log("Filtered events for photographer:", eventsList.map(e => ({ id: e.id, title: e.title, photographerIds: e.photographerIds })))
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

        // Fetch photographers (only if admin)
        if (userRole === "admin") {
          const photographersQuery = query(
            collection(db, "users"), 
            where("role", "==", "photographer"),
            orderBy("name")
          )
          const photographersSnapshot = await getDocs(photographersQuery)
          const photographersList = photographersSnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          })) as PhotographerData[]
          setPhotographers(photographersList)
        }

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

  const handleEventConfirmation = async (eventId: string, confirm: boolean) => {
    if (!userId) return

    setConfirmingEvents(prev => new Set(prev).add(eventId))
    
    try {
      await updateDoc(doc(db, "events", eventId), {
        [`photographerConfirmations.${userId}`]: confirm
      })

      // Update the local state
      setEvents(prevEvents => 
        prevEvents.map(event => {
          if (event.id === eventId) {
            return {
              ...event,
              photographerConfirmations: {
                ...event.photographerConfirmations,
                [userId]: confirm
              }
            }
          }
          return event
        })
      )
    } catch (error) {
      console.error("Error updating confirmation:", error)
    } finally {
      setConfirmingEvents(prev => {
        const newSet = new Set(prev)
        newSet.delete(eventId)
        return newSet
      })
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
      {events.length === 0 ? (
        <Card>
          <CardContent className="p-6 text-center">
            <p className="text-gray-500">
              {userRole === "photographer" 
                ? "No events assigned to you yet." 
                : "No events found."
              }
            </p>
            {userRole === "admin" && (
              <Link href="/admin/events/create">
                <Button className="mt-4">
                  Create your first event
                </Button>
              </Link>
            )}
            {userRole === "photographer" && (
              <p className="text-sm text-gray-400 mt-2">
                Events will appear here when an admin assigns you to photograph them.
              </p>
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
                  <TableHead>Status</TableHead>
                  <TableHead>Photographers</TableHead>
                  {userRole === "photographer" && (
                    <TableHead>My Status</TableHead>
                  )}
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {events.map((event) => {
                  const eventType = getEventType(event.eventTypeId)
                  const country = getCountryByCode(event.country)
                  const { status, color } = getEventStatus(event)
                  const photographerStatus = userRole === "photographer" ? getPhotographerConfirmationStatus(event, userId!) : null
                  const isConfirming = confirmingEvents.has(event.id)
                  
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
                        {(() => {
                          return (
                            <Badge className={`${color} capitalize`}>
                              {status}
                            </Badge>
                          )
                        })()}
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
                                  const status = getPhotographerConfirmationStatus(event, photographerId)
                                  
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
                            {getConfirmationIcon(photographerStatus!)}
                            <span className="text-sm">
                              {getConfirmationText(photographerStatus!)}
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
                          
                          {userRole === "photographer" && photographerStatus === "pending" && (
                            <>
                              <TooltipProvider>
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <Button 
                                      variant="outline" 
                                      size="sm"
                                      onClick={() => handleEventConfirmation(event.id, true)}
                                      disabled={isConfirming}
                                      className="text-green-600 hover:text-green-700 hover:bg-green-50"
                                    >
                                      <CheckCircle className="h-4 w-4" />
                                    </Button>
                                  </TooltipTrigger>
                                  <TooltipContent>
                                    <p>Confirm Event</p>
                                  </TooltipContent>
                                </Tooltip>
                              </TooltipProvider>
                              
                              <TooltipProvider>
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <Button 
                                      variant="outline" 
                                      size="sm"
                                      onClick={() => handleEventConfirmation(event.id, false)}
                                      disabled={isConfirming}
                                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                    >
                                      <XCircle className="h-4 w-4" />
                                    </Button>
                                  </TooltipTrigger>
                                  <TooltipContent>
                                    <p>Decline Event</p>
                                  </TooltipContent>
                                </Tooltip>
                              </TooltipProvider>
                            </>
                          )}
                          
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