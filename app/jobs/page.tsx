import { EventCard } from "@/components/home/event-card"
import { StaticPageLayout } from "@/components/static-page-layout"
import { jobs } from "@/lib/jobs"

export default function JobsPage() {
  return (
    <StaticPageLayout>
      <div className="max-w-8xl mx-auto px-16">
        <div className="py-20">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {jobs.map((job) => (
              <EventCard key={job.id} event={job as any} />
            ))}
          </div>
          <div className="mt-8 text-center">
            <button className="bg-mainActiveV1 text-sm font-montserrat font-medium h-10 uppercase hover:bg-gray-300 text-gray-800 py-2 px-6 rounded-none transition-colors">
              LOAD MORE
            </button>
          </div>
        </div>
      </div>
    </StaticPageLayout>
  )
}
