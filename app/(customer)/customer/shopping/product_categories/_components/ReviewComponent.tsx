"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Star, ChevronDown, ChevronUp, AlertCircle } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { submitProductReview } from "../_categoryActions/reviewAction";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Alert, AlertDescription } from "@/components/ui/alert";
import type { ReviewData } from "../types";

interface ReviewDropdownProps {
  productId: string;
  reviews: ReviewData[];
  canReview: boolean;
  productName: string;
}

const REVIEWS_PER_PAGE = 5;

export const ReviewDropdown: React.FC<ReviewDropdownProps> = ({
  productId,
  reviews,
  canReview,
  productName,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isWritingReview, setIsWritingReview] = useState(false);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(reviews.length / REVIEWS_PER_PAGE);
  const startIndex = (currentPage - 1) * REVIEWS_PER_PAGE;
  const endIndex = startIndex + REVIEWS_PER_PAGE;
  const currentReviews = reviews.slice(startIndex, endIndex);

  const averageRating = reviews.length
    ? reviews.reduce((acc, review) => acc + review.rating, 0) / reviews.length
    : 0;

  const handleSubmitReview = async () => {
    if (!comment.trim()) return;

    setIsSubmitting(true);
    try {
      const result = await submitProductReview(productId, rating, comment);
      if (result.success) {
        setIsWritingReview(false);
        setComment("");
        setRating(5);
        window.location.reload();
      } else {
        alert(result.error || "Failed to submit review");
      }
    } catch (error) {
      alert("An error occurred while submitting your review");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Collapsible
      open={isOpen}
      onOpenChange={setIsOpen}
      className="w-full border rounded-lg"
    >
      <CollapsibleTrigger asChild>
        <Button
          variant="ghost"
          className="w-full flex items-center justify-between p-1 pl-4 hover:bg-muted"
        >
          <div className="flex items-center gap-2">
            <h3 className="font-semibold">Customer Reviews</h3>
            <div className="flex">
              {[1, 2, 3, 4, 5].map(star => (
                <Star
                  key={star}
                  className={`w-4 h-4 ${
                    star <= averageRating
                      ? "fill-yellow-400 text-yellow-400"
                      : "text-gray-300"
                  }`}
                />
              ))}
            </div>
            <span className="text-sm text-muted-foreground">
              ({reviews.length})
            </span>
          </div>
          {isOpen ? (
            <ChevronUp className="h-4 w-4" />
          ) : (
            <ChevronDown className="h-4 w-4" />
          )}
        </Button>
      </CollapsibleTrigger>

      <CollapsibleContent className="p-4 space-y-4 border-t bg-background">
        {!canReview && (
          <Alert className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              You will only be able to review product once order has been
              successfully delivered.
            </AlertDescription>
          </Alert>
        )}

        {canReview && !isWritingReview && (
          <Button
            onClick={() => setIsWritingReview(true)}
            className="w-full bg-blue-600 hover:bg-blue-700 text-foreground"
          >
            Write a Review
          </Button>
        )}

        {isWritingReview && (
          <div className="space-y-4 border p-4 rounded-lg bg-background dark:text-black">
            <div className="flex gap-2 justify-center">
              {[1, 2, 3, 4, 5].map(value => (
                <button
                  key={value}
                  onClick={() => setRating(value)}
                  className="focus:outline-none transition-transform hover:scale-110"
                  disabled={!canReview}
                >
                  <Star
                    className={`w-8 h-8 ${
                      value <= rating
                        ? "fill-yellow-400 text-yellow-400"
                        : "text-gray-300"
                    }`}
                  />
                </button>
              ))}
            </div>
            <Textarea
              value={comment}
              onChange={e => setComment(e.target.value)}
              placeholder={
                canReview
                  ? "What did you like or dislike about this product?"
                  : "You need to purchase this product to write a review"
              }
              disabled={!canReview}
              className="min-h-[100px] bg-background text-foreground"
            />
            <div className="flex gap-2 justify-end">
              <Button
                className="bg-background dark:text-white"
                variant="outline"
                onClick={() => setIsWritingReview(false)}
              >
                Cancel
              </Button>
              <Button
                onClick={handleSubmitReview}
                disabled={isSubmitting || !comment.trim() || !canReview}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                {isSubmitting ? "Submitting..." : "Submit Review"}
              </Button>
            </div>
          </div>
        )}

        <div className="space-y-4">
          {currentReviews.map(review => (
            <div key={review.id} className="border p-4 rounded-lg bg-bac">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <div className="font-semibold">{review.userName}</div>
                  <div className="text-sm text-muted-foreground">
                    {new Date(review.createdAt).toLocaleDateString()}
                  </div>
                </div>
                {/* <div className="flex">
                  {[1, 2, 3, 4, 5].map(star => (
                    <Star
                      key={star}
                      className={`w-4 h-4 ${
                        star <= review.rating
                          ? "fill-yellow-400 text-yellow-400"
                          : "text-gray-300"
                      }`}
                    />
                  ))}
                </div> */}
              </div>
              <p className="text-sm">{review.comment}</p>
            </div>
          ))}

          {reviews.length === 0 && (
            <p className="text-center text-muted-foreground py-4 bg-background rounded-lg">
              No reviews yet.{" "}
              {canReview && "Be the first to review this product!"}
            </p>
          )}
        </div>

        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-2 pt-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
            >
              Previous
            </Button>
            <span className="text-sm">
              Page {currentPage} of {totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() =>
                setCurrentPage(prev => Math.min(totalPages, prev + 1))
              }
              disabled={currentPage === totalPages}
            >
              Next
            </Button>
          </div>
        )}
      </CollapsibleContent>
    </Collapsible>
  );
};
