"use client"

import Link from "next/link"
import Image from "next/image"
import type { Job } from "@/lib/jobs"

interface JobCardProps {
  job: Job
}

export function JobCard({ job }: JobCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
      <div className="p-6">
        <div className="flex justify-center mb-4">
          <Image
            src={job.imageUrl || "/placeholder.svg?height=200&width=300"}
            alt={job.title}
            width={300}
            height={200}
            className="rounded-lg object-cover"
          />
        </div>

        <div className="text-center">
          <h3 className="text-lg font-semibold text-blue-600 mb-1">{job.title}</h3>
          <p className="text-gray-600 text-sm mb-4">{job.department}</p>

          <Link
            href={`/jobs/${job.id}`}
            className="inline-block w-full bg-white border border-blue-600 text-blue-600 py-2 px-4 rounded-md hover:bg-blue-50 transition-colors text-sm font-medium uppercase"
          >
            SHOW JOB
          </Link>
        </div>
      </div>
    </div>
  )
}
