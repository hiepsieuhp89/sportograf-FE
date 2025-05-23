"use client"

import { AdminDashboard } from "@/components/admin/dashboard"
import { EventsList } from "@/components/admin/events-list"

export default function AdminEventsPage() {
  return (
    <AdminDashboard>
      <EventsList />
    </AdminDashboard>
  )
}
