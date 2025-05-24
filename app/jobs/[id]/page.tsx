import { StaticPageLayout } from "@/components/static-page-layout"
import { getJobById } from "@/lib/jobs"
import { notFound } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, Mail } from "lucide-react"

interface JobDetailPageProps {
  params: {
    id: string
  }
}

export default function JobDetailPage({ params }: JobDetailPageProps) {
  const job = getJobById(params.id)

  if (!job) {
    notFound()
  }

  return (
    <StaticPageLayout>
      <div className="max-w-[800px] mx-auto px-4 py-12">
        {/* Back Button */}
        <Link
          href="/jobs"
          className="inline-flex items-center text-gray-600 hover:text-gray-800 mb-8 transition-colors"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          BACK
        </Link>

        {/* Job Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-blue-600 uppercase mb-2">{job.title}</h1>
          <p className="text-lg text-gray-600 uppercase font-medium">{job.department}</p>
        </div>

        {/* About Us Section */}
        <div className="mb-8">
          <h2 className="text-xl font-bold text-gray-800 mb-4 uppercase">ABOUT US</h2>
          <p className="text-gray-700 leading-relaxed">{job.aboutUs}</p>
        </div>

        {/* Requirements Section */}
        <div className="mb-8">
          <h2 className="text-xl font-bold text-gray-800 mb-4 uppercase">WHAT YOU SHOULD BRING WITH YOU</h2>
          <ul className="space-y-4">
            {job.requirements.map((requirement, index) => (
              <li key={index} className="flex items-start">
                <span className="inline-block w-2 h-2 bg-blue-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                <span className="text-gray-700">{requirement}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Application Section */}
        <div className="mb-8">
          <p className="text-gray-700 mb-6">
            We are looking forward to your application <Mail className="inline h-4 w-4 mx-1" />
            and to maybe welcoming you soon in our great team!
          </p>

          <a
            href={`mailto:${job.applicationEmail}?subject=Application for ${job.title}`}
            className="inline-block bg-blue-600 text-mainBackgroundV1 py-3 px-8 rounded-md hover:bg-blue-700 transition-colors font-medium"
          >
            Apply Now
          </a>
        </div>

        {/* Back Button */}
        <div className="pt-8 border-t border-gray-200">
          <Link
            href="/jobs"
            className="inline-block bg-gray-200 text-gray-700 py-2 px-6 rounded-md hover:bg-gray-300 transition-colors"
          >
            Back
          </Link>
        </div>
      </div>
    </StaticPageLayout>
  )
}
