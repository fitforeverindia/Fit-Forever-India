import './globals.css';
import type { Metadata } from 'next';
import { Inter, Plus_Jakarta_Sans } from 'next/font/google';
import { Toaster } from '@/components/ui/sonner';
import { StoreProvider } from '@/components/store/store-provider';
import { AdminAuthProvider } from '@/lib/admin-auth';
import { CartDrawer } from '@/components/store/cart-drawer';
import { WishlistDrawer } from '@/components/store/wishlist-drawer';
import Navbar from '@/components/layout/navbar';
import Footer from '@/components/layout/footer';
import ScrollToTop from '@/components/layout/scroll-to-top';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});
const display = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-display',
  display: 'swap',
});

export const metadata: Metadata = {
  title: {
    default: 'Fit Forever India — Premium Fitness & Wellness Equipment',
    template: '%s | Fit Forever India',
  },
  description:
    'Shop premium massage chairs, treadmills, spin bikes, home gyms and wellness equipment from Fit Forever India. Manufacturer-direct quality with nationwide service.',
  keywords: [
    'fitness equipment India',
    'massage chair',
    'treadmill',
    'spin bike',
    'home gym',
    'Fit Forever India',
  ],
  openGraph: {
    title: 'Fit Forever India — Premium Fitness & Wellness Equipment',
    description:
      'Premium massage chairs, treadmills, spin bikes and wellness equipment. Manufacturer-direct quality with nationwide service.',
    type: 'website',
    images: [
      {
        url: 'https://res.cloudinary.com/ufptbplr/image/upload/v1785996171/Fit_Forever_Logo_page-0001_gglf4q.jpg',
        width: 1200,
        height: 630,
        alt: 'Fit Forever India',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    images: [
      {
        url: 'https://res.cloudinary.com/ufptbplr/image/upload/v1785996171/Fit_Forever_Logo_page-0001_gglf4q.jpg',
      },
    ],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${display.variable}`}>
      <body className="font-sans antialiased min-h-screen flex flex-col">
        <AdminAuthProvider>
          <StoreProvider>
            <Navbar />
            <main className="flex-1">{children}</main>
            <Footer />
            <ScrollToTop />
            <CartDrawer />
            <WishlistDrawer />
            <Toaster richColors position="bottom-right" />
          </StoreProvider>
        </AdminAuthProvider>
      </body>
    </html>
  );
}

