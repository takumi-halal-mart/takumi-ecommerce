import Link from 'next/link';

import { Metadata } from 'next';
import { JsonLd } from "@/components/storefront/JsonLd";

export const metadata: Metadata = {
  title: "FAQ — Delivery, Halal Certification, Wholesale & More",
  description:
    "Answers to common questions about Takumi Halal Mart: delivery areas across Japan, halal certification standards, wholesale registration, returns, and store hours.",
  alternates: { canonical: "https://www.takumihalalmart.store/faq" },
};

const faqs = [
  {
    question: "Are all your products certified Halal?",
    answer: "Yes, absolutely. We strictly curate and source our ingredients to ensure that every product we sell is 100% Halal certified and safe for our community to consume."
  },
  {
    question: "How long does delivery take?",
    answer: "Orders are typically processed and shipped within 2–5 business days after payment confirmation. You will receive a tracking link once your order has been dispatched."
  },
  {
    question: "What payment methods do you accept?",
    answer: "We currently accept all major credit cards securely processed through Stripe, as well as Cash on Delivery (COD) for your convenience."
  },
  {
    question: "How are shipping costs calculated?",
    answer: "Shipping and delivery charges are calculated automatically at checkout based on your delivery location in Japan and the total weight of your order."
  },
  {
    question: "Can I return or exchange an item?",
    answer: "Due to the perishable nature of food products, we cannot accept returns or exchanges for customer convenience. However, if you receive a damaged, defective, or incorrect product, please contact us within 7 days of delivery for a replacement or refund."
  },
  {
    question: "Do you offer wholesale purchasing?",
    answer: "Yes! We supply restaurants and businesses. Please visit our Wholesale Portal to submit an inquiry, and our B2B team will get in touch with you to discuss bulk pricing."
  }
];

export default function FAQPage() {
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map(faq => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };

  return (
    <div className="min-h-screen bg-[#F8F9FA] py-16 md:py-24 px-4 sm:px-6 lg:px-8">
      <JsonLd data={faqSchema} />
      <div className="max-w-3xl mx-auto">
        
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 tracking-tight mb-6">
            Frequently Asked Questions
          </h1>
          <p className="text-lg md:text-xl text-gray-500 max-w-2xl mx-auto">
            Everything you need to know about shopping with Takumi Halal Mart.
          </p>
        </div>

        <div className="space-y-6">
          {faqs.map((faq, idx) => (
            <div 
              key={idx} 
              className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8 hover:shadow-md transition-shadow duration-300"
            >
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                {faq.question}
              </h3>
              <p className="text-gray-600 leading-relaxed text-base">
                {faq.answer}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-16 text-center bg-brand-black rounded-3xl p-8 md:p-12 shadow-lg border-t-4 border-brand-gold">
          <h2 className="text-2xl md:text-3xl font-extrabold text-white mb-4 tracking-tight">
            Still have questions?
          </h2>
          <p className="text-gray-400 mb-8 max-w-xl mx-auto text-lg">
            Can't find the answer you're looking for? Please chat to our friendly team.
          </p>
          <Link
            href="/contact"
            className="inline-flex items-center justify-center px-8 py-4 border border-transparent text-base font-bold rounded-xl text-brand-black bg-brand-gold hover:bg-white transition-all shadow-sm transform hover:-translate-y-0.5"
          >
            Contact Support
          </Link>
        </div>
        
      </div>
    </div>
  );
}
