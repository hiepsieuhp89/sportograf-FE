"use client"

import { useState, useEffect } from "react"
import { collection, getDocs, deleteDoc, doc, query, orderBy } from "firebase/firestore"
import { db } from "@/lib/firebase"
import type { BannerImage } from "@/lib/types"
import Link from "next/link"
import { Edit, Trash2, Plus, Info } from "lucide-react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"

export default function BannersPage() {
  const [banners, setBanners] = useState<BannerImage[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchBanners = async () => {
      try {
        const bannersQuery = query(collection(db, "banners"), orderBy("order"))
        const bannersSnapshot = await getDocs(bannersQuery)
        const bannersList = bannersSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as BannerImage[]
        setBanners(bannersList)
      } catch (error) {
        console.error("Error fetching banners:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchBanners()
  }, [])

  const handleDeleteBanner = async (bannerId: string) => {
    if (!confirm("Are you sure you want to delete this banner?")) return

    try {
      await deleteDoc(doc(db, "banners", bannerId))
      setBanners(banners.filter((banner) => banner.id !== bannerId))
    } catch (error) {
      console.error("Error deleting banner:", error)
    }
  }

  const centerBanner = banners.find(banner => banner.type === "center")
  const parallaxBanners = banners.filter(banner => banner.type === "parallax")
  const canAddCenter = !centerBanner
  const canAddParallax = parallaxBanners.length < 4

  if (loading) {
    return (
      <div className="flex justify-center p-8">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-mainNavyText"></div>
      </div>
    )
  }

  const BannerTable = ({ banners, type }: { banners: BannerImage[], type: "center" | "parallax" }) => (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Image</TableHead>
          <TableHead>Title</TableHead>
          {type === "parallax" && <TableHead>Order</TableHead>}
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {banners.map((banner) => (
          <TableRow key={banner.id}>
            <TableCell>
              <div className="h-20 w-32 relative">
                <Image
                  src={banner.imageUrl}
                  alt={banner.title || "Banner image"}
                  fill
                  className="object-cover rounded-md"
                />
              </div>
            </TableCell>
            <TableCell className="font-medium">{banner.title}</TableCell>
            {type === "parallax" && <TableCell>{banner.order}</TableCell>}
            <TableCell className="text-right">
              <div className="flex justify-end gap-2">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Link href={`/admin/banners/${banner.id}/edit`}>
                        <Button variant="outline" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                      </Link>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Edit Banner</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>

                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDeleteBanner(banner.id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Delete Banner</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Banner Images</h1>
          <p className="text-gray-600 mt-1">Manage hero section banner images</p>
        </div>
        <div className="flex gap-2">
          {!canAddCenter && !canAddParallax && (
            <Alert variant="destructive" className="max-w-lg">
              <Info className="h-4 w-4" />
              <AlertTitle>Banner Limits Reached</AlertTitle>
              <AlertDescription>
                You can only have 1 Center Image and up to 4 Parallax Images. Please delete existing banners to add new ones.
              </AlertDescription>
            </Alert>
          )}
          <Link href="/admin/banners/create">
            <Button 
              className="flex items-center gap-2"
              disabled={!canAddCenter && !canAddParallax}
            >
              <Plus className="h-4 w-4" />
              Add Banner
            </Button>
          </Link>
        </div>
      </div>

      {/* Center Image Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Center Image</span>
            {!canAddCenter && (
              <Badge variant="secondary">Maximum 1</Badge>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {centerBanner ? (
            <BannerTable banners={[centerBanner]} type="center" />
          ) : (
            <div className="text-center py-8 text-gray-500">
              No center image set. Add one to create the main hero image.
            </div>
          )}
        </CardContent>
      </Card>

      {/* Parallax Images Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Parallax Images</span>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-500">
                {parallaxBanners.length} of 4 images
              </span>
              {!canAddParallax && (
                <Badge variant="secondary">Maximum 4</Badge>
              )}
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {parallaxBanners.length > 0 ? (
            <BannerTable banners={parallaxBanners} type="parallax" />
          ) : (
            <div className="text-center py-8 text-gray-500">
              No parallax images added. Add up to 4 images for the scrolling effect.
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
} 