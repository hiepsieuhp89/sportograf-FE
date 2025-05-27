"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useUser } from "@/contexts/user-context"
import { useFirebase } from "@/components/firebase-provider"
import { doc, updateDoc } from "firebase/firestore"
import { StaticPageLayout } from "@/components/static-page-layout"
import Image from "next/image"
import { FileImage, Lock, Mail, User } from "lucide-react"
import { updateProfile } from "firebase/auth"
import { uploadFile } from "@/lib/upload-utils"

interface FormData {
  name: string
  email: string
  bio: string
  profileImageUrl: string
}

export default function ProfilePage() {
  const router = useRouter()
  const { userData, loading, initialized } = useUser()
  const { db, auth } = useFirebase()
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    bio: "",
    profileImageUrl: "",
  })
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)
  const [profileImageFile, setProfileImageFile] = useState<File | null>(null)
  const [profileImagePreview, setProfileImagePreview] = useState<string | null>(null)
  const [uploadProgress, setUploadProgress] = useState<number>(0)

  useEffect(() => {
    if (initialized && !loading && !userData) {
      router.push("/login")
    }
  }, [initialized, loading, userData, router])

  useEffect(() => {
    if (userData) {
      setFormData({
        name: userData.name || "",
        email: userData.email || "",
        bio: userData.bio || "",
        profileImageUrl: userData.profileImageUrl || "",
      })
      if (userData.profileImageUrl) {
        setProfileImagePreview(userData.profileImageUrl)
      }
    }
  }, [userData])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      
      // Validate file type
      if (!file.type.startsWith('image/')) {
        setError('Please select an image file')
        return
      }
      
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setError('Image size should be less than 5MB')
        return
      }

      setProfileImageFile(file)
      setProfileImagePreview(URL.createObjectURL(file))
      setError('')
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!auth) return
    if (!db || !userData || !auth.currentUser) return

    setSaving(true)
    setError("")
    setSuccess(false)
    setUploadProgress(0)

    try {
      let profileImageUrl = formData.profileImageUrl

      // Upload profile image if provided
      if (profileImageFile) {
        try {
          const path = `users/${userData.uid}/profile`
          profileImageUrl = await uploadFile(profileImageFile, path)
          setUploadProgress(100)
        } catch (uploadError: any) {
          console.error("Error uploading image:", uploadError)
          setError("Failed to upload profile image. Please try again.")
          setSaving(false)
          return
        }
      }

      // Update Firebase Auth profile
      await updateProfile(auth.currentUser, {
        displayName: formData.name,
        photoURL: profileImageUrl || null,
      })

      // Update user document
      const userRef = doc(db, "users", userData.uid)
      await updateDoc(userRef, {
        name: formData.name,
        bio: formData.bio,
        profileImageUrl,
        updatedAt: new Date().toISOString(),
      })

      setSuccess(true)
      // Clear file input
      setProfileImageFile(null)
      setUploadProgress(0)
    } catch (error: any) {
      console.error("Error updating profile:", error)
      setError(error.message || "Failed to update profile")
    } finally {
      setSaving(false)
    }
  }

  // Show loading state while initializing or loading
  if (!initialized || loading) {
    return (
      <StaticPageLayout>
        <div className="max-w-md mx-auto px-4 py-12">
          <div className="flex justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-mainNavyText"></div>
          </div>
        </div>
      </StaticPageLayout>
    )
  }

  // Don't show anything while redirecting
  if (!userData) {
    return null
  }

  return (
    <StaticPageLayout>
      <div className="max-w-md mx-auto px-4 py-12">
        <div className="bg-mainBackgroundV1 p-8 rounded-lg shadow-sm">
          <h1 className="text-2xl font-bold mb-6 text-center">Edit Profile</h1>

          <div className="flex justify-center mb-6">
            <div className="flex flex-col items-center">
              <div className="w-32 h-32 rounded-full bg-gray-200 overflow-hidden mb-4 relative">
                {(profileImagePreview || formData.profileImageUrl) ? (
                  <>
                    <Image
                      src={profileImagePreview || formData.profileImageUrl}
                      alt="Profile"
                      width={128}
                      height={128}
                      className="w-full h-full object-cover"
                    />
                    {uploadProgress > 0 && uploadProgress < 100 && (
                      <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                        <div className="text-white">{uploadProgress}%</div>
                      </div>
                    )}
                  </>
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <User className="h-16 w-16 text-gray-400" />
                  </div>
                )}
              </div>

              <label
                htmlFor="profileImage"
                className="cursor-pointer inline-flex items-center px-4 py-2 bg-mainNavyText text-mainBackgroundV1 rounded-md hover:bg-blue-700 transition-colors"
              >
                <FileImage className="h-5 w-5 mr-2" />
                Choose Image
              </label>
              <input
                id="profileImage"
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
              />
              {profileImageFile && (
                <p className="text-sm text-mainNavyText mt-2">
                  Selected: {profileImageFile.name}
                </p>
              )}
            </div>
          </div>

          {error && <div className="mb-4 p-4 bg-red-100 text-red-700 rounded-sm">{error}</div>}
          {success && (
            <div className="mb-4 p-4 bg-green-100 text-green-700 rounded-sm">
              Profile updated successfully!
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="mb-6">
              <label htmlFor="email" className="block text-xs text-gray-500 mb-2">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  type="email"
                  value={formData.email}
                  disabled
                  className="w-full pl-10 px-4 py-2 border border-gray-300 rounded-md bg-gray-50"
                />
              </div>
              <p className="text-xs text-gray-500 mt-1">Email cannot be changed</p>
            </div>

            <div className="mb-6">
              <label htmlFor="name" className="block text-xs text-gray-500 mb-2">
                Name
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  id="name"
                  name="name"
                  type="text"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full pl-10 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-mainNavyText"
                />
              </div>
            </div>

            <div className="mb-6">
              <label htmlFor="bio" className="block text-xs text-gray-500 mb-2">
                Bio
              </label>
              <textarea
                id="bio"
                name="bio"
                rows={4}
                value={formData.bio}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-mainNavyText resize-none"
                placeholder="Tell us about yourself..."
              />
            </div>

            <button
              type="submit"
              disabled={saving}
              className="w-full bg-mainNavyText text-mainBackgroundV1 py-3 rounded-md hover:bg-blue-700 transition-colors disabled:bg-blue-300 flex items-center justify-center"
            >
              {saving ? (
                <>
                  <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-mainBackgroundV1 border-t-transparent"></div>
                  {uploadProgress > 0 && uploadProgress < 100 ? 'Uploading...' : 'Saving...'}
                </>
              ) : (
                'Save Changes'
              )}
            </button>
          </form>
        </div>
      </div>
    </StaticPageLayout>
  )
} 