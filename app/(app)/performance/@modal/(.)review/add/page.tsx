"use client";

import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { ReviewDialog } from "@/components/performance/review-dialog";
import { addReview } from "@/store/slices/performance";
import type { Review } from "@/lib/types/performance";
import type { RootState } from "@/store/index";

export default function AddReviewModal() {
  const router = useRouter();
  const dispatch = useDispatch();
  const currentEmail = useSelector(
    (state: RootState) => state.auth.currentEmail,
  );

  const handleSave = (reviewData: Omit<Review, "id" | "overallScore">) => {
    const overallScore = Math.round(
      (reviewData.metrics.productivity +
        reviewData.metrics.quality +
        reviewData.metrics.communication +
        reviewData.metrics.learning) /
        4,
    );
    dispatch(
      addReview({
        ...reviewData,
        id: crypto.randomUUID(),
        userEmail: currentEmail!,
        overallScore,
      }),
    );
    router.back();
  };

  return (
    <ReviewDialog
      open={true}
      onOpenChange={(open) => {
        if (!open) router.back();
      }}
      review={null}
      onSave={handleSave}
    />
  );
}
