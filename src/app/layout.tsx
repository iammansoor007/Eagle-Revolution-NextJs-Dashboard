import type { Metadata } from "next";
import { Space_Grotesk, DM_Sans } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/Providers";
import SiteLayout from "@/components/SiteLayout";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-heading",
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-body",
});

const BASE_URL = "https://eagle-revolution.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  icons: {
    icon: `${BASE_URL}/eagle-logo.png`,
    apple: `${BASE_URL}/eagle-logo.png`,
  },

  // ── Core Meta Tags ──
  title: {
    default: "Eagle Revolution | #1 Roofing & Home Improvement in St. Louis, MO",
    template: "%s | Eagle Revolution",
  },
  description:
    "Veteran-owned roofing & home improvement company in St. Louis, MO. Expert residential & commercial roofing, siding, windows, decks & gutters. Free estimates. Call 636-449-9714.",
  keywords: [
    "roofing contractor St. Louis",
    "residential roofing Missouri",
    "commercial roofing St. Louis",
    "roof replacement St. Louis MO",
    "siding installation St. Louis",
    "window replacement Missouri",
    "custom decks St. Louis",
    "gutter installation St. Louis",
    "veteran owned roofing company",
    "Eagle Revolution",
    "home improvement St. Louis",
    "storm damage roof repair",
    "PVC decking Missouri",
    "soffit and fascia repair",
    "free roofing estimate St. Louis",
  ],
  authors: [{ name: "Eagle Revolution", url: BASE_URL }],
  creator: "Eagle Revolution",
  publisher: "Eagle Revolution",

  // ── Robots & Canonical ──
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: {
    canonical: BASE_URL,
  },

  // ── Open Graph (Facebook, LinkedIn) ──
  openGraph: {
    type: "website",
    locale: "en_US",
    url: BASE_URL,
    siteName: "Eagle Revolution",
    title: "Eagle Revolution | #1 Roofing & Home Improvement in St. Louis, MO",
    description:
      "Veteran-owned roofing & exterior remodeling experts serving the greater St. Louis area. Professional residential & commercial roofing, siding, windows, decks, and gutters. Free estimates available.",
    images: [
      {
        url: `${BASE_URL}/eagle-logo.png`,
        width: 1200,
        height: 630,
        alt: "Eagle Revolution – Veteran Owned Roofing & Home Improvement",
        type: "image/png",
      },
    ],
  },

  // ── Twitter Cards ──
  twitter: {
    card: "summary_large_image",
    title: "Eagle Revolution | #1 Roofing & Home Improvement in St. Louis, MO",
    description:
      "Veteran-owned roofing & home improvement company. Expert residential & commercial roofing, siding, windows, decks & gutters in St. Louis, MO.",
    images: [`${BASE_URL}/eagle-logo.png`],
    creator: "@EagleRevolution",
  },

  // ── Additional Meta ──
  category: "Home Improvement",
  verification: {
    // Add your verification codes here when you have them:
    // google: "your-google-verification-code",
    // yandex: "your-yandex-verification-code",
  },
  other: {
    "geo.region": "US-MO",
    "geo.placename": "St. Louis",
    "geo.position": "38.627003;-90.199404",
    ICBM: "38.627003, -90.199404",
    "format-detection": "telephone=yes",
    image: `${BASE_URL}/eagle-logo.png`,
  },
};

