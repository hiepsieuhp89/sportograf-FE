"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { onAuthStateChanged } from "firebase/auth"
import { useFirebase } from "@/components/firebase-provider"
import { isAdmin, isPhotographer } from "@/lib/firebase"
import Link from "next/link"
import { LogOut, Camera, Calendar, User } from "lucide-react"

export function AdminDashboard({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [role, setRole] = useState<"admin" | "photographer" | null>(null)
  const router = useRouter()
  const { auth } = useFirebase()

  useEffect(() => {
    if (!auth) {
      setLoading(false)
      return
    }

    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser)

        // Check user role
        if (await isAdmin(currentUser.uid)) {
          setRole("admin")
        } else if (await isPhotographer(currentUser.uid)) {
          setRole("photographer")
        } else {
          // Not authorized
          await auth.signOut()
          router.push("/admin/login")
        }
      } else {
        router.push("/admin/login")
      }

      setLoading(false)
    })

    return () => unsubscribe()
  }, [router, auth])

  const handleLogout = async () => {
    if (auth) {
      await auth.signOut()
      router.push("/admin/login")
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  if (!user || !role) {
    return null
  }

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-64 bg-[#0f1923] text-white">
        <div className="p-4 border-b border-gray-700">
          <h1 className="text-xl font-bold">Sportograf Admin</h1>
        </div>
        <nav className="p-4">
          <ul className="space-y-2">
            {role === "admin" && (
              <>
                <li>
                  <Link href="/admin/events" className="flex items-center gap-2 p-2 rounded-md hover:bg-gray-700">
                    <Calendar className="h-5 w-5" />
                    <span>Events</span>
                  </Link>
                </li>
                <li>
                  <Link
                    href="/admin/photographers"
                    className="flex items-center gap-2 p-2 rounded-md hover:bg-gray-700"
                  >
                    <Camera className="h-5 w-5" />
                    <span>Photographers</span>
                  </Link>
                </li>
              </>
            )}
            <li>
              <Link href="/admin/profile" className="flex items-center gap-2 p-2 rounded-md hover:bg-gray-700">
                <User className="h-5 w-5" />
                <span>Profile</span>
              </Link>
            </li>
            <li>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 p-2 rounded-md hover:bg-gray-700 w-full text-left"
              >
                <LogOut className="h-5 w-5" />
                <span>Logout</span>
              </button>
            </li>
          </ul>
        </nav>
      </div>

      {/* Main content */}
      <div className="flex-1 overflow-auto">
        <div className="p-6">{children}</div>
      </div>
    </div>
  )
}
