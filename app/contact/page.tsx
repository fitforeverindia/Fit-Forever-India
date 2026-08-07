'use client';

import { useState } from 'react';
import { Mail, MapPin, Phone, Send } from 'lucide-react';
import { toast } from 'sonner';
import { PageHeader } from '@/components/sections/page-header';
import { Reveal } from '@/components/ui/reveal';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { SITE } from '@/lib/site';

export default function ContactPage() {
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitting(true);
    await new Promise((r) => setTimeout(r, 800));
    setSubmitting(false);
    toast.success('Message sent! We will get back to you soon.');
    (e.target as HTMLFormElement).reset();
  }

  return (
    <>
      <PageHeader
        title="Contact Us"
        subtitle="Have a question? Reach out and our support team will respond promptly."
        breadcrumb={[{ label: 'Home', href: '/' }, { label: 'Contact Us' }]}
      />

      <section className="py-20 lg:py-28">
        <div className="container-fit">
          <div className="grid gap-10 lg:grid-cols-2 lg:gap-16">
            {/* Form */}
            <Reveal>
              <h2 className="font-display text-2xl font-semibold text-foreground sm:text-3xl">
                Send Us a Message
              </h2>
              <p className="mt-3 text-muted-foreground">
                Fill out the form below and we will get back to you as soon as possible.
              </p>

              <form onSubmit={handleSubmit} className="mt-8 space-y-5">
                <div>
                  <Label htmlFor="name" className="mb-1.5 block text-sm font-medium">
                    Name
                  </Label>
                  <Input id="name" name="name" type="text" required placeholder="Your full name" />
                </div>
                <div className="grid gap-5 sm:grid-cols-2">
                  <div>
                    <Label htmlFor="email" className="mb-1.5 block text-sm font-medium">
                      Email
                    </Label>
                    <Input id="email" name="email" type="email" required placeholder="you@example.com" />
                  </div>
                  <div>
                    <Label htmlFor="phone" className="mb-1.5 block text-sm font-medium">
                      Phone Number
                    </Label>
                    <Input id="phone" name="phone" type="tel" required placeholder="+91 00000 00000" />
                  </div>
                </div>
                <div>
                  <Label htmlFor="message" className="mb-1.5 block text-sm font-medium">
                    Write a Message
                  </Label>
                  <Textarea
                    id="message"
                    name="message"
                    required
                    rows={5}
                    placeholder="Tell us how we can help..."
                  />
                </div>
                <Button
                  type="submit"
                  disabled={submitting}
                  className="w-full bg-primary text-primary-foreground hover:bg-primary/90 sm:w-auto"
                >
                  <Send className="mr-2 h-4 w-4" />
                  {submitting ? 'Sending...' : 'Send Message'}
                </Button>
              </form>
            </Reveal>

            {/* Contact info + Map */}
            <Reveal delay={0.1}>
              <div className="space-y-6">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm dark:bg-card dark:border-border">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                      <MapPin className="h-5 w-5" />
                    </div>
                    <h3 className="mt-4 font-sans text-sm font-bold text-foreground">
                      Head Office
                    </h3>
                    <p className="mt-1 text-sm text-muted-foreground">{SITE.headOfficeCity}, Rajasthan, India</p>
                  </div>
                  <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm dark:bg-card dark:border-border">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                      <Phone className="h-5 w-5" />
                    </div>
                    <h3 className="mt-4 font-sans text-sm font-bold text-foreground">
                      Phone
                    </h3>
                    <div className="mt-1 space-y-0.5 text-sm text-muted-foreground">
                      <a href={`tel:${SITE.phones[0]}`} className="block hover:text-primary">
                        {SITE.phones[0]}
                      </a>
                      <a href={`tel:${SITE.phones[1]}`} className="block hover:text-primary">
                        {SITE.phones[1]}
                      </a>
                    </div>
                  </div>
                  <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm sm:col-span-2 dark:bg-card dark:border-border">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                      <Mail className="h-5 w-5" />
                    </div>
                    <h3 className="mt-4 font-sans text-sm font-bold text-foreground">
                      Email
                    </h3>
                    <a
                      href={`mailto:${SITE.email}`}
                      className="mt-1 block text-sm text-muted-foreground hover:text-primary"
                    >
                      {SITE.email}
                    </a>
                  </div>
                </div>

                <div className="overflow-hidden rounded-2xl border border-slate-100 shadow-md dark:border-border">
                  <iframe
                    title="Fit Forever India location"
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3627.3061644217937!2d73.702896!3d24.6131305!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3967e5a985e8cad3%3A0x84321f6245b2f3a3!2sReliance%20Digital!5e0!3m2!1sen!2sin!4v1786011959596!5m2!1sen!2sin"
                    width="100%"
                    height="350"
                    style={{ border: 0 }}
                    loading="lazy"
                    referrerPolicy="strict-origin-when-cross-origin"
                  />
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>
    </>
  );
}
