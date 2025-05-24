"use client"

import { AdminSidebarLayout } from "@/components/admin/admin-sidebar-layout"
import { usePathname } from "next/navigation"

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()

  // Don't apply admin layout to login page
  if (pathname === "/admin/login") {
    return children
  }

  return <AdminSidebarLayout>{children}</AdminSidebarLayout>
} 