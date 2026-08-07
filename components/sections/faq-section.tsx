'use client';

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Reveal } from '@/components/ui/reveal';
import { FAQS } from '@/lib/data';

export function FaqSection() {
  return (
    <section className="py-20 lg:py-28">
      <div className="container-fit">
        <div className="grid gap-12 lg:grid-cols-[0.9fr_1.4fr]">
          <Reveal>
            <span className="text-xs font-semibold uppercase tracking-[0.25em] text-primary">
              FAQ
            </span>
            <h2 className="mt-3 font-display text-3xl font-semibold text-foreground sm:text-4xl">
              Questions, Answered
            </h2>
            <p className="mt-4 text-muted-foreground">
              Everything you need to know about our products, warranty and
              service. Still curious? Reach our team anytime.
            </p>
          </Reveal>

          <Reveal direction="right">
            <Accordion
              type="single"
              collapsible
              className="w-full"
              defaultValue="f1"
            >
              {FAQS.map((faq) => (
                <AccordionItem
                  key={faq.id}
                  value={faq.id}
                  className="border-border"
                >
                  <AccordionTrigger className="text-left font-display text-base font-medium hover:text-primary">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-sm leading-relaxed text-muted-foreground">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
