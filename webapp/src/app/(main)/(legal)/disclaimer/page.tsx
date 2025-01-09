// app/(legal)/terms-of-use/page.tsx
export const metadata = {
  title: 'Terms of Use | Print4Me',
  description: 'Review the terms of use before using Print4Me',
}

export default function DisclaimerPage() {
  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Disclaimer</h1>

      <section className="mb-6">
        <h2 className="text-2xl font-semibold mb-4">General Information</h2>
        <p className="mb-4">
          Print4Me.Work (“Company”, “Website”, “Site”, “we”, “our”, or “us”) provides general educational information on various topics as a public service, which should not be construed as professional, financial, business, tax, or legal advice. These are our personal opinions only.
        </p>
        <p className="font-bold">
          By using this website, you agree to this Disclaimer and our Terms and Conditions and Privacy Policy.
        </p>
      </section>

      <section className="mb-6">
        <h2 className="text-2xl font-semibold mb-4">Professional Disclaimer</h2>
        <p className="mb-4">
          All content is for informational and educational purposes only and does not establish a professional-client relationship. Always consult a qualified professional before making decisions related to financial, business, tax, or legal matters.
        </p>
        <p className="font-bold">
          You agree not to hold us liable for any outcomes resulting from your reliance on this information.
        </p>
      </section>

      <section className="mb-6">
        <h2 className="text-2xl font-semibold mb-4">Affiliate / Third-Party Links Disclaimer</h2>
        <p className="mb-4">
          We may partner with businesses or affiliate programs, earning commissions when you click or purchase through affiliate links. Recommendations are based on personal experience, but it is your responsibility to verify all information before purchasing products or services.
        </p>
        <p className="font-bold">
          We are not responsible for the content or actions of third-party websites.
        </p>
      </section>

      <section className="mb-6">
        <h2 className="text-2xl font-semibold mb-4">Sponsored Content / Reviews Disclaimer</h2>
        <p className="mb-4">
          We may publish sponsored posts or reviews and may receive compensation, discounts, or free products for these. However, all opinions expressed are our own, and you should conduct your own research before relying on such information.
        </p>
        <p className="font-bold">
          We are not liable for your decisions based on reviews or sponsored content.
        </p>
      </section>

      <section className="mb-6">
        <h2 className="text-2xl font-semibold mb-4">Fair Use Disclaimer</h2>
        <p className="mb-4">
          Any copyrighted material used on this site falls under “fair use” for purposes such as criticism, comment, news reporting, teaching, scholarship, and research. If you believe we have infringed on copyright, please contact us immediately.
        </p>
      </section>

      <section className="mb-6">
        <h2 className="text-2xl font-semibold mb-4">No Warranties</h2>
        <p className="mb-4">
          ALL CONTENT, INFORMATION, PRODUCTS, AND SERVICES ON THE WEBSITE ARE PROVIDED “AS IS” WITHOUT WARRANTIES OF ANY KIND. WE DO NOT GUARANTEE THE COMPLETENESS OR ACCURACY OF THE INFORMATION PRESENTED HERE.
        </p>
        <p className="font-bold">
          Your use of the site is at your own risk.
        </p>
      </section>

      <section className="mb-6">
        <h2 className="text-2xl font-semibold mb-4">Limitation of Liability</h2>
        <p className="mb-4">
          Under no circumstances shall we or anyone working with us be liable for any direct, indirect, incidental, consequential, or special damages arising from your use of this website.
        </p>
        <p className="font-bold">
          This includes losses from data theft, interruptions, or system failures.
        </p>
      </section>

      <section className="mb-6">
        <h2 className="text-2xl font-semibold mb-4">Contact Us</h2>
        <p>
          If you have questions about this Disclaimer, please contact us at <a href="mailto:support@print4me.work" className="text-blue-500 underline">support@print4me.work</a>.
        </p>
      </section>
    </div>
  );
}
