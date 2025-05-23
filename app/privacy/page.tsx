import { StaticPageLayout } from "@/components/static-page-layout"

export default function PrivacyPage() {
  return (
    <StaticPageLayout>
      <div className="max-w-[1200px] mx-auto px-4 py-12">
        <h1 className="text-2xl font-bold mb-6">Privacy Policy for Sportograf.com</h1>

        <div className="prose max-w-none">
          <p className="mb-4">
            At Sportograf, we take your privacy seriously. This Privacy Policy explains how we collect, use, disclose,
            and safeguard your information when you visit our website or use our services.
          </p>

          <h2 className="text-xl font-semibold mt-8 mb-4">1. Information We Collect</h2>

          <h3 className="text-lg font-medium mt-6 mb-3">1.1 Personal Data</h3>
          <p className="mb-4">
            We may collect personal identification information from users in a variety of ways, including, but not
            limited to, when users visit our site, register on the site, place an order, and in connection with other
            activities, services, features or resources we make available on our site. Users may be asked for, as
            appropriate, name, email address, mailing address, phone number, and payment information.
          </p>

          <h3 className="text-lg font-medium mt-6 mb-3">1.2 Non-Personal Data</h3>
          <p className="mb-4">
            We may collect non-personal identification information about users whenever they interact with our site.
            Non-personal identification information may include the browser name, the type of computer and technical
            information about users' means of connection to our site, such as the operating system and the Internet
            service providers utilized and other similar information.
          </p>

          <h2 className="text-xl font-semibold mt-8 mb-4">2. How We Use Collected Information</h2>
          <p className="mb-4">Sportograf may collect and use users' personal information for the following purposes:</p>
          <ul className="list-disc pl-6 mb-4">
            <li>To process and fulfill orders</li>
            <li>To improve customer service</li>
            <li>To personalize user experience</li>
            <li>To process payments</li>
            <li>To send periodic emails</li>
            <li>To notify about special offers and events</li>
          </ul>

          <h2 className="text-xl font-semibold mt-8 mb-4">3. How We Protect Your Information</h2>
          <p className="mb-4">
            We adopt appropriate data collection, storage and processing practices and security measures to protect
            against unauthorized access, alteration, disclosure or destruction of your personal information, username,
            password, transaction information and data stored on our site.
          </p>

          <h2 className="text-xl font-semibold mt-8 mb-4">4. Sharing Your Personal Information</h2>
          <p className="mb-4">
            We do not sell, trade, or rent users' personal identification information to others. We may share generic
            aggregated demographic information not linked to any personal identification information regarding visitors
            and users with our business partners, trusted affiliates and advertisers for the purposes outlined above.
          </p>

          <h2 className="text-xl font-semibold mt-8 mb-4">5. Third Party Websites</h2>
          <p className="mb-4">
            Users may find advertising or other content on our site that link to the sites and services of our partners,
            suppliers, advertisers, sponsors, licensors and other third parties. We do not control the content or links
            that appear on these sites and are not responsible for the practices employed by websites linked to or from
            our site.
          </p>

          <h2 className="text-xl font-semibold mt-8 mb-4">6. Changes to This Privacy Policy</h2>
          <p className="mb-4">
            Sportograf has the discretion to update this privacy policy at any time. When we do, we will revise the
            updated date at the bottom of this page. We encourage users to frequently check this page for any changes to
            stay informed about how we are helping to protect the personal information we collect.
          </p>

          <h2 className="text-xl font-semibold mt-8 mb-4">7. Your Acceptance of These Terms</h2>
          <p className="mb-4">
            By using this site, you signify your acceptance of this policy. If you do not agree to this policy, please
            do not use our site. Your continued use of the site following the posting of changes to this policy will be
            deemed your acceptance of those changes.
          </p>

          <h2 className="text-xl font-semibold mt-8 mb-4">8. Contacting Us</h2>
          <p className="mb-4">
            If you have any questions about this Privacy Policy, the practices of this site, or your dealings with this
            site, please contact us at:
          </p>
          <p className="mb-4">
            Sportograf Digital Solutions GmbH
            <br />
            Süsterfeldstrasse 170
            <br />
            52072 Aachen, Germany
            <br />
            Email: privacy@sportograf.com
          </p>

          <p className="mt-8 text-sm text-gray-500">Last updated: May 23, 2025</p>
        </div>
      </div>
    </StaticPageLayout>
  )
}
