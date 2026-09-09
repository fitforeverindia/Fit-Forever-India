'use client';

import Link from 'next/link';
import {
  Microscope,
  Truck,
  Headset,
  Award,
  CheckCircle2,
  MapPin,
  ShieldCheck,
  Sparkles,
  ArrowRight,
  Building2,
  Heart,
  Cpu,
  Globe2,
} from 'lucide-react';
import { PageHeader } from '@/components/sections/page-header';
import { Reveal } from '@/components/ui/reveal';
import { Button } from '@/components/ui/button';

const CORE_PILLARS = [
  {
    icon: Microscope,
    title: 'In-House R&D Facility',
    description:
      'Our state-of-the-art Research & Development facility serves as the heart of our operations, continuously engineering zero-gravity tracks and body-scanning 4D systems.',
    gradient: 'from-amber-500/10 to-orange-500/10 text-amber-600',
  },
  {
    icon: Cpu,
    title: 'Biomedical Innovation',
    description:
      'Pioneering robotic wellness solutions where every contour, airbag, and rollers-track delivers a therapeutic experience indistinguishable from human hands.',
    gradient: 'from-blue-500/10 to-cyan-500/10 text-blue-600',
  },
  {
    icon: Globe2,
    title: 'Distribution Infrastructure',
    description:
      'Extensive distribution network seamlessly serving discerning residential and corporate clients across all major Indian metropolitan cities.',
    gradient: 'from-emerald-500/10 to-teal-500/10 text-emerald-600',
  },
  {
    icon: Headset,
    title: 'Lifetime Customer Care',
    description:
      'Centralized customer support ecosystem and dedicated technical networks guaranteeing a flawless ownership journey for a lifetime.',
    gradient: 'from-purple-500/10 to-indigo-500/10 text-purple-600',
  },
];

const STATS = [
  { value: '2006', label: 'Pioneering Year', sub: 'Healthcare & Wellness Research' },
  { value: '4D', label: 'Robotic Engineering', sub: 'Biomedical Zero-Gravity Systems' },
  { value: '100k+', label: 'Discerning Homes', sub: 'Pan-India Distribution Network' },
  { value: '24/7', label: 'Centralized Care', sub: 'Lifetime Technical Support' },
];

const FEATURES = [
  '3D & 4D Luxury Robotic Massage Chairs',
  'State-of-the-Art In-House R&D & Testing',
  'Reflexology Foot & Leg Massagers',
  'Smart Treadmills & Fitness Innovation',
  'Centralized Customer Support & On-Site Care',
  'Pan-India Metropolitan Logistics Infrastructure',
];

