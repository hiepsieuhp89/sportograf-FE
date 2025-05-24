import { StaticPageLayout } from "@/components/static-page-layout"
import { JobCard } from "@/components/job-card"
import { jobs } from "@/lib/jobs"

export default function JobsPage() {
  return (
    <StaticPageLayout>
      <div className="max-w-8xl mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold mb-4">Join Our Team</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Discover exciting career opportunities at Sportograf. We're always looking for talented individuals who
            share our passion for sports photography and event coverage.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {jobs.map((job) => (
            <JobCard key={job.id} job={job} />
          ))}
        </div>

        {jobs.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No job openings available at the moment. Please check back later!</p>
          </div>
        )}
      </div>
    </StaticPageLayout>
  )
}
