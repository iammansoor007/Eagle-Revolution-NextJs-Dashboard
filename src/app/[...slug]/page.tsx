import { notFound } from 'next/navigation';
import connectToDatabase from '@/lib/mongodb';
import Page from '@/models/Page';
import { getTemplate } from '@/components/templates/TemplateRegistry';
import { Metadata } from 'next';
import Script from 'next/script';

interface PageProps {
  params: Promise<{ slug: string[] }>;
}

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "https://www.eaglerevolution.com";

function getAbsoluteUrl(path: string | undefined) {
  if (!path) return undefined;
  if (path.startsWith('http')) return path;
  return `${BASE_URL}${path.startsWith('/') ? '' : '/'}${path}`;
}

function generateAutoSchema(page: any) {
  let type = "WebPage";
  if (page.template === 'about') type = "AboutPage";
  if (page.template === 'contact') type = "ContactPage";
  if (page.template === 'gallery') type = "CollectionPage";

  return {
    "@context": "https://schema.org",
    "@type": type,
    "name": page.seo?.metaTitle || page.title,
    "description": page.seo?.metaDescription || "",
    "url": `${BASE_URL}/${page.slug}`,
    "publisher": {
      "@id": `${BASE_URL}/#organization`
    }
  };
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const resolvedParams = await params;
  const slug = resolvedParams.slug.join('/');

  await connectToDatabase();
  const page = await Page.findOne({ slug, status: 'published' }).lean();

  if (!page) return {};

  const seo = page.seo || {};
  const pageUrl = `${BASE_URL}/${slug}`;

  return {
    title: seo.metaTitle || page.title,
    description: seo.metaDescription,
    alternates: {
      canonical: seo.canonicalUrl || pageUrl,
    },
    robots: {
      index: seo.metaRobotsIndex === 'index',
      follow: seo.metaRobotsFollow === 'follow',
    },
    openGraph: {
      title: seo.ogTitle || seo.metaTitle || page.title,
      description: seo.ogDescription || seo.metaDescription,
      url: pageUrl,
      siteName: "Eagle Revolution",
      type: "website",
      images: seo.ogImage ? [{ url: getAbsoluteUrl(seo.ogImage) || "" }] : [],
    },
    twitter: {
      card: (seo.twitterCard as any) || 'summary_large_image',
      title: seo.twitterTitle || seo.ogTitle || seo.metaTitle || page.title,
      description: seo.twitterDescription || seo.ogDescription || seo.metaDescription,
      images: seo.twitterImage ? [getAbsoluteUrl(seo.twitterImage) || ""] : (seo.ogImage ? [getAbsoluteUrl(seo.ogImage) || ""] : []),
    },
  };
}

export default async function DynamicPage({ params }: PageProps) {
  const resolvedParams = await params;
  const slug = resolvedParams.slug.join('/');

  await connectToDatabase();
  
  // Find the page in MongoDB
  const pageDoc = await Page.findOne({ 
    slug: slug, 
    status: 'published' 
  }).lean();

  if (!pageDoc) {
    // If no page found in DB, 404
    notFound();
  }

  // Convert to plain object to avoid Mongoose serialization issues in Client Components
  const page = JSON.parse(JSON.stringify(pageDoc));
  
  // Use manual schema if provided, otherwise generate automatically
  const schema = page.seo?.schemaData ? JSON.parse(page.seo.schemaData) : generateAutoSchema(page);

  // Use TemplateWrapper to handle local content context overrides
  const { TemplateWrapper } = await import('@/components/templates/TemplateRegistry');

  return (
    <main>
      <Script
        id="page-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
      <TemplateWrapper 
        templateName={page.template} 
        pageData={page} 
        params={resolvedParams} 
      />
    </main>
  );
}

// Generate static params for ISR/SSG optimization
export async function generateStaticParams() {
  try {
    await connectToDatabase();
    const pages = await Page.find({ status: 'published' }).select('slug');
    
    return pages.map((page: any) => ({
      slug: page.slug.split('/'),
    }));
  } catch (error) {
    console.error("Error generating static params:", error);
    return [];
  }
}
