// src/types/post.ts

export type PostType = 'POST' | 'PRODUCT';
export type AuthorType = 'User' | 'Business';
export type PostContentType = 'POST' | 'PRODUCT';

// 1. Shared fields found in every feed item
interface BasePost {
  _id: string;
  authorType: AuthorType;
  authorId: string; // Used for profile navigation
  displayName: string;
  displayAvatar: string | null;
  isVerified: boolean;
  content: string; // The text content/caption
  media: string[];
  createdAt: string;
  updatedAt: string;
  username: string;
  // Engagement (Shared across both types)
  likesCount: number;
  commentsCount: number;
  isLiked: boolean;
  isBookmarked: boolean;
  caption: string;

}

// 2. Specific shape for a Social Post
export interface SocialPostType extends BasePost {
  type: 'POST';
  tags: string[]
  // You can add social-only fields here (e.g., sharesCount)
}

// 3. Specific shape for a Product Post
export interface ProductPostType extends BasePost {
  type: 'PRODUCT';
  name: string;
  price: number;
  stock: number;
  category: string;
  description: string; // Product specific description
  // Business/Product Rating
  rating: number | null;
  reviewCount: number | null;
}

// 4. The Final Unified Type
export type FeedItem = SocialPostType | ProductPostType;
export type UnifiedPost = SocialPostType | ProductPostType;

// Props shared by both card components
export interface CardProps<T> {
    post: T;
    onRequireAuth?: () => void;
}


// src/types/post.ts


// export interface UnifiedPost {
//   _id: string;
//   type: PostContentType;
//   content: string;
//   media: string[];
//   createdAt: string;
//   updatedAt: string;
//   authorType: AuthorType;
  
//   // Author & Routing
//   authorId: string; 
//   displayName: string;
//   displayAvatar: string | null;
//   username: string | null; // null if Business
//   isVerified: boolean;

//   // Product Data (Optional)
//   productName?: string | null;
//   price?: number | null;
//   category?: string | null;

//   // Engagement
//   likesCount: number;
//   commentsCount: number;
//   isLiked: boolean;
//   isBookmarked: boolean;

//   // Business Only
//   rating?: number | null;
//   reviewCount?: number | null;
// }