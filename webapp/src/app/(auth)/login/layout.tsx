
export const metadata = {
  title: "Login | Print4Me",
  description: "Login to your Print4Me account to access our services!",
};

// This is a server component (no "use client" directive)
export default function LoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>
}
