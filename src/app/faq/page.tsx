import FaqClient from "./FaqClient";
import { Metadata } from "next";
import connectToDatabase from "@/lib/mongodb";
import SiteContent from "@/models/Content";
import Script from "next/script";
import { generateSchema } from "@/lib/schema-generator";

export async function generateMetadata(): Promise<Metadata> {
  await connectToDatabase();
  const content = await SiteContent.findOne({ key: "complete_data" }).lean() as any;
  const faqData = content?.data?.faqPage;
  
  return {
    title: faqData?.title || "Frequently Asked Questions | Eagle Revolution",
    description: faqData?.description || "Find clear answers to common questions about our services, processes, and military-grade standards.",
  };
}

export default async function FAQPage() {
  await connectToDatabase();
  const content = await SiteContent.findOne({ key: "complete_data" }).lean() as any;
  const faqData = content?.data?.faqPage;
  const allFaqs = content?.data?.faq?.items || [];
  
  // Filter FAQs for the FAQ page
  const faqs = allFaqs.filter((item: any) => 
    item.visibility === 'global' || 
    (item.visibility === 'specific' && item.targetPages?.includes('faq'))
  );

  const schema = generateSchema({
    title: faqData?.title || "Frequently Asked Questions",
    description: faqData?.description || "",
    slug: "/faq",
    type: "WebPage",
    faqs: faqs
  });

  return (
    <>
      <Script
        id="json-ld-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
      <FaqClient />
    </>
  );
}
