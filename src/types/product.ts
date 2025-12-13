// src/types/product.ts
export interface Product {
  id: number;
  name: string;
  category: string; // <-- New field
  imageUrl: string;
  description: string;
  price: number;
  stock: number;
}

// src/types/product.ts (Adding a new interface)
// src/types/product.ts (Adding and updating interfaces)

export interface Seller {
  name: string;
  profileImageUrl: string;
  followers: string;
  rating: number;
}

export interface SingleProduct {
  id: number;
  name: string;
  imageUrl: string;
  description: string;
  price: number;
  availableStocks: number;
  size: string;
  currencySymbol: string;
  seller: Seller;
}

// src/types/product.ts (Adding Category type)
export interface ProductCategory {
  id: string;
  name: string;
}


// --- New Definition for Product Card Display ---
export interface ProductCardProps {
  id: string;
  name: string;
  image: string;          // URL or path to the main product image
  merchant: string;       // Name of the merchant/shop that posted the product
  photoCount: number;     // Total number of media/photos associated with the product
  likes: number;          // Total number of likes/saves
  price?: string;         // Optional: Price string (if displayed on the card)
}