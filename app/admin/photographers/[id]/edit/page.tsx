"use client"

import { AdminDashboard } from "@/components/admin/dashboard"
import { PhotographerForm } from "@/components/admin/photographer-form"

export default function EditPhotographerPage({ params }: { params: { id: string } }) {
  return (
    <AdminDashboard>
      <PhotographerForm photographerId={params.id} />
    </AdminDashboard>
  )
}
