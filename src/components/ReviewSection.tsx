"use client";

import { useState, useEffect } from "react";
import { authClient } from "@/lib/auth/client";
import { Star, MessageSquare, ChevronDown, ChevronUp } from "lucide-react";
import StarRating from "./StarRating";
import { Button } from "./ui/button";

interface Review {
  id: string;
  userId: string;
  userName: string;
  productId: string;
  rating: number;
  title: string | null;
  body: string | null;
  createdAt: string;
}

export default function ReviewSection({ productId }: { productId: string }) {
  const { data: session } = authClient.useSession();
  const isSignedIn = !!session?.user;
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const [formRating, setFormRating] = useState(5);
  const [formTitle, setFormTitle] = useState("");
  const [formBody, setFormBody] = useState("");

  useEffect(() => {
    fetch(`/api/ratings?productId=${productId}&limit=50`)
      .then((res) => res.json())
      .then((data) => setReviews(data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [productId]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!isSignedIn) {
      setError("Please sign in to leave a review");
      return;
    }
    if (!formBody.trim()) {
      setError("Please write a few words about the product");
      return;
    }
    setSubmitting(true);
    setError("");

    try {
      const res = await fetch("/api/ratings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productId,
          rating: formRating,
          title: formTitle,
          body: formBody,
        }),
      });

      if (res.status === 409) {
        setError("You have already reviewed this product");
        return;
      }

      if (!res.ok) {
        setError("Failed to submit review");
        return;
      }

      const newReview = await res.json();
      setReviews((prev) => [newReview, ...prev]);
      setShowForm(false);
      setFormTitle("");
      setFormBody("");
      setFormRating(5);
    } catch {
      setError("Something went wrong");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div>
      <div className="mb-8 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <MessageSquare className="h-5 w-5 text-primary" aria-hidden="true" />
          <h3 className="font-serif text-2xl font-semibold text-foreground">Reviews</h3>
          <span className="eyebrow">({reviews.length})</span>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setShowForm(!showForm)}
          className="rounded-full"
        >
          {showForm ? (
            <><ChevronUp className="mr-1 h-4 w-4" /> Cancel</>
          ) : (
            <><ChevronDown className="mr-1 h-4 w-4" /> Write a review</>
          )}
        </Button>
      </div>

      {showForm && (
        <form
          onSubmit={handleSubmit}
          className="mb-8 space-y-4 rounded-xl border border-border bg-muted/40 p-5"
        >
          <div>
            <p className="eyebrow mb-2">Your rating</p>
            <StarRating
              rating={formRating}
              size="lg"
              interactive
              onChange={setFormRating}
            />
          </div>
          <div>
            <label htmlFor="title" className="mb-1 block text-sm font-medium text-foreground">
              Title
            </label>
            <input
              id="title"
              type="text"
              value={formTitle}
              onChange={(e) => setFormTitle(e.target.value)}
              className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary"
              placeholder="Great product!"
            />
          </div>
          <div>
            <label htmlFor="body" className="mb-1 block text-sm font-medium text-foreground">
              Review
            </label>
            <textarea
              id="body"
              rows={3}
              required
              minLength={4}
              value={formBody}
              onChange={(e) => setFormBody(e.target.value)}
              aria-describedby={error ? "review-error" : undefined}
              className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary"
              placeholder="Share your experience with this product..."
            />
          </div>
          {error && <p id="review-error" role="alert" className="text-sm text-destructive">{error}</p>}
          <Button type="submit" disabled={submitting} className="rounded-full">
            {submitting ? "Submitting..." : "Submit review"}
          </Button>
        </form>
      )}

      {loading ? (
        <p className="text-sm text-muted-foreground">Loading reviews...</p>
      ) : reviews.length === 0 ? (
        <p className="text-sm text-muted-foreground">No reviews yet. Be the first to review!</p>
      ) : (
        <div className="divide-y divide-border">
          {reviews.map((review) => (
            <div key={review.id} className="py-5 first:pt-0">
              <div className="mb-1 flex flex-wrap items-center gap-2">
                <StarRating rating={review.rating} size="sm" />
                <span className="text-sm font-semibold text-foreground">{review.userName}</span>
                <span className="text-xs text-muted-foreground">
                  {new Date(review.createdAt).toLocaleDateString()}
                </span>
              </div>
              {review.title && (
                <p className="font-serif text-base font-medium text-foreground">{review.title}</p>
              )}
              {review.body && (
                <p className="mt-1 text-sm leading-7 text-muted-foreground">{review.body}</p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
