import './globals.css';
import type { Metadata } from 'next';
import { Inter, Plus_Jakarta_Sans } from 'next/font/google';
import { Toaster } from '@/components/ui/sonner';
import { StoreProvider } from '@/components/store/store-provider';
import { AdminAuthProvider } from '@/lib/admin-auth';
import { CustomerAuthProvider } from '@/lib/customer-auth';
import { CartDrawer } from '@/components/store/cart-drawer';
import { WishlistDrawer } from '@/components/store/wishlist-drawer';
import Navbar from '@/components/layout/navbar';
import Footer from '@/components/layout/footer';
import ScrollToTop from '@/components/layout/scroll-to-top';
import { SITE } from '@/lib/site';

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
    default: 'Fit Forever India — 4D Massage Chairs, Foot Massager, Leg Massager, Healthmate & Treadmills',
    template: '%s | Fit Forever India',
  },
  description:
    'Fit Forever India is the premier manufacturer and supplier of 4D luxury massage chairs, leg massagers, foot massagers, Healthmate wellness companions, and motorized treadmills with pan-India warranty.',
  icons: {
    icon: SITE.logo,
    shortcut: SITE.logo,
    apple: SITE.logo,
  },
  keywords: [
    'Massage chairs',
    '4D Massage Chair',
    'Foot massager',
    'Leg massager',
    'Healthmate',
    'Health Mate',
    'Treadmill',
    'Fit Forever India',
    'robotic massage chair India',
    'luxury wellness engineering',
    'home gym equipment',
  ],
  openGraph: {
    title: 'Fit Forever India — 4D Massage Chairs, Foot & Leg Massagers, Healthmate & Treadmills',
    description:
      'Premier luxury wellness engineering & health-care innovation. Shop 4D massage chairs, foot massagers, leg massagers, Healthmate and treadmills.',
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
    title: 'Fit Forever India — 4D Massage Chairs, Foot & Leg Massagers, Healthmate & Treadmills',
    description:
      'Premier luxury wellness engineering & health-care innovation. 4D massage chairs, foot massagers, leg massagers, Healthmate and treadmills.',
    images: [
      {
        url: 'https://res.cloudinary.com/ufptbplr/image/upload/v1785996171/Fit_Forever_Logo_page-0001_gglf4q.jpg',
      },
    ],
  },
};

const jsonLdOrganization = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'Fit Forever India',
  url: 'https://fitforever.in',
  logo: SITE.logo,
  description:
    'Nation’s premier destination for luxury wellness engineering and elite health-care innovation. Manufacturer of 4D luxury massage chairs, foot massagers, leg massagers, Healthmate wellness tech, and motorized treadmills.',
  telephone: SITE.headOfficePhone,
  email: SITE.email,
  address: {
    '@type': 'PostalAddress',
    addressLocality: SITE.headOfficeCity,
    addressCountry: 'IN',
  },
  sameAs: [SITE.instagram],
};

const jsonLdWebSite = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: 'Fit Forever India',
  url: 'https://fitforever.in',
  potentialAction: {
    '@type': 'SearchAction',
    target: 'https://fitforever.in/products?search={search_term_string}',
    'query-input': 'required name=search_term_string',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${display.variable}`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdOrganization) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdWebSite) }}
        />
      </head>
      <body className="font-sans antialiased min-h-screen flex flex-col">
        <AdminAuthProvider>
          <CustomerAuthProvider>
            <StoreProvider>
              <Navbar />
              <main className="flex-1">{children}</main>
              <Footer />
              <ScrollToTop />
              <CartDrawer />
              <WishlistDrawer />
              <Toaster richColors position="bottom-right" />
            </StoreProvider>
          </CustomerAuthProvider>
        </AdminAuthProvider>
      </body>
    </html>
  );
}
