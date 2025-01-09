// app/(legal)/terms-of-use/page.tsx
export const metadata = {
  title: 'Terms of Use | Print4Me',
  description: 'Review the terms of use before using Print4Me',
}

export default function TermsOfUsePage() {
  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Terms of Use</h1>

      <section className="mb-6">
        <h2 className="text-2xl font-semibold mb-4">Acceptance of Terms</h2>
        <p className="mb-4">
          By visiting and using <a href="https://print4me.work" className="text-blue-500 underline">https://print4me.work</a> (hereinafter the “Website”), you accept and agree to be bound by these Terms and Conditions including our Disclaimer and Privacy Policy posted on the website and incorporated herein by reference.
        </p>
        <p className="mb-4">
          The term “you” refers to anyone who uses, visits and/or views the website. Print4Me.Work (“Company”, “Website”, “Site”, “I”, “we”, “our” or “us”) reserves the right to amend or modify these terms and conditions in its sole discretion at any time without notice and by using the website, you accept those amendments.
        </p>
        <p className="font-bold">
          It is your responsibility to periodically check the website for updates.
        </p>
      </section>

      <section className="mb-6">
        <h2 className="text-2xl font-semibold mb-4">Age Restrictions</h2>
        <p className="mb-4">
          All information and content on this website is intended for individuals over the age of 18. We do not envision offering products or services to individuals living in the European Union as outlined in the General Data Protection Regulation.
        </p>
        <p>
          Additionally, we make no representation that the information provided on the website including any products and/or services are available or appropriate for use in other locations.
        </p>
      </section>

      <section className="mb-6">
        <h2 className="text-2xl font-semibold mb-4">Privacy Policy</h2>
        <p>
          We are dedicated to respecting the privacy of your personal information. Your acceptance of our Privacy Policy is expressly incorporated into these Terms and Conditions. Please review our <a href="/privacy-policy" className="text-blue-500 underline">Privacy Policy</a> for more information.
        </p>
      </section>

      <section className="mb-6">
        <h2 className="text-2xl font-semibold mb-4">Disclaimer</h2>
        <p>
          Your acceptance of our Disclaimer is expressly incorporated into these Terms and Conditions. Please review our <a href="/disclaimer" className="text-blue-500 underline">Disclaimer</a> for more information.
        </p>
      </section>

      <section className="mb-6">
        <h2 className="text-2xl font-semibold mb-4">Governing Law</h2>
        <p className="mb-4">
          In the event of any dispute, claim, or controversy arising out of or relating to your use of this website, the terms and conditions shall be construed in accordance with the rules and regulations of the State of California, United States.
        </p>
        <p className="font-bold">
          You agree to resolve disputes through mandatory arbitration. Your participation in arbitration is required before pursuing any legal remedies. The prevailing party shall be entitled to recover reasonable attorney’s fees and costs associated with legal action.
        </p>
      </section>

      <section className="mb-6">
        <h2 className="text-2xl font-semibold mb-4">Intellectual Property</h2>
        <p className="mb-4">
          All content on this website including but not limited to text, logos, graphics, and code (collectively, the “Content”) is owned by us and protected by copyright and trademark laws.
        </p>
        <p className="font-bold">
          You agree not to copy, reproduce, or distribute any content without our prior written consent.
        </p>
      </section>

      <section className="mb-6">
        <h2 className="text-2xl font-semibold mb-4">Eligibility and Registration</h2>
        <p className="mb-4">
          To access premium services, you must register as a member. Membership is not transferable and is intended for individuals aged 18 or older.
        </p>
        <p className="font-bold">
          Keep your password confidential. You are responsible for all activities conducted under your account.
        </p>
      </section>

      <section className="mb-6">
        <h2 className="text-2xl font-semibold mb-4">Termination</h2>
        <p>
          We reserve the right to terminate your access without notice if you violate these Terms and Conditions.
        </p>
      </section>

      <section className="mb-6">
        <h2 className="text-2xl font-semibold mb-4">No Refunds</h2>
        <p className="font-bold">
          All sales are final. No refunds will be issued.
        </p>
      </section>

      <section className="mb-6">
        <h2 className="text-2xl font-semibold mb-4">No Warranties</h2>
        <p>
          All content and services are provided “as is” without warranties of any kind.
        </p>
      </section>

      <section className="mb-6">
        <h2 className="text-2xl font-semibold mb-4">Limitation of Liability</h2>
        <p className="font-bold">
          We are not liable for any damages resulting from the use of this website.
        </p>
      </section>

      <section className="mb-6">
        <h2 className="text-2xl font-semibold mb-4">Indemnification</h2>
        <p>
          You agree to indemnify and hold us harmless against any claims, damages, or losses arising from your use of this website.
        </p>
      </section>
    </div>
  );
}
