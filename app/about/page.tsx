import type { Metadata } from 'next';
import AboutClientContent from '@/components/about/about-client-content';

export const metadata: Metadata = {
  title: 'About Us | Fit Forever India — 4D Massage Chairs & Luxury Wellness Engineering',
  description:
    'Welcome to Fit Forever India, the nation’s premier destination for luxury wellness engineering, 4D massage chairs, foot massagers, leg massagers, Healthmate wellness tech, and treadmills.',
  keywords: [
    'Massage chairs',
    '4D Massage Chair',
    'Foot massager',
    'Leg massager',
    'Healthmate',
    'Health Mate',
    'Treadmill',
    'About Fit Forever India',
    'robotic wellness equipment India',
    'luxury wellness engineering',
  ],
  openGraph: {
    title: 'About Us — Fit Forever India Luxury Wellness Engineering',
    description:
      'Pioneering manufacturer and trusted supplier of 4D luxury massage chairs, foot massagers, leg massagers, Healthmate products, and treadmills across India.',
    images: [
      {
        url: 'https://res.cloudinary.com/ufptbplr/image/upload/v1785999891/45ip-Left-Side-View-scaled-1_qhfnzf.jpg',
        width: 1200,
        height: 630,
        alt: 'Fit Forever India About Us',
      },
    ],
  },
};

export default function AboutPage() {
  return <AboutClientContent />;
}
