import { StaticPageLayout } from "@/components/static-page-layout"

export default function LegalPage() {
  return (
    <StaticPageLayout>
      <div className="max-w-8xl mx-auto px-4 py-12">
        <h1 className="text-2xl font-bold mb-6">Legal notice</h1>

        <div className="mb-8">
          <p className="font-semibold mb-1">Sportograf Digital Solutions GmbH</p>
          <p className="mb-1">Süsterfeldstrasse 170</p>
          <p className="mb-1">52072 Aachen - Germany</p>
          <p className="mb-4">
            Email:{" "}
            <a href="mailto:legal@sportograf.com" className="text-blue-600 hover:underline">
              legal@sportograf.com
            </a>
          </p>

          <p className="mb-4">
            To contact our support, please{" "}
            <a href="#" className="text-blue-600 hover:underline">
              use our contact form
            </a>
            .
          </p>
        </div>

        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Managing Directors:</h2>
          <p className="mb-4">Tom Janas, Hans-Peter Zurbrügg</p>
        </div>

        <div className="mb-8">
          <p className="mb-2">Local Court Aachen, HRB 24642</p>
          <p className="mb-4">Sales tax identification number: DE341002439</p>
        </div>

        <div className="mb-8">
          <p className="mb-4">
            On the basis of Regulation (EU) No 524/2013 on online dispute resolution for consumer disputes, the European
            Commission expectedly launches a platform for online dispute resolution on 02/15/2016 under the URL
            http://ec.europa.eu/odr.
          </p>
          <p className="mb-4">
            Consumers then have the opportunity to use this platform for the settlement of disputes regarding our online
            offer.
          </p>
        </div>
      </div>
    </StaticPageLayout>
  )
}
