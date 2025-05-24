"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import {
  collection,
  doc,
  getDoc,
  getDocs,
  addDoc,
  updateDoc,
  serverTimestamp,
  query,
  orderBy,
} from "firebase/firestore"
import { ref, uploadBytes, getDownloadURL } from "firebase/storage"
import { db, storage } from "@/lib/firebase"
import type { Event, Photographer } from "@/lib/types"
import { Calendar, MapPin, FileImage, Clock, Users, Info } from "lucide-react"

interface EventFormProps {
  eventId?: string
}

export function EventForm({ eventId }: EventFormProps) {
  const router = useRouter()
  const isEditing = !!eventId

  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState("")
  const [photographers, setPhotographers] = useState<Photographer[]>([])

  const [formData, setFormData] = useState<Partial<Event>>({
    title: "",
    description: "",
    date: "",
    time: "",
    location: "",
    url: "",
    photographerIds: [],
  })

  const [imageFile, setImageFile] = useState<File | null>(null)
  const [bestOfImageFile, setBestOfImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [bestOfImagePreview, setBestOfImagePreview] = useState<string | null>(null)

  // Fetch event data if editing
  useEffect(() => {
    const fetchEventData = async () => {
      if (!eventId) return

      setLoading(true)
      try {
        const eventDoc = await getDoc(doc(db, "events", eventId))
        if (eventDoc.exists()) {
          const eventData = eventDoc.data() as Event
          setFormData({
            title: eventData.title || "",
            description: eventData.description || "",
            date: eventData.date || "",
            time: eventData.time || "",
            location: eventData.location || "",
            url: eventData.url || "",
            photographerIds: eventData.photographerIds || [],
            imageUrl: eventData.imageUrl || "",
            bestOfImageUrl: eventData.bestOfImageUrl || "",
          })

          if (eventData.imageUrl) {
            setImagePreview(eventData.imageUrl)
          }

          if (eventData.bestOfImageUrl) {
            setBestOfImagePreview(eventData.bestOfImageUrl)
          }
        }
      } catch (error) {
        console.error("Error fetching event:", error)
        setError("Failed to load event data")
      } finally {
        setLoading(false)
      }
    }

    fetchEventData()
  }, [eventId])

  // Fetch photographers
  useEffect(() => {
    const fetchPhotographers = async () => {
      try {
        const photographersQuery = query(collection(db, "photographers"), orderBy("name"))
        const snapshot = await getDocs(photographersQuery)
        const photographersList = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Photographer[]

        setPhotographers(photographersList)
      } catch (error) {
        console.error("Error fetching photographers:", error)
      }
    }

    fetchPhotographers()
  }, [])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>, type: "image" | "bestOfImage") => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      if (type === "image") {
        setImageFile(file)
        setImagePreview(URL.createObjectURL(file))
      } else {
        setBestOfImageFile(file)
        setBestOfImagePreview(URL.createObjectURL(file))
      }
    }
  }

  const handlePhotographerChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const options = e.target.options
    const selectedValues = []
    for (let i = 0; i < options.length; i++) {
      if (options[i].selected) {
        selectedValues.push(options[i].value)
      }
    }
    setFormData((prev) => ({ ...prev, photographerIds: selectedValues }))
  }

  const uploadImage = async (file: File, path: string): Promise<string> => {
    const storageRef = ref(storage, path)
    await uploadBytes(storageRef, file)
    return getDownloadURL(storageRef)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setError("")

    try {
      let imageUrl = formData.imageUrl
      let bestOfImageUrl = formData.bestOfImageUrl

      // Upload images if provided
      if (imageFile) {
        const path = `events/${Date.now()}_${imageFile.name}`
        imageUrl = await uploadImage(imageFile, path)
      }

      if (bestOfImageFile) {
        const path = `events/best-of/${Date.now()}_${bestOfImageFile.name}`
        bestOfImageUrl = await uploadImage(bestOfImageFile, path)
      }

      const eventData = {
        ...formData,
        imageUrl,
        bestOfImageUrl,
        updatedAt: serverTimestamp(),
      }

      if (isEditing) {
        // Update existing event
        await updateDoc(doc(db, "events", eventId), eventData)
      } else {
        // Create new event
        await addDoc(collection(db, "events"), {
          ...eventData,
          createdAt: serverTimestamp(),
        })
      }

      router.push("/admin/events")
    } catch (error) {
      console.error("Error saving event:", error)
      setError("Failed to save event. Please try again.")
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center p-8">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">{isEditing ? "Edit Event" : "Create Event"}</h1>

      {error && <div className="mb-6 p-4 bg-red-100 text-red-700 rounded-md">{error}</div>}

      <form onSubmit={handleSubmit} className="bg-mainBackgroundV1 p-6 rounded-lg shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                Title <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Info className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  id="title"
                  name="title"
                  type="text"
                  required
                  value={formData.title}
                  onChange={handleInputChange}
                  className="pl-10 w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                id="description"
                name="description"
                rows={4}
                value={formData.description}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-1">
                Date <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  id="date"
                  name="date"
                  type="date"
                  required
                  value={formData.date}
                  onChange={handleInputChange}
                  className="pl-10 w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div>
              <label htmlFor="time" className="block text-sm font-medium text-gray-700 mb-1">
                Time
              </label>
              <div className="relative">
                <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  id="time"
                  name="time"
                  type="time"
                  value={formData.time}
                  onChange={handleInputChange}
                  className="pl-10 w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div>
              <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">
                Location <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  id="location"
                  name="location"
                  type="text"
                  required
                  value={formData.location}
                  onChange={handleInputChange}
                  className="pl-10 w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div>
              <label htmlFor="url" className="block text-sm font-medium text-gray-700 mb-1">
                Event URL
              </label>
              <input
                id="url"
                name="url"
                type="url"
                value={formData.url}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label htmlFor="image" className="block text-sm font-medium text-gray-700 mb-1">
                Event Image <span className="text-red-500">*</span>
              </label>
              <div className="flex items-center space-x-4">
                <div className="flex-1">
                  <div className="relative">
                    <FileImage className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                    <input
                      id="image"
                      name="image"
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleImageChange(e, "image")}
                      className="pl-10 w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
                {imagePreview && (
                  <div className="h-16 w-16 relative">
                    <Image
                      src={imagePreview || "/placeholder.svg"}
                      alt="Event preview"
                      width={64}
                      height={64}
                      className="h-full w-full object-cover rounded-md"
                    />
                  </div>
                )}
              </div>
              {!imageFile && !formData.imageUrl && <p className="text-red-500 text-xs mt-1">Event image is required</p>}
            </div>

            <div>
              <label htmlFor="bestOfImage" className="block text-sm font-medium text-gray-700 mb-1">
                Best of Image <span className="text-red-500">*</span>
              </label>
              <div className="flex items-center space-x-4">
                <div className="flex-1">
                  <div className="relative">
                    <FileImage className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                    <input
                      id="bestOfImage"
                      name="bestOfImage"
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleImageChange(e, "bestOfImage")}
                      className="pl-10 w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
                {bestOfImagePreview && (
                  <div className="h-16 w-16 relative">
                    <Image
                      src={bestOfImagePreview || "/placeholder.svg"}
                      alt="Best of preview"
                      width={64}
                      height={64}
                      className="h-full w-full object-cover rounded-md"
                    />
                  </div>
                )}
              </div>
              {!bestOfImageFile && !formData.bestOfImageUrl && (
                <p className="text-red-500 text-xs mt-1">Best of image is required</p>
              )}
            </div>

            <div>
              <label htmlFor="photographers" className="block text-sm font-medium text-gray-700 mb-1">
                Assign Photographers
              </label>
              <div className="relative">
                <Users className="absolute left-3 top-4 text-gray-400 h-5 w-5" />
                <select
                  id="photographers"
                  name="photographers"
                  multiple
                  value={formData.photographerIds}
                  onChange={handlePhotographerChange}
                  className="pl-10 w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 h-40"
                >
                  {photographers.map((photographer) => (
                    <option key={photographer.id} value={photographer.id}>
                      {photographer.name}
                    </option>
                  ))}
                </select>
              </div>
              <p className="text-xs text-gray-500 mt-1">Hold Ctrl (or Cmd) to select multiple photographers</p>
            </div>
          </div>
        </div>

        <div className="mt-8 flex justify-end space-x-4">
          <button
            type="button"
            onClick={() => router.push("/admin/events")}
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={saving}
            className="px-4 py-2 bg-blue-600 text-mainBackgroundV1 rounded-md hover:bg-blue-700 transition-colors disabled:bg-blue-300"
          >
            {saving ? "Saving..." : "Save Event"}
          </button>
        </div>
      </form>
    </div>
  )
}
