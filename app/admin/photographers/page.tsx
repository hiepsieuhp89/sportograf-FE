"use client"

import { AdminDashboard } from "@/components/admin/dashboard"
import { PhotographersList } from "@/components/admin/photographers-list"

export default function AdminPhotographersPage() {
  return (
    <AdminDashboard>
      <PhotographersList />
    </AdminDashboard>
  )
}
