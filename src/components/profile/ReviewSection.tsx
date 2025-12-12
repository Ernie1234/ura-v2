// src/components/ReviewsSection.tsx
import React, { useEffect, useState } from 'react';
import { mockApi } from '@/services/mockApi';
import type { ReviewsData } from '@/types/review';

import ReviewSummary from '@/components/profile/ReviewSummary';
import ReviewCard from '@/components/profile/ReviewCard';

const ReviewsSection: React.FC = () => {
  const [data, setData] = useState<ReviewsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchReviews = async () => {
      setLoading(true);
      setError(null);
      // 'reviews' corresponds to the reviews.json file name
      const fetchedData = await mockApi.get('reviews'); 
      if (fetchedData) {
        setData(fetchedData as ReviewsData);
      } else {
        setError("Failed to load reviews. Check mock-data/reviews.json.");
      }
      setLoading(false);
    };

    fetchReviews();
  }, []);

  if (loading) {
    return <div className="p-4 text-center text-gray-500">Loading reviews...</div>;
  }

  if (error) {
    return <div className="p-4 text-center text-red-500">{error}</div>;
  }
  
  if (!data) return null; // Should not happen if error handling is correct

  return (
    <div className="bg-white">
      
      {/* 1. Summary Section */}
      <ReviewSummary summary={data.summary} />
      
      {/* 2. Individual Reviews */}
      <div className="p-4 pt-0">
        {data.reviews.map((review) => (
          <ReviewCard key={review.id} review={review} />
        ))}
      </div>
      
    </div>
  );
};

export default ReviewsSection;