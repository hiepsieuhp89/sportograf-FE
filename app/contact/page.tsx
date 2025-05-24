import { StaticPageLayout } from "@/components/static-page-layout"

export default function ContactPage() {
  return (
    <StaticPageLayout>
      <div className="max-w-8xl mx-auto px-4 py-12">
        <div className="mb-4">
          <h1 className="text-2xl font-bold mb-6">Contact</h1>
          <h2 className="text-xl font-bold uppercase mb-6">HOW TO CONTACT US</h2>
        </div>

        <div className="mb-8">
          <p className="font-semibold mb-1">Sportograf Digital Solutions GmbH</p>
          <p className="mb-1">Süsterfeldstr 170</p>
          <p className="mb-1">52072 Aachen</p>
          <p className="mb-4">Germany</p>

          <p className="mb-4">
            To contact our support, please{" "}
            <a href="#" className="text-blue-600 hover:underline">
              use our contact form
            </a>
            .
          </p>
        </div>

        <div className="bg-mainBackgroundV1 p-6 rounded-lg shadow-sm mb-8">
          <h3 className="text-lg font-semibold mb-4">Contact Form</h3>
          <form>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                  Name <span className="text-red-500">*</span>
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Email <span className="text-red-500">*</span>
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            <div className="mb-6">
              <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">
                Subject <span className="text-red-500">*</span>
              </label>
              <input
                id="subject"
                name="subject"
                type="text"
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="mb-6">
              <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                Message <span className="text-red-500">*</span>
              </label>
              <textarea
                id="message"
                name="message"
                rows={6}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              ></textarea>
            </div>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-mainBackgroundV1 rounded-md hover:bg-blue-700 transition-colors"
            >
              Send Message
            </button>
          </form>
        </div>
      </div>
    </StaticPageLayout>
  )
}
