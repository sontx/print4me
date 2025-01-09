
export const metadata = {
  title: "Register | Print4Me",
  description: "Register for a Print4Me account to access our services!",
};

// This is a server component (no "use client" directive)
export default function LoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>
}
