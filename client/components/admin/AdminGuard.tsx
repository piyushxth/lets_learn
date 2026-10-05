"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/lib/useAuth";

export default function AdminGuard({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();

  const { user, loading, isAuthenticated, isAdmin } = useAuth();

  useEffect(() => {
    if (loading) return;

    if (!isAuthenticated) {
      router.replace("/admin/login");
      return;
    }

    if (!isAdmin) {
      router.replace("/");
    }
  }, [loading, isAuthenticated, isAdmin, router]);

  if (loading) {
    return <div>Checking authentication...</div>;
  }

  if (!user || !isAdmin) {
    return null;
  }

  return <>{children}</>;
}
