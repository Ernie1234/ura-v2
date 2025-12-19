export type PostType = 'POST' | 'PRODUCT';

export interface PostData {
  // --- CORE FIELDS ---
  type: PostType;
  caption: string;
  tags?: string[];
  
  // --- MEDIA ---
  // We use File[] for the initial upload and string[] for the preview/backend URLs
  mediaFiles?: File[]; 
  mediaUrls?: string[];

  // --- PRODUCT LINKING (Requirement 6) ---
  // If the user is promoting an existing product from their inventory
  productId?: string; 

  // --- NEW PRODUCT CREATION (UploadProductForm) ---
  // These fields match the Joi validator and Product model exactly
  productDetails?: {
    productName: string;
    category: string;
    description: string;
    price: number;
    stock: number;
    size?: string;
  };

  // --- LOGIC FLAGS ---
  publishToFeed?: boolean; // Used when creating a product to determine if a Post should also be made
}

// Helper for the Feed Response to ensure frontend components know what to render
export interface UnifiedPost extends PostData {
  _id: string;
  author: {
    _id: string;
    displayName: string;
    displayAvatar: string;
    isVerified: boolean;
    businessName?: string;
    username?: string;
  };
  likesCount: number;
  isLiked: boolean;
  isBookmarked: boolean;
  createdAt: string;
  
  // Flattened product fields (from our controller's response)
  productName?: string;
  price?: number;
  stock?: number;
}
