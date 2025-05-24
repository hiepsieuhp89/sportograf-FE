"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { EnhancedEventForm } from "@/components/admin/enhanced-event-form"
import { EnhancedEventsList } from "@/components/admin/enhanced-events-list"

export default function AdminEventsPage() {
  const [showForm, setShowForm] = useState(false)
  const [editingEvent, setEditingEvent] = useState<string | null>(null)

  const handleNewEvent = () => {
    setEditingEvent(null)
    setShowForm(true)
  }

  const handleEditEvent = (eventId: string) => {
    setEditingEvent(eventId)
    setShowForm(true)
  }

  const handleFormClose = () => {
    setShowForm(false)
    setEditingEvent(null)
  }

  if (showForm) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">
            {editingEvent ? "Edit Event" : "Create New Event"}
          </h1>
          <Button variant="outline" onClick={handleFormClose}>
            Back to Events
          </Button>
        </div>
        <EnhancedEventForm eventId={editingEvent || undefined} />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Events</h1>
        <Button onClick={handleNewEvent} className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          New Event
        </Button>
      </div>
      <EnhancedEventsList />
    </div>
  )
}
