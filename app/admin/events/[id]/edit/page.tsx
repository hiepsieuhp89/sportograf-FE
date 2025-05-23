"use client"

import { AdminDashboard } from "@/components/admin/dashboard"
import { EventForm } from "@/components/admin/event-form"

export default function EditEventPage({ params }: { params: { id: string } }) {
  return (
    <AdminDashboard>
      <EventForm eventId={params.id} />
    </AdminDashboard>
  )
}
