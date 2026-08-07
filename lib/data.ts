import { CATEGORIES, CATEGORY_IMAGES } from './site';
import type { Product, Category, Testimonial, Faq, GalleryItem, Outlet } from './types';

const PH = {
  chair1: 'https://images.pexels.com/photos/4198567/pexels-photo-4198567.jpeg?auto=compress&cs=tinysrgb&w=900',
  chair2: 'https://images.pexels.com/photos/3997991/pexels-photo-3997991.jpeg?auto=compress&cs=tinysrgb&w=900',
  chair3: 'https://images.pexels.com/photos/3757942/pexels-photo-3757942.jpeg?auto=compress&cs=tinysrgb&w=900',
  treadmill1: 'https://images.pexels.com/photos/12250460/pexels-photo-12250460.jpeg?auto=compress&cs=tinysrgb&w=900',
  treadmill2: 'https://images.pexels.com/photos/35215421/pexels-photo-35215421.jpeg?auto=compress&cs=tinysrgb&w=900',
  bike1: 'https://images.pexels.com/photos/28080/pexels-photo.jpg?auto=compress&cs=tinysrgb&w=900',
  bike2: 'https://images.pexels.com/photos/1954524/pexels-photo-1954524.jpeg?auto=compress&cs=tinysrgb&w=900',
  gym1: 'https://images.pexels.com/photos/7174396/pexels-photo-7174396.jpeg?auto=compress&cs=tinysrgb&w=900',
  gym2: 'https://images.pexels.com/photos/7031705/pexels-photo-7031705.jpeg?auto=compress&cs=tinysrgb&w=900',
  massage1: 'https://images.pexels.com/photos/3997991/pexels-photo-39997991.jpeg?auto=compress&cs=tinysrgb&w=900',
  jogpad1: 'https://images.pexels.com/photos/4761779/pexels-photo-4761779.jpeg?auto=compress&cs=tinysrgb&w=900',
  handy1: 'https://images.pexels.com/photos/4327048/pexels-photo-4327048.jpeg?auto=compress&cs=tinysrgb&w=900',
};

export const SEED_CATEGORIES: Category[] = CATEGORIES.map((c) => ({
  id: c.slug,
  name: c.name,
  slug: c.slug,
  description: c.description,
  image: CATEGORY_IMAGES[c.slug] ?? PH.chair1,
}));

