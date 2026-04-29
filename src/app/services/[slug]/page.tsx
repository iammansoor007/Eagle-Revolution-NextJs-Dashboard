import ServiceDetailTemplate from "@/components/templates/ServiceDetailTemplate";
import { Metadata } from "next";
import connectToDatabase from "@/lib/mongodb";
import SiteContent from "@/models/Content";
import Script from "next/script";

export const dynamic = 'force-dynamic';
export const revalidate = 0;

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "https://www.eaglerevolution.com";

function getAbsoluteUrl(path: string | undefined) {
  if (!path) return undefined;
  if (path.startsWith('http')) return path;
  return `${BASE_URL}${path.startsWith('/') ? '' : '/'}${path}`;
}

function generateServiceSchema(service: any) {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    "name": service.title,
    "description": service.seo?.metaDescription || service.description,
    "provider": {
      "@id": `${BASE_URL}/#organization`
    },
    "serviceType": service.tag || "Home Improvement",
    "areaServed": {
      "@type": "State",
      "name": "Missouri"
    }
  };
}

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

  const schema = service?.seo?.schemaData ? JSON.parse(service.seo.schemaData) : generateServiceSchema(service);

  return (
    <>
      <Script
        id="service-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
      <ServiceDetailTemplate params={resolvedParams} />
    </>
  );
}