"use client"

import { AdminDashboard } from "@/components/admin/dashboard"
import { useFirebase } from "@/components/firebase-provider"
import type { Event, Photographer } from "@/lib/types"
import { collection, getDocs, limit, orderBy, query, where } from "firebase/firestore"
import { ArrowRight, Calendar, Camera } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { useAuthStore } from "@/lib/store/auth-store"

export default function AdminPage() {
  const [recentEvents, setRecentEvents] = useState<Event[]>([])
  const [photographers, setPhotographers] = useState<Photographer[]>([])
  const [loading, setLoading] = useState(true)
  const { auth, db, isInitialized } = useFirebase()
  const router = useRouter()
  const { user, isAdmin, setUser, setIsAdmin } = useAuthStore()

  useEffect(() => {
    const checkAdminStatus = async () => {
      try {
        // Wait for Firebase to initialize
        if (!isInitialized) {
          return
        }

        // Check if auth is available
        if (!auth) {
          console.error("Auth not initialized")
          router.push("/admin/login")
          return
        }

        // Check stored auth state
        if (!user) {
          router.push("/admin/login")
          return
        }

        if (!db) {
          console.error("Firestore not initialized")
          return
        }

        // Verify admin status in Firestore
        const usersQuery = query(collection(db, "users"), where("uid", "==", user.uid))
        const snapshot = await getDocs(usersQuery)
        if (!snapshot.empty) {
          const userData = snapshot.docs[0].data()
          setIsAdmin(userData.role === "admin")
        } else {
          setUser(null)
          setIsAdmin(false)
          router.push("/admin/login")
        }
      } catch (error) {
        console.error("Error in auth check:", error)
        setUser(null)
        setIsAdmin(false)
        router.push("/admin/login")
      } finally {
        setLoading(false)
      }
    }

    checkAdminStatus()
  }, [auth, db, router, isInitialized, user, setUser, setIsAdmin])

  useEffect(() => {
    const fetchDashboardData = async () => {
      if (!isAdmin || !db) return
      
      try {
        // Fetch recent events
        const eventsQuery = query(collection(db, "events"), orderBy("date", "desc"), limit(5))
        const eventsSnapshot = await getDocs(eventsQuery)
        const eventsList = eventsSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Event[]
        setRecentEvents(eventsList)

        // Fetch photographers
        const photographersQuery = query(collection(db, "photographers"), orderBy("name"), limit(5))
        const photographersSnapshot = await getDocs(photographersQuery)
        const photographersList = photographersSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Photographer[]
        setPhotographers(photographersList)
      } catch (error) {
        console.error("Error fetching dashboard data:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchDashboardData()
  }, [db, isAdmin])

  return (
    <AdminDashboard>
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>

      {loading ? (
        <div className="flex justify-center p-8">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-mainNavyText"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-mainBackgroundV1 p-6 rounded-lg shadow-sm">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold flex items-center">
                <Calendar className="h-5 w-5 mr-2" />
                Recent Events
              </h2>
              <Link href="/admin/events" className="text-sm text-mainNavyText hover:underline flex items-center">
                View all <ArrowRight className="h-4 w-4 ml-1" />
              </Link>
            </div>
            {recentEvents.length === 0 ? (
              <p className="text-gray-500 text-center py-4">No events found</p>
            ) : (
              <ul className="divide-y divide-gray-200">
                {recentEvents.map((event) => (
                  <li key={event.id} className="py-3">
                    <Link href={`/admin/events/${event.id}/edit`} className="hover:text-mainNavyText">
                      <div className="font-medium">{event.title}</div>
                      <div className="text-sm text-gray-500">{event.date}</div>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {isAdmin && (
            <div className="bg-mainBackgroundV1 p-6 rounded-lg shadow-sm">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold flex items-center">
                  <Camera className="h-5 w-5 mr-2" />
                  Photographers
                </h2>
                <Link href="/admin/photographers" className="text-sm text-mainNavyText hover:underline flex items-center">
                  View all <ArrowRight className="h-4 w-4 ml-1" />
                </Link>
              </div>
              {photographers.length === 0 ? (
                <p className="text-gray-500 text-center py-4">No photographers found</p>
              ) : (
                <ul className="divide-y divide-gray-200">
                  {photographers.map((photographer) => (
                    <li key={photographer.id} className="py-3">
                      <Link href={`/admin/photographers/${photographer.id}/edit`} className="hover:text-mainNavyText">
                        <div className="font-medium">{photographer.name}</div>
                        <div className="text-sm text-gray-500">{photographer.email}</div>
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}
        </div>
      )}
    </AdminDashboard>
  )
}
