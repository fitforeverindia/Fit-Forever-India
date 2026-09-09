'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sparkles,
  Award,
  Microscope,
  ShieldCheck,
  Truck,
  Headset,
  Building2,
  CheckCircle2,
  ArrowRight,
  MapPin,
  Cpu,
  HeartPulse,
  Activity,
  Compass,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { PageHeader } from '@/components/sections/page-header';
import { Reveal } from '@/components/ui/reveal';
import { Button } from '@/components/ui/button';

const STATS = [
  { value: '3D & 4D', label: 'Robotic Massage Systems', sub: 'Biomedical engineering' },
  { value: '100k+', label: 'Discerning Clients', sub: 'Pan-India coverage' },
  { value: 'In-House', label: 'R&D & Engineering', sub: 'Proprietary testing lab' },
  { value: '24/7', label: 'Centralized Support', sub: 'Lifetime care ecosystem' },
];

const INNOVATION_PILLARS = [
  {
    icon: Cpu,
    title: 'Intelligent Body-Scanning',
    description:
      'Precision optical sensors detect body contours and spinal geometry in real-time for perfectly tailored pressure and stroke alignment.',
    gradient: 'from-amber-500/10 to-orange-500/10 text-amber-600',
  },
  {
    icon: Activity,
    title: '3D & 4D Biomimetic Mechanics',
    description:
      'Multi-axis robotic roller tracks deliver variable depth, speed, and rhythm indistinguishable from professional human massage therapists.',
    gradient: 'from-blue-500/10 to-cyan-500/10 text-blue-600',
  },
  {
    icon: HeartPulse,
    title: 'Zero-Gravity Decompression',
    description:
      'Elevates legs above the heart to virtually eliminate spinal compression, reduce cardiac stress, and optimize therapeutic circulation.',
    gradient: 'from-emerald-500/10 to-teal-500/10 text-emerald-600',
  },
  {
    icon: Microscope,
    title: 'Rigorous Stress & Quality Testing',
    description:
      'Every mechanical contour, motor, and multi-layer airbag undergoes thousands of cycles in our in-house facility for whisper-quiet durability.',
    gradient: 'from-purple-500/10 to-indigo-500/10 text-purple-600',
  },
];

const NETWORK_HIGHLIGHTS = [
  {
    icon: Truck,
    title: 'Pan-India White-Glove Logistics',
    description:
      'Optimized distribution infrastructure ensuring safe, insured transit and professional doorstep white-glove assembly across all major metropolitan cities.',
  },
  {
    icon: Headset,
    title: 'Centralized Customer Care Ecosystem',
    description:
      'Dedicated helpline and concierge support providing rapid resolution, ergonomic usage guidance, and seamless assistance.',
  },
  {
    icon: ShieldCheck,
    title: 'Lifetime Technical Support',
    description:
      'On-ground certified engineering specialists and guaranteed availability of 100% genuine spare parts to safeguard your wellness investment.',
  },
  {
    icon: Building2,
    title: 'Flagship Experience Centers',
    description:
      'Physical luxury showrooms located in prime retail destinations allowing you to experience 4D robotics and zero-gravity comfort firsthand.',
  },
];

const FEATURES = [
  'Pioneering Manufacturer of Advanced Personal Care Technology',
  'Elite Collection of 3D & 4D Luxury Massage Chairs',
  'State-of-the-Art In-House Research & Development Facility',
  'Pan-India Optimized Distribution & White-Glove Installation',
];

