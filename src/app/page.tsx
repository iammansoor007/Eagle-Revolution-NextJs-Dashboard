import HomeTemplate from "@/components/templates/HomeTemplate";
import { Metadata } from "next";
import connectToDatabase from "@/lib/mongodb";
import SiteContent from "@/models/Content";
import Script from "next/script";
import { generateSchema } from "@/lib/schema-generator";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "https://www.eaglerevolution.com";

export async function generateMetadata(): Promise<Metadata> {
  await connectToDatabase();
  const content = await SiteContent.findOne({ key: "complete_data" }).lean() as any;
  const homeData = content?.data?.home;
  const settings = content?.data?.settings;

  return {
    title: homeData?.hero?.headline || settings?.siteTitle || "Eagle Revolution",
    description: homeData?.hero?.subheadline || "Veteran-owned roofing & home improvement in St. Louis, MO.",
  };
}

export default async function Index() {
  await connectToDatabase();
  const content = await SiteContent.findOne({ key: "complete_data" }).lean() as any;
  const homeData = content?.data?.home;
  const settings = content?.data?.settings;

  // Helper to validate FAQ items
  const isValidFaq = (items: any) => Array.isArray(items) && items.length > 0 && items.every((i: any) => i.question && i.answer);

  // Detect FAQs in Home content
  let faqs = [];
  if (isValidFaq(homeData?.faq?.items)) {
    faqs = homeData.faq.items;
  } else if (isValidFaq(homeData?.faqs)) {
    faqs = homeData.faqs;
  }

  const schema = generateSchema({
    title: settings?.siteTitle || "Eagle Revolution",
    description: homeData?.hero?.subheadline || "Veteran-owned roofing & home improvement in St. Louis, MO.",
    slug: "/",
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
      <HomeTemplate />
    </>
  );
}
