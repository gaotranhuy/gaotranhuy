export interface Category {
  slug: string;
  name: string;
  shortName: string;
  description: string;
  longDescription: string;
  image: string;
  icon: string;
  order: number;
}

export interface Product {
  id: string;
  slug: string;
  name: string;
  categorySlug: string;
  shortDescription: string;
  description: string;
  origin: string;
  weight: string;
  price: number;
  oldPrice?: number;
  unit: string;
  image: string;
  gallery?: string[];
  features: string[];
  nutritionFacts?: { label: string; value: string }[];
  tags: string[];
  rating: number;
  reviewCount: number;
  soldCount: number;
  inStock: boolean;
  isFeatured: boolean;
  isBestSeller: boolean;
  isNew: boolean;
  createdAt: string;
  shopeeUrl?: string;
}

export interface NewsArticle {
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  category: string;
  image: string;
  author: string;
  publishedAt: string;
  readingTime: number;
  tags: string[];
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface ContactInfo {
  phone: string;
  zalo: string;
  email: string;
  address: string;
  workingHours: string;
  mapEmbed: string;
  facebook: string;
  tiktok: string;
  youtube: string;
  shopee: string;
}

export interface SiteSettings {
  name: string;
  tagline: string;
  description: string;
  logoText: string;
  freeShippingThreshold: number;
  shippingFee: number;
}
