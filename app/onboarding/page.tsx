"use client";

import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { completeOnboarding } from "@/store/slices/app";
import { OnboardingFlow } from "@/components/onboarding/onboarding-flow";

export default function OnboardingPage() {
  const router = useRouter();

  const dispatch = useDispatch();

  const handleComplete = () => {
    dispatch(completeOnboarding());

    router.replace("/login");
  };

  return <OnboardingFlow onComplete={handleComplete} />;
}
