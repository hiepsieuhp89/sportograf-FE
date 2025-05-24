"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { collection, doc, getDoc, addDoc, updateDoc, serverTimestamp } from "firebase/firestore"
import { ref, uploadBytes, getDownloadURL } from "firebase/storage"
import { createUserWithEmailAndPassword } from "firebase/auth"
import { db, storage, auth } from "@/lib/firebase"
import type { Photographer } from "@/lib/types"
import { User, Mail, FileImage, Info } from "lucide-react"
import Image from "next/image"

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
    const storageRef = ref(storage, path)
    await uploadBytes(storageRef, file)
    return getDownloadURL(storageRef)
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
    <div>
      <h1 className="text-2xl font-bold mb-6">{isEditing ? "Edit Photographer" : "Create Photographer"}</h1>

      {error && <div className="mb-6 p-4 bg-red-100 text-red-700 rounded-sm">{error}</div>}

      <form onSubmit={handleSubmit} className="bg-mainBackgroundV1 p-6 rounded-lg shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                Name <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  id="name"
                  name="name"
                  type="text"
                  required
                  value={formData.name}
                  onChange={handleInputChange}
                  className="pl-10 w-full px-4 py-2 border border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-mainNavyText"
                />
              </div>
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={handleInputChange}
                  disabled={isEditing} // Can't change email if editing
                  className="pl-10 w-full px-4 py-2 border border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-mainNavyText disabled:bg-gray-100 disabled:text-gray-500"
                />
              </div>
              {isEditing && <p className="text-xs text-gray-500 mt-1">Email cannot be changed</p>}
            </div>

            {!isEditing && (
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                  Password <span className="text-red-500">*</span>
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  required={!isEditing}
                  value={formData.password || ""}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-mainNavyText"
                  minLength={6}
                />
                <p className="text-xs text-gray-500 mt-1">Minimum 6 characters</p>
              </div>
            )}

            <div>
              <label htmlFor="bio" className="block text-sm font-medium text-gray-700 mb-1">
                Bio
              </label>
              <div className="relative">
                <Info className="absolute left-3 top-4 text-gray-400 h-5 w-5" />
                <textarea
                  id="bio"
                  name="bio"
                  rows={4}
                  value={formData.bio}
                  onChange={handleInputChange}
                  className="pl-10 w-full px-4 py-2 border border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-mainNavyText"
                />
              </div>
            </div>
          </div>

          <div>
            <div>
              <label htmlFor="profileImage" className="block text-sm font-medium text-gray-700 mb-1">
                Profile Image
              </label>
              <div className="flex items-center space-x-4">
                <div className="flex-1">
                  <div className="relative">
                    <FileImage className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                    <input
                      id="profileImage"
                      name="profileImage"
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="pl-10 w-full px-4 py-2 border border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-mainNavyText"
                    />
                  </div>
                </div>
                {profileImagePreview ? (
                  <div className="h-20 w-20 relative">
                    <Image
                      src={profileImagePreview || "/placeholder.svg"}
                      alt="Profile preview"
                      width={80}
                      height={80}
                      className="h-full w-full object-cover rounded-full"
                    />
                  </div>
                ) : (
                  <div className="h-20 w-20 bg-gray-200 rounded-full flex items-center justify-center">
                    <User className="h-10 w-10 text-gray-500" />
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 flex justify-end space-x-4">
          <button
            type="button"
            onClick={() => router.push("/admin/photographers")}
            className="px-4 py-2 border border-gray-300 rounded-sm text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={saving}
            className="px-4 py-2 bg-mainNavyText text-mainBackgroundV1 rounded-sm hover:bg-blue-700 transition-colors disabled:bg-blue-300"
          >
            {saving ? "Saving..." : "Save Photographer"}
          </button>
        </div>
      </form>
    </div>
  )
}
