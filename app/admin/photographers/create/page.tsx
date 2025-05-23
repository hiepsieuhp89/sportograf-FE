"use client"

import { AdminDashboard } from "@/components/admin/dashboard"
import { PhotographerForm } from "@/components/admin/photographer-form"

export default function CreatePhotographerPage() {
  return (
    <AdminDashboard>
      <PhotographerForm />
    </AdminDashboard>
  )
}
