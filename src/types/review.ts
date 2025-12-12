// src/types/review.ts
export interface Review {
  id: number;
  user: string;
  rating: number;
  timeAgo: string;
  comment: string;
  likes: number;
  dislikes: number;
  avatarUrl: string;
}

export interface ReviewDistribution {
  '5': number;
  '4': number;
  '3': number;
  '2': number;
  '1': number;
}

export interface ReviewSummaryData {
  averageRating: number;
  totalReviews: number;
  distribution: ReviewDistribution;
}

export interface ReviewsData {
  summary: ReviewSummaryData;
  reviews: Review[];
}