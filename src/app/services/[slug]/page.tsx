import ServiceDetailTemplate from "@/components/templates/ServiceDetailTemplate";
import { Metadata } from "next";
import connectToDatabase from "@/lib/mongodb";
import SiteContent from "@/models/Content";
import Script from "next/script";
import { generateSchema } from "@/lib/schema-generator";

export const dynamic = 'force-dynamic';
export const revalidate = 0;

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "https://www.eaglerevolution.com";

function getAbsoluteUrl(path: string | undefined) {
  if (!path) return undefined;
  if (path.startsWith('http')) return path;
  return `${BASE_URL}${path.startsWith('/') ? '' : '/'}${path}`;
}

// Auto-schema logic moved to centralized generator

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  await connectToDatabase();
  const content = await SiteContent.findOne({ key: "complete_data" }).lean() as any;
  const service = content?.data?.services?.services?.find((s: any) => s.slug === slug);

  if (!service) return {};

  const seo = service.seo || {};
  const pageUrl = `${BASE_URL}/services/${slug}`;

  return {
    title: seo.metaTitle || service.title,
    description: seo.metaDescription || service.description,
    alternates: {
      canonical: seo.canonicalUrl || pageUrl,
    },
    robots: {
      index: seo.metaRobotsIndex === 'index',
      follow: seo.metaRobotsFollow === 'follow',
    },
    openGraph: {
      title: seo.ogTitle || seo.metaTitle || service.title,
      description: seo.ogDescription || seo.metaDescription || service.description,
      url: pageUrl,
      siteName: "Eagle Revolution",
      type: "article",
      images: seo.ogImage ? [{ url: getAbsoluteUrl(seo.ogImage) || "" }] : [],
    },
    twitter: {
      card: (seo.twitterCard as any) || 'summary_large_image',
      title: seo.twitterTitle || seo.ogTitle || seo.metaTitle || service.title,
      description: seo.twitterDescription || seo.ogDescription || seo.metaDescription || service.description,
      images: seo.twitterImage ? [getAbsoluteUrl(seo.twitterImage) || ""] : (seo.ogImage ? [getAbsoluteUrl(seo.ogImage) || ""] : []),
    },
  };
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  
  // Fetch service for schema injection
  await connectToDatabase();
  const content = await SiteContent.findOne({ key: "complete_data" }).lean() as any;
  const serviceDoc = content?.data?.services?.services?.find((s: any) => s.slug === resolvedParams.slug);
  const service = JSON.parse(JSON.stringify(serviceDoc));
  const globalData = content?.data || {};
  
  // Helper to validate FAQ items
  const isValidFaq = (items: any) => Array.isArray(items) && items.length > 0 && items.every((i: any) => i.question && i.answer);

  // Detect FAQs in service content
  let faqs = [];
  if (isValidFaq(service?.content?.faqs)) {
    faqs = service.content.faqs;
  } else if (isValidFaq(service?.content?.items)) {
    faqs = service.content.items;
  } else if (isValidFaq(service?.faq?.items)) {
    faqs = service.faq.items;
  } else if (isValidFaq(service?.faqs)) {
    faqs = service.faqs;
  }

  // If no service-specific FAQs, check if there's a global FAQ section that should be linked
  if (faqs.length === 0 && globalData.faq?.items && Array.isArray(globalData.faq.items)) {
    // Only include global FAQs if they are relevant (optional, but requested for automation)
    // faqs = globalData.faq.items; 
  }

  const schema = generateSchema({
    title: service?.seo?.metaTitle || service?.title || "",
    description: service?.seo?.metaDescription || service?.description || "",
    slug: `services/${resolvedParams.slug}`,
    type: "Service",
    faqs: faqs,
    breadcrumbTitle: service?.seo?.breadcrumbTitle,
    isService: true
  });

  return (
    <>
      <Script
        id="json-ld-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
      <ServiceDetailTemplate params={resolvedParams} />
    </>
  );
}