// components/footer.tsx
import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="w-full border-t bg-white">
      <div className="container mx-auto flex flex-col items-center justify-between gap-4 p-4 md:flex-row">
        <span className="text-sm">
          © {new Date().getFullYear()} Print4Me. All rights reserved.
        </span>

        <div className="flex items-center space-x-4 text-sm">
          <Link href="/terms-of-use" className="hover:underline">
            Terms of Use
          </Link>
          <Link href="/privacy-policy" className="hover:underline">
            Privacy Policy
          </Link>
          <Link href="/disclaimer" className="hover:underline">
            Disclaimer
          </Link>
        </div>
      </div>
    </footer>
  )
}
