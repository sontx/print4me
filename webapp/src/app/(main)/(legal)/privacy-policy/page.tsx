// app/(legal)/terms-of-use/page.tsx
export const metadata = {
  title: 'Terms of Use | Print4Me',
  description: 'Review the terms of use before using Print4Me',
}

export default function PrivacyPolicyPage() {
  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Privacy Policy</h1>

      <section className="mb-6">
        <h2 className="text-2xl font-semibold mb-4">Introduction</h2>
        <p className="mb-4">
          Print4Me.Work (“Company”, “Website”, “Site”, “we”, “our”, or “us”) is committed to respecting the privacy of your personal information. This Privacy Policy explains what data we collect, how it is used, and your rights regarding that data. By visiting <a href="https://print4me.work" className="text-blue-500 underline">https://print4me.work</a> (the "website"), you agree to this Privacy Policy.
        </p>
      </section>

      <section className="mb-6">
        <h2 className="text-2xl font-semibold mb-4">Information We Collect</h2>
        <p className="mb-4">
          We may collect the following types of information:
        </p>
        <ul className="list-disc pl-6 mb-4">
          <li>Personal information (name, email, phone number, billing address, and payment details) when you register, make purchases, or contact us.</li>
          <li>Technical information (IP address, browser type, operating system, and usage data) through logs and analytics tools.</li>
          <li>Comments and feedback submitted through forms, emails, or surveys.</li>
        </ul>
      </section>

      <section className="mb-6">
        <h2 className="text-2xl font-semibold mb-4">How We Use Your Information</h2>
        <p className="mb-4">
          We use your information to:
        </p>
        <ul className="list-disc pl-6 mb-4">
          <li>Provide products, services, and customer support.</li>
          <li>Process transactions and send order confirmations.</li>
          <li>Improve website functionality and user experience.</li>
          <li>Send promotional materials, newsletters, and updates.</li>
          <li>Ensure compliance with legal and regulatory requirements.</li>
        </ul>
      </section>

      <section className="mb-6">
        <h2 className="text-2xl font-semibold mb-4">Cookies and Tracking</h2>
        <p className="mb-4">
          We use cookies and tracking technologies to:
        </p>
        <ul className="list-disc pl-6 mb-4">
          <li>Enhance your browsing experience.</li>
          <li>Track website usage and improve performance.</li>
          <li>Display targeted advertisements and offers.</li>
        </ul>
        <p className="mb-4">
          You can manage cookie preferences in your browser settings, but disabling cookies may affect website functionality.
        </p>
      </section>

      <section className="mb-6">
        <h2 className="text-2xl font-semibold mb-4">Third-Party Services</h2>
        <p className="mb-4">
          We may partner with third-party services such as Google Analytics and advertising platforms to collect data for analytics and marketing. These third parties have their own privacy policies, and we encourage you to review them.
        </p>
      </section>

      <section className="mb-6">
        <h2 className="text-2xl font-semibold mb-4">Data Security</h2>
        <p className="mb-4">
          We implement industry-standard security measures to protect your information. However, no method is 100% secure, and we cannot guarantee absolute protection.
        </p>
        <p className="font-bold">
          By using this website, you accept any risks associated with data transmission.
        </p>
      </section>

      <section className="mb-6">
        <h2 className="text-2xl font-semibold mb-4">Children’s Privacy</h2>
        <p className="mb-4">
          This website is not intended for individuals under 13 years of age. We do not knowingly collect data from children. If you believe we have collected such data, please contact us for removal.
        </p>
      </section>

      <section className="mb-6">
        <h2 className="text-2xl font-semibold mb-4">Your Rights</h2>
        <p className="mb-4">
          Under GDPR and CCPA, you have the right to:
        </p>
        <ul className="list-disc pl-6 mb-4">
          <li>Access, update, or delete your personal data.</li>
          <li>Opt-out of marketing communications and data collection.</li>
          <li>Request details about how your data is used.</li>
          <li>File a complaint if your data rights are violated.</li>
        </ul>
        <p className="font-bold">
          Contact us at privacy@print4me.work to exercise your rights.
        </p>
      </section>

      <section className="mb-6">
        <h2 className="text-2xl font-semibold mb-4">Policy Updates</h2>
        <p className="mb-4">
          We may update this Privacy Policy at any time. Changes will be posted on this page.
        </p>
        <p className="font-bold">
          Continued use of our website constitutes acceptance of the revised policy.
        </p>
      </section>

      <section className="mb-6">
        <h2 className="text-2xl font-semibold mb-4">Contact Us</h2>
        <p>
          If you have any questions, contact us at <a href="mailto:privacy@print4me.work" className="text-blue-500 underline">privacy@print4me.work</a>.
        </p>
      </section>
    </div>
  );
}