export default function AboutPage() {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <>
      {/* Header Banner */}
      <PageHeader
        title="About Us"
        subtitle="The nation’s premier destination for luxury wellness engineering and elite health-care innovation."
        breadcrumb={[{ label: 'Home', href: '/' }, { label: 'About Us' }]}
      />

      {/* Hero Overview Section */}
      <section className="relative py-12 sm:py-16 lg:py-20 overflow-hidden bg-white dark:bg-background">
        <div className="container-fit">
          <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
            <Reveal>
              <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3.5 py-1.5 text-xs font-bold uppercase tracking-[0.2em] text-primary">
                <Sparkles className="h-3.5 w-3.5" />
                Luxury Wellness Engineering
              </div>

              {/* Trust Badge */}
              <div className="mt-5 inline-flex items-center gap-3 rounded-2xl border border-primary/20 bg-primary/5 px-4 py-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary text-primary-foreground">
                  <Award className="h-5 w-5" />
                </div>
                <p className="font-display text-sm font-bold leading-snug text-foreground sm:text-base">
                  Premier Destination for Luxury Wellness & Health-Care Innovation
                  <span className="block text-xs font-semibold text-primary mt-0.5">Engineered for Indian Homes & Corporate Spaces</span>
                </p>
              </div>

              <h2 className="mt-4 font-display text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl lg:text-5xl leading-[1.15]">
                Welcome to Fit Forever India
              </h2>

              <div className="mt-6 space-y-4 font-sans text-base leading-relaxed text-muted-foreground sm:text-lg">
                <p>
                  Welcome to <strong className="text-foreground">Fit Forever India</strong>, the nation’s premier destination for luxury wellness engineering and elite health-care innovation. As a pioneering manufacturer and trusted supplier of advanced personal care technology, we are dedicated to transforming modern living by bringing the pinnacle of therapeutic relaxation directly into Indian homes and corporate wellness spaces.
                </p>
                <p>
                  At Fit Forever India, we believe that <strong className="text-foreground">health is the ultimate luxury</strong>. Over the years, we have transitioned from being a visionary pioneer in health-care research products to a leading force in high-end, robotic wellness solutions. Our crown jewels—our premium collection of 3D and 4D luxury massage chairs—represent the perfect synthesis of sophisticated aesthetics, intelligent ergonomics, and breakthrough biomedical engineering.
                </p>

                {/* Collapsible Read More Content */}
                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                      className="overflow-hidden space-y-4 pt-2 border-t border-slate-100 dark:border-border"
                    >
                      <div className="rounded-2xl bg-slate-50/90 p-5 sm:p-6 dark:bg-card border border-slate-200/80 dark:border-border space-y-4">
                        <div>
                          <h4 className="font-display text-base sm:text-lg font-bold text-foreground">
                            Driven by Innovation & Scientific Excellence
                          </h4>
                          <p className="mt-1.5 text-sm sm:text-base leading-relaxed text-muted-foreground">
                            We do not just supply products; we curate experiences. Our state-of-the-art Research and Development facility serves as the heart of our operations. Every zero-gravity massage chair, advanced body-scanning system, and multi-functional wellness asset we create undergoes rigorous testing and continuous optimization. This ensures that every contour, airbag, and rollers-track delivers a therapeutic experience indistinguishable from human hands, offering unparalleled relief from the stress of modern routines.
                          </p>
                        </div>

                        <div className="pt-3 border-t border-slate-200/60 dark:border-border/60">
                          <h4 className="font-display text-base sm:text-lg font-bold text-foreground">
                            A Network Built on Trust and Sophistication
                          </h4>
                          <p className="mt-1.5 text-sm sm:text-base leading-relaxed text-muted-foreground">
                            Headquartered with an extensive, highly optimized distribution infrastructure, Fit Forever India seamlessly serves discerning clients across all major metropolitan cities. Our commitment to your personal wellness extends far beyond production. With a centralized customer care ecosystem and dedicated technical support networks, we guarantee a flawless ownership journey, ensuring your wellness infrastructure remains pristine for a lifetime.
                          </p>
                        </div>

                        <div className="pt-3 border-t border-slate-200/60 dark:border-border/60">
                          <h4 className="font-display text-base sm:text-lg font-bold text-foreground">
                            Our Philosophy
                          </h4>
                          <p className="mt-1.5 text-sm sm:text-base leading-relaxed text-muted-foreground">
                            We do not view a premium massage chair as an extravagance, but as an essential investment in daily vitality, recovery, and longevity. Whether it is our intelligent body-scanning 4D systems or customized reflexology massagers, our mission remains absolute: to orchestrate a harmonious balance between cutting-edge technology and holistic human comfort.
                          </p>
                        </div>

                        <div className="pt-3 border-t border-slate-200/60 dark:border-border/60">
                          <p className="text-sm sm:text-base font-semibold text-primary italic">
                            Step into the future of lifestyle wellness. Experience the enduring luxury of relaxation, engineered exclusively for you by Fit Forever India.
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Read More / Read Less Button */}
                <button
                  type="button"
                  onClick={() => setIsExpanded(!isExpanded)}
                  className="inline-flex items-center gap-1.5 text-sm sm:text-base font-bold text-primary hover:text-primary/80 transition-colors cursor-pointer group py-1"
                >
                  <span>{isExpanded ? 'Read Less' : 'Read More'}</span>
                  {isExpanded ? (
                    <ChevronUp className="h-4 w-4 transition-transform group-hover:-translate-y-0.5" />
                  ) : (
                    <ChevronDown className="h-4 w-4 transition-transform group-hover:translate-y-0.5" />
                  )}
                </button>
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
                <Button asChild size="lg" className="rounded-full bg-primary text-primary-foreground hover:bg-primary/90">
                  <Link href="/products">
                    Explore Our Collection
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
                <Button asChild size="lg" variant="outline" className="rounded-full border-slate-200 dark:border-border">
                  <Link href="/outlets">
                    <MapPin className="mr-2 h-4 w-4 text-primary" />
                    Visit Our Showrooms
                  </Link>
                </Button>
              </div>
            </Reveal>

            {/* Visual Showcase Card */}
            <Reveal delay={0.2} className="relative">
              <div className="relative aspect-[4/3] sm:aspect-[4/3] overflow-hidden rounded-3xl shadow-2xl border border-slate-100 dark:border-border">
                <img
                  src="https://res.cloudinary.com/ufptbplr/image/upload/v1786000626/massagechairhero_nkpobu.jpg"
                  alt="Fit Forever luxury 4D robotic massage chair"
                  className="h-full w-full object-cover transition-transform duration-700 hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />
                
                {/* Floating Overlay Badge */}
                <div className="absolute bottom-6 left-6 right-6 p-6 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 text-white">
                  <div className="flex items-center gap-3">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary text-primary-foreground font-bold">
                      <ShieldCheck className="h-6 w-6" />
                    </div>
                    <div>
                      <h4 className="font-display font-bold text-base">Biomedical Engineering & Luxury Craftsmanship</h4>
                      <p className="text-xs text-white/80 mt-0.5">Engineered with precision body scanning & zero-gravity mechanics.</p>
                    </div>
                  </div>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Modern Stats Banner */}
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

      {/* Section: Driven by Innovation & Scientific Excellence */}
      <section className="py-16 sm:py-24 bg-[#F8F9FA] dark:bg-muted/20">
        <div className="container-fit">
          <Reveal className="mx-auto max-w-3xl text-center">
            <span className="text-xs font-bold uppercase tracking-[0.25em] text-primary">
              RESEARCH & DEVELOPMENT
            </span>
            <h2 className="mt-3 font-display text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl lg:text-5xl">
              Driven by Innovation & Scientific Excellence
            </h2>
            <p className="mt-5 font-sans text-base leading-relaxed text-muted-foreground sm:text-lg">
              We do not just supply products; we curate experiences. Our state-of-the-art Research and Development facility serves as the heart of our operations. Every zero-gravity massage chair, advanced body-scanning system, and multi-functional wellness asset we create undergoes rigorous testing and continuous optimization. This ensures that every contour, airbag, and rollers-track delivers a therapeutic experience indistinguishable from human hands, offering unparalleled relief from the stress of modern routines.
            </p>
          </Reveal>

          <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {INNOVATION_PILLARS.map((item, i) => (
              <Reveal key={item.title} delay={i * 0.08}>
                <div className="group relative flex flex-col justify-between h-full rounded-3xl border border-slate-200/80 bg-white p-7 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl dark:bg-card dark:border-border">
                  <div>
                    <div className={`flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br ${item.gradient} transition-transform group-hover:scale-110`}>
                      <item.icon className="h-7 w-7" />
                    </div>
                    <h3 className="mt-6 font-display text-lg font-bold text-foreground">
                      {item.title}
                    </h3>
                    <p className="mt-3 font-sans text-sm leading-relaxed text-muted-foreground">
                      {item.description}
                    </p>
                  </div>
                  <div className="mt-6 pt-4 border-t border-slate-100 dark:border-border flex items-center gap-1 text-xs font-bold text-primary group-hover:underline">
                    Explore Technology <ArrowRight className="h-3.5 w-3.5" />
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Section: A Network Built on Trust and Sophistication */}
      <section className="py-16 sm:py-24 bg-white dark:bg-background">
        <div className="container-fit">
          <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
            <Reveal>
              <span className="text-xs font-bold uppercase tracking-[0.25em] text-primary">
                NATIONWIDE INFRASTRUCTURE
              </span>
              <h2 className="mt-3 font-display text-3xl font-extrabold text-foreground sm:text-4xl lg:text-5xl">
                A Network Built on Trust and Sophistication
              </h2>
              <p className="mt-6 font-sans text-base leading-relaxed text-muted-foreground sm:text-lg">
                Headquartered with an extensive, highly optimized distribution infrastructure, Fit Forever India seamlessly serves discerning clients across all major metropolitan cities. Our commitment to your personal wellness extends far beyond production. With a centralized customer care ecosystem and dedicated technical support networks, we guarantee a flawless ownership journey, ensuring your wellness infrastructure remains pristine for a lifetime.
              </p>

              <div className="mt-8 space-y-4">
                {NETWORK_HIGHLIGHTS.map((nh) => (
                  <div key={nh.title} className="flex items-start gap-3.5 rounded-2xl border border-slate-100 bg-slate-50/70 p-4 dark:border-border dark:bg-card">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                      <nh.icon className="h-5 w-5" />
                    </div>
                    <div>
                      <h4 className="font-display text-sm font-bold text-foreground">{nh.title}</h4>
                      <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">{nh.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </Reveal>

            <Reveal delay={0.2}>
              <div className="grid grid-cols-2 gap-4">
                <div className="aspect-[4/5] rounded-3xl overflow-hidden shadow-xl border border-slate-100 dark:border-border">
                  <img
                    src="https://images.pexels.com/photos/7174396/pexels-photo-7174396.jpeg?auto=compress&cs=tinysrgb&w=800"
                    alt="Fit Forever corporate engineering and wellness"
                    className="h-full w-full object-cover"
                  />
                </div>
                <div className="aspect-[4/5] rounded-3xl overflow-hidden shadow-xl border border-slate-100 dark:border-border mt-8">
                  <img
                    src="https://images.pexels.com/photos/35215412/pexels-photo-35215412.jpeg?auto=compress&cs=tinysrgb&w=800"
                    alt="Fit Forever retail showroom"
                    className="h-full w-full object-cover"
                  />
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Section: Our Philosophy */}
      <section className="py-16 sm:py-24 bg-slate-900 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(249,115,22,0.15),transparent_50%)]" />
        <div className="container-fit relative z-10">
          <div className="mx-auto max-w-4xl text-center">
            <Reveal>
              <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-1.5 text-xs font-bold uppercase tracking-[0.2em] text-primary backdrop-blur-md border border-white/10">
                <Compass className="h-3.5 w-3.5" />
                Our Philosophy
              </div>

              <h2 className="mt-5 font-display text-3xl font-extrabold text-white sm:text-4xl lg:text-5xl">
                Health is the Ultimate Luxury
              </h2>

              <blockquote className="mt-8 rounded-3xl border border-white/15 bg-white/5 p-8 sm:p-12 backdrop-blur-md shadow-2xl text-left">
                <p className="font-serif text-lg sm:text-2xl leading-relaxed text-slate-100 italic">
                  &ldquo;We do not view a premium massage chair as an extravagance, but as an essential investment in daily vitality, recovery, and longevity. Whether it is our intelligent body-scanning 4D systems or customized reflexology massagers, our mission remains absolute: to orchestrate a harmonious balance between cutting-edge technology and holistic human comfort.&rdquo;
                </p>
                <div className="mt-6 flex items-center gap-3 pt-6 border-t border-white/10">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary font-bold text-white text-sm">
                    FF
                  </div>
                  <div>
                    <div className="font-display text-sm font-bold text-white">Fit Forever India</div>
                    <div className="text-xs text-slate-400">Engineering Wellness for a Lifetime</div>
                  </div>
                </div>
              </blockquote>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Closing Call To Action */}
      <section className="py-16 sm:py-24">
        <div className="container-fit">
          <Reveal>
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-primary via-orange-600 to-amber-600 px-8 py-14 text-center sm:px-16 text-white shadow-2xl">
              <h2 className="font-display text-3xl font-black text-white sm:text-4xl lg:text-5xl">
                Step into the future of lifestyle wellness.
              </h2>
              <p className="mx-auto mt-4 max-w-2xl font-sans text-white/95 text-base sm:text-lg">
                Experience the enduring luxury of relaxation, engineered exclusively for you by Fit Forever India.
              </p>
              <div className="mt-8 flex flex-wrap justify-center gap-4">
                <Button asChild size="lg" className="rounded-full bg-white text-slate-900 hover:bg-slate-100 font-bold shadow-lg">
                  <Link href="/products">
                    Explore Our Products
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
                <Button asChild size="lg" variant="outline" className="rounded-full border-white/50 bg-white/10 text-white backdrop-blur hover:bg-white hover:text-slate-900">
                  <Link href="/contact">
                    Contact Wellness Advisors
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

