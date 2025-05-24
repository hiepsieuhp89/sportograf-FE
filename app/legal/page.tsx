import { StaticPageLayout } from "@/components/static-page-layout"

export default function LegalPage() {
  return (
    <StaticPageLayout>
      <div className="bg-white mx-auto py-12 sm:py-16 lg:py-20 text-mainNavyText">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-lg sm:text-xl font-bold mb-6">Legal notice</h1>
          <div className="mb-6 sm:mb-8">
            <p className="mb-1 text-sm font-bold">Sportograf Digital Solutions GmbH</p>
            <p className="mb-1 text-sm font-bold">Süsterfeldstrasse 170</p>
            <p className="mb-1 text-sm font-bold">52072 Aachen - Germany</p>
            <p className="mb-4 text-sm font-bold">
              Email:{" "}
              <a href="mailto:legal@sportograf.com" className="text-mainNavyText hover:underline">
                legal@sportograf.com
              </a>
            </p>

            <p className="mb-4 text-sm">
              To contact our support, please{" "}
              <a href="#" className="text-mainNavyText hover:underline">
                use our contact form
              </a>
              .
            </p>
          </div>
          <div className="mb-6 sm:mb-8">
            <h2 className="text-sm font-semibold mb-4">Managing Directors:</h2>
            <p className="mb-4 text-sm">Tom Janas, Hans-Peter Zurbrügg</p>
          </div>
          <div className="mb-6 sm:mb-8">
            <p className="mb-2 text-sm">Local Court Aachen, HRB 24642</p>
            <p className="mb-4 text-sm">Sales tax identification number: DE341002439</p>
          </div>

          <div className="mb-6 sm:mb-8">
            <p className="mb-4 text-sm">
              On the basis of Regulation (EU) No 524/2013 on online dispute resolution for consumer disputes, the European
              Commission expectedly launches a platform for online dispute resolution on 02/15/2016 under the URL
              http://ec.europa.eu/odr.
            </p>
            <p className="mb-4 text-sm">
              Consumers then have the opportunity to use this platform for the settlement of disputes regarding our online
              offer.
            </p>
          </div>
        </div>
      </div>
    </StaticPageLayout>
  )
}
