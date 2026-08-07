'use client';

import Link from 'next/link';
import { Phone, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Reveal } from '@/components/ui/reveal';
import { SITE } from '@/lib/site';

export function CtaBanner() {
  return (
    <section className="py-20 lg:py-24">
      <div className="container-fit">
        <Reveal>
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary to-primary/80 px-8 py-14 text-center shadow-lift sm:px-16 lg:py-20">
            <div className="absolute -right-16 -top-16 h-64 w-64 rounded-full bg-white/10" />
            <div className="absolute -bottom-20 -left-10 h-72 w-72 rounded-full bg-white/5" />
            <div className="relative">
              <h2 className="font-display text-3xl font-semibold text-white sm:text-4xl lg:text-5xl">
                Ready to Invest in Your Health?
              </h2>
              <p className="mx-auto mt-4 max-w-xl text-white/85">
                Talk to our wellness experts and find the perfect equipment
                for your home or studio.
              </p>
              <div className="mt-8 flex flex-wrap justify-center gap-3">
                <Button
                  asChild
                  size="lg"
                  className="bg-white text-primary hover:bg-white/90"
                >
                  <Link href="/products">
                    Shop Products
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
                <Button
                  asChild
                  size="lg"
                  variant="outline"
                  className="border-white/40 bg-transparent text-white hover:bg-white hover:text-primary"
                >
                  <a href={`tel:${SITE.headOfficePhone}`}>
                    <Phone className="mr-2 h-4 w-4" />
                    {SITE.headOfficePhone}
                  </a>
                </Button>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
