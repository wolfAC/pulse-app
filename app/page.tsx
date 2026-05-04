"use client";
import { Dashboard } from "@/components/dashboard/dashboard";
import { FormModalDemo } from "@/components/demos/form-modal-demo";
import { OnboardingFlow } from "@/components/onboarding/onboarding-flow";
import { useEffect, useState } from "react";

export default function DashboardPage() {
  const [showOnboarding, setShowOnboarding] = useState<boolean | null>(null);

  useEffect(() => {
    // Check if onboarding has been completed
    const hasCompletedOnboarding = localStorage.getItem("onboarding_completed");
    setShowOnboarding(!hasCompletedOnboarding);
  }, []);

  const handleOnboardingComplete = () => {
    localStorage.setItem("onboarding_completed", "true");
    setShowOnboarding(false);
  };

  // Show nothing while checking localStorage to avoid hydration mismatch
  if (showOnboarding === null) {
    return null;
  }

  if (showOnboarding) {
    return <OnboardingFlow onComplete={handleOnboardingComplete} />;
  }

  return (
    <div className="space-y-6">
      <Dashboard />
      <FormModalDemo />
    </div>
  );
}
