'use client';

import { Reveal } from '@/components/ui/reveal';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb';
import Link from 'next/link';

export function PageHeader({
  title,
  subtitle,
  image,
  breadcrumb,
}: {
  title: string;
  subtitle?: string;
  image?: string;
  breadcrumb?: { label: string; href?: string }[];
}) {
  return (
    <section className="relative flex items-end overflow-hidden bg-foreground pt-28 pb-12 lg:pt-36 lg:pb-16">
      {image && (
        <img
          src={image}
          alt=""
          className="absolute inset-0 h-full w-full object-cover opacity-30"
        />
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-foreground via-foreground/80 to-foreground/40" />
      <div className="container-fit relative z-10">
        <Reveal>
          {breadcrumb && (
            <Breadcrumb className="mb-4">
              <BreadcrumbList>
                {breadcrumb.map((item, i) => (
                  <BreadcrumbItem key={i}>
                    {i > 0 && <BreadcrumbSeparator />}
                    {item.href ? (
                      <BreadcrumbLink asChild>
                        <Link href={item.href} className="text-white/60 hover:text-white">
                          {item.label}
                        </Link>
                      </BreadcrumbLink>
                    ) : (
                      <BreadcrumbPage className="text-white">{item.label}</BreadcrumbPage>
                    )}
                  </BreadcrumbItem>
                ))}
              </BreadcrumbList>
            </Breadcrumb>
          )}
          <h1 className="font-display text-4xl font-semibold text-white sm:text-5xl">
            {title}
          </h1>
          {subtitle && (
            <p className="mt-4 max-w-2xl text-white/70">{subtitle}</p>
          )}
        </Reveal>
      </div>
    </section>
  );
}
