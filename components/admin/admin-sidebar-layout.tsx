"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { useAuthStore } from "@/lib/store/auth-store"
import { useFirebase } from "@/components/firebase-provider"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import {
  Calendar,
  Camera,
  Tag,
  Users,
  LogOut,
  Menu,
  X,
  Settings,
  BarChart3,
  FileText,
  FileImage,
} from "lucide-react"
import { cn } from "@/lib/utils"

interface AdminSidebarLayoutProps {
  children: React.ReactNode
}

export function AdminSidebarLayout({ children }: AdminSidebarLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const pathname = usePathname()
  const router = useRouter()
  const { auth } = useFirebase()
  const { user, isAdmin, clearAuth } = useAuthStore()

  const handleLogout = async () => {
    try {
      if (auth) {
        await auth.signOut()
        clearAuth()
        router.push("/admin/login")
      }
    } catch (error) {
      console.error("Error during logout:", error)
      clearAuth()
      router.push("/admin/login")
    }
  }

  const navigation = [
    {
      name: "Dashboard",
      href: "/admin",
      icon: BarChart3,
      current: pathname === "/admin",
    },
    {
      name: "Events",
      href: "/admin/events",
      icon: Calendar,
      current: pathname.startsWith("/admin/events"),
    },
    {
      name: "Event Types",
      href: "/admin/event-types",
      icon: Tag,
      current: pathname.startsWith("/admin/event-types"),
      adminOnly: true,
    },
    {
      name: "Photographers",
      href: "/admin/photographers",
      icon: Camera,
      current: pathname.startsWith("/admin/photographers"),
      adminOnly: true,
    },
    {
      name: "Banners",
      href: "/admin/banners",
      icon: FileImage,
      current: pathname.startsWith("/admin/banners"),
      adminOnly: true,
    },
    {
      name: "Reports",
      href: "/admin/reports",
      icon: FileText,
      current: pathname.startsWith("/admin/reports"),
      adminOnly: true,
    },
  ]

  const filteredNavigation = navigation.filter(item => !item.adminOnly || isAdmin)

  const Sidebar = ({ mobile = false }: { mobile?: boolean }) => (
    <div className={cn(
      "flex flex-col h-full bg-white border-r border-gray-200",
      mobile ? "w-full" : "w-64"
    )}>
      {/* Logo */}
      <div className="flex items-center justify-between h-16 px-6 border-b border-gray-200">
        <div className="flex items-center">
          <h1 className="text-xl font-bold text-mainNavyText">Sportograf</h1>
          <Badge variant="secondary" className="ml-2 text-xs">
            Admin
          </Badge>
        </div>
        {mobile && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setSidebarOpen(false)}
          >
            <X className="h-5 w-5" />
          </Button>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-6 space-y-2">
        {filteredNavigation.map((item) => {
          const Icon = item.icon
          return (
            <Link
              key={item.name}
              href={item.href}
              onClick={() => mobile && setSidebarOpen(false)}
              className={cn(
                "flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors",
                item.current
                  ? "bg-mainNavyText text-white"
                  : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
              )}
            >
              <Icon className="mr-3 h-5 w-5" />
              {item.name}
            </Link>
          )
        })}
      </nav>

      <Separator />

      {/* User section */}
      <div className="p-4">
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-8 h-8 bg-mainNavyText rounded-full flex items-center justify-center">
            <span className="text-white text-sm font-medium">
              {user?.email?.charAt(0).toUpperCase()}
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900 truncate">
              {user?.email}
            </p>
            <p className="text-xs text-gray-500">
              {isAdmin ? "Administrator" : "Photographer"}
            </p>
          </div>
        </div>

        <div className="space-y-2">
          <Link
            href="/admin/profile"
            onClick={() => mobile && setSidebarOpen(false)}
            className="flex items-center px-3 py-2 text-sm text-gray-700 rounded-md hover:bg-gray-100"
          >
            <Settings className="mr-3 h-4 w-4" />
            Profile Settings
          </Link>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleLogout}
            className="w-full justify-start text-gray-700 hover:bg-gray-100"
          >
            <LogOut className="mr-3 h-4 w-4" />
            Sign Out
          </Button>
        </div>
      </div>
    </div>
  )

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Desktop Sidebar */}
      <div className="hidden lg:flex lg:flex-shrink-0">
        <Sidebar />
      </div>

      {/* Mobile Sidebar */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="fixed inset-0 bg-black bg-opacity-25" onClick={() => setSidebarOpen(false)} />
          <div className="fixed inset-y-0 left-0 w-64 bg-white">
            <Sidebar mobile />
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Mobile Header */}
        <div className="lg:hidden flex items-center justify-between h-16 px-4 bg-white border-b border-gray-200">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu className="h-5 w-5" />
          </Button>
          <h1 className="text-lg font-semibold text-mainNavyText">Sportograf Admin</h1>
          <div className="w-8" /> {/* Spacer */}
        </div>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto">
          <div className="p-6">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
} 