export default function AboutClientContent() {
  return (
    <>
      {/* Header Banner */}
      <PageHeader
        title="About Fit Forever India"
        subtitle="The nation’s premier destination for luxury wellness engineering and elite health-care innovation."
        breadcrumb={[{ label: 'Home', href: '/' }, { label: 'About Us' }]}
      />

      {/* Main Brand Story & Hero Overview */}
      <section className="relative py-12 sm:py-16 lg:py-24 overflow-hidden">
        <div className="container-fit">
          <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
            <Reveal>
              <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 text-xs font-bold uppercase tracking-[0.2em] text-primary">
                <Sparkles className="h-3.5 w-3.5" />
                Luxury Wellness Engineering
              </div>

              <h2 className="mt-4 font-display text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl lg:text-5xl leading-[1.15]">
                Welcome to <span className="text-primary">Fit Forever India</span>
              </h2>

              <p className="mt-4 font-sans text-lg font-medium leading-relaxed text-foreground/90">
                Welcome to Fit Forever India, the nation’s premier destination for luxury wellness engineering and elite health-care innovation. As a pioneering manufacturer and trusted supplier of advanced personal care technology, we are dedicated to transforming modern living by bringing the pinnacle of therapeutic relaxation directly into Indian homes and corporate wellness spaces.
              </p>

              <div className="mt-6 space-y-4 font-sans text-base leading-relaxed text-muted-foreground sm:text-lg">
                <p>
                  At Fit Forever India, we believe that health is the ultimate luxury. Over the years, we have transitioned from being a visionary pioneer in health-care research products to a leading force in high-end, robotic wellness solutions. Our crown jewels—our premium collection of 3D and 4D luxury massage chairs—represent the perfect synthesis of sophisticated aesthetics, intelligent ergonomics, and breakthrough biomedical engineering.
                </p>
              </div>

              {/* Highlights Checklist */}
              <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-3">
                {FEATURES.map((feat) => (
                  <div key={feat} className="flex items-start gap-2.5">
                    <CheckCircle2 className="h-5 w-5 shrink-0 text-primary mt-0.5" />
                    <span className="font-sans text-sm font-semibold text-foreground">{feat}</span>
                  </div>
                ))}
              </div>

              <div className="mt-8 flex flex-wrap gap-4">
                <Button asChild size="lg" className="rounded-full bg-primary text-primary-foreground hover:bg-primary/90 shadow-md">
                  <Link href="/products">
                    Explore Luxury Collection
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
                <Button asChild size="lg" variant="outline" className="rounded-full border-slate-200 dark:border-border">
                  <Link href="/outlets">
                    <MapPin className="mr-2 h-4 w-4 text-primary" />
                    Locate Experience Stores
                  </Link>
                </Button>
              </div>
            </Reveal>

            {/* Visual Feature Card Stack */}
            <Reveal delay={0.2} className="relative">
              <div className="relative aspect-[4/3] sm:aspect-[4/3] overflow-hidden rounded-3xl shadow-2xl border border-slate-100 bg-slate-50 dark:bg-slate-900 dark:border-border">
                <img
                  src="https://res.cloudinary.com/ufptbplr/image/upload/v1785999891/45ip-Left-Side-View-scaled-1_qhfnzf.jpg"
                  alt="Fit Forever 4D Luxury Massage Chair Engineering"
                  className="h-full w-full object-contain p-2 sm:p-4 transition-transform duration-700 hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent pointer-events-none" />
                
                {/* Floating Overlay Badge — High Contrast & Ultra Readable */}
                <div className="absolute bottom-3 left-3 right-3 p-4 sm:bottom-6 sm:left-6 sm:right-6 sm:p-5 rounded-2xl bg-slate-950/95 border border-white/20 text-white shadow-2xl">
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 sm:h-11 sm:w-11 items-center justify-center rounded-xl bg-primary text-white font-bold shrink-0 shadow-md">
                      <ShieldCheck className="h-5 w-5 sm:h-6 sm:w-6" />
                    </div>
                    <div>
                      <h3 className="font-display font-extrabold text-xs sm:text-base text-white leading-tight">4D Zero-Gravity Precision</h3>
                      <p className="text-[11px] sm:text-xs text-slate-200 mt-0.5 font-medium leading-relaxed">Biomedical engineering designed for human longevity and muscle recovery.</p>
                    </div>
                  </div>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Section 2: Driven by Innovation & Scientific Excellence */}
      <section className="bg-slate-900 py-16 sm:py-24 text-white relative overflow-hidden">
        <div className="container-fit">
          <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
            <Reveal delay={0.1}>
              <div className="relative aspect-[4/3] rounded-3xl overflow-hidden shadow-2xl border border-white/10">
                <img
                  src="https://images.pexels.com/photos/7174396/pexels-photo-7174396.jpeg?auto=compress&cs=tinysrgb&w=1200"
                  alt="Fit Forever R&D Innovation Facility"
                  className="h-full w-full object-cover"
                />
                <div className="absolute bottom-3 left-3 right-3 p-4 sm:bottom-6 sm:left-6 sm:right-6 sm:p-5 rounded-2xl bg-slate-950/95 border border-white/20 text-white shadow-2xl">
                  <span className="text-[11px] sm:text-xs font-mono font-extrabold text-amber-400 uppercase tracking-wider block">
                    RESEARCH & DEVELOPMENT FACILITY
                  </span>
                  <p className="text-xs sm:text-xs text-white font-medium mt-1 leading-relaxed">
                    Rigorous stress testing and biomedical optimization before every deployment.
                  </p>
                </div>
              </div>
            </Reveal>

            <Reveal>
              <span className="text-xs font-bold uppercase tracking-[0.25em] text-primary">
                SCIENTIFIC EXCELLENCE
              </span>
              <h2 className="mt-3 font-display text-3xl font-extrabold text-white sm:text-4xl">
                Driven by Innovation & Scientific Excellence
              </h2>
              <div className="mt-6 space-y-4 font-sans text-base leading-relaxed text-slate-300 sm:text-lg">
                <p>
                  We do not just supply products; we curate experiences. Our state-of-the-art Research and Development facility serves as the heart of our operations.
                </p>
                <p>
                  Every zero-gravity massage chair, advanced body-scanning system, and multi-functional wellness asset we create undergoes rigorous testing and continuous optimization. This ensures that every contour, airbag, and rollers-track delivers a therapeutic experience indistinguishable from human hands, offering unparalleled relief from the stress of modern routines.
                </p>
              </div>

              <div className="mt-8 grid grid-cols-2 gap-4">
                <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
                  <h3 className="font-display font-bold text-white text-base">Intelligent Body-Scanning</h3>
                  <p className="text-xs text-slate-400 mt-1">Optical sensors mapping spine curvature in 4D.</p>
                </div>
                <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
                  <h3 className="font-display font-bold text-white text-base">Human Hands Simulation</h3>
                  <p className="text-xs text-slate-400 mt-1">Multi-axis massage rollers & pneumatic compression.</p>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Section 3: A Network Built on Trust and Sophistication & Philosophy */}
      <section className="py-16 sm:py-24 bg-slate-50 dark:bg-muted/10">
        <div className="container-fit">
          <div className="grid gap-12 lg:grid-cols-2">
            {/* Box 1: Network Built on Trust */}
            <Reveal className="flex flex-col justify-between rounded-3xl border border-slate-200/80 bg-white p-8 sm:p-10 shadow-sm dark:bg-card dark:border-border">
              <div>
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                  <Globe2 className="h-6 w-6" />
                </div>
                <h3 className="mt-6 font-display text-2xl font-extrabold text-foreground">
                  A Network Built on Trust and Sophistication
                </h3>
                <p className="mt-4 font-sans text-base leading-relaxed text-muted-foreground">
                  Headquartered with an extensive, highly optimized distribution infrastructure, Fit Forever India seamlessly serves discerning clients across all major metropolitan cities.
                </p>
                <p className="mt-4 font-sans text-base leading-relaxed text-muted-foreground">
                  Our commitment to your personal wellness extends far beyond production. With a centralized customer care ecosystem and dedicated technical support networks, we guarantee a flawless ownership journey, ensuring your wellness infrastructure remains pristine for a lifetime.
                </p>
              </div>

              <div className="mt-8 pt-6 border-t border-slate-100 dark:border-border flex items-center justify-between">
                <span className="text-xs font-bold text-primary uppercase tracking-wider">Pan-India Support</span>
                <span className="text-xs font-mono text-muted-foreground">Centralized Customer Care</span>
              </div>
            </Reveal>

            {/* Box 2: Our Philosophy */}
            <Reveal delay={0.1} className="flex flex-col justify-between rounded-3xl border border-slate-200/80 bg-white p-8 sm:p-10 shadow-sm dark:bg-card dark:border-border">
              <div>
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                  <Heart className="h-6 w-6" />
                </div>
                <h3 className="mt-6 font-display text-2xl font-extrabold text-foreground">
                  Our Philosophy
                </h3>
                <p className="mt-4 font-sans text-base leading-relaxed text-muted-foreground">
                  We do not view a premium massage chair as an extravagance, but as an essential investment in daily vitality, recovery, and longevity.
                </p>
                <p className="mt-4 font-sans text-base leading-relaxed text-muted-foreground">
                  Whether it is our intelligent body-scanning 4D systems or customized reflexology massagers, our mission remains absolute: to orchestrate a harmonious balance between cutting-edge technology and holistic human comfort.
                </p>
              </div>

              <div className="mt-8 pt-6 border-t border-slate-100 dark:border-border flex items-center justify-between">
                <span className="text-xs font-bold text-primary uppercase tracking-wider">Holistic Comfort</span>
                <span className="text-xs font-mono text-muted-foreground">Biomedical Ergonomics</span>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Stats Counter Section */}
      <section className="border-y border-border bg-slate-950 text-white py-12 sm:py-16">
        <div className="container-fit">
          <div className="grid grid-cols-2 gap-8 lg:grid-cols-4">
            {STATS.map((stat, i) => (
              <Reveal key={stat.label} delay={i * 0.08} className="text-center">
                <div className="font-display text-4xl font-extrabold text-primary sm:text-5xl">
                  {stat.value}
                </div>
                <div className="mt-2 font-display text-base font-bold text-white sm:text-lg">
                  {stat.label}
                </div>
                <div className="mt-1 text-xs text-slate-400">
                  {stat.sub}
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Four Pillars */}
      <section className="bg-white py-16 sm:py-24 dark:bg-card">
        <div className="container-fit">
          <Reveal className="mx-auto max-w-2xl text-center">
            <span className="text-xs font-bold uppercase tracking-[0.25em] text-primary">
              OUR CORE ADVANTAGE
            </span>
            <h2 className="mt-3 font-display text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
              Engineered For Modern Lifestyle Excellence
            </h2>
            <p className="mt-3 font-sans text-muted-foreground">
              Built on scientific R&D, direct manufacturing quality, and lifetime customer care.
            </p>
          </Reveal>

          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {CORE_PILLARS.map((item, i) => (
              <Reveal key={item.title} delay={i * 0.08}>
                <div className="group relative flex flex-col justify-between h-full rounded-3xl border border-slate-200/80 bg-slate-50/60 p-8 shadow-xs transition-all duration-300 hover:-translate-y-1 hover:shadow-xl dark:bg-card dark:border-border">
                  <div>
                    <div className={`flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br ${item.gradient} transition-transform group-hover:scale-110`}>
                      <item.icon className="h-7 w-7" />
                    </div>
                    <h3 className="mt-6 font-display text-xl font-bold text-foreground">
                      {item.title}
                    </h3>
                    <p className="mt-3 font-sans text-sm leading-relaxed text-muted-foreground">
                      {item.description}
                    </p>
                  </div>
                  <div className="mt-6 pt-4 border-t border-slate-200/60 dark:border-border flex items-center gap-1 text-xs font-bold text-primary group-hover:underline">
                    Explore Technology <ArrowRight className="h-3.5 w-3.5" />
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Closing Hero Callout / CTA */}
      <section className="py-16 sm:py-24">
        <div className="container-fit">
          <Reveal>
            <div className="relative overflow-hidden rounded-[36px] bg-gradient-to-r from-primary via-orange-600 to-amber-600 px-8 py-16 text-center sm:px-16 text-white shadow-2xl">
              <span className="inline-block rounded-full bg-white/20 px-4 py-1 text-xs font-mono font-bold tracking-widest text-white uppercase backdrop-blur-sm">
                FIT FOREVER INDIA
              </span>
              <h2 className="mt-4 font-display text-3xl font-black text-white sm:text-4xl lg:text-5xl leading-tight max-w-4xl mx-auto">
                Step into the future of lifestyle wellness.
              </h2>
              <p className="mx-auto mt-4 max-w-3xl font-sans text-lg sm:text-xl text-white/95 leading-relaxed font-medium">
                Experience the enduring luxury of relaxation, engineered exclusively for you by Fit Forever India.
              </p>
              <div className="mt-8 flex flex-wrap justify-center gap-4">
                <Button asChild size="lg" className="rounded-full bg-white text-slate-950 hover:bg-slate-100 font-extrabold px-8 shadow-lg">
                  <Link href="/products">
                    View Massage Chairs & Equipment
                  </Link>
                </Button>
                <Button asChild size="lg" variant="outline" className="rounded-full border-white/40 bg-white/10 text-white backdrop-blur hover:bg-white hover:text-slate-950 font-bold px-8">
                  <Link href="/contact">
                    Get Expert Advice
                  </Link>
                </Button>
              </div>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
