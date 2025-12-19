// Common fields for both types
interface BasePost {
  _id: string;
  authorType: 'User' | 'Business';
  displayName: string;
  displayAvatar: string;
  author: { _id: string; username?: string; rating?: number };
  caption: string;
  media?: string[];
  tags?: string[];
  username?: string;
  createdAt: string;
}

// Specific shape for a Social Post
export interface SocialPostType extends BasePost {
  type: 'POST';
  likesCount: number;
  commentsCount: number;
  isLiked: boolean;
  isBookmarked: boolean
}

// Specific shape for a Product Post
export interface ProductPostType extends BasePost {
  type: 'PRODUCT';
  productName: string;
  price: number;
  // Add stock/size here if needed later
}

// The union type the feed expects
export type FeedItem = SocialPostType | ProductPostType;

// Props shared by both card components
export interface CardProps<T> {
    post: T;
    onRequireAuth?: () => void;
}