"use client"

import { PhotographerForm } from "@/components/admin/photographer-form"

export default function EditPhotographerPage({ params }: { params: { id: string } }) {
  return <PhotographerForm photographerId={params.id} />
}
