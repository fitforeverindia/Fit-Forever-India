export type Product = {
  id: string;
  name: string;
  slug: string;
  categorySlug: string;
  categoryName: string;
  subCategorySlug?: string;
  subCategoryName?: string;
  shortDescription?: string | null;
  description?: string | null;
  price: number;
  compareAtPrice?: number | null;
  image: string;
  gallery: string[];
  rating: number;
  reviewCount: number;
  badge?: string | null;
  featured: boolean;
  inStock: boolean;
  sizes?: string[];
  colors?: string[];
  specifications?: { label: string; value: string }[];
};

export type Category = {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  image: string;
  productCount?: number;
};

export type CartItem = {
  product: Product;
  quantity: number;
};

export type Testimonial = {
  id: string;
  name: string;
  city: string;
  rating: number;
  quote: string;
  image: string;
  title?: string;
  tag?: string;
  role?: string;
};

export type Faq = {
  id: string;
  question: string;
  answer: string;
};

export type GalleryItem = {
  id: string;
  title: string;
  category: string;
  image: string;
  width: number;
  height: number;
};

export type Outlet = {
  id: string;
  name: string;
  mall: string;
  city: string;
  address: string;
  phone: string;
};
