import type { Metadata } from "next";
import servicesData from "../../../data/servicesData.json";

const BASE_URL = "https://www.eaglerevolution.com";

// SEO-optimized metadata map for each service slug
const seoMap: Record<string, { title: string; description: string; keywords: string[] }> = {
  "residential-roofing": {
    title: "Residential Roofing Services | Roof Replacement & Repair St. Louis, MO",
    description:
      "Professional residential roof replacement and repair in St. Louis, MO. 50-year warranty, Class 4 impact-resistant shingles, IKO & CertainTeed certified. Veteran-owned. Free inspection. Call 636-449-9714.",
    keywords: [
      "residential roofing St. Louis",
      "roof replacement St. Louis MO",
      "roof repair Missouri",
      "asphalt shingle installation",
      "storm damage roof repair St. Louis",
      "50 year roofing warranty",
      "best roofer St. Louis",
    ],
  },
  "commercial-roofing": {
    title: "Commercial Roofing Contractor | TPO & Flat Roof St. Louis, MO",
    description:
      "Expert commercial roofing in St. Louis, MO. TPO, EPDM flat roof systems with No Dollar Limit warranties. 5M+ sqft installed. 24/7 emergency response. Veteran-owned. Free estimate.",
    keywords: [
      "commercial roofing St. Louis",
      "TPO roofing contractor Missouri",
      "flat roof repair St. Louis MO",
      "EPDM roofing installation",
      "commercial roof replacement",
      "warehouse roofing contractor",
    ],
  },
  "siding-soffit-fascia": {
    title: "Siding, Soffit & Fascia Installation | St. Louis, MO",
    description:
      "Premium vinyl siding, soffit, and fascia installation in St. Louis, MO. 500+ color options, maintenance-free, insulated upgrade available. Veteran-owned contractor. Free estimate.",
    keywords: [
      "siding installation St. Louis",
      "vinyl siding contractor Missouri",
      "soffit and fascia repair St. Louis",
      "insulated siding installation",
      "exterior remodeling St. Louis MO",
      "aluminum fascia capping",
    ],
  },
  "windows-doors": {
    title: "Window & Door Replacement | Energy Star Rated | St. Louis, MO",
    description:
      "Energy Star rated window and door replacement in St. Louis, MO. Save up to 35% on energy bills. Custom vinyl & wood options. Sound-reducing insulation. Free estimate. Call 636-449-9714.",
    keywords: [
      "window replacement St. Louis",
      "energy efficient windows Missouri",
      "door installation St. Louis MO",
      "vinyl window contractor",
      "Low-E glass windows",
      "window installation near me",
    ],
  },
  "custom-decks": {
    title: "Custom Deck Builder | Composite & Wood Decks | St. Louis, MO",
    description:
      "Custom deck construction in St. Louis, MO. Premium composite and PVC decking with 25-year fade warranty. Pergolas, built-in lighting, and outdoor kitchens. Veteran-owned. Free 3D design.",
    keywords: [
      "custom deck builder St. Louis",
      "composite decking Missouri",
      "deck construction St. Louis MO",
      "outdoor living spaces",
      "Trex deck installer",
      "deck with pergola St. Louis",
    ],
  },
  "pvc-decking": {
    title: "PVC Decking Installation | Waterproof Decks | St. Louis, MO",
    description:
      "100% waterproof PVC decking installation in St. Louis, MO. Lifetime rot warranty, mold-proof, pool-ready design. Lighter and cooler than composite. Veteran-owned contractor.",
    keywords: [
      "PVC decking St. Louis",
      "waterproof deck Missouri",
      "pool deck installation St. Louis MO",
      "cellular PVC decking",
      "low maintenance deck",
      "AZEK deck installer",
    ],
  },
  "gutters-protection": {
    title: "Seamless Gutter Installation & Leaf Guards | St. Louis, MO",
    description:
      "Seamless aluminum gutter installation and micro-mesh leaf guard systems in St. Louis, MO. On-site fabrication, 6-inch capacity, zero-clog guarantee. Veteran-owned. Call 636-449-9714.",
    keywords: [
      "gutter installation St. Louis",
      "seamless gutters Missouri",
      "leaf guard installation St. Louis MO",
      "gutter replacement near me",
      "micro-mesh gutter guards",
      "6 inch seamless gutters",
    ],
  },
};

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const service = servicesData.services.find((s) => s.slug === slug);

  if (!service) {
    return {
      title: "Service Not Found",
      description: "The requested service page could not be found.",
    };
  }

  const seo = seoMap[slug];

  // Fallback metadata if slug isn't in the hardcoded map
  const title = seo?.title || `${service.title} Services | Eagle Revolution St. Louis, MO`;
  const description =
    seo?.description ||
    `Professional ${service.title.toLowerCase()} services in St. Louis, MO. ${service.description} Veteran-owned. Free estimate. Call 636-449-9714.`;
  const keywords = seo?.keywords || [
    `${service.title.toLowerCase()} St. Louis`,
    `${service.title.toLowerCase()} Missouri`,
    "Eagle Revolution",
    "veteran owned contractor",
  ];

  return {
    title,
    description,
    keywords,
    alternates: {
      canonical: `${BASE_URL}/services/${slug}`,
    },
    openGraph: {
      title,
      description,
      url: `${BASE_URL}/services/${slug}`,
      type: "website",
      siteName: "Eagle Revolution",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}

// Pre-generate all service pages at build time for optimal SEO
export async function generateStaticParams() {
  return servicesData.services.map((service) => ({
    slug: service.slug,
  }));
}

export default function ServiceDetailLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
