"use client";

import { useRouter, useParams } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { ReviewDialog } from "@/components/performance/review-dialog";
import { updateReview } from "@/store/slices/performance";
import type { Review } from "@/lib/types/performance";
import type { RootState } from "@/store/index";

export default function EditReviewModal() {
  const router = useRouter();
  const dispatch = useDispatch();
  const { id } = useParams<{ id: string }>();

  const review = useSelector((state: RootState) =>
    state.performance.reviews.find((r) => r.id === id),
  );

  const handleSave = (reviewData: Omit<Review, "id" | "overallScore">) => {
    if (!review) return;
    const overallScore = Math.round(
      (reviewData.metrics.productivity +
        reviewData.metrics.quality +
        reviewData.metrics.communication +
        reviewData.metrics.learning) /
        4,
    );
    dispatch(updateReview({ ...review, ...reviewData, overallScore }));
    router.back();
  };

  if (!review) return null;

  return (
    <ReviewDialog
      open={true}
      onOpenChange={(open) => {
        if (!open) router.back();
      }}
      review={review}
      onSave={handleSave}
    />
  );
}
