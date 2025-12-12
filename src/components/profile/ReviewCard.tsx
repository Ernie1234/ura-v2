// src/components/ReviewCard.tsx (UPDATED)
import React from 'react';
import type { Review } from '@/types/review';
import { ThumbsUp, ThumbsDown } from 'lucide-react'; // <-- CHANGED: Imported from lucide-react

interface ReviewCardProps {
  review: Review;
}

const ReviewCard: React.FC<ReviewCardProps> = ({ review }) => {
  
  const renderStars = (rating: number) => {
    return Array(5).fill(0).map((_, i) => (
      <span key={i} className={i < rating ? 'text-orange-500' : 'text-gray-300'}>
        ★
      </span>
    ));
  };

  return (
    <div className="p-4 border-b last:border-b-0">
      <div className="flex items-start space-x-3 mb-3">
        {/* User Avatar */}
        <img
          src={review.avatarUrl}
          alt={review.user}
          className="w-10 h-10 rounded-full object-cover"
          onError={(e) => { e.currentTarget.src = 'https://i.pravatar.cc/150?img=50'; }} // Fallback avatar
        />
        
        {/* Reviewer Info */}
        <div className="flex-grow">
          <p className="font-semibold text-gray-800">{review.user}</p>
          <div className="flex items-center text-sm text-gray-500">
            <span className="mr-2 flex">{renderStars(review.rating)}</span>
            <span>{review.timeAgo}</span>
          </div>
        </div>
      </div>

      {/* Review Comment */}
      <p className="text-gray-700 mb-4 text-sm">{review.comment}</p>

      {/* Likes/Dislikes */}
      <div className="flex space-x-4 text-sm text-gray-500">
        <div className="flex items-center space-x-1 cursor-pointer hover:text-orange-500 transition-colors">
          {/* CHANGED ICON HERE */}
          <ThumbsUp size={16} /> 
          <span>{review.likes}</span>
        </div>
        <div className="flex items-center space-x-1 cursor-pointer hover:text-orange-500 transition-colors">
          {/* CHANGED ICON HERE */}
          <ThumbsDown size={16} />
          <span>{review.dislikes}</span>
        </div>
      </div>
    </div>
  );
};

export default ReviewCard;