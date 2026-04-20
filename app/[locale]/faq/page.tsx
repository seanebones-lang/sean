import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { PageShell } from "@/components/page-shell";
import { FaqAccordion } from "@/components/faq-accordion";
import { siteConfig } from "@/lib/site";
import { sanityClient } from "@/sanity/lib/client";
import { faqItemsQuery } from "@/sanity/lib/queries";
import { sanityEnv } from "@/sanity/env";

export const revalidate = 300;

type FaqPageProps = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: FaqPageProps): Promise<Metadata> {
  const { locale } = await params;
  return {
    title: "FAQ",
    description: "Common questions about booking, pricing, styles, consultation, and preparing for your tattoo appointment.",
    alternates: { canonical: `${siteConfig.siteUrl}/${locale}/faq` },
    openGraph: {
      title: "FAQ — Cody Meneley Tattoo Artist",
      description: "Booking, pricing, aftercare, cover-ups — quick answers to the questions we hear most.",
      url: `${siteConfig.siteUrl}/${locale}/faq`,
    },
  };
}

const fallbackFaqs = [
  {
    question: "Do you require a consultation?",
    answer: "Yes. Most projects start with a consultation to confirm concept, placement, sizing, and session structure.",
  },
  {
    question: "Can I book black and grey realism?",
    answer: "Absolutely. Black and grey work is a core specialty and highlighted in the portfolio queue.",
  },
  {
    question: "Do you tattoo over scars or cover old work?",
    answer: "Many cover-up and rework projects are possible after visual review and a realistic planning conversation.",
  },
  {
    question: "How much does a tattoo cost?",
    answer: "Pricing varies by size, complexity, and session time. Contact us for a quote — deposits are required to hold appointments.",
  },
  {
    question: "How do I prepare for my appointment?",
    answer: "Get good sleep, eat a solid meal beforehand, stay hydrated, and wear clothing that gives easy access to the area being tattooed. Avoid alcohol 24 hours prior.",
  },
  {
    question: "What aftercare do you recommend?",
    answer: "See the Aftercare page for a full guide. In summary: keep it clean, moisturize with unscented lotion, avoid sun and soaking until fully healed.",
  },
  {
    question: "Do you accept walk-ins?",
    answer: "Custom work is booked in advance through the booking portal. Check availability there or use the contact form to inquire.",
  },
  {
    question: "Can I bring my own reference images?",
    answer: "Absolutely — references are encouraged. Bring as many as you like to the consultation. They help establish style, mood, and detail level.",
  },
];

type FaqItem = { question: string; answer: string };

async function getFaqItems(): Promise<FaqItem[]> {
  if (!sanityEnv.isConfigured) return fallbackFaqs;
  try {
    const items = await sanityClient.fetch<FaqItem[]>(
      faqItemsQuery,
      {},
      { next: { revalidate: 300 } }
    );
    return items?.length ? items : fallbackFaqs;
  } catch {
    return fallbackFaqs;
  }
}

export default async function FaqPage({ params }: FaqPageProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  const faqs = await getFaqItems();

  const faqLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: f.answer,
      },
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }}
      />
      <PageShell
        title="FAQ"
        description="Quick answers to common booking, style, and process questions."
      >
        <FaqAccordion items={faqs} />
      </PageShell>
    </>
  );
}
