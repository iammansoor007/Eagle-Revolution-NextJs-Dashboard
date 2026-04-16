import type { Metadata } from "next";

const BASE_URL = "https://eagle-revolution.vercel.app";

export const metadata: Metadata = {
  title:
    "All Services | Roofing, Decks, Siding, Windows & Gutters | Eagle Revolution St. Louis",
  description:
    "Explore Eagle Revolution's full range of expert home improvement services in St. Louis, MO: residential & commercial roofing, custom composite & PVC decks, vinyl siding, soffit & fascia, Energy Star windows & doors, and seamless gutter installation. Veteran-owned. Free estimates.",
  keywords: [
    // Services overview
    "home improvement services St. Louis MO",
    "exterior remodeling contractor Missouri",
    "roofing services St. Louis",
    "decking services St. Louis MO",
    "siding installation Missouri",
    "window replacement services St. Louis",
    "gutter installation St. Louis MO",
    "commercial roofing services Missouri",
    "residential roofing services St. Louis",
    "custom composite deck builder Missouri",
    "PVC decking contractor St. Louis",
    "soffit and fascia installation Missouri",
    // High intent
    "veteran owned home improvement company St. Louis",
    "best home improvement contractor St. Louis MO",
    "top rated exterior contractor Missouri",
    "licensed insured roofing contractor St. Louis",
    "free home improvement estimate St. Louis",
    "Eagle Revolution services",
    "roofing siding decks windows gutters St. Louis",
    "full service exterior contractor Missouri",
    // Local
    "home improvement contractor Chesterfield MO",
    "exterior contractor O'Fallon MO",
    "home renovation contractor Wildwood MO",
    "contractor St. Louis County MO",
    "St. Charles County contractor Missouri",
  ],
  alternates: {
    canonical: `${BASE_URL}/services`,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    title:
      "All Services | Roofing, Decks, Siding, Windows & Gutters | Eagle Revolution",
    description:
      "Full-service exterior remodeling — roofing, custom decks, siding, windows & gutters. Veteran-owned contractor serving St. Louis, MO with military-grade craftsmanship. Free estimates.",
    url: `${BASE_URL}/services`,
    type: "website",
    siteName: "Eagle Revolution",
    locale: "en_US",
    images: [
      {
        url: `${BASE_URL}/eagle-logo.png`,
        width: 1200,
        height: 630,
        alt: "Eagle Revolution – Home Improvement Services St. Louis MO",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Services | Eagle Revolution St. Louis MO",
    description:
      "Roofing, custom decks, siding, windows & gutters. Veteran-owned. Free estimates. Call 636-449-9714.",
    images: [`${BASE_URL}/eagle-logo.png`],
    creator: "@EagleRevolution",
  },
  other: {
    "geo.region": "US-MO",
    "geo.placename": "St. Louis, Missouri",
    "geo.position": "38.627003;-90.199404",
    ICBM: "38.627003, -90.199404",
  },
};

export default function ServicesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
