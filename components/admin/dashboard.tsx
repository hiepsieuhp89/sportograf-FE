"use client"

import type React from "react"
import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useFirebase } from "@/components/firebase-provider"
import Link from "next/link"
import { LogOut, Camera, Calendar, User } from "lucide-react"
import { useAuthStore } from "@/lib/store/auth-store"

export function AdminDashboard({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const { auth } = useFirebase()
  const { user, isAdmin, clearAuth } = useAuthStore()

  useEffect(() => {
    if (!user) {
      router.push("/admin/login")
    }
  }, [user, router])

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

  if (!user) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-mainBackgroundV1 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <Link href="/admin" className="flex items-center px-4 text-mainNavyText hover:text-blue-700">
                <Calendar className="h-5 w-5 mr-2" />
                Events
              </Link>
              {isAdmin && (
                <Link href="/admin/photographers" className="flex items-center px-4 text-mainNavyText hover:text-blue-700">
                  <Camera className="h-5 w-5 mr-2" />
                  Photographers
                </Link>
              )}
            </div>
            <div className="flex items-center">
              <Link href="/admin/profile" className="flex items-center px-4 text-mainNavyText hover:text-blue-700">
                <User className="h-5 w-5 mr-2" />
                Profile
              </Link>
              <button
                onClick={handleLogout}
                className="flex items-center px-4 text-mainNavyText hover:text-blue-700"
              >
                <LogOut className="h-5 w-5 mr-2" />
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {children}
      </main>
    </div>
  )
}
