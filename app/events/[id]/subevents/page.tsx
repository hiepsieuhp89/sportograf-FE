"use client"

import { useState, useEffect } from "react"
import { collection, query, where, getDocs } from "firebase/firestore"
import { db } from "@/lib/firebase"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { SubeventCard } from "@/components/subevent-card"
import type { Subevent, Event } from "@/lib/types"
import { doc, getDoc } from "firebase/firestore"

export default function SubeventsPage({ params }: { params: { id: string } }) {
  const [event, setEvent] = useState<Event | null>(null)
  const [subevents, setSubevents] = useState<Subevent[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    const fetchEventAndSubevents = async () => {
      try {
        // Fetch event
        const eventDoc = await getDoc(doc(db, "events", params.id))
        if (!eventDoc.exists()) {
          setError("Event not found")
          setLoading(false)
          return
        }

        setEvent({ id: eventDoc.id, ...eventDoc.data() } as Event)

        // Fetch subevents
        const subeventsQuery = query(collection(db, "subevents"), where("eventId", "==", params.id))
        const snapshot = await getDocs(subeventsQuery)

        const subeventsList = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Subevent[]

        setSubevents(subeventsList)
      } catch (error) {
        console.error("Error fetching subevents:", error)
        setError("Failed to load subevents")
      } finally {
        setLoading(false)
      }
    }

    fetchEventAndSubevents()
  }, [params.id])

  return (
    <main>
      <Header />
      <div className="container mx-auto px-4 py-8">
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : error ? (
          <div className="bg-red-100 text-red-700 p-4 rounded-md">{error}</div>
        ) : (
          <>
            <h1 className="text-2xl font-bold mb-6">Subevents</h1>
            {subevents.length === 0 ? (
              <div className="bg-gray-100 p-6 rounded-md text-center">
                <p className="text-gray-500">No subevents found for this event.</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {subevents.map((subevent) => (
                  <SubeventCard key={subevent.id} subevent={subevent} />
                ))}
              </div>
            )}
          </>
        )}
      </div>
      <Footer />
    </main>
  )
}
