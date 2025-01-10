import type { ReviewData } from "../types";

export function isReviewData(value: unknown): value is ReviewData {
  if (!value || typeof value !== "object") return false;

  const review = value as Record<string, unknown>;

  return (
    typeof review.id === "string" &&
    typeof review.userId === "string" &&
    typeof review.userName === "string" &&
    typeof review.rating === "number" &&
    typeof review.comment === "string" &&
    typeof review.createdAt === "string" &&
    typeof review.orderId === "string" &&
    typeof review.verified === "boolean"
  );
}

export function parseReviews(reviewsJson: unknown): ReviewData[] {
  if (!Array.isArray(reviewsJson)) return [];

  return reviewsJson.filter(isReviewData).map(review => ({
    ...review,
    rating: Number(review.rating),
  }));
}
