export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <main className="flex-1 container mx-auto px-4 py-8 min-h-[calc(100vh-148px)] md:min-h-[calc(100vh-117px)]">{children}</main>;
}
