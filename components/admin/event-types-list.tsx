"use client"

import { useState, useEffect } from "react"
import { collection, getDocs, deleteDoc, doc, query, orderBy } from "firebase/firestore"
import { db } from "@/lib/firebase"
import type { EventType } from "@/lib/types"
import Link from "next/link"
import { Edit, Trash2, Plus, Tag } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"

export function EventTypesList() {
  const [eventTypes, setEventTypes] = useState<EventType[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchEventTypes = async () => {
      try {
        const eventTypesQuery = query(collection(db, "eventTypes"), orderBy("name"))
        const snapshot = await getDocs(eventTypesQuery)
        const eventTypesList = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as EventType[]

        setEventTypes(eventTypesList)
      } catch (error) {
        console.error("Error fetching event types:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchEventTypes()
  }, [])

  const handleDeleteEventType = async (eventTypeId: string) => {
    if (!confirm("Are you sure you want to delete this event type?")) return

    try {
      await deleteDoc(doc(db, "eventTypes", eventTypeId))
      setEventTypes(eventTypes.filter((eventType) => eventType.id !== eventTypeId))
    } catch (error) {
      console.error("Error deleting event type:", error)
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
        <h1 className="text-2xl font-bold">Event Types</h1>
        <Link href="/admin/event-types/create">
          <Button className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Create Event Type
          </Button>
        </Link>
      </div>

      {eventTypes.length === 0 ? (
        <div className="bg-mainBackgroundV1 p-6 rounded-lg shadow-sm text-center">
          <p className="text-gray-500">No event types found.</p>
          <Link href="/admin/event-types/create">
            <Button className="mt-4">
              Create your first event type
            </Button>
          </Link>
        </div>
      ) : (
        <div className="bg-mainBackgroundV1 rounded-lg shadow-sm">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Color</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {eventTypes.map((eventType) => (
                <TableRow key={eventType.id}>
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-2">
                      <Tag className="h-4 w-4" />
                      {eventType.name}
                    </div>
                  </TableCell>
                  <TableCell>{eventType.description || "-"}</TableCell>
                  <TableCell>
                    {eventType.color && (
                      <Badge 
                        style={{ backgroundColor: eventType.color }}
                        className="text-white"
                      >
                        {eventType.color}
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Link href={`/admin/event-types/${eventType.id}/edit`}>
                        <Button variant="outline" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                      </Link>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleDeleteEventType(eventType.id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  )
} 