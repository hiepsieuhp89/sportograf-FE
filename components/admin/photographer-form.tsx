"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { collection, doc, getDoc, addDoc, updateDoc, serverTimestamp } from "firebase/firestore"
import { ref, uploadBytes, getDownloadURL } from "firebase/storage"
import { createUserWithEmailAndPassword } from "firebase/auth"
import { db, storage, auth } from "@/lib/firebase"
import type { Photographer } from "@/lib/types"
import { User, Mail, FileImage, Info, ArrowLeft } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { uploadFile } from "@/lib/upload-utils"

interface PhotographerFormProps {
  photographerId?: string
}

export function PhotographerForm({ photographerId }: PhotographerFormProps) {
  const router = useRouter()
  const isEditing = !!photographerId

  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState("")

  const [formData, setFormData] = useState<Partial<Photographer> & { password?: string }>({
    name: "",
    email: "",
    bio: "",
  })

  const [profileImageFile, setProfileImageFile] = useState<File | null>(null)
  const [profileImagePreview, setProfileImagePreview] = useState<string | null>(null)

  // Fetch photographer data if editing
  useEffect(() => {
    const fetchPhotographerData = async () => {
      if (!photographerId) return

      setLoading(true)
      try {
        const photographerDoc = await getDoc(doc(db, "photographers", photographerId))
        if (photographerDoc.exists()) {
          const photographerData = photographerDoc.data() as Photographer
          setFormData({
            name: photographerData.name || "",
            email: photographerData.email || "",
            bio: photographerData.bio || "",
            profileImageUrl: photographerData.profileImageUrl || "",
          })

          if (photographerData.profileImageUrl) {
            setProfileImagePreview(photographerData.profileImageUrl)
          }
        }
      } catch (error) {
        console.error("Error fetching photographer:", error)
        setError("Failed to load photographer data")
      } finally {
        setLoading(false)
      }
    }

    fetchPhotographerData()
  }, [photographerId])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      setProfileImageFile(file)
      setProfileImagePreview(URL.createObjectURL(file))
    }
  }

  const uploadImage = async (file: File, path: string): Promise<string> => {
    return uploadFile(file, `photographers/${path}`)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setError("")

    try {
      let profileImageUrl = formData.profileImageUrl

      // Upload profile image if provided
      if (profileImageFile) {
        const path = `photographers/${Date.now()}_${profileImageFile.name}`
        profileImageUrl = await uploadImage(profileImageFile, path)
      }

      const photographerData = {
        name: formData.name,
        email: formData.email,
        bio: formData.bio,
        profileImageUrl,
        updatedAt: serverTimestamp(),
      }

      if (isEditing) {
        // Update existing photographer
        await updateDoc(doc(db, "photographers", photographerId), photographerData)
      } else {
        // Create new photographer and Firebase auth account
        if (!formData.password) {
          throw new Error("Password is required for new photographers")
        }

        // Create Firebase auth account
        const userCredential = await createUserWithEmailAndPassword(auth, formData.email!, formData.password)
        const uid = userCredential.user.uid

        // Create photographer document
        const docRef = await addDoc(collection(db, "photographers"), {
          ...photographerData,
          uid,
          createdAt: serverTimestamp(),
        })

        // Create user role document
        await addDoc(collection(db, "users"), {
          uid,
          email: formData.email,
          role: "photographer",
          photographerId: docRef.id,
          createdAt: serverTimestamp(),
        })
      }

      router.push("/admin/photographers")
    } catch (error: any) {
      console.error("Error saving photographer:", error)
      setError(error.message || "Failed to save photographer. Please try again.")
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
    <div className="max-w-4xl mx-auto py-8">
      <div className="flex items-center gap-4 mb-6">
        <Button
          variant="ghost"
          className="hover:bg-gray-100"
          onClick={() => router.push("/admin/photographers")}
        >
          <ArrowLeft className="h-5 w-5 mr-2" />
          Back to Photographers
        </Button>
        <h1 className="text-2xl font-bold">{isEditing ? "Edit Photographer" : "Create Photographer"}</h1>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-100 text-red-700 rounded-lg border border-red-200">
          {error}
        </div>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Photographer Information</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="name">
                    Name <span className="text-red-500">*</span>
                  </Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                    <Input
                      id="name"
                      name="name"
                      required
                      value={formData.name}
                      onChange={handleInputChange}
                      className="pl-10"
                      placeholder="Enter photographer name"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="email">
                    Email <span className="text-red-500">*</span>
                  </Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      required
                      value={formData.email}
                      onChange={handleInputChange}
                      disabled={isEditing}
                      className="pl-10"
                      placeholder="Enter email address"
                    />
                  </div>
                  {isEditing && <p className="text-xs text-gray-500 mt-1">Email cannot be changed</p>}
                </div>

                {!isEditing && (
                  <div>
                    <Label htmlFor="password">
                      Password <span className="text-red-500">*</span>
                    </Label>
                    <div className="relative">
                      <Input
                        id="password"
                        name="password"
                        type="password"
                        required
                        value={formData.password || ""}
                        onChange={handleInputChange}
                        className="pl-10"
                        minLength={6}
                        placeholder="Enter password"
                      />
                    </div>
                    <p className="text-xs text-gray-500 mt-1">Minimum 6 characters</p>
                  </div>
                )}

                <div>
                  <Label htmlFor="bio">Bio</Label>
                  <Textarea
                    id="bio"
                    name="bio"
                    rows={4}
                    value={formData.bio}
                    onChange={handleInputChange}
                    className="resize-none"
                    placeholder="Write a brief bio about the photographer..."
                  />
                </div>
              </div>

              <div className="space-y-4">
                <Label>Profile Picture</Label>
                <div className="flex flex-col items-center p-6 border-2 border-dashed border-gray-300 rounded-lg hover:border-mainNavyText transition-colors">
                  <Avatar className="h-32 w-32 mb-4">
                    <AvatarImage src={profileImagePreview || formData.profileImageUrl} />
                    <AvatarFallback>
                      {formData.name ? formData.name.charAt(0).toUpperCase() : <User className="h-16 w-16 text-gray-400" />}
                    </AvatarFallback>
                  </Avatar>
                  
                  <div className="flex flex-col items-center">
                    <label
                      htmlFor="profileImage"
                      className="cursor-pointer inline-flex items-center px-4 py-2 bg-mainNavyText text-mainBackgroundV1 rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      <FileImage className="h-5 w-5 mr-2" />
                      Choose Image
                    </label>
                    <input
                      id="profileImage"
                      name="profileImage"
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden"
                    />
                    <p className="text-sm text-gray-500 mt-2">
                      Upload a profile picture. Images will be cropped to a circle.
                    </p>
                    {profileImageFile && (
                      <p className="text-sm text-mainNavyText mt-2">
                        Selected: {profileImageFile.name}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push("/admin/photographers")}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={saving}
                className="bg-mainNavyText text-mainBackgroundV1 hover:bg-blue-700"
              >
                {saving ? (
                  <>
                    <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-mainBackgroundV1 border-t-transparent"></div>
                    Saving...
                  </>
                ) : (
                  isEditing ? 'Save Changes' : 'Create Photographer'
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
