import { EventTypeForm } from "@/components/admin/event-type-form"

interface EditEventTypePageProps {
  params: {
    id: string
  }
}

export default function EditEventTypePage({ params }: EditEventTypePageProps) {
  return <EventTypeForm eventTypeId={params.id} />
} 