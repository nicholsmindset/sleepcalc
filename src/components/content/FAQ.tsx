import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { SchemaMarkup } from "@/components/seo/SchemaMarkup";

interface FAQItem {
  question: string;
  answer: string;
}

interface FAQProps {
  items: FAQItem[];
  title?: string;
}

export function FAQ({ items, title = "Frequently Asked Questions" }: FAQProps) {
  const faqSchema = {
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };

  return (
    <section className="py-12">
      <SchemaMarkup type="FAQPage" data={faqSchema} />
      <h2 className="font-headline text-2xl md:text-3xl font-bold mb-8 text-on-surface">
        {title}
      </h2>
      <Accordion className="w-full space-y-3">
        {items.map((item, index) => (
          <AccordionItem
            key={index}
            className="glass-card rounded-2xl px-6 border-none"
          >
            <AccordionTrigger className="text-left text-on-surface font-medium hover:no-underline py-5">
              {item.question}
            </AccordionTrigger>
            <AccordionContent className="text-on-surface-variant text-sm leading-relaxed pb-5">
              {item.answer}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </section>
  );
}
