"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { doc, getDoc, addDoc, updateDoc, collection, serverTimestamp } from "firebase/firestore"
import { db } from "@/lib/firebase"
import type { EventType } from "@/lib/types"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tag, Palette } from "lucide-react"

interface EventTypeFormProps {
  eventTypeId?: string
}

export function EventTypeForm({ eventTypeId }: EventTypeFormProps) {
  const router = useRouter()
  const isEditing = !!eventTypeId

  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState("")

  const [formData, setFormData] = useState<Partial<EventType>>({
    name: "",
    description: "",
    color: "#3B82F6",
  })

  // Fetch event type data if editing
  useEffect(() => {
    const fetchEventTypeData = async () => {
      if (!eventTypeId) return

      setLoading(true)
      try {
        const eventTypeDoc = await getDoc(doc(db, "eventTypes", eventTypeId))
        if (eventTypeDoc.exists()) {
          const eventTypeData = eventTypeDoc.data() as EventType
          setFormData({
            name: eventTypeData.name || "",
            description: eventTypeData.description || "",
            color: eventTypeData.color || "#3B82F6",
          })
        }
      } catch (error) {
        console.error("Error fetching event type:", error)
        setError("Failed to load event type data")
      } finally {
        setLoading(false)
      }
    }

    fetchEventTypeData()
  }, [eventTypeId])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setError("")

    try {
      const eventTypeData = {
        ...formData,
        updatedAt: serverTimestamp(),
      }

      if (isEditing) {
        // Update existing event type
        await updateDoc(doc(db, "eventTypes", eventTypeId), eventTypeData)
      } else {
        // Create new event type
        await addDoc(collection(db, "eventTypes"), {
          ...eventTypeData,
          createdAt: serverTimestamp(),
        })
      }

      router.push("/admin/event-types")
    } catch (error) {
      console.error("Error saving event type:", error)
      setError("Failed to save event type. Please try again.")
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center p-8">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-mainNavyText"></div>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Tag className="h-5 w-5" />
            {isEditing ? "Edit Event Type" : "Create Event Type"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {error && (
            <div className="mb-6 p-4 bg-red-100 text-red-700 rounded-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name">
                Name <span className="text-red-500">*</span>
              </Label>
              <Input
                id="name"
                name="name"
                type="text"
                required
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Enter event type name"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                name="description"
                rows={4}
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Enter event type description"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="color" className="flex items-center gap-2">
                <Palette className="h-4 w-4" />
                Color
              </Label>
              <div className="flex items-center gap-4">
                <Input
                  id="color"
                  name="color"
                  type="color"
                  value={formData.color}
                  onChange={handleInputChange}
                  className="w-20 h-10"
                />
                <div 
                  className="w-10 h-10 rounded border-2 border-gray-300"
                  style={{ backgroundColor: formData.color }}
                />
                <span className="text-sm text-gray-600">{formData.color}</span>
              </div>
            </div>

            <div className="flex justify-end space-x-4 pt-6">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push("/admin/event-types")}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={saving}>
                {saving ? "Saving..." : "Save Event Type"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
} 