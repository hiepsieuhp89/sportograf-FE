"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { collection, doc, getDoc, addDoc, updateDoc, query, orderBy, getDocs } from "firebase/firestore"
import { db } from "@/lib/firebase"
import type { BannerImage } from "@/lib/types"
import { uploadFile } from "@/lib/upload-utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import Image from "next/image"

interface BannerFormProps {
  bannerId?: string
}

const getScrollValues = (order: number) => {
  const scrollPatterns = [
    { start: -200, end: 200 },    // First pattern
    { start: 200, end: -250 },    // Second pattern
    { start: -200, end: 200 },    // Third pattern
    { start: 0, end: -500 },      // Fourth pattern
  ]

  // Use modulo to cycle through patterns if we have more than 4 images
  const patternIndex = (order - 1) % scrollPatterns.length
  return scrollPatterns[patternIndex]
}

export function BannerForm({ bannerId }: BannerFormProps) {
  const router = useRouter()
  const isEditing = !!bannerId

  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState("")

  const [formData, setFormData] = useState<Partial<BannerImage>>({
    title: "",
    type: "parallax",
    order: 0,
    startScroll: -200,
    endScroll: 200,
  })

  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [uploadedImageUrl, setUploadedImageUrl] = useState<string | null>(null)

  useEffect(() => {
    const initializeForm = async () => {
      setLoading(true)
      try {
        if (bannerId) {
          // Editing mode - fetch existing banner
          const bannerDoc = await getDoc(doc(db, "banners", bannerId))
          if (bannerDoc.exists()) {
            const bannerData = bannerDoc.data() as BannerImage
            setFormData({
              title: bannerData.title || "",
              type: bannerData.type || "parallax",
              order: bannerData.order || 0,
              startScroll: bannerData.startScroll || 0,
              endScroll: bannerData.endScroll || 0,
              imageUrl: bannerData.imageUrl,
            })

            if (bannerData.imageUrl) {
              setImagePreview(bannerData.imageUrl)
              setUploadedImageUrl(bannerData.imageUrl)
            }
          }
        } else {
          // Creation mode - set default values
          const bannersQuery = query(
            collection(db, "banners"), 
            orderBy("order", "desc")
          )
          const bannersSnapshot = await getDocs(bannersQuery)
          const parallaxBanners = bannersSnapshot.docs
            .map(doc => ({ id: doc.id, ...doc.data() }) as BannerImage)
            .filter(banner => banner.type === "parallax")

          const newOrder = parallaxBanners.length > 0 
            ? parallaxBanners[0].order + 1 
            : 1

          const scrollValues = getScrollValues(newOrder)
          
          setFormData(prev => ({
            ...prev,
            order: newOrder,
            startScroll: scrollValues.start,
            endScroll: scrollValues.end,
          }))
        }
      } catch (error) {
        console.error("Error initializing form:", error)
        setError("Failed to initialize form data")
      } finally {
        setLoading(false)
      }
    }

    initializeForm()
  }, [bannerId])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name: string, value: "center" | "parallax") => {
    setFormData((prev) => {
      if (name === "type") {
        // If changing to parallax type, set scroll values based on order
        if (value === "parallax") {
          const scrollValues = getScrollValues(prev.order || 1)
          return {
            ...prev,
            type: value,
            startScroll: scrollValues.start,
            endScroll: scrollValues.end,
          }
        }
        // If changing to center type, reset scroll values
        return {
          ...prev,
          type: value,
          startScroll: 0,
          endScroll: 0,
        }
      }
      return { ...prev, [name]: value }
    })
  }

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      setImageFile(file)
      setImagePreview(URL.createObjectURL(file))
      
      // Reset uploaded URL when new file is selected
      setUploadedImageUrl(null)
      
      // Auto-upload the image
      await uploadImage(file)
    }
  }

  const uploadImage = async (file: File) => {
    if (!file) return
    
    setUploading(true)
    setError("")
    
    try {
      const path = `banners/${Date.now()}_${file.name}`
      const imageUrl = await uploadFile(file, path)
      setUploadedImageUrl(imageUrl)
    } catch (error) {
      console.error("Error uploading image:", error)
      setError("Failed to upload image. Please try again.")
    } finally {
      setUploading(false)
    }
  }

  const handleSubmit = async () => {
    setSaving(true)
    setError("")

    try {
      // Validate required fields
      if (!formData.title?.trim()) {
        throw new Error("Title is required")
      }

      if (!uploadedImageUrl && !formData.imageUrl) {
        throw new Error("Image is required")
      }

      const imageUrl = uploadedImageUrl || formData.imageUrl

      const bannerData = {
        ...formData,
        imageUrl,
        updatedAt: new Date().toISOString(),
      }

      if (isEditing) {
        // Update existing banner
        await updateDoc(doc(db, "banners", bannerId), bannerData)
      } else {
        // Create new banner
        await addDoc(collection(db, "banners"), {
          ...bannerData,
          createdAt: new Date().toISOString(),
        })
      }

      router.push("/admin/banners")
    } catch (error: any) {
      console.error("Error saving banner:", error)
      setError(error.message || "Failed to save banner. Please try again.")
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
    <div className="max-w-2xl mx-auto space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>{isEditing ? "Edit Banner" : "Create Banner"}</CardTitle>
        </CardHeader>
        <CardContent>
          {error && (
            <div className="mb-6 p-4 bg-red-100 text-red-700 rounded-sm">
              {error}
            </div>
          )}

          <div className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                placeholder="Enter banner title"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="type">Type</Label>
              <Select
                value={formData.type}
                onValueChange={(value) => handleSelectChange("type", value as "center" | "parallax")}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select banner type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="center">Center Image</SelectItem>
                  <SelectItem value="parallax">Parallax Image</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="order">Order</Label>
              <Input
                id="order"
                name="order"
                type="number"
                value={formData.order}
                onChange={handleInputChange}
                placeholder="Enter display order"
              />
            </div>

            {formData.type === "parallax" && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="startScroll">Start Scroll</Label>
                  <Input
                    id="startScroll"
                    name="startScroll"
                    type="number"
                    value={formData.startScroll}
                    onChange={handleInputChange}
                    placeholder="Enter start scroll position"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="endScroll">End Scroll</Label>
                  <Input
                    id="endScroll"
                    name="endScroll"
                    type="number"
                    value={formData.endScroll}
                    onChange={handleInputChange}
                    placeholder="Enter end scroll position"
                  />
                </div>
              </>
            )}

            <div className="space-y-2">
              <Label htmlFor="image">Banner Image</Label>
              <Input
                id="image"
                name="image"
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                disabled={uploading}
              />
              {uploading && (
                <div className="mt-2 p-2 bg-blue-50 text-blue-700 rounded text-sm">
                  Uploading image...
                </div>
              )}
              {uploadedImageUrl && (
                <div className="mt-2 p-2 bg-green-50 text-green-700 rounded text-sm">
                  ✓ Image uploaded successfully
                </div>
              )}
              {imagePreview && (
                <div className="mt-2">
                  <Image
                    src={imagePreview}
                    alt="Banner preview"
                    width={400}
                    height={200}
                    className="rounded-md object-cover"
                  />
                </div>
              )}
            </div>

            <div className="flex justify-end space-x-4">
              <Button
                variant="outline"
                onClick={() => router.push("/admin/banners")}
              >
                Cancel
              </Button>
              <Button 
                onClick={handleSubmit} 
                disabled={saving || uploading}
              >
                {saving ? "Saving..." : "Save Banner"}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 