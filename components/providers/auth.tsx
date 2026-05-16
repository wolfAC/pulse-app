"use client";

import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useRouter, usePathname } from "next/navigation";
import { RootState } from "@/store/index";

const PUBLIC_PATHS = ["/login", "/onboarding"];

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const isAuthenticated = useSelector((s: RootState) => s.auth.isAuthenticated);
  const currentEmail = useSelector((s: RootState) => s.auth.currentEmail);
  const users = useSelector((s: RootState) => s.auth.users);

  const hasAnyUsers = Object.keys(users).length > 0;
  const isPublic = PUBLIC_PATHS.some((p) => pathname.startsWith(p));

  useEffect(() => {
    if (isPublic) return;
    if (!hasAnyUsers) {
      router.replace("/onboarding");
      return;
    }
    if (!isAuthenticated || !currentEmail) {
      router.replace("/login");
      return;
    }
  }, [isAuthenticated, currentEmail, hasAnyUsers, isPublic, router, pathname]);

  if (!isPublic && (!hasAnyUsers || !isAuthenticated || !currentEmail)) {
    return null;
  }

  return <>{children}</>;
}
