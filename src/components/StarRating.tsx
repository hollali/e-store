"use client";

import { Star } from "lucide-react";

interface StarRatingProps {
  rating: number;
  count?: number;
  size?: "sm" | "md" | "lg";
  interactive?: boolean;
  onChange?: (rating: number) => void;
}

const sizes = {
  sm: "h-3.5 w-3.5",
  md: "h-5 w-5",
  lg: "h-6 w-6",
};

export default function StarRating({
  rating,
  count,
  size = "md",
  interactive = false,
  onChange,
}: StarRatingProps) {
  const stars = [1, 2, 3, 4, 5];

  if (interactive) {
    return (
      <div className="flex items-center gap-0.5" role="radiogroup" aria-label="Choose a rating">
        {stars.map((star) => (
          <button
            key={star}
            type="button"
            role="radio"
            aria-checked={star === rating}
            aria-label={`Rate ${star} out of 5 stars`}
            onClick={() => onChange?.(star)}
            className={`${sizes[size]} transition-colors ${
              star <= rating
                ? "text-yellow-400 fill-yellow-400"
                : "text-gray-300"
            }`}
          >
            <Star className={`${sizes[size]} ${star <= rating ? "fill-yellow-400" : ""}`} />
          </button>
        ))}
      </div>
    );
  }

  return (
    <div className="flex items-center gap-0.5" role="img" aria-label={`Rated ${rating} out of 5 stars${count !== undefined ? ` based on ${count} reviews` : ""}`}>
      {stars.map((star) => {
        const fill = star <= Math.floor(rating) ? "fill-yellow-400" : "";
        const half = star === Math.ceil(rating) && rating % 1 >= 0.25 ? "half" : "";
        return (
          <span key={star} className={`${sizes[size]} text-yellow-400 ${fill}`}>
            <Star className={`${sizes[size]} ${fill}`} />
          </span>
        );
      })}
      {count !== undefined && (
        <span className="ml-1.5 text-xs text-gray-500">({count})</span>
      )}
    </div>
  );
}