export const SEED_PRODUCTS: Product[] = [
  {
    id: 'p1', name: 'Aura Pro 4D Luxury Massage Chair', slug: 'aura-pro-massage-chair',
    categorySlug: 'massage-chairs', categoryName: 'Massage Chairs',
    shortDescription: 'Zero-gravity full-body recliner with 12 auto programs and heating care.',
    description: 'The Aura Pro delivers a spa-grade zero-gravity massage experience at home with 12 automatic programs, 4D rollers, voice control, and heated lumbar care.',
    price: 189000, compareAtPrice: 229000, image: PH.chair1,
    gallery: [PH.chair1, PH.chair2, PH.chair3],
    rating: 4.9, reviewCount: 214, badge: 'Best Seller', featured: true, inStock: true,
    colors: ['Matte Black', 'Champagne Gold', 'Royal Rose'],
    specifications: [{ label: 'Programs', value: '12 Auto' }, { label: 'Recline', value: 'Zero-Gravity 4D' }, { label: 'Warranty', value: '2 Years On-Site Warranty' }],
  },
  {
    id: 'p2', name: 'Tranquil Leg & Calf Massager', slug: 'tranquil-leg-massager',
    categorySlug: 'leg-massager', categoryName: 'Leg Massager',
    shortDescription: 'Air-compression therapy for calves, ankles and feet.',
    description: 'Adjustable air-compression sleeves massage calves, ankles, and feet to improve blood circulation and relieve daily fatigue.',
    price: 14999, compareAtPrice: 19999, image: PH.chair2,
    gallery: [PH.chair2, PH.chair1],
    rating: 4.7, reviewCount: 96, badge: 'Sale', featured: true, inStock: true,
    colors: ['Space Grey', 'Maroon Velvet'],
    specifications: [{ label: 'Modes', value: '3 Intensity Levels' }, { label: 'Coverage', value: 'Calf + Ankle + Foot' }],
  },
  {
    id: 'p3', name: 'SoleSoothe Shiatsu Foot Massager', slug: 'solesoothe-foot-massager',
    categorySlug: 'foot-massager', categoryName: 'Foot Massager',
    shortDescription: 'Shiatsu foot spa with infrared warmth therapy.',
    description: 'Deep-kneading Shiatsu nodes and soothing infrared heat revive tired feet in minutes.',
    price: 8999, compareAtPrice: 11999, image: PH.chair3,
    gallery: [PH.chair3, PH.chair2],
    rating: 4.6, reviewCount: 58, badge: 'New', featured: true, inStock: true,
    colors: ['Obsidian Black', 'Pearl White'],
    specifications: [{ label: 'Technique', value: 'Deep Shiatsu' }, { label: 'Heat', value: 'Infrared Warmth' }],
  },
  {
    id: 'p4', name: 'Health Mate Wellness Companion', slug: 'health-mate-companion',
    categorySlug: 'health-mate', categoryName: 'Health Mate',
    shortDescription: 'Daily wellness tracker and relaxation hub.',
    description: 'A compact wellness companion that pairs guided breathing with gentle vibration therapy.',
    price: 6999, compareAtPrice: 9999, image: PH.chair3,
    gallery: [PH.chair3],
    rating: 4.5, reviewCount: 41, featured: true, inStock: true,
    colors: ['Pure White', 'Emerald Blue'],
  },
  {
    id: 'p5', name: 'AcuTouch Handy Percussion Body Massager', slug: 'acutouch-handy-massager',
    categorySlug: 'handy-body-massager', categoryName: 'Handy Body Massager',
    shortDescription: 'Portable acupressure percussion massager with interchangeable nodes.',
    description: 'A lightweight percussion body massager with 5 interchangeable acupressure heads for muscle relief on the go.',
    price: 3499, compareAtPrice: 4999, image: PH.handy1,
    gallery: [PH.handy1],
    rating: 4.5, reviewCount: 52, badge: 'Hot', featured: true, inStock: true,
    colors: ['Graphite Black', 'Rose Gold'],
  },
  {
    id: 'p6', name: 'JogPad Slim 3 Walking Pad', slug: 'jogpad-slim-3',
    categorySlug: 'jogpad', categoryName: 'JogPad',
    shortDescription: 'Flat-fold walking pad for standing desks.',
    description: 'Whisper-quiet walking pad that slides under any standing desk for daily movement.',
    price: 24999, compareAtPrice: 29999, image: PH.jogpad1,
    gallery: [PH.jogpad1, PH.treadmill1],
    rating: 4.6, reviewCount: 73, badge: 'New', featured: true, inStock: true,
    specifications: [{ label: 'Max Speed', value: '8 km/h' }, { label: 'Deck', value: 'Foldable Slim' }],
  },
  {
    id: 'p7', name: 'Velocity X 3.5HP Treadmill', slug: 'velocity-x-treadmill',
    categorySlug: 'treadmill', categoryName: 'Treadmill',
    shortDescription: '3.5HP folding treadmill with auto incline.',
    description: 'A powerful home treadmill with auto incline, cushioned deck and a vivid training console.',
    price: 54999, compareAtPrice: 69999, image: PH.treadmill1,
    gallery: [PH.treadmill1, PH.treadmill2],
    rating: 4.8, reviewCount: 132, badge: 'Best Seller', featured: true, inStock: true,
    specifications: [{ label: 'Motor', value: '3.5 HP' }, { label: 'Incline', value: 'Auto 0-12%' }, { label: 'Warranty', value: '3 Years' }],
  },
  {
    id: 'p8', name: 'Spin Studio Pro Indoor Cycling Bike', slug: 'spin-studio-pro-bike',
    categorySlug: 'spin-bike', categoryName: 'Spin Bike',
    shortDescription: 'Silent belt-drive indoor cycling bike with magnetic resistance.',
    description: 'Studio-grade flywheel and belt drive for a smooth, silent ride at home with real-time performance tracking.',
    price: 32999, compareAtPrice: 39999, image: PH.bike1,
    gallery: [PH.bike1, PH.bike2],
    rating: 4.7, reviewCount: 88, badge: 'Sale', featured: true, inStock: true,
    specifications: [{ label: 'Drive', value: 'Belt Drive' }, { label: 'Resistance', value: 'Magnetic Multi-Level' }],
  },
  {
    id: 'p8-2', name: 'Sprint Master Commercial Spin Bike', slug: 'sprint-master-commercial-spin-bike',
    categorySlug: 'spin-bike', categoryName: 'Spin Bike',
    shortDescription: 'Heavy-duty 18kg heavy flywheel spin bike for high-intensity training.',
    description: 'Commercial grade steel frame indoor cycle with adjustable ergonomic seat and dual SPD pedal system.',
    price: 44999, compareAtPrice: 52999, image: PH.bike2,
    gallery: [PH.bike2, PH.bike1],
    rating: 4.8, reviewCount: 42, badge: 'Pro', featured: true, inStock: true,
    specifications: [{ label: 'Flywheel', value: '18 kg' }, { label: 'Frame', value: 'Heavy Duty Steel' }],
  },
  {
    id: 'p9', name: 'Fortress Home Gym 800 Strength System', slug: 'fortress-home-gym-800',
    categorySlug: 'home-gym', categoryName: 'Home Gym',
    shortDescription: '80kg multi-station full-body strength training system.',
    description: 'A complete multi-station home gym with an 80kg weight stack for chest, arms, legs, and back workouts.',
    price: 41999, compareAtPrice: 49999, image: PH.gym1,
    gallery: [PH.gym1, PH.gym2],
    rating: 4.6, reviewCount: 64, badge: 'Heavy Duty', featured: true, inStock: true,
    specifications: [{ label: 'Weight Stack', value: '80 kg' }, { label: 'Stations', value: '6 Functional Stations' }],
  },
];

