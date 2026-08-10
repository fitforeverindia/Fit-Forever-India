import { CATEGORIES, CATEGORY_IMAGES } from './site';
import type { Product, Category, Testimonial, Faq, GalleryItem, Outlet, Customer } from './types';

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
    id: 'p1',
    name: 'Aura Pro 4D Luxury Massage Chair',
    model: 'AM-6666',
    slug: 'aura-pro-massage-chair',
    categorySlug: 'massage-chairs',
    categoryName: 'Massage Chairs',
    shortDescription: 'Zero-gravity full-body 4D recliner with 12 auto programs, heated lumbar therapy, and voice control.',
    description: `Elevate your home wellness with the **Fit Forever Aura Pro 4D Luxury Massage Chair (Model AM-6666)**, engineered to deliver a spa-grade zero-gravity therapy experience.

### Product Highlights

* **4D Intelligent Massage Engine:** Bi-directional rollers with 3D/4D depth adjustments to target deep muscular knots along the spine.
* **SL-Track Dual Guide Rail:** 137cm ergonomically curved track covering neck, shoulders, lumbar, glutes, and upper thighs.
* **Zero-Gravity Positioning:** 3-stage zero gravity angles reduce spinal compression and maximize circulation.
* **Full-Body Air Compression:** 32 targeted airbags with 5 adjustable intensity levels for shoulders, arms, calves, and feet.
* **Graphene Thermal Therapy:** Soothing 45°C constant lumbar heating to improve blood flow and melt daily fatigue.

### Technical Specifications Table

| Feature Spec | Details / Rating |
| --- | --- |
| **Model Number** | AM-6666 |
| **Rated Voltage** | 220V - 240V |
| **Rated Frequency** | 50Hz / 60Hz |
| **Rated Power** | 150W |
| **Safety Design** | Class I Electrical Isolation |
| **Noise Level** | ≤ 55 dB (Quiet Operation) |
| **Air Pressure Rating** | 0.025 - 0.03 MPa |
| **Guide Rail Length** | 137 cm SL-Track |
| **Max User Weight** | 150 KG |

### Package & Dimensions

* **Net Weight:** 88 KG | **Gross Weight:** 102 KG
* **Sit-Up Dimensions (L x W x H):** 148 x 78 x 118 cm
* **Lay-Down Reclined (L x W x H):** 182 x 78 x 86 cm
* **Container Loading QTY:** 20FT: 24 Units | 40HQ: 54 Units`,
    price: 189000,
    compareAtPrice: 229000,
    image: PH.chair1,
    gallery: [PH.chair1, PH.chair2, PH.chair3],
    colorVariants: [
      {
        colorName: 'Royal Black / Brown',
        colorCode: '#2C1D11',
        imageUrls: [PH.chair1, PH.chair2],
        inStock: true,
      },
      {
        colorName: 'Champagne Gold / Cream',
        colorCode: '#D4AF37',
        imageUrls: [PH.chair2, PH.chair3],
        inStock: true,
      },
      {
        colorName: 'Space Grey / Sapphire Blue',
        colorCode: '#3A4B5C',
        imageUrls: [PH.chair3, PH.chair1],
        inStock: true,
      },
    ],
    rating: 4.9,
    reviewCount: 214,
    badge: 'Best Seller',
    featured: true,
    inStock: true,
    colors: ['Royal Black / Brown', 'Champagne Gold / Cream', 'Space Grey / Sapphire Blue'],
    ratedVoltage: '220V - 240V',
    ratedFrequency: '50/60Hz',
    ratedPower: '150W',
    safetyClass: 'Class I',
    ratedTime: '20 mins',
    noiseLevel: '≤ 55 dB',
    airPressure: '0.025 - 0.03 MPa',
    netWeight: '88 KG',
    grossWeight: '102 KG',
    dimensionsSitUp: '148 x 78 x 118 cm',
    dimensionsLayDown: '182 x 78 x 86 cm',
    packageSize: '155 x 82 x 122 cm',
    containerQty: '20FT: 24 units | 40HQ: 54 units',
    massageTechniques: '4D Knead, Tap, Shiatsu, Knock, Synchronous Stretch',
    autoProgramsCount: '12 Auto Specialized Programs',
    railType: '137 cm Ergonomic SL-Track',
    aiBodyDetection: 'Yes - Automatic Optical Body Scan',
    heating: 'Yes - Lumbar Graphene Heat Therapy',
    airbagZones: '32 Airbags (Shoulder, Arm, Calf, Foot)',
    voiceControl: 'Yes - Offline Smart Voice Control (16 Commands)',
    bluetoothSpeaker: 'Yes - Hi-Fi 3D Surround Sound Bluetooth',
    remoteType: '7-inch HD Color Touchscreen & Quick Control Dial',
    charging: 'USB Fast Charging & Wireless Charging Dock',
    certifications: ['ISO9001:2015', 'FDA', 'CE', 'KC', 'RoHS', 'ETL'],
    specifications: [
      { label: 'Model', value: 'AM-6666' },
      { label: 'Programs', value: '12 Auto Types' },
      { label: 'Recline', value: '3-Stage Zero-Gravity 4D' },
      { label: 'Guide Rail', value: '137cm SL-Track' },
      { label: 'Warranty', value: '3 Years On-Site Comprehensive Warranty' },
    ],
  },
  {
    id: 'p2',
    name: 'Tranquil Leg & Calf Massager',
    model: 'AM-333',
    slug: 'tranquil-leg-massager',
    categorySlug: 'leg-massager',
    categoryName: 'Leg Massager',
    shortDescription: 'Air-compression kneader therapy for calves, ankles and feet with thermal warming.',
    description: `Relieve daily leg fatigue and revive circulation with the **Fit Forever Tranquil Leg & Calf Massager (Model AM-333)**.

### Key Highlights

* **3D Surround Airbag Compression:** Dual-action air pressure wraps knees, calves, and feet simultaneously.
* **Acupressure Foot Rollers:** Triple-row motorized rollers stimulate plantar fascia reflex points.
* **Infrared Knee Heating:** 3-level gentle heat therapy promotes vascular circulation and joint mobility.

| Specifications | Values |
| --- | --- |
| **Model** | AM-333 |
| **Rated Power** | 60W |
| **Voltage** | 220V - 240V |
| **Net Weight** | 14.5 KG |
| **Noise Level** | ≤ 48 dB |`,
    price: 14999,
    compareAtPrice: 19999,
    image: PH.chair2,
    gallery: [PH.chair2, PH.chair1],
    colorVariants: [
      {
        colorName: 'Space Grey',
        colorCode: '#4B5563',
        imageUrls: [PH.chair2],
        inStock: true,
      },
      {
        colorName: 'Maroon Velvet',
        colorCode: '#7F1D1D',
        imageUrls: [PH.chair1],
        inStock: true,
      },
    ],
    rating: 4.7,
    reviewCount: 96,
    badge: 'Sale',
    featured: true,
    inStock: true,
    colors: ['Space Grey', 'Maroon Velvet'],
    ratedVoltage: '220V - 240V',
    ratedFrequency: '50/60Hz',
    ratedPower: '60W',
    safetyClass: 'Class I',
    ratedTime: '15 mins',
    noiseLevel: '≤ 48 dB',
    netWeight: '14.5 KG',
    grossWeight: '16.8 KG',
    dimensionsSitUp: '52 x 48 x 54 cm',
    packageSize: '58 x 52 x 58 cm',
    containerQty: '20FT: 180 units | 40HQ: 420 units',
    massageTechniques: 'Knead, Air Compression, Plantar Rollers',
    autoProgramsCount: '3 Intensity Modes',
    heating: 'Yes - Dual Knee & Calf Heat',
    airbagZones: '24 Airbags (Knee, Calf, Ankle)',
    certifications: ['ISO9001:2015', 'CE', 'RoHS'],
    specifications: [
      { label: 'Model', value: 'AM-333' },
      { label: 'Modes', value: '3 Intensity Levels' },
      { label: 'Coverage', value: 'Calf + Ankle + Foot' },
    ],
  },
  {
    id: 'p3',
    name: 'SoleSoothe Shiatsu Foot Massager',
    model: 'Z91',
    slug: 'solesoothe-foot-massager',
    categorySlug: 'foot-massager',
    categoryName: 'Foot Massager',
    shortDescription: 'Shiatsu foot spa with deep-kneading nodes and soothing infrared warmth therapy.',
    description: `Relax tired feet after long days with the **Fit Forever SoleSoothe Foot Massager (Model Z91)**.

### Features
* Deep Shiatsu Node Kneading
* Infrared Warmth Therapy
* Washable Breathable Sleeves`,
    price: 8999,
    compareAtPrice: 11999,
    image: PH.chair3,
    gallery: [PH.chair3, PH.chair2],
    colorVariants: [
      {
        colorName: 'Obsidian Black',
        colorCode: '#111827',
        imageUrls: [PH.chair3],
        inStock: true,
      },
      {
        colorName: 'Pearl White',
        colorCode: '#F9FAFB',
        imageUrls: [PH.chair2],
        inStock: true,
      },
    ],
    rating: 4.6,
    reviewCount: 58,
    badge: 'New',
    featured: true,
    inStock: true,
    colors: ['Obsidian Black', 'Pearl White'],
    ratedVoltage: '220V',
    ratedPower: '45W',
    netWeight: '6.5 KG',
    grossWeight: '7.8 KG',
    certifications: ['CE', 'RoHS'],
    specifications: [
      { label: 'Model', value: 'Z91' },
      { label: 'Technique', value: 'Deep Shiatsu' },
      { label: 'Heat', value: 'Infrared Warmth' },
    ],
  },
  {
    id: 'p4',
    name: 'Health Mate Wellness Companion',
    model: 'AM-444',
    slug: 'health-mate-companion',
    categorySlug: 'health-mate',
    categoryName: 'Health Mate',
    shortDescription: 'Daily wellness tracker and vibration relaxation therapy hub.',
    description: `Compact wellness companion pairing gentle vibration therapy with biometric posture alignment.`,
    price: 6999,
    compareAtPrice: 9999,
    image: PH.chair3,
    gallery: [PH.chair3],
    rating: 4.5,
    reviewCount: 41,
    featured: true,
    inStock: true,
    colors: ['Pure White', 'Emerald Blue'],
    ratedVoltage: '220V',
    ratedPower: '35W',
    netWeight: '4.2 KG',
    certifications: ['ISO9001:2015', 'CE'],
  },
  {
    id: 'p5',
    name: 'AcuTouch Handy Percussion Body Massager',
    model: 'A372-2',
    slug: 'acutouch-handy-massager',
    categorySlug: 'handy-body-massager',
    categoryName: 'Handy Body Massager',
    shortDescription: 'Portable acupressure percussion massager with 5 interchangeable nodes.',
    description: `Lightweight deep-tissue percussion gun targeting stubborn muscle soreness.`,
    price: 3499,
    compareAtPrice: 4999,
    image: PH.handy1,
    gallery: [PH.handy1],
    rating: 4.5,
    reviewCount: 52,
    badge: 'Hot',
    featured: true,
    inStock: true,
    colors: ['Graphite Black', 'Rose Gold'],
    ratedVoltage: '12V Cordless Li-Ion',
    ratedPower: '24W',
    netWeight: '1.2 KG',
    certifications: ['CE', 'RoHS'],
  },
  {
    id: 'p6',
    name: 'JogPad Slim 3 Walking Pad',
    model: 'JP-300',
    slug: 'jogpad-slim-3',
    categorySlug: 'jogpad',
    categoryName: 'JogPad',
    shortDescription: 'Flat-fold walking pad designed for standing desks with remote speed control.',
    description: `Whisper-quiet walking pad that slides under any desk for daily movement while working.`,
    price: 24999,
    compareAtPrice: 29999,
    image: PH.jogpad1,
    gallery: [PH.jogpad1, PH.treadmill1],
    rating: 4.6,
    reviewCount: 73,
    badge: 'New',
    featured: true,
    inStock: true,
    ratedVoltage: '220V',
    ratedPower: '550W',
    netWeight: '22 KG',
    dimensionsSitUp: '120 x 54 x 14 cm',
    certifications: ['ISO9001:2015', 'CE', 'RoHS'],
    specifications: [
      { label: 'Model', value: 'JP-300' },
      { label: 'Max Speed', value: '8 km/h' },
      { label: 'Deck', value: 'Foldable Ultra-Slim' },
    ],
  },
  {
    id: 'p7',
    name: 'Velocity X 3.5HP Treadmill',
    model: 'VX-5000',
    slug: 'velocity-x-treadmill',
    categorySlug: 'treadmill',
    categoryName: 'Treadmill',
    shortDescription: '3.5HP heavy motor folding treadmill with 12% auto incline and shock-cushioned deck.',
    description: `Powerful commercial-grade motor treadmill with auto-incline, multi-layer cushioning deck, and interactive workout apps.`,
    price: 54999,
    compareAtPrice: 69999,
    image: PH.treadmill1,
    gallery: [PH.treadmill1, PH.treadmill2],
    rating: 4.8,
    reviewCount: 132,
    badge: 'Best Seller',
    featured: true,
    inStock: true,
    ratedVoltage: '220V - 240V',
    ratedPower: '3.5 HP Peak',
    netWeight: '75 KG',
    grossWeight: '88 KG',
    dimensionsSitUp: '175 x 82 x 135 cm',
    packageSize: '185 x 88 x 38 cm',
    certifications: ['ISO9001:2015', 'CE', 'RoHS', 'ETL'],
    specifications: [
      { label: 'Model', value: 'VX-5000' },
      { label: 'Motor', value: '3.5 HP Peak' },
      { label: 'Incline', value: 'Auto 0-12%' },
      { label: 'Warranty', value: '3 Years Frame & Motor Warranty' },
    ],
  },
  {
    id: 'p8',
    name: 'Spin Studio Pro Indoor Cycling Bike',
    model: 'SP-800',
    slug: 'spin-studio-pro-bike',
    categorySlug: 'spin-bike',
    categoryName: 'Spin Bike',
    shortDescription: 'Silent belt-drive indoor cycling bike with magnetic resistance and heavy flywheel.',
    description: `Studio-grade 18kg flywheel spin bike with micro-adjustable magnetic resistance for high-octane cardio workouts.`,
    price: 32999,
    compareAtPrice: 39999,
    image: PH.bike1,
    gallery: [PH.bike1, PH.bike2],
    rating: 4.7,
    reviewCount: 88,
    badge: 'Sale',
    featured: true,
    inStock: true,
    netWeight: '42 KG',
    grossWeight: '48 KG',
    certifications: ['CE', 'ISO9001:2015'],
    specifications: [
      { label: 'Model', value: 'SP-800' },
      { label: 'Drive', value: 'Smooth Silent Belt Drive' },
      { label: 'Resistance', value: 'Magnetic Multi-Level' },
    ],
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

export const SEED_CUSTOMERS: Customer[] = [
  {
    id: 'cust-101',
    name: 'Rajesh Sharma',
    email: 'rajesh.sharma@gmail.com',
    phone: '+91 98260 12345',
    city: 'Indore',
    state: 'Madhya Pradesh',
    pincode: '452001',
    address: '14/B Vijay Nagar, Indore',
    ordersCount: 3,
    totalSpent: 349997,
    joinedDate: '2025-11-12',
    status: 'Active',
  },
  {
    id: 'cust-102',
    name: 'Priya Verma',
    email: 'priya.verma@yahoo.com',
    phone: '+91 94140 87654',
    city: 'Ajmer',
    state: 'Rajasthan',
    pincode: '305001',
    address: '42 Vaishali Nagar, Ajmer',
    ordersCount: 2,
    totalSpent: 124998,
    joinedDate: '2026-01-08',
    status: 'Active',
  },
  {
    id: 'cust-103',
    name: 'Anil Gupta',
    email: 'anil.gupta@outlook.com',
    phone: '+91 98890 54321',
    city: 'Kanpur',
    state: 'Uttar Pradesh',
    pincode: '208001',
    address: '88 Mall Road, Kanpur',
    ordersCount: 1,
    totalSpent: 149999,
    joinedDate: '2026-02-14',
    status: 'Active',
  },
  {
    id: 'cust-104',
    name: 'Sneha Kulkarni',
    email: 'sneha.kulkarni@gmail.com',
    phone: '+91 97230 67890',
    city: 'Dehradun',
    state: 'Uttarakhand',
    pincode: '248001',
    address: '105 Rajpur Road, Dehradun',
    ordersCount: 4,
    totalSpent: 489996,
    joinedDate: '2025-08-20',
    status: 'Active',
  },
  {
    id: 'cust-105',
    name: 'Vikramaditya Singh',
    email: 'vikram.singh@gmail.com',
    phone: '+91 99290 11223',
    city: 'Udaipur',
    state: 'Rajasthan',
    pincode: '313001',
    address: '23 Fatehpura, Udaipur',
    ordersCount: 1,
    totalSpent: 49999,
    joinedDate: '2025-12-05',
    status: 'Inactive',
  },
];

