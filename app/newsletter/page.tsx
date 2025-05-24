import { StaticPageLayout } from "@/components/static-page-layout"

export default function NewsletterPage() {
  return (
    <StaticPageLayout>
      <div className="relative">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage:
              "url('https://hebbkx1anhila5yf.public.blob.vercel-storage.com/screencapture-sportograf-en-newsletter-2025-05-23-11_02_41-BwrZYYIVnXkh4t1y3igxbhcU54Uwyo.png')",
          }}
        ></div>
        <div className="absolute inset-0 bg-black bg-opacity-50"></div>

        <div className="relative max-w-8xl mx-auto px-4 py-16">
          <div className="flex flex-col md:flex-row items-center">
            <div className="md:w-1/2 mb-8 md:mb-0">
              <h1 className="text-4xl md:text-5xl font-bold text-mainBackgroundV1 mb-4">
                SPORTOGRAF
                <br />
                <span className="text-blue-500">RACELETTER</span>
              </h1>
              <div className="bg-blue-600 text-mainBackgroundV1 p-8 rounded-lg max-w-md">
                <h2 className="text-xl font-bold mb-4 uppercase">JOIN THE SPORTOGRAF RACELETTER</h2>
                <p className="mb-6">
                  Get updates on exciting events, insights from the world of sport, and special offers from our
                  partners. Ready to dive in?
                </p>

                <form>
                  <div className="mb-4">
                    <input
                      type="email"
                      placeholder="Enter your email"
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800"
                      required
                    />
                  </div>

                  <div className="mb-6">
                    <label className="flex items-start text-sm">
                      <input type="checkbox" className="mt-1 mr-2" required />
                      <span>
                        I agree to receive occasional emails from Sportograf. I can unsubscribe at any time by sending
                        an email to support@sportograf.com.
                      </span>
                    </label>
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-red-600 text-mainBackgroundV1 py-2 px-4 rounded-md hover:bg-red-700 transition-colors"
                  >
                    Subscribe
                  </button>
                </form>
              </div>
            </div>

            <div className="md:w-1/2 md:pl-12">
              <div className="text-mainBackgroundV1">
                <h2 className="text-2xl font-bold mb-4">Why Join Our Newsletter?</h2>
                <ul className="space-y-4">
                  <li className="flex items-start">
                    <div className="mr-2 mt-1 text-blue-400">✓</div>
                    <div>
                      <strong className="block">Event Alerts</strong>
                      <p>Be the first to know about upcoming events where Sportograf will be capturing your moments.</p>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <div className="mr-2 mt-1 text-blue-400">✓</div>
                    <div>
                      <strong className="block">Special Offers</strong>
                      <p>Get exclusive discounts and promotions only available to our newsletter subscribers.</p>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <div className="mr-2 mt-1 text-blue-400">✓</div>
                    <div>
                      <strong className="block">Photography Tips</strong>
                      <p>Learn how to look your best in action photos and make the most of your sporting moments.</p>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <div className="mr-2 mt-1 text-blue-400">✓</div>
                    <div>
                      <strong className="block">Athlete Stories</strong>
                      <p>Read inspiring stories from athletes around the world and their journey in sports.</p>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </StaticPageLayout>
  )
}
