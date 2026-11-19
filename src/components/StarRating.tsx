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
  sm: 14,
  md: 20,
  lg: 24,
};

export default function StarRating({
  rating,
  count,
  size = "md",
  interactive = false,
  onChange,
}: StarRatingProps) {
  const stars = [1, 2, 3, 4, 5];
  const px = sizes[size];

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
            className="transition-transform hover:scale-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          >
            <Star
              style={{ width: px, height: px }}
              className={
                star <= rating
                  ? "fill-yellow-400 text-yellow-400"
                  : "text-muted-foreground/40"
              }
              aria-hidden="true"
            />
          </button>
        ))}
      </div>
    );
  }

  return (
    <div
      className="flex items-center gap-0.5"
      role="img"
      aria-label={`Rated ${rating} out of 5 stars${
        count !== undefined ? ` based on ${count} reviews` : ""
      }`}
    >
      {stars.map((star) => {
        const fill = Math.max(0, Math.min(1, rating - (star - 1)));
        return (
          <span
            key={star}
            className="relative inline-block shrink-0"
            style={{ width: px, height: px }}
          >
            <Star
              style={{ width: px, height: px }}
              className="absolute inset-0 text-muted-foreground/35"
              aria-hidden="true"
            />
            {fill > 0 && (
              <span
                className="absolute inset-y-0 left-0 overflow-hidden"
                style={{ width: `${fill * 100}%` }}
              >
                <Star
                  style={{ width: px, height: px }}
                  className="fill-yellow-400 text-yellow-400"
                  aria-hidden="true"
                />
              </span>
            )}
          </span>
        );
      })}
      {count !== undefined && (
        <span className="ml-1.5 text-xs text-muted-foreground">({count})</span>
      )}
    </div>
  );
}