export const TESTIMONIALS: Testimonial[] = [
  { id: 't1', name: 'Aarav Mehta', city: 'Mumbai', role: 'Business Owner', title: 'Spa-Grade Relaxation At Home', tag: 'Massage Chair', rating: 5, image: 'https://images.pexels.com/photos/220452/pexels-photo-220452.jpeg?auto=compress&cs=tinysrgb&w=400', quote: 'The Aura Pro massage chair is a daily retreat. Build quality feels truly premium and delivery was seamless.' },
  { id: 't2', name: 'Priya Sharma', city: 'Pune', role: 'Product Manager', title: 'Quiet & Sturdy Performance', tag: 'Treadmill', rating: 5, image: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=400', quote: 'My Velocity X treadmill has transformed mornings at home. Quiet, sturdy and the console is brilliant.' },
  { id: 't3', name: 'Rohan Iyer', city: 'Bengaluru', role: 'Software Engineer', title: 'Prompt On-Site Installation', tag: 'Verified Buyer', rating: 5, image: 'https://images.pexels.com/photos/697509/pexels-photo-697509.jpeg?auto=compress&cs=tinysrgb&w=400', quote: 'Service support in Bengaluru was prompt and professional. Fit Forever genuinely cares after the sale.' },
  { id: 't4', name: 'Neha Kapoor', city: 'Jaipur', role: 'Fitness Enthusiast', title: 'Studio-Grade Cycling Experience', tag: 'Spin Bike', rating: 5, image: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=400', quote: 'The Spin Studio Pro bike feels like a studio class at home. Smooth, silent and beautifully designed.' },
];

export const FAQS: Faq[] = [
  { id: 'f1', question: 'Do you offer installation and demo?', answer: 'Yes. Every large equipment order includes free installation and a guided demo by our trained technicians in serviced cities.' },
  { id: 'f2', question: 'What warranty do Fit Forever products carry?', answer: 'Warranty ranges from 1 to 3 years depending on the product, covering manufacturing defects. Extended coverage is available at checkout.' },
  { id: 'f3', question: 'How is servicing handled after purchase?', answer: 'We operate service centers across major malls and cities. You can book a service visit through any outlet or our contact line.' },
  { id: 'f4', question: 'Are financing or EMI options available?', answer: 'Yes, easy EMI options are available on most equipment through major banks and payment partners at checkout.' },
  { id: 'f5', question: 'Can I try equipment before buying?', answer: 'Absolutely. Visit any of our outlet and service points to experience products before you purchase.' },
];

export const GALLERY_ITEMS: GalleryItem[] = [
  { id: 'g1', title: 'Showroom Experience', category: 'Showroom', image: 'https://images.pexels.com/photos/35215412/pexels-photo-35215412.jpeg?auto=compress&cs=tinysrgb&w=800', width: 800, height: 533 },
  { id: 'g2', title: 'Recovery Zone', category: 'Wellness', image: 'https://images.pexels.com/photos/7011212/pexels-photo-7011212.jpeg?auto=compress&cs=tinysrgb&w=800', width: 800, height: 1200 },
  { id: 'g3', title: 'Treadmill Studio', category: 'Equipment', image: 'https://images.pexels.com/photos/35215421/pexels-photo-35215421.jpeg?auto=compress&cs=tinysrgb&w=800', width: 800, height: 533 },
  { id: 'g4', title: 'Home Gym Setup', category: 'Equipment', image: 'https://images.pexels.com/photos/7174396/pexels-photo-7174396.jpeg?auto=compress&cs=tinysrgb&w=800', width: 800, height: 533 },
  { id: 'g5', title: 'Cycling Studio', category: 'Equipment', image: 'https://images.pexels.com/photos/28080/pexels-photo.jpg?auto=compress&cs=tinysrgb&w=800', width: 800, height: 1200 },
  { id: 'g6', title: 'Wellness Care', category: 'Wellness', image: 'https://images.pexels.com/photos/6724510/pexels-photo-6724510.jpeg?auto=compress&cs=tinysrgb&w=800', width: 800, height: 533 },
  { id: 'g7', title: 'Strength Training', category: 'Equipment', image: 'https://images.pexels.com/photos/7031705/pexels-photo-7031705.jpeg?auto=compress&cs=tinysrgb&w=800', width: 800, height: 533 },
  { id: 'g8', title: 'Spa At Home', category: 'Wellness', image: 'https://images.pexels.com/photos/3997991/pexels-photo-3997991.jpeg?auto=compress&cs=tinysrgb&w=800', width: 800, height: 1200 },
  { id: 'g9', title: 'Retail Presence', category: 'Showroom', image: 'https://images.pexels.com/photos/1954524/pexels-photo-1954524.jpeg?auto=compress&cs=tinysrgb&w=800', width: 800, height: 533 },
];

export const OUTLETS: Outlet[] = [
  { id: 'o1', name: 'Treasure Island Mall Indore', mall: 'Treasure Island Mall', city: 'Indore', address: 'Treasure Island Mall, MG Road, Indore, Madhya Pradesh', phone: '+91 8881098786' },
  { id: 'o2', name: 'Mittal Mall Ajmer', mall: 'Mittal Mall', city: 'Ajmer', address: 'Mittal Mall, Vaishali Nagar, Ajmer, Rajasthan', phone: '+91 8181098786' },
  { id: 'o3', name: 'Pacific Mall Dehradun', mall: 'Pacific Mall', city: 'Dehradun', address: 'Pacific Mall, Rajpur Road, Dehradun, Uttarakhand', phone: '+91 7007418046' },
  { id: 'o4', name: 'Z Square Mall Kanpur', mall: 'Z Square Mall', city: 'Kanpur', address: 'Z Square Mall, Mall Road, Kanpur, Uttar Pradesh', phone: '+91 8881098786' },
  { id: 'o5', name: 'Urban Square Mall Udaipur', mall: 'Urban Square Mall', city: 'Udaipur', address: 'Urban Square Mall, University Road, Udaipur, Rajasthan', phone: '+91 7007418046' },
];

export const STATS = [
  { label: 'Years Experience', value: 12, suffix: '+' },
  { label: 'Happy Customers', value: 25000, suffix: '+' },
  { label: 'Products Sold', value: 60000, suffix: '+' },
  { label: 'Service Centers', value: 15, suffix: '+' },
];

export const WHY_CHOOSE = [
  { icon: 'Factory', title: 'Manufacturer', description: 'Direct-from-factory quality without middlemen markups.' },
  { icon: 'BadgeCheck', title: 'Premium Quality', description: 'Every product engineered for durability and comfort.' },
  { icon: 'ShieldCheck', title: 'Warranty', description: 'Up to 3 years of coverage with extended options.' },
  { icon: 'Headset', title: 'Service Support', description: 'Nationwide service network and on-site assistance.' },
  { icon: 'Wallet', title: 'Affordable Pricing', description: 'Flexible EMI and transparent, honest pricing.' },
  { icon: 'Users', title: 'Trusted by Thousands', description: 'Loved by 25,000+ customers across India.' },
];
