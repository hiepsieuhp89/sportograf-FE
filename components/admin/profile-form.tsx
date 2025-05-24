"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { doc, getDoc, updateDoc, collection, query, where, getDocs } from "firebase/firestore"
import { updatePassword, EmailAuthProvider, reauthenticateWithCredential } from "firebase/auth"
import { ref, uploadBytes, getDownloadURL } from "firebase/storage"
import { db, storage, auth } from "@/lib/firebase"
import type { Photographer } from "@/lib/types"
import { User, Mail, FileImage, Lock } from "lucide-react"
import Image from "next/image"
import { uploadFile } from "@/lib/upload-utils"

export function ProfileForm() {
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [isPhotographer, setIsPhotographer] = useState(false)
  const [photographerId, setPhotographerId] = useState<string | null>(null)

  const [formData, setFormData] = useState<{
    name: string
    email: string
    bio: string
    profileImageUrl: string
    currentPassword: string
    newPassword: string
    confirmPassword: string
  }>({
    name: "",
    email: "",
    bio: "",
    profileImageUrl: "",
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  })

  const [profileImageFile, setProfileImageFile] = useState<File | null>(null)
  const [profileImagePreview, setProfileImagePreview] = useState<string | null>(null)

  useEffect(() => {
    const fetchUserProfile = async () => {
      setLoading(true)
      try {
        const currentUser = auth.currentUser
        if (!currentUser) return

        // Check if user is a photographer
        const usersQuery = query(collection(db, "users"), where("uid", "==", currentUser.uid))
        const userSnapshot = await getDocs(usersQuery)

        if (!userSnapshot.empty) {
          const userData = userSnapshot.docs[0].data()
          if (userData.role === "photographer" && userData.photographerId) {
            setIsPhotographer(true)
            setPhotographerId(userData.photographerId)

            // Fetch photographer data
            const photographerDoc = await getDoc(doc(db, "photographers", userData.photographerId))
            if (photographerDoc.exists()) {
              const photographerData = photographerDoc.data() as Photographer
              setFormData((prev) => ({
                ...prev,
                name: photographerData.name || "",
                email: currentUser.email || "",
                bio: photographerData.bio || "",
                profileImageUrl: photographerData.profileImageUrl || "",
              }))

              if (photographerData.profileImageUrl) {
                setProfileImagePreview(photographerData.profileImageUrl)
              }
            }
          } else {
            // Admin user
            setFormData((prev) => ({
              ...prev,
              name: "Admin",
              email: currentUser.email || "",
            }))
          }
        }
      } catch (error) {
        console.error("Error fetching profile:", error)
        setError("Failed to load profile data")
      } finally {
        setLoading(false)
      }
    }

    fetchUserProfile()
  }, [])

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
    return uploadFile(file, `profile/${path}`)
  }

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setError("")
    setSuccess("")

    try {
      if (!isPhotographer || !photographerId) {
        throw new Error("Only photographers can update their profile")
      }

      let profileImageUrl = formData.profileImageUrl

      // Upload profile image if provided
      if (profileImageFile) {
        const path = `photographers/${Date.now()}_${profileImageFile.name}`
        profileImageUrl = await uploadImage(profileImageFile, path)
      }

      // Update photographer document
      await updateDoc(doc(db, "photographers", photographerId), {
        name: formData.name,
        bio: formData.bio,
        profileImageUrl,
      })

      setSuccess("Profile updated successfully")
    } catch (error: any) {
      console.error("Error updating profile:", error)
      setError(error.message || "Failed to update profile")
    } finally {
      setSaving(false)
    }
  }

  const handlePasswordUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setError("")
    setSuccess("")

    try {
      const currentUser = auth.currentUser
      if (!currentUser) throw new Error("User not authenticated")

      // Validate passwords
      if (formData.newPassword !== formData.confirmPassword) {
        throw new Error("New passwords do not match")
      }

      if (formData.newPassword.length < 6) {
        throw new Error("New password must be at least 6 characters")
      }

      // Re-authenticate user
      const credential = EmailAuthProvider.credential(currentUser.email!, formData.currentPassword)
      await reauthenticateWithCredential(currentUser, credential)

      // Update password
      await updatePassword(currentUser, formData.newPassword)

      // Clear password fields
      setFormData((prev) => ({
        ...prev,
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      }))

      setSuccess("Password updated successfully")
    } catch (error: any) {
      console.error("Error updating password:", error)
      if (error.code === "auth/wrong-password") {
        setError("Current password is incorrect")
      } else {
        setError(error.message || "Failed to update password")
      }
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
      <h1 className="text-2xl font-bold mb-6">My Profile</h1>

      {error && <div className="mb-6 p-4 bg-red-100 text-red-700 rounded-sm">{error}</div>}
      {success && <div className="mb-6 p-4 bg-green-100 text-green-700 rounded-sm">{success}</div>}

      <div className="bg-mainBackgroundV1 p-6 rounded-lg shadow-sm mb-8">
        <h2 className="text-xl font-semibold mb-4">Profile Information</h2>

        <form onSubmit={handleProfileUpdate}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
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
                    disabled={!isPhotographer}
                    className="pl-10 w-full px-4 py-2 border border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-mainNavyText disabled:bg-gray-100"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                  <input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    disabled
                    className="pl-10 w-full px-4 py-2 border border-gray-300 rounded-sm bg-gray-100"
                  />
                </div>
                <p className="text-xs text-gray-500 mt-1">Email cannot be changed</p>
              </div>

              {isPhotographer && (
                <div>
                  <label htmlFor="bio" className="block text-sm font-medium text-gray-700 mb-1">
                    Bio
                  </label>
                  <textarea
                    id="bio"
                    name="bio"
                    rows={4}
                    value={formData.bio}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-mainNavyText"
                  />
                </div>
              )}
            </div>

            {isPhotographer && (
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
            )}
          </div>

          {isPhotographer && (
            <div className="mt-6 flex justify-end">
              <button
                type="submit"
                disabled={saving}
                className="px-4 py-2 bg-mainNavyText text-mainBackgroundV1 rounded-sm hover:bg-blue-700 transition-colors disabled:bg-blue-300"
              >
                {saving ? "Saving..." : "Update Profile"}
              </button>
            </div>
          )}
        </form>
      </div>

      <div className="bg-mainBackgroundV1 p-6 rounded-lg shadow-sm">
        <h2 className="text-xl font-semibold mb-4">Change Password</h2>

        <form onSubmit={handlePasswordUpdate}>
          <div className="space-y-4 max-w-md">
            <div>
              <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700 mb-1">
                Current Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  id="currentPassword"
                  name="currentPassword"
                  type="password"
                  required
                  value={formData.currentPassword}
                  onChange={handleInputChange}
                  className="pl-10 w-full px-4 py-2 border border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-mainNavyText"
                />
              </div>
            </div>

            <div>
              <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 mb-1">
                New Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  id="newPassword"
                  name="newPassword"
                  type="password"
                  required
                  value={formData.newPassword}
                  onChange={handleInputChange}
                  className="pl-10 w-full px-4 py-2 border border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-mainNavyText"
                  minLength={6}
                />
              </div>
              <p className="text-xs text-gray-500 mt-1">Minimum 6 characters</p>
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                Confirm New Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  required
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  className="pl-10 w-full px-4 py-2 border border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-mainNavyText"
                />
              </div>
            </div>
          </div>

          <div className="mt-6 flex justify-end">
            <button
              type="submit"
              disabled={saving}
              className="px-4 py-2 bg-mainNavyText text-mainBackgroundV1 rounded-sm hover:bg-blue-700 transition-colors disabled:bg-blue-300"
            >
              {saving ? "Updating..." : "Update Password"}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
