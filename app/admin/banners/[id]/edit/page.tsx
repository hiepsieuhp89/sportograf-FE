"use client"

import { BannerForm } from "@/components/admin/banner-form"

interface EditBannerPageProps {
  params: {
    id: string
  }
}

export default function EditBannerPage({ params }: EditBannerPageProps) {
  return <BannerForm bannerId={params.id} />
} 