"use client"

import { AdminDashboard } from "@/components/admin/dashboard"
import { ProfileForm } from "@/components/admin/profile-form"

export default function AdminProfilePage() {
  return (
    <AdminDashboard>
      <ProfileForm />
    </AdminDashboard>
  )
}
