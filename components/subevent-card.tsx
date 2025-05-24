"use client"

import Link from "next/link"
import Image from "next/image"
import { useTranslations } from "@/hooks/use-translations"
import { formatDate } from "@/lib/utils"
import type { Subevent } from "@/lib/types"

interface SubeventCardProps {
  subevent: Subevent
}

export function SubeventCard({ subevent }: SubeventCardProps) {
  const { t } = useTranslations()

  return (
    <div className="flex flex-col border border-gray-200 rounded-sm overflow-hidden">
      <div className="p-4 text-center">
        <div className="mb-4">
          <Image
            src={subevent.imageUrl || "/placeholder.svg?height=150&width=150"}
            alt={subevent.title}
            width={150}
            height={150}
            className="mx-auto"
          />
        </div>
        <div className="text-sm text-gray-500 mb-1">{formatDate(subevent.date)}</div>
        <h3 className="font-medium text-sm mb-4">{subevent.title}</h3>
        <Link
          href={`/events/${subevent.eventId}/subevents/${subevent.id}`}
          className="block w-full bg-mainNavyText text-mainBackgroundV1 py-2 px-4 text-sm font-medium hover:bg-blue-700 transition-colors"
        >
          {t("showPhotos")}
        </Link>
      </div>
    </div>
  )
}
