"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { RootState } from "@/store/index";
import { Dashboard } from "@/components/dashboard/dashboard";

export default function DashboardPage() {
  const router = useRouter();
  const currentEmail = useSelector(
    (state: RootState) => state.auth.currentEmail,
  );
  const isAuthenticated = useSelector(
    (state: RootState) => state.auth.isAuthenticated,
  );
  const appLocked = useSelector((state: RootState) => state.app.appLocked);
  const onboardingCompleted = useSelector((state: RootState) =>
    currentEmail ? !!state.auth.users[currentEmail] : false,
  );

  useEffect(() => {
    if (!isAuthenticated || appLocked) {
      router.replace("/login");
    }
    if (!onboardingCompleted) {
      router.replace("/onboarding");
      return;
    }
  }, [onboardingCompleted, isAuthenticated, appLocked, router]);

  if (!onboardingCompleted || !isAuthenticated || appLocked) {
    return null;
  }

  return (
    <div className="h-full overflow-hidden">
      <Dashboard />
    </div>
  );
}
