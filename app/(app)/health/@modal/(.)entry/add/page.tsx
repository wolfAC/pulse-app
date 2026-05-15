"use client";
import { useRouter } from "next/navigation";
import { HealthDialog } from "@/components/health/health-dialog";

export default function AddEntryModal() {
  const router = useRouter();
  return (
    <HealthDialog
      open={true}
      onOpenChange={(open) => {
        if (!open) router.back();
      }}
    />
  );
}
