import { StaticPageLayout } from "@/components/static-page-layout"
import Image from "next/image"

export default function AboutUsPage() {
  return (
    <StaticPageLayout>
      <div className="max-w-[1200px] mx-auto px-4 py-12">
        <section className="mb-16">
          <h1 className="text-3xl font-bold mb-8 text-center">About Sportograf</h1>
          <div className="flex flex-col md:flex-row gap-8 items-center">
            <div className="md:w-1/2">
              <Image
                src="/placeholder.svg?height=400&width=600"
                alt="Sportograf team"
                width={600}
                height={400}
                className="rounded-lg"
              />
            </div>
            <div className="md:w-1/2">
              <p className="text-lg mb-4">
                Sportograf has been the leading sports photography service for over a decade, capturing the passion and
                determination of athletes around the world.
              </p>
              <p className="text-lg mb-4">
                Our team of professional photographers are present at hundreds of events each year, from local races to
                international competitions, ensuring that every participant has the opportunity to preserve their
                sporting memories.
              </p>
              <p className="text-lg">
                With our state-of-the-art technology and dedicated team, we provide high-quality images that capture the
                spirit and emotion of every sporting event.
              </p>
            </div>
          </div>
        </section>

        <section className="mb-16 bg-gray-50 p-8 rounded-lg">
          <h2 className="text-2xl font-bold mb-6 text-center">Our Numbers</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div className="p-4">
              <div className="text-4xl font-bold text-blue-600 mb-2">550+</div>
              <div className="text-gray-600">Events per year</div>
            </div>
            <div className="p-4">
              <div className="text-4xl font-bold text-blue-600 mb-2">500+</div>
              <div className="text-gray-600">Photographers</div>
            </div>
            <div className="p-4">
              <div className="text-4xl font-bold text-blue-600 mb-2">10+</div>
              <div className="text-gray-600">Million photos</div>
            </div>
            <div className="p-4">
              <div className="text-4xl font-bold text-blue-600 mb-2">50+</div>
              <div className="text-gray-600">Countries</div>
            </div>
          </div>
        </section>

        <section className="mb-16">
          <h2 className="text-2xl font-bold mb-6 text-center">What differentiates us from others</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-xl font-semibold mb-3">Quality</h3>
              <p>
                Our photographers are professionals with years of experience in sports photography, ensuring the highest
                quality images for every participant.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-xl font-semibold mb-3">Coverage</h3>
              <p>
                We position photographers at strategic locations throughout the course to capture multiple shots of each
                participant.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-xl font-semibold mb-3">Technology</h3>
              <p>
                Our advanced facial recognition technology makes it easy for participants to find their photos quickly
                after the event.
              </p>
            </div>
          </div>
        </section>

        <section className="mb-16">
          <h2 className="text-2xl font-bold mb-6 text-center">Image processing</h2>
          <div className="flex flex-col md:flex-row gap-8 items-center">
            <div className="md:w-1/2">
              <p className="mb-4">
                After each event, our team processes thousands of images to ensure optimal quality. Our workflow
                includes:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Professional color correction and enhancement</li>
                <li>Facial recognition tagging for easy search</li>
                <li>High-resolution exports for print and digital use</li>
                <li>Secure storage and delivery systems</li>
              </ul>
            </div>
            <div className="md:w-1/2">
              <div className="grid grid-cols-1 gap-4">
                <Image
                  src="/placeholder.svg?height=200&width=400"
                  alt="Image processing example 1"
                  width={400}
                  height={200}
                  className="rounded-lg"
                />
                <Image
                  src="/placeholder.svg?height=200&width=400"
                  alt="Image processing example 2"
                  width={400}
                  height={200}
                  className="rounded-lg"
                />
              </div>
            </div>
          </div>
        </section>
      </div>
    </StaticPageLayout>
  )
}
