"use client"

import { EnhancedEventForm } from "@/components/admin/enhanced-event-form"

export default function EditEventPage({ params }: { params: { id: string } }) {
  return <EnhancedEventForm eventId={params.id} />
}
