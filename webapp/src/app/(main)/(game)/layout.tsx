"use client";

import { useAuth } from "@/contexts/auth-context";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function GamesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isLoggedIn, isReady } = useAuth();
  const router = useRouter();

  // Redirect non-logged-in users
  useEffect(() => {
    if (!isLoggedIn && isReady) {
      router.replace("/login");
    }
  }, [isLoggedIn, isReady, router]);

  // Render nothing while redirecting
  if (!isLoggedIn) return null;

  return <>{children}</>;
}
