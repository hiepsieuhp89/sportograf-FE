"use client"

import { AdminDashboard } from "@/components/admin/dashboard"
import { EventForm } from "@/components/admin/event-form"

export default function CreateEventPage() {
  return (
    <AdminDashboard>
      <EventForm />
    </AdminDashboard>
  )
}
