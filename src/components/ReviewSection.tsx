"use client";

import { useState, useEffect } from "react";
import { useUser } from "@clerk/nextjs";
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
  const { user, isSignedIn } = useUser();
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
          userName: user?.fullName || user?.username || user?.primaryEmailAddress?.emailAddress || "Anonymous",
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
    <div className="mt-16">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-2">
          <MessageSquare className="h-5 w-5 text-gray-700" />
          <h3 className="text-lg font-bold text-gray-900">Reviews</h3>
          <span className="text-sm text-gray-500">({reviews.length})</span>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setShowForm(!showForm)}
        >
          {showForm ? (
            <><ChevronUp className="h-4 w-4 mr-1" /> Cancel</>
          ) : (
            <><ChevronDown className="h-4 w-4 mr-1" /> Write a Review</>
          )}
        </Button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="mb-8 p-4 border rounded-lg bg-gray-50">
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Rating</label>
            <StarRating
              rating={formRating}
              size="lg"
              interactive
              onChange={setFormRating}
            />
          </div>
          <div className="mb-4">
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
              Title
            </label>
            <input
              id="title"
              type="text"
              value={formTitle}
              onChange={(e) => setFormTitle(e.target.value)}
              className="w-full px-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="Great product!"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="body" className="block text-sm font-medium text-gray-700 mb-1">
              Review
            </label>
            <textarea
              id="body"
              rows={3}
              value={formBody}
              onChange={(e) => setFormBody(e.target.value)}
              className="w-full px-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="Share your experience with this product..."
            />
          </div>
          {error && <p className="text-red-500 text-sm mb-3">{error}</p>}
          <Button type="submit" disabled={submitting}>
            {submitting ? "Submitting..." : "Submit Review"}
          </Button>
        </form>
      )}

      {loading ? (
        <p className="text-gray-500 text-sm">Loading reviews...</p>
      ) : reviews.length === 0 ? (
        <p className="text-gray-500 text-sm">No reviews yet. Be the first to review!</p>
      ) : (
        <div className="space-y-5">
          {reviews.map((review) => (
            <div key={review.id} className="border-b pb-5">
              <div className="flex items-center gap-2 mb-1">
                <StarRating rating={review.rating} size="sm" />
                <span className="font-semibold text-sm text-gray-900">{review.userName}</span>
                <span className="text-xs text-gray-400">
                  {new Date(review.createdAt).toLocaleDateString()}
                </span>
              </div>
              {review.title && (
                <p className="text-sm font-medium text-gray-800">{review.title}</p>
              )}
              {review.body && (
                <p className="text-sm text-gray-600 mt-1">{review.body}</p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
