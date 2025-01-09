// app/(auth)/register/layout.tsx
import { Metadata } from 'next'

export const metadata = {
  title: 'Contact Us | Print4Me',
  description: 'Get in touch with the Print4Me team',
}

// This is a server component (no "use client" directive)
export default function ContactLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
