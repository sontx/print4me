// app/(marketing)/contact/page.tsx

export const metadata = {
  title: "Contact Us | Print4Me",
  description: "Get in touch with the Print4Me team",
};

export default function ContactPage() {
  return (
    <section className="mx-auto max-w-xl py-8">
      <h1 className="mb-4 text-2xl font-bold">Contact Us</h1>
      <p>
        If you have any questions or comments, please reach out at{" "}
        <a
          href="mailto:hello@allplrs.com"
          className="text-blue-600 hover:underline"
        >
          hello@allplrs.com
        </a>
        .
      </p>
    </section>
  );
}