// JSON-LD Structured Data for the entire site (Organization + LocalBusiness)
const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": ["LocalBusiness", "RoofingContractor", "HomeAndConstructionBusiness"],
      "@id": `${BASE_URL}/#organization`,
      name: "Eagle Revolution",
      alternateName: "Eagle Revolution LLC",
      url: BASE_URL,
      logo: `${BASE_URL}/eagle-logo.png`,
      image: `${BASE_URL}/eagle-logo.png`,
      description:
        "Veteran-owned roofing and home improvement company providing expert residential and commercial roofing, siding, windows, decks, and gutter services in the greater St. Louis, Missouri area.",
      telephone: "+1-636-449-9714",
      email: "banderson@eaglerevolution.com",
      address: {
        "@type": "PostalAddress",
        streetAddress: "St. Louis Metropolitan Area",
        addressLocality: "St. Louis",
        addressRegion: "MO",
        postalCode: "63101",
        addressCountry: "US",
      },
      geo: {
        "@type": "GeoCoordinates",
        latitude: 38.627003,
        longitude: -90.199404,
      },
      areaServed: [
        {
          "@type": "City",
          name: "St. Louis",
          "@id": "https://en.wikipedia.org/wiki/St._Louis",
        },
        {
          "@type": "State",
          name: "Missouri",
        },
      ],
      priceRange: "$$",
      currenciesAccepted: "USD",
      paymentAccepted: "Cash, Credit Card, Financing Available",
      openingHoursSpecification: [
        {
          "@type": "OpeningHoursSpecification",
          dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
          opens: "07:00",
          closes: "19:00",
        },
        {
          "@type": "OpeningHoursSpecification",
          dayOfWeek: "Saturday",
          opens: "08:00",
          closes: "17:00",
        },
      ],
      sameAs: [
        "https://www.facebook.com/eaglerevolution",
        "https://www.instagram.com/eaglerevolution",
        "https://www.linkedin.com/company/eaglerevolution",
      ],
      hasOfferCatalog: {
        "@type": "OfferCatalog",
        name: "Home Improvement Services",
        itemListElement: [
          {
            "@type": "Offer",
            itemOffered: {
              "@type": "Service",
              name: "Residential Roofing",
              description: "Professional residential roof replacement, repair, and installation with 50-year manufacturer warranties.",
            },
          },
          {
            "@type": "Offer",
            itemOffered: {
              "@type": "Service",
              name: "Commercial Roofing",
              description: "TPO, EPDM, and flat-roof commercial roofing systems with No Dollar Limit warranties.",
            },
          },
          {
            "@type": "Offer",
            itemOffered: {
              "@type": "Service",
              name: "Siding, Soffit & Fascia",
              description: "Premium vinyl and composite siding installation with lifetime fade resistance.",
            },
          },
          {
            "@type": "Offer",
            itemOffered: {
              "@type": "Service",
              name: "Windows & Doors",
              description: "Energy Star rated window and door replacement with up to 35% energy savings.",
            },
          },
          {
            "@type": "Offer",
            itemOffered: {
              "@type": "Service",
              name: "Custom Decks",
              description: "Precision-crafted composite and PVC outdoor living spaces with 25-year warranties.",
            },
          },
          {
            "@type": "Offer",
            itemOffered: {
              "@type": "Service",
              name: "Gutters & Protection",
              description: "Seamless aluminum gutter fabrication and micro-mesh leaf guard installation.",
            },
          },
        ],
      },
      aggregateRating: {
        "@type": "AggregateRating",
        ratingValue: "4.9",
        reviewCount: "500",
        bestRating: "5",
        worstRating: "1",
      },
    },
    {
      "@type": "WebSite",
      "@id": `${BASE_URL}/#website`,
      url: BASE_URL,
      name: "Eagle Revolution",
      description: "Veteran-owned roofing & home improvement in St. Louis, MO.",
      publisher: {
        "@id": `${BASE_URL}/#organization`,
      },
      potentialAction: {
        "@type": "SearchAction",
        target: {
          "@type": "EntryPoint",
          urlTemplate: `${BASE_URL}/services?search={search_term_string}`,
        },
        "query-input": "required name=search_term_string",
      },
    },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* JSON-LD Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        {/* Preconnect to external origins for performance */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://images.unsplash.com" />
      </head>
      <body className={`${spaceGrotesk.variable} ${dmSans.variable} antialiased`}>
        <Providers>
          <div className="relative min-h-screen flex flex-col">
            {/* Common background grid for all pages */}
            <div className="fixed inset-0 pointer-events-none z-0 opacity-[0.03]">
              <div 
                className="absolute inset-0"
                style={{
                  backgroundImage: `
                    linear-gradient(to right, #2563eb 1px, transparent 1px),
                    linear-gradient(to bottom, #2563eb 1px, transparent 1px)
                  `,
                  backgroundSize: '80px 80px',
                }}
              />
            </div>
            
            <SiteLayout>{children}</SiteLayout>
          </div>
        </Providers>
      </body>
    </html>
  );
}
