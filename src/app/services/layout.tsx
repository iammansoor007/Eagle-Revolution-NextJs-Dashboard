import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Our Services | Roofing, Siding, Windows, Decks & Gutters",
  description:
    "Explore Eagle Revolution's full range of home improvement services in St. Louis, MO: residential & commercial roofing, siding, soffit & fascia, windows & doors, custom decks, PVC decking, and seamless gutters. Free estimates.",
  keywords: [
    "home improvement services St. Louis",
    "roofing services Missouri",
    "siding installation St. Louis MO",
    "window replacement services",
    "custom deck builder St. Louis",
    "gutter installation Missouri",
    "exterior remodeling contractor",
    "commercial roofing services St. Louis",
  ],
  alternates: {
    canonical: "https://www.eaglerevolution.com/services",
  },
  openGraph: {
    title: "Home Improvement Services | Eagle Revolution St. Louis",
    description:
      "Full-service roofing, siding, windows, decks & gutters. Veteran-owned contractor serving St. Louis, MO with military-grade craftsmanship.",
    url: "https://www.eaglerevolution.com/services",
    type: "website",
  },
};

export default function ServicesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
