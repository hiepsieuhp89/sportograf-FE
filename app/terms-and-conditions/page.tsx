import { StaticPageLayout } from "@/components/static-page-layout"

export default function TermsPage() {
  return (
    <StaticPageLayout>
      <div className="max-w-8xl mx-auto px-4 py-12">
        <h1 className="text-2xl font-bold mb-6">Our Terms and Conditions</h1>

        <p className="mb-4">
          Standard Terms and Conditions of Business of Sportograf Digital Solutions GmbH (referred to below as
          "Sportograf"), Süsterfeldstr 170, 52072 Aachen applicable worldwide
        </p>

        <p className="mb-4">19 August 2018</p>
        <p className="mb-6">V 2.0</p>

        <div className="prose max-w-none">
          <h2 className="text-xl font-semibold mt-8 mb-4">1. Scope</h2>
          <p className="mb-4">
            (1) The following standard terms and conditions of business apply to all contracts between Sportograf and
            consumers (referred to below as "Customer") concerning the purchase and delivery of goods or digital content
            via the web shop https://www.sportograf.com.
          </p>
          <p className="mb-4">
            (2) The following applies to commercial interested parties: we are not bound by any of the customer's
            conditions to the contrary, even if we do not explicitly contradict them. Should you wish to purchase a
            license for the commercial use of pictures, we will you to contact us directly. The granting of a license to
            commercial interested parties or for commercial use is not possible via our website and is only possible
            with a separate agreement.
          </p>

          <h2 className="text-xl font-semibold mt-8 mb-4">2. Offer and Conclusion of Contract</h2>
          <p className="mb-4">
            (1) The presentation of products on our website does not constitute a legally binding offer, but is an
            invitation to place an order. The technical goods or digital content will be presented in your shopping
            basket. Before submitting the order, you have the opportunity to correct any errors or change the order
            here.
          </p>
          <p className="mb-4">
            (2) By clicking on the "Buy" button, you place a binding order for the goods in your shopping basket. The
            confirmation of receipt of the order takes place immediately after the order is submitted and does not yet
            constitute acceptance of the contract. The contract is only established and advanced when the Customer has
            accepted these contract terms and conditions by checking the box "accept standard terms and conditions of
            business" and has thereby incorporated the content of the standard terms and conditions of business in its
            offer.
          </p>

          <h2 className="text-xl font-semibold mt-8 mb-4">3. Prices</h2>
          <p className="mb-4">
            (1) During the order process, the Customer may select the language that is familiar with from the languages
            offered in the navigation bar.
          </p>
          <p className="mb-4">
            (2) The prices stated on the product pages include statutory value added tax and all other price components.
            If no other prices are agreed with us in writing, the entire current for the day of the order apply.
          </p>
          <p className="mb-4">
            (3) The prices vary depending on the event. The payment currency and price is determined separately for each
            event. The respective price list can be found by clicking on the event tag highlighted in blue on the right
            side of the image or on the event page itself.
          </p>

          <h2 className="text-xl font-semibold mt-8 mb-4">4. Delivery and payment</h2>
          <p className="mb-4">
            (1) The complete production time (delivery of the ordered images. The delivery time depends heavily on the
            selected payment and delivery modes. The normal time is in any case delivered via download link and are
            delivered on CD, DVD or similar storage at the customer.
          </p>
          <p className="mb-4">
            (2) Payments are made by credit card via PayPal, the digital images are delivered no later than 2 working
            days after the order, although we are trying to deliver within 24 hours. In case of pre-payment, the images
            are delivered within two working days after confirmation that the payable amount has been credited to our
            account.
          </p>

          <h2 className="text-xl font-semibold mt-8 mb-4">5. Right of cancellation</h2>
          <div className="bg-gray-100 p-4 rounded-sm mb-6">
            <h3 className="font-semibold mb-2">Right of cancellation</h3>
            <p className="mb-4">
              You have the right to cancel this contract within fourteen days, without stating any reasons. The
              cancellation period is fourteen days from the date on which the contract is concluded.
            </p>
            <p className="mb-4">
              To exercise your right of cancellation, you must inform us (Sportograf Digital Solutions GmbH,
              Süsterfeldstr 170, 52072 Aachen, support@sportograf.com) of your decision to cancel this contract by means
              of an unambiguous declaration (e.g. by posted letter, fax or email). You may use the attached model
              cancellation form, but this is not mandatory. You may also complete and submit the model cancellation form
              or any other unambiguous declaration electronically on our website. If you make use of this option, we
              will immediately send you confirmation of receipt of such a cancellation.
            </p>
            <p className="mb-4">
              To comply with the cancellation period, it is sufficient that you send the communication concerning your
              exercise of the right of cancellation before the cancellation period has expired.
            </p>
          </div>

          <p className="mt-8 text-sm text-gray-500">Last updated: May 23, 2025</p>
        </div>
      </div>
    </StaticPageLayout>
  )
}
