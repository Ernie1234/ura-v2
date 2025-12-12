// src/components/ReviewSummary.tsx (UPDATED)
import React from 'react';
import type { ReviewSummaryData, ReviewDistribution } from '@/types/review';
import ReviewBar from './ReviewBar';
import { Edit } from 'lucide-react'; // <-- CHANGED: Imported 'Edit' from lucide-react

interface ReviewSummaryProps {
  summary: ReviewSummaryData;
}

const ReviewSummary: React.FC<ReviewSummaryProps> = ({ summary }) => {
  // Find the max count to calculate relative widths for the bars
  const counts = Object.values(summary.distribution).map(Number);
  const maxCount = Math.max(...counts);
  
  // Format rating to one decimal place
  const formattedRating = summary.averageRating.toFixed(1);
  const starRating = Math.round(summary.averageRating);
  
  // Stars array for mapping and reversing the display order (5 down to 1)
  const starLevels = [5, 4, 3, 2, 1]; 

  const renderStars = (rating: number) => {
    return Array(5).fill(0).map((_, i) => (
      <span key={i} className={i < rating ? 'text-orange-500' : 'text-gray-300'}>
        ★
      </span>
    ));
  };

  return (
    <div className="mb-6 p-4 border-b">
      <h3 className="text-xl font-bold mb-4 text-gray-800">Reviews Summary</h3>
      
      <div className="flex justify-between items-start">
        {/* Left Side: Average Rating */}
        <div className="flex flex-col items-center mr-6">
          <p className="text-4xl font-bold text-gray-800">{formattedRating}</p>
          <div className="flex text-2xl mt-1">
            {renderStars(starRating)}
          </div>
          <p className="text-sm text-gray-500 mt-1">{summary.totalReviews}</p>
        </div>

        {/* Right Side: Distribution Bars */}
        <div className="flex-grow">
          {starLevels.map((star) => (
            <ReviewBar
              key={star}
              stars={star}
              count={summary.distribution[star as unknown as keyof ReviewDistribution] || 0}
              maxCount={maxCount}
            />
          ))}
        </div>
      </div>
      
      {/* Add Review Button */}
      <div className="flex justify-between items-center mt-6 py-2 border-t">
        <span className="text-orange-500 font-medium">Add Review</span>
        {/* CHANGED ICON HERE */}
        <Edit className="text-orange-500 cursor-pointer text-lg w-5 h-5" /> 
      </div>
    </div>
  );
};

export default ReviewSummary;