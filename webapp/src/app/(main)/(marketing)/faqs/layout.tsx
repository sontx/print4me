// app/(auth)/register/layout.tsx
import { Metadata } from 'next'

export const metadata = {
  title: 'FAQs | Print4Me',
  description: 'Frequently asked questions about Print4Me',
}

// This is a server component (no "use client" directive)
export default function FaqLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
