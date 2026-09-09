export const SITE = {
  name: 'Fit Forever India',
  tagline: 'Premier Luxury Wellness Engineering & Healthcare Innovation',
  email: 'Hasan.zaid1988@gmail.com',
  phones: ['+91 8881098786', '+91 8181098786'],
  headOfficePhone: '+91 7007418046',
  headOfficeCity: 'Udaipur',
  instagram: 'https://www.instagram.com/fitforeverindia888',
  logo: 'https://res.cloudinary.com/ufptbplr/image/upload/v1785996171/Fit_Forever_Logo_page-0001_gglf4q.jpg',
} as const;

export const NAV_LINKS = [
  { label: 'Home', href: '/' },
  { label: 'Our Products', href: '/products' },
  { label: 'Gallery', href: '/gallery' },
  { label: 'About Us', href: '/about' },
  { label: 'Outlet & Service Points', href: '/outlets' },
  { label: 'Contact Us', href: '/contact' },
] as const;

export const CATEGORIES = [
  { name: '4D Massage Chair', slug: '4d-massage-chair', description: 'Intelligent zero-gravity robotic 4D massage chairs' },
  { name: 'Massage Chairs', slug: 'massage-chairs', description: 'Full-body luxury relaxation and recovery' },
  { name: 'Foot Massager', slug: 'foot-massager', description: 'Soothe and revive your feet with reflexology' },
  { name: 'Leg Massager', slug: 'leg-massager', description: 'Targeted air-compression relief for tired legs' },
  { name: 'Healthmate', slug: 'health-mate', description: 'Personal care wellness companions' },
  { name: 'Treadmill', slug: 'treadmill', description: 'High-performance running & cardio for home' },
  { name: 'JogPad', slug: 'jogpad', description: 'Compact walking and jogging solutions' },
  { name: 'Spin Bike', slug: 'spin-bike', description: 'Studio-grade indoor cycling' },
  { name: 'Home Gym', slug: 'home-gym', description: 'All-in-one strength training' },
  { name: 'Handy Body Massager', slug: 'handy-body-massager', description: 'Acupressure percussion on the go' },
] as const;

export const CATEGORY_IMAGES: Record<string, string> = {
  '4d-massage-chair': 'https://res.cloudinary.com/ufptbplr/image/upload/v1785999891/45ip-Left-Side-View-scaled-1_qhfnzf.jpg',
  'massage-chairs': 'https://res.cloudinary.com/ufptbplr/image/upload/v1785999891/45ip-Left-Side-View-scaled-1_qhfnzf.jpg',
  'leg-massager': 'https://res.cloudinary.com/ufptbplr/image/upload/v1785999891/Leg_massager_yrusy1.jpg',
  'foot-massager': 'https://res.cloudinary.com/ufptbplr/image/upload/v1785999891/foot_kfjl1b.jpg',
  'health-mate': 'https://res.cloudinary.com/ufptbplr/image/upload/v1785999891/health_mate_mr9iku.jpg',
  'jogpad': 'https://res.cloudinary.com/ufptbplr/image/upload/v1785999890/Jogpad_c64iun.jpg',
  'treadmill': 'https://images.pexels.com/photos/12250460/pexels-photo-12250460.jpeg?auto=compress&cs=tinysrgb&w=800',
  'spin-bike': 'https://res.cloudinary.com/ufptbplr/image/upload/v1785999892/Spinebike_qxv4mi.jpg',
  'home-gym': 'https://res.cloudinary.com/ufptbplr/image/upload/v1785999892/homegym_trzurw.jpg',
  'handy-body-massager': 'https://res.cloudinary.com/ufptbplr/image/upload/v1785999891/Handybody_wofkwy.jpg',
};
