"use client"

import { useState, useEffect } from "react"
import { collection, getDocs, deleteDoc, doc, query, orderBy, where } from "firebase/firestore"
import { db } from "@/lib/firebase"
import type { UserData } from "@/contexts/user-context"
import Link from "next/link"
import { Edit, Trash2, Plus, User, CheckCircle } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

interface PhotographerData extends UserData {
  id: string
}

export function PhotographersList() {
  const [photographers, setPhotographers] = useState<PhotographerData[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchPhotographers = async () => {
      try {
        // Fetch users with photographer role
        const photographersQuery = query(
          collection(db, "users"), 
          where("role", "==", "photographer"),
          orderBy("name")
        )

        const snapshot = await getDocs(photographersQuery)
        const photographersList = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as PhotographerData[]

        setPhotographers(photographersList)
      } catch (error) {
        console.error("Error fetching photographers:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchPhotographers()
  }, [])

  const handleDeletePhotographer = async (photographerId: string) => {
    if (!confirm("Are you sure you want to delete this photographer?")) return

    try {
      await deleteDoc(doc(db, "users", photographerId))
      setPhotographers(photographers.filter((photographer) => photographer.id !== photographerId))
    } catch (error) {
      console.error("Error deleting photographer:", error)
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
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Photographers</h1>
        <Link
          href="/admin/photographers/create"
          className="flex items-center gap-2 bg-mainNavyText text-mainBackgroundV1 px-4 py-2 rounded-sm hover:bg-blue-700 transition-colors"
        >
          <Plus className="h-4 w-4" />
          <span>Create Photographer</span>
        </Link>
      </div>

      {photographers.length === 0 ? (
        <div className="bg-mainBackgroundV1 p-6 rounded-lg shadow-sm text-center">
          <p className="text-gray-500">No photographers found.</p>
          <Link
            href="/admin/photographers/create"
            className="inline-block mt-4 bg-mainNavyText text-mainBackgroundV1 px-4 py-2 rounded-sm hover:bg-blue-700 transition-colors"
          >
            Create your first photographer
          </Link>
        </div>
      ) : (
        <div className="bg-mainBackgroundV1 rounded-lg shadow-sm overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Photographer
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {photographers.map((photographer) => (
                <tr key={photographer.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={photographer.profileImageUrl} alt={photographer.name} />
                        <AvatarFallback>
                          <User className="h-5 w-5 text-gray-500" />
                        </AvatarFallback>
                      </Avatar>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{photographer.name}</div>
                        {photographer.uid && (
                          <div className="text-xs text-gray-500">UID: {photographer.uid.substring(0, 8)}...</div>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">{photographer.email}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary" className="bg-green-100 text-green-800">
                        <CheckCircle className="h-3 w-3 mr-1" />
                        Active
                      </Badge>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex justify-end gap-2">
                      <Link
                        href={`/admin/photographers/${photographer.id}/edit`}
                        className="text-mainNavyText hover:text-blue-900 mr-2"
                      >
                        <Edit className="h-5 w-5 inline" />
                      </Link>
                      <button
                        onClick={() => handleDeletePhotographer(photographer.id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        <Trash2 className="h-5 w-5 inline" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
