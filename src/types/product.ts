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