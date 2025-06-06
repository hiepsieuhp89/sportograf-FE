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
import { useTranslations } from "@/hooks/use-translations"

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
  const { t } = useTranslations()
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    bio: "",
    profileImageUrl: "",
  })
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)
  const [profileImageFile, setProfileImageFile] = useState<File | null>(null)
  const [profileImagePreview, setProfileImagePreview] = useState<string | null>(null)
  const [uploadedImageUrl, setUploadedImageUrl] = useState<string | null>(null)
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
        setUploadedImageUrl(userData.profileImageUrl)
      }
    }
  }, [userData])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const uploadImage = async (file: File) => {
    if (!file || !userData) return
    
    setUploading(true)
    setError('')
    setUploadProgress(0)
    
    try {
      const path = `users/${userData.uid}/profile`
      const imageUrl = await uploadFile(file, path)
      setUploadedImageUrl(imageUrl)
      setUploadProgress(100)
    } catch (uploadError: any) {
      console.error("Error uploading image:", uploadError)
      setError(t("imageUploadError"))
    } finally {
      setUploading(false)
    }
  }

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      
      // Validate file type
      if (!file.type.startsWith('image/')) {
        setError(t("imageTypeError"))
        return
      }
      
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setError(t("imageSizeError"))
        return
      }

      setProfileImageFile(file)
      setProfileImagePreview(URL.createObjectURL(file))
      setError('')
      
      // Reset uploaded URL when new file is selected
      setUploadedImageUrl(null)
      
      // Auto-upload the image
      await uploadImage(file)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!auth) return
    if (!db || !userData || !auth.currentUser) return

    setSaving(true)
    setError("")
    setSuccess(false)

    try {
      // Validate required fields
      if (!formData.name?.trim()) {
        throw new Error(t("nameRequired") || "Name is required")
      }

      const profileImageUrl = uploadedImageUrl || formData.profileImageUrl

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
      setError(error.message || t("profileUpdateError"))
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
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-br from-mainDarkBackgroundV1/90 via-mainDarkBackgroundV1/80 to-black/70"></div>
        
        <div className="relative max-w-md mx-auto px-4 py-12" style={{ minHeight: "calc(100vh - 64px)" }}>
          <div className="bg-white/10 backdrop-blur-md p-8 rounded-xl shadow-2xl border border-white/20">
            <h1 className="text-2xl font-bold mb-6 text-center text-white drop-shadow-lg">{t("editProfile")}</h1>

            <div className="flex justify-center mb-6">
              <div className="flex flex-col items-center">
                <div className="w-32 h-32 rounded-full bg-white/20 backdrop-blur-sm overflow-hidden mb-4 relative border-4 border-white/30 shadow-lg">
                  {(profileImagePreview || formData.profileImageUrl) ? (
                    <>
                      <Image
                        src={profileImagePreview || formData.profileImageUrl}
                        alt="Profile"
                        width={128}
                        height={128}
                        className="w-full h-full object-cover"
                      />
                      {uploading && (
                        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                          <div className="text-white font-medium">Uploading...</div>
                        </div>
                      )}
                    </>
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <User className="h-16 w-16 text-white/60" />
                    </div>
                  )}
                </div>

                <label
                  htmlFor="profileImage"
                  className={`cursor-pointer inline-flex items-center px-4 py-2 bg-mainActiveV1 text-black rounded-lg hover:bg-mainActiveV1/80 transition-colors shadow-lg backdrop-blur-sm ${uploading ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  <FileImage className="h-5 w-5 mr-2" />
                  {uploading ? t("uploading") : t("chooseImage")}
                </label>
                <input
                  id="profileImage"
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                  disabled={uploading}
                />
                {profileImageFile && (
                  <p className="text-sm text-white/80 mt-2 font-medium">
                    {t("selectedFile")}: {profileImageFile.name}
                  </p>
                )}
                {uploadedImageUrl && !uploading && (
                  <div className="mt-2 p-2 bg-green-500/20 text-green-200 rounded text-sm">
                    ✓ {t("imageUploadedSuccessfully") || "Image uploaded successfully"}
                  </div>
                )}
              </div>
            </div>

            {error && <div className="mb-4 p-4 bg-red-500/20 text-red-200 rounded-lg border border-red-500/30 backdrop-blur-sm">{error}</div>}
            {success && (
              <div className="mb-4 p-4 bg-green-500/20 text-green-200 rounded-lg border border-green-500/30 backdrop-blur-sm">
                {t("profileUpdatedSuccessfully")}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="mb-6">
                <label htmlFor="email" className="block text-xs text-white/80 mb-2 font-medium">
                  {t("email")}
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/60 h-5 w-5" />
                  <input
                    type="email"
                    value={formData.email}
                    disabled
                    className="w-full pl-10 px-4 py-3 border border-white/20 rounded-lg bg-white/10 backdrop-blur-sm text-white/70 placeholder-white/50"
                  />
                </div>
                <p className="text-xs text-white/60 mt-1">{t("emailCannotBeChanged")}</p>
              </div>

              <div className="mb-6">
                <label htmlFor="name" className="block text-xs text-white/80 mb-2 font-medium">
                  {t("name")}
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/60 h-5 w-5" />
                  <input
                    id="name"
                    name="name"
                    type="text"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full pl-10 px-4 py-3 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-mainActiveV1 focus:border-transparent bg-white/10 backdrop-blur-sm text-white placeholder-white/50"
                  />
                </div>
              </div>

              <div className="mb-6">
                <label htmlFor="bio" className="block text-xs text-white/80 mb-2 font-medium">
                  {t("bio")}
                </label>
                <textarea
                  id="bio"
                  name="bio"
                  rows={4}
                  value={formData.bio}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-mainActiveV1 focus:border-transparent resize-none bg-white/10 backdrop-blur-sm text-white placeholder-white/50"
                  placeholder={t("tellUsAboutYourself")}
                />
              </div>

              <button
                type="submit"
                disabled={saving || uploading}
                className="w-full bg-mainActiveV1 text-black py-3 rounded-lg hover:bg-mainActiveV1/80 transition-colors disabled:bg-mainActiveV1/50 flex items-center justify-center shadow-lg backdrop-blur-sm font-medium"
              >
                {saving ? (
                  <>
                    <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                    {t("saving")}...
                  </>
                ) : (
                  t("saveChanges")
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </StaticPageLayout>
  )
} 