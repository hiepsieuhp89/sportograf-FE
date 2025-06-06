"use client"

import type React from "react"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { auth, db } from "@/lib/firebase"
import type { UserData } from "@/contexts/user-context"
import { uploadFile } from "@/lib/upload-utils"
import { EmailAuthProvider, reauthenticateWithCredential, updatePassword, updateProfile } from "firebase/auth"
import { collection, doc, getDoc, getDocs, query, updateDoc, where } from "firebase/firestore"
import { FileImage, Lock, Mail, User } from "lucide-react"
import { useEffect, useState } from "react"

export function ProfileForm() {
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [isPhotographer, setIsPhotographer] = useState(false)
  const [userDocId, setUserDocId] = useState<string | null>(null)

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
  const [uploadedImageUrl, setUploadedImageUrl] = useState<string | null>(null)

  useEffect(() => {
    const fetchUserProfile = async () => {
      setLoading(true)
      try {
        const currentUser = auth.currentUser
        if (!currentUser) return

        // Find user document by UID
        const usersQuery = query(collection(db, "users"), where("uid", "==", currentUser.uid))
        const userSnapshot = await getDocs(usersQuery)

        if (!userSnapshot.empty) {
          console.log("userSnapshot", userSnapshot)
          const userData = userSnapshot.docs[0].data() as UserData
          const docId = userSnapshot.docs[0].id
          
          setUserDocId(docId)
          setIsPhotographer(userData.role === "photographer")

          setFormData((prev) => ({
            ...prev,
            name: userData.name || "",
            email: userData.email || "",
            bio: userData.bio || "",
            profileImageUrl: userData.profileImageUrl || "",
          }))

          if (userData.profileImageUrl) {
            setProfileImagePreview(userData.profileImageUrl)
            setUploadedImageUrl(userData.profileImageUrl)
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

  const uploadImage = async (file: File) => {
    if (!file || !auth.currentUser) return
    
    setUploading(true)
    setError("")
    
    try {
      const path = `profiles/${auth.currentUser.uid}/${Date.now()}_${file.name}`
      const imageUrl = await uploadFile(file, path)
      setUploadedImageUrl(imageUrl)
    } catch (error) {
      console.error("Error uploading image:", error)
      setError("Failed to upload image. Please try again.")
    } finally {
      setUploading(false)
    }
  }

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      setProfileImageFile(file)
      setProfileImagePreview(URL.createObjectURL(file))
      
      // Reset uploaded URL when new file is selected
      setUploadedImageUrl(null)
      
      // Auto-upload the image
      await uploadImage(file)
    }
  }

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setError("")
    setSuccess("")

    try {
      const currentUser = auth.currentUser
      if (!currentUser || !userDocId) throw new Error("User not authenticated")

      // Validate required fields
      if (!formData.name?.trim()) {
        throw new Error("Name is required")
      }

      const profileImageUrl = uploadedImageUrl || formData.profileImageUrl

      // Update Firebase Auth profile
      await updateProfile(currentUser, {
        displayName: formData.name,
        photoURL: profileImageUrl || null,
      })

      // Update user document
      await updateDoc(doc(db, "users", userDocId), {
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
    <div className="max-w-4xl mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6">My Profile</h1>

      {error && (
        <div className="mb-6 p-4 bg-red-100 text-red-700 rounded-lg border border-red-200">
          {error}
        </div>
      )}
      {success && (
        <div className="mb-6 p-4 bg-green-100 text-green-700 rounded-lg border border-green-200">
          {success}
        </div>
      )}

      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Profile Information</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleProfileUpdate} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="name">Name</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                    <Input
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="pl-10"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="email">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      disabled
                      className="pl-10 bg-gray-50"
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-1">Email cannot be changed</p>
                </div>

                {isPhotographer && (
                  <div>
                    <Label htmlFor="bio">Bio</Label>
                    <textarea
                      id="bio"
                      name="bio"
                      rows={4}
                      value={formData.bio}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-mainNavyText resize-none"
                      placeholder="Tell us about yourself..."
                    />
                  </div>
                )}
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
                      className={`cursor-pointer inline-flex items-center px-4 py-2 bg-mainNavyText text-mainBackgroundV1 rounded-lg hover:bg-blue-700 transition-colors ${uploading ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                      <FileImage className="h-5 w-5 mr-2" />
                      {uploading ? "Uploading..." : "Choose Image"}
                    </label>
                    <input
                      id="profileImage"
                      name="profileImage"
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden"
                      disabled={uploading}
                    />
                    <p className="text-sm text-gray-500 mt-2">
                      Upload a profile picture. Images will be cropped to a circle.
                    </p>
                    {profileImageFile && (
                      <p className="text-sm text-mainNavyText mt-2">
                        Selected: {profileImageFile.name}
                      </p>
                    )}
                    {uploadedImageUrl && !uploading && (
                      <div className="mt-2 p-2 bg-green-100 text-green-700 rounded text-sm">
                        ✓ Image uploaded successfully
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-end">
              <Button
                type="submit"
                disabled={saving || uploading}
                className="bg-mainNavyText text-mainBackgroundV1 hover:bg-blue-700"
              >
                {saving ? (
                  <>
                    <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-mainBackgroundV1 border-t-transparent"></div>
                    Saving...
                  </>
                ) : (
                  'Update Profile'
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Change Password</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handlePasswordUpdate} className="space-y-4 max-w-md">
            <div>
              <Label htmlFor="currentPassword">Current Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <Input
                  id="currentPassword"
                  name="currentPassword"
                  type="password"
                  required
                  value={formData.currentPassword}
                  onChange={handleInputChange}
                  className="pl-10"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="newPassword">New Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <Input
                  id="newPassword"
                  name="newPassword"
                  type="password"
                  required
                  value={formData.newPassword}
                  onChange={handleInputChange}
                  className="pl-10"
                  minLength={6}
                />
              </div>
              <p className="text-xs text-gray-500 mt-1">Minimum 6 characters</p>
            </div>

            <div>
              <Label htmlFor="confirmPassword">Confirm New Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  required
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  className="pl-10"
                />
              </div>
            </div>

            <div className="flex justify-end">
              <Button
                type="submit"
                disabled={saving}
                className="bg-mainNavyText text-mainBackgroundV1 hover:bg-blue-700"
              >
                {saving ? (
                  <>
                    <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-mainBackgroundV1 border-t-transparent"></div>
                    Updating...
                  </>
                ) : (
                  'Update Password'
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
