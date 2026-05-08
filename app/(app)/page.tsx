"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Dashboard } from "@/components/dashboard/dashboard";
import { useSelector } from "react-redux";
import { RootState } from "@/store";

export default function DashboardPage() {
  const router = useRouter();

  const onboardingCompleted = useSelector(
    (state: RootState) => state.app.onboardingCompleted,
  );

  useEffect(() => {
    if (!onboardingCompleted) {
      router.replace("/onboarding");
      return;
    }

    const unlocked = sessionStorage.getItem("authenticated");

    if (!unlocked) {
      router.replace("/login");
    }
  }, [onboardingCompleted, router]);

  return (
    <div className="space-y-6">
      <Dashboard />
    </div>
  );
}
