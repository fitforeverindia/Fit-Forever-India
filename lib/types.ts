export type ColorVariant = {
  colorName: string;
  colorCode?: string;
  imageUrls: string[];
  inStock?: boolean;
};

export type Product = {
  id: string;
  name: string;
  model?: string; // e.g. "AM-333", "A372-2", "Z91", "AM-444", "AM-6666"
  slug: string;
  categorySlug: string;
  categoryName: string;
  subCategorySlug?: string;
  subCategoryName?: string;
  shortDescription?: string | null;
  description?: string | null; // Supports rich Markdown formatting
  price: number;
  compareAtPrice?: number | null;
  image: string;
  gallery: string[];
  colorVariants?: ColorVariant[];
  rating: number;
  reviewCount: number;
  badge?: string | null;
  featured: boolean;
  inStock: boolean;
  sizes?: string[];
  colors?: string[];

  // Technical Specs
  ratedVoltage?: string; // e.g. "220-240V"
  ratedFrequency?: string; // e.g. "50/60Hz"
  ratedPower?: string; // e.g. "150W"
  safetyClass?: string; // e.g. "Class I"
  ratedTime?: string; // e.g. "20 mins"
  noiseLevel?: string; // e.g. "≤60dB"
  airPressure?: string; // e.g. "0.025-0.03MPa"

  // Weight & Dimensions
  netWeight?: string; // e.g. "85 KG"
  grossWeight?: string; // e.g. "98 KG"
  dimensionsSitUp?: string; // e.g. "145 x 75 x 115 cm"
  dimensionsLayDown?: string; // e.g. "180 x 75 x 85 cm"
  packageSize?: string; // e.g. "150 x 80 x 120 cm"

  // Shipping / Logistics
  containerQty?: string; // e.g. "20FT: 24 units | 40HQ: 54 units"

  // Feature Fields
  massageTechniques?: string; // e.g. "3D/4D Kneading, Shiatsu, Tapping, Knocking"
  autoProgramsCount?: string; // e.g. "12 Auto Programs"
  railType?: string; // e.g. "137cm SL-Track Guide Rail"
  aiBodyDetection?: string; // e.g. "Yes - Smart Optical Sensor Scan"
  heating?: string; // e.g. "Yes - Lumbar Graphene Thermal Therapy"
  airbagZones?: string; // e.g. "32 Airbags (Shoulder, Arm, Calf, Foot)"
  voiceControl?: string; // e.g. "Offline Smart Voice Control (16 Commands)"
  bluetoothSpeaker?: string; // e.g. "Yes - Hi-Fi Surround Sound"
  remoteType?: string; // e.g. "7-inch HD Touchscreen & Quick Dial"
  charging?: string; // e.g. "USB Fast Charging & Wireless Pad"

  // Certifications
  certifications?: string[]; // e.g. ['ISO9001:2015', 'FDA', 'CE', 'KC', 'RoHS', 'ETL']

  // Warranty
  warranty?: string; // e.g. "1-Year Manufacturer Warranty"

  // Rich HTML content (exact copy from source website)
  descriptionHtml?: string | null;
  specificationHtml?: string | null;
  warrantyHtml?: string | null;
  faqs?: { question: string; answer: string }[];
  videoUrl?: string | null;

  specifications?: { label: string; value: string }[];
};


export type HeroSlide = {
  id: string;
  eyebrow?: string | null;
  title: string;
  subtitle?: string | null;
  imageDesktop?: string | null;
  imageMobile?: string | null;
  primaryLabel?: string | null;
  primaryHref?: string | null;
  secondaryLabel?: string | null;
  secondaryHref?: string | null;
  sortOrder?: number;
  isActive?: boolean;
};

export type Category = {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  image: string;
  bannerImage?: string | null;
  bannerImageMobile?: string | null;
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

export type Customer = {
  id: string;
  name: string;
  email: string;
  phone: string;
  city: string;
  state: string;
  pincode?: string;
  address?: string;
  ordersCount: number;
  totalSpent: number;
  joinedDate: string;
  status: 'Active' | 'Inactive';
  orderUpdates?: boolean;
  promoNotifications?: boolean;
};

export type SiteUser = {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
  createdAt: string;
};

export type SavedAddress = {
  id: string;
  customerId: string;
  addressType: string;
  fullName: string;
  phoneNumber: string;
  addressLine1: string;
  addressLine2?: string | null;
  city: string;
  state: string;
  pinCode: string;
  isDefault: boolean;
  createdAt?: string;
};

export type Order = {
  id: string;
  customerId: string;
  status: 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled';
  subtotal: number;
  shipping: number;
  discount: number;
  total: number;
  shippingName: string;
  shippingPhone: string;
  shippingAddressLine1: string;
  shippingAddressLine2?: string | null;
  shippingCity: string;
  shippingState: string;
  shippingPinCode: string;
  createdAt: string;
  items?: OrderItemDetail[];
};

export type OrderItemDetail = {
  id: string;
  orderId: string;
  productId: string;
  quantity: number;
  price: number;
  productName?: string;
  productImage?: string;
};




