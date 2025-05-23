"use client"

import { useState, useEffect } from "react"
import { collection, getDocs, deleteDoc, doc, query, orderBy } from "firebase/firestore"
import { db, auth, isAdmin, isPhotographer } from "@/lib/firebase"
import type { Event } from "@/lib/types"
import Link from "next/link"
import { Edit, Trash2, Plus, Calendar, MapPin, Users } from "lucide-react"
import Image from "next/image"

export function EventsList() {
  const [events, setEvents] = useState<Event[]>([])
  const [loading, setLoading] = useState(true)
  const [userRole, setUserRole] = useState<"admin" | "photographer" | null>(null)
  const [userId, setUserId] = useState<string | null>(null)

  useEffect(() => {
    const checkUserRole = async () => {
      const currentUser = auth.currentUser
      if (currentUser) {
        setUserId(currentUser.uid)
        if (await isAdmin(currentUser.uid)) {
          setUserRole("admin")
        } else if (await isPhotographer(currentUser.uid)) {
          setUserRole("photographer")
        }
      }
    }

    checkUserRole()
  }, [])

  useEffect(() => {
    const fetchEvents = async () => {
      if (!userRole || !userId) return

      try {
        const eventsQuery = query(collection(db, "events"), orderBy("date", "desc"))

        const snapshot = await getDocs(eventsQuery)
        let eventsList = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Event[]

        // If photographer, filter events assigned to them
        if (userRole === "photographer") {
          eventsList = eventsList.filter((event) => event.photographerIds && event.photographerIds.includes(userId))
        }

        setEvents(eventsList)
      } catch (error) {
        console.error("Error fetching events:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchEvents()
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

  if (loading) {
    return (
      <div className="flex justify-center p-8">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Events</h1>
        {userRole === "admin" && (
          <Link
            href="/admin/events/create"
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
          >
            <Plus className="h-4 w-4" />
            <span>Create Event</span>
          </Link>
        )}
      </div>

      {events.length === 0 ? (
        <div className="bg-white p-6 rounded-lg shadow-sm text-center">
          <p className="text-gray-500">No events found.</p>
          {userRole === "admin" && (
            <Link
              href="/admin/events/create"
              className="inline-block mt-4 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
            >
              Create your first event
            </Link>
          )}
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Event
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Location
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Photographers
                </th>
                {userRole === "admin" && (
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                )}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {events.map((event) => (
                <tr key={event.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10 relative">
                        <Image
                          src={event.imageUrl || "/placeholder.svg?height=40&width=40"}
                          alt={event.title}
                          width={40}
                          height={40}
                          className="rounded-md object-cover"
                        />
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{event.title}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center text-sm text-gray-500">
                      <Calendar className="h-4 w-4 mr-1" />
                      {event.date}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center text-sm text-gray-500">
                      <MapPin className="h-4 w-4 mr-1" />
                      {event.location}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center text-sm text-gray-500">
                      <Users className="h-4 w-4 mr-1" />
                      {event.photographerIds?.length || 0} assigned
                    </div>
                  </td>
                  {userRole === "admin" && (
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <Link href={`/admin/events/${event.id}/edit`} className="text-blue-600 hover:text-blue-900 mr-4">
                        <Edit className="h-5 w-5 inline" />
                      </Link>
                      <button onClick={() => handleDeleteEvent(event.id)} className="text-red-600 hover:text-red-900">
                        <Trash2 className="h-5 w-5 inline" />
                      </button>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
