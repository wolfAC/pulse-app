"use client";

import { useRouter } from "next/navigation";
import { OnboardingFlow } from "@/components/onboarding/onboarding-flow";

export default function OnboardingPage() {
  const router = useRouter();

  const handleComplete = () => {
    router.replace("/");
  };

  return <OnboardingFlow onComplete={handleComplete} />;
}
