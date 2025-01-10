"use client";

import { Star } from "lucide-react";
import type { ReviewData } from "../types";

interface StarRatingProps {
  reviews: ReviewData[];
  showCount?: boolean;
  size?: number;
}

export const StarRating: React.FC<StarRatingProps> = ({
  reviews,
  showCount = true,
  size = 14,
}) => {
  const averageRating = reviews.length
    ? reviews.reduce((acc, review) => acc + review.rating, 0) / reviews.length
    : 0;

  return (
    <div className="flex items-center gap-1">
      <div className="flex">
        {[1, 2, 3, 4, 5].map(star => (
          <Star
            key={star}
            className={`w-${size} h-${size} ${
              star <= averageRating
                ? "fill-yellow-400 text-yellow-400"
                : "text-gray-300"
            }`}
          />
        ))}
      </div>
      {showCount && (
        <span className="text-sm text-muted-foreground">
          ({reviews.length})
        </span>
      )}
    </div>
  );
};
