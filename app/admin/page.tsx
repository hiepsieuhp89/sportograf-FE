"use client"

import { useFirebase } from "@/components/firebase-provider"
import type { Event, Photographer } from "@/lib/types"
import { collection, getDocs, limit, orderBy, query, where } from "firebase/firestore"
import { ArrowRight, Calendar, Camera, Users, TrendingUp, BarChart3, CheckCircle, Tag } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { useAuthStore } from "@/lib/store/auth-store"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { format } from "date-fns"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export default function AdminPage() {
  const [recentEvents, setRecentEvents] = useState<Event[]>([])
  const [photographers, setPhotographers] = useState<Photographer[]>([])
  const [stats, setStats] = useState({
    totalEvents: 0,
    totalPhotographers: 0,
    upcomingEvents: 0,
    confirmedEvents: 0
  })
  const [loading, setLoading] = useState(true)
  const { auth, db, isInitialized } = useFirebase()
  const router = useRouter()
  const { user, isAdmin, setUser, setIsAdmin } = useAuthStore()

  const [upcomingEvents, setUpcomingEvents] = useState<Event[]>([])
  const [completedEvents, setCompletedEvents] = useState<Event[]>([])
  const [suggestedEvents, setSuggestedEvents] = useState<Event[]>([])

  useEffect(() => {
    const checkAdminStatus = async () => {
      try {
        if (!isInitialized) return

        if (!auth) {
          console.error("Auth not initialized")
          router.push("/admin/login")
          return
        }

        if (!user) {
          router.push("/admin/login")
          return
        }

        if (!db) {
          console.error("Firestore not initialized")
          return
        }

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
      if (!db || !user) return
      
      try {
        // Fetch all events
        const now = new Date()
        const allEventsSnapshot = await getDocs(collection(db, "events"))
        const allEvents = allEventsSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Event[]

        if (isAdmin) {
          // Admin dashboard data
          const upcomingEvents = allEvents.filter(event => new Date(event.date) > now)
          const confirmedEvents = allEvents.filter(event => 
            event.photographerConfirmations && 
            Object.values(event.photographerConfirmations).some(confirmed => confirmed === true)
          )

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

          // Get total photographers count
          const allPhotographersSnapshot = await getDocs(collection(db, "photographers"))

          setStats({
            totalEvents: allEvents.length,
            totalPhotographers: allPhotographersSnapshot.size,
            upcomingEvents: upcomingEvents.length,
            confirmedEvents: confirmedEvents.length
          })
        } else {
          // Photographer dashboard data
          const photographerEvents = allEvents.filter(event => 
            event.photographerIds && event.photographerIds.includes(user.uid)
          )

          const upcoming = photographerEvents.filter(event => new Date(event.date) > now)
          const completed = photographerEvents.filter(event => {
            const eventEndDate = event.endDate ? new Date(event.endDate) : new Date(event.date)
            return eventEndDate < now
          })

          // Get suggested events (events without this photographer assigned)
          const suggested = allEvents
            .filter(event => 
              new Date(event.date) > now && 
              (!event.photographerIds || !event.photographerIds.includes(user.uid))
            )
            .slice(0, 3)

          setUpcomingEvents(upcoming)
          setCompletedEvents(completed)
          setSuggestedEvents(suggested)

          setStats({
            totalEvents: photographerEvents.length,
            upcomingEvents: upcoming.length,
            confirmedEvents: completed.length,
            totalPhotographers: 0
          })
        }
      } catch (error) {
        console.error("Error fetching dashboard data:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchDashboardData()
  }, [db, isAdmin, user])

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-mainNavyText"></div>
      </div>
    )
  }

  if (!isAdmin) {
    return (
      <div className="space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Photographer Dashboard</h1>
          <p className="text-gray-600 mt-2">Welcome back! Here's what's happening with your events.</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Events</p>
                  <p className="text-3xl font-bold text-gray-900">{stats.totalEvents}</p>
                </div>
                <div className="p-3 bg-blue-100 rounded-full">
                  <Calendar className="h-6 w-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Upcoming Events</p>
                  <p className="text-3xl font-bold text-gray-900">{stats.upcomingEvents}</p>
                </div>
                <div className="p-3 bg-green-100 rounded-full">
                  <TrendingUp className="h-6 w-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Completed Events</p>
                  <p className="text-3xl font-bold text-gray-900">{stats.confirmedEvents}</p>
                </div>
                <div className="p-3 bg-purple-100 rounded-full">
                  <CheckCircle className="h-6 w-6 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Upcoming Events */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
            <CardTitle className="text-lg font-semibold flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Upcoming Events
            </CardTitle>
            <Link href="/admin/events">
              <Button variant="outline" size="sm" className="flex items-center gap-2">
                View all <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </CardHeader>
          <CardContent>
            {upcomingEvents.length === 0 ? (
              <div className="text-center py-8">
                <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">No upcoming events</p>
              </div>
            ) : (
              <div className="space-y-4">
                {upcomingEvents.map((event) => (
                  <div key={event.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                    <div className="flex-1">
                      <Link href={`/admin/events/${event.id}`} className="hover:text-mainNavyText">
                        <h4 className="font-medium text-gray-900">{event.title}</h4>
                        <div className="flex items-center gap-4 mt-1">
                          <p className="text-sm text-gray-500">
                            {format(new Date(event.date), "MMM dd, yyyy")}
                            {event.endDate && ` - ${format(new Date(event.endDate), "MMM dd, yyyy")}`}
                          </p>
                          <Badge variant="secondary" className="text-xs">
                            {event.location}
                          </Badge>
                        </div>
                      </Link>
                    </div>
                    <Link href={`/admin/events/${event.id}`}>
                      <Button variant="ghost" size="sm">View Details</Button>
                    </Link>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Completed Events */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
            <CardTitle className="text-lg font-semibold flex items-center gap-2">
              <CheckCircle className="h-5 w-5" />
              Completed Events
            </CardTitle>
          </CardHeader>
          <CardContent>
            {completedEvents.length === 0 ? (
              <div className="text-center py-8">
                <CheckCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">No completed events yet</p>
              </div>
            ) : (
              <div className="space-y-4">
                {completedEvents.map((event) => (
                  <div key={event.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                    <div className="flex-1">
                      <Link href={`/admin/events/${event.id}`} className="hover:text-mainNavyText">
                        <h4 className="font-medium text-gray-900">{event.title}</h4>
                        <div className="flex items-center gap-4 mt-1">
                          <p className="text-sm text-gray-500">
                            {format(new Date(event.date), "MMM dd, yyyy")}
                            {event.endDate && ` - ${format(new Date(event.endDate), "MMM dd, yyyy")}`}
                          </p>
                          <Badge variant="secondary" className="text-xs">
                            {event.location}
                          </Badge>
                        </div>
                      </Link>
                    </div>
                    <Link href={`/admin/events/${event.id}`}>
                      <Button variant="ghost" size="sm">View Details</Button>
                    </Link>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Suggested Events */}
        {suggestedEvents.length > 0 && (
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
              <CardTitle className="text-lg font-semibold flex items-center gap-2">
                <Tag className="h-5 w-5" />
                Suggested Events
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {suggestedEvents.map((event) => (
                  <div key={event.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                    <div className="flex-1">
                      <Link href={`/admin/events/${event.id}`} className="hover:text-mainNavyText">
                        <h4 className="font-medium text-gray-900">{event.title}</h4>
                        <div className="flex items-center gap-4 mt-1">
                          <p className="text-sm text-gray-500">
                            {format(new Date(event.date), "MMM dd, yyyy")}
                            {event.endDate && ` - ${format(new Date(event.endDate), "MMM dd, yyyy")}`}
                          </p>
                          <Badge variant="secondary" className="text-xs">
                            {event.location}
                          </Badge>
                        </div>
                      </Link>
                    </div>
                    <Link href={`/admin/events/${event.id}`}>
                      <Button variant="ghost" size="sm">View Details</Button>
                    </Link>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-2">Welcome back! Here's what's happening with your events.</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Events</p>
                <p className="text-3xl font-bold text-gray-900">{stats.totalEvents}</p>
              </div>
              <div className="p-3 bg-blue-100 rounded-full">
                <Calendar className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Photographers</p>
                <p className="text-3xl font-bold text-gray-900">{stats.totalPhotographers}</p>
              </div>
              <div className="p-3 bg-green-100 rounded-full">
                <Camera className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Upcoming Events</p>
                <p className="text-3xl font-bold text-gray-900">{stats.upcomingEvents}</p>
              </div>
              <div className="p-3 bg-yellow-100 rounded-full">
                <TrendingUp className="h-6 w-6 text-yellow-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Confirmed Events</p>
                <p className="text-3xl font-bold text-gray-900">{stats.confirmedEvents}</p>
              </div>
              <div className="p-3 bg-purple-100 rounded-full">
                <BarChart3 className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Events */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
            <CardTitle className="text-lg font-semibold flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Recent Events
            </CardTitle>
            <Link href="/admin/events">
              <Button variant="outline" size="sm" className="flex items-center gap-2">
                View all <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </CardHeader>
          <CardContent>
            {recentEvents.length === 0 ? (
              <div className="text-center py-8">
                <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500 mb-4">No events found</p>
                <Link href="/admin/events">
                  <Button>Create your first event</Button>
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {recentEvents.map((event) => (
                  <div key={event.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                    <div className="flex-1">
                      <Link href={`/admin/events/${event.id}`} className="hover:text-mainNavyText">
                        <h4 className="font-medium text-gray-900">{event.title}</h4>
                        <div className="flex items-center gap-4 mt-1">
                          <p className="text-sm text-gray-500">
                            {format(new Date(event.date), "MMM dd, yyyy")}
                          </p>
                          {event.photographerIds && event.photographerIds.length > 0 && (
                            <Badge variant="secondary" className="text-xs">
                              {event.photographerIds.length} photographer{event.photographerIds.length !== 1 ? 's' : ''}
                            </Badge>
                          )}
                        </div>
                      </Link>
                    </div>
                    <Link href={`/admin/events/${event.id}/edit`}>
                      <Button variant="ghost" size="sm">Edit</Button>
                    </Link>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Photographers */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
            <CardTitle className="text-lg font-semibold flex items-center gap-2">
              <Camera className="h-5 w-5" />
              Photographers
            </CardTitle>
            <Link href="/admin/photographers">
              <Button variant="outline" size="sm" className="flex items-center gap-2">
                View all <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </CardHeader>
          <CardContent>
            {photographers.length === 0 ? (
              <div className="text-center py-8">
                <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500 mb-4">No photographers found</p>
                <Link href="/admin/photographers/create">
                  <Button>Add your first photographer</Button>
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {photographers.map((photographer) => (
                  <div key={photographer.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={photographer.profileImageUrl} alt={photographer.name} />
                        <AvatarFallback>
                          {photographer.name.charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <Link href={`/admin/photographers/${photographer.id}/edit`} className="hover:text-mainNavyText">
                          <h4 className="font-medium text-gray-900">{photographer.name}</h4>
                          <p className="text-sm text-gray-500">{photographer.email}</p>
                        </Link>
                      </div>
                    </div>
                    <Link href={`/admin/photographers/${photographer.id}/edit`}>
                      <Button variant="ghost" size="sm">Edit</Button>
                    </Link>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
