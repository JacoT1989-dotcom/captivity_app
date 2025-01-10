// StarRating.tsx
import { Star } from "lucide-react";

interface StarRatingProps {
  rating?: number;
  className?: string;
}

export const StarRating = ({ rating = 5, className = "" }: StarRatingProps) => {
  return (
    <div className={`flex items-center gap-0.5 ${className}`}>
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className="h-4 w-4 fill-yellow-400 text-yellow-400"
          strokeWidth={1.5}
        />
      ))}
    </div>
  );
};