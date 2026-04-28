import type { Metadata } from "next";
import { Space_Grotesk, DM_Sans } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/Providers";
import SiteLayout from "@/components/SiteLayout";
import connectToDatabase from "@/lib/mongodb";
import SiteContent from "@/models/Content";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-heading",
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-body",
});

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "https://eagle-revolution.vercel.app";

export async function generateMetadata(): Promise<Metadata> {
  let settings = { siteTitle: "Eagle Revolution | #1 Roofing & Home Improvement in St. Louis, MO", siteTemplate: "%s | Eagle Revolution", favicon: "/eagle-logo.png" };
  
  try {
    await connectToDatabase();
    const content = await SiteContent.findOne({ key: 'complete_data' });
    if (content?.data?.settings) settings = content.data.settings;
  } catch (e) {
    console.error("Failed to fetch settings for metadata", e);
  }

  return {
    metadataBase: new URL(BASE_URL),
    icons: {
      icon: settings.favicon || `${BASE_URL}/eagle-logo.png`,
      apple: settings.favicon || `${BASE_URL}/eagle-logo.png`,
    },
    facebook: {
      appId: "YOUR_FB_APP_ID", // TODO: Replace with your actual Facebook App ID
    },
    title: {
      default: settings.siteTitle,
      template: settings.siteTemplate,
    },
    description:
      "Veteran-owned roofing & home improvement company in St. Louis, MO. Expert residential & commercial roofing, siding, windows, decks & gutters. Free estimates. Call 636-449-9714.",
    keywords: [
      // ── Brand ──
      "Eagle Revolution",
      "Eagle Revolution roofing",
      "Eagle Revolution St. Louis",
      "Eagle Revolution LLC",

      // ── Roofing – High Intent ──
      "roofing contractor St. Louis",
      "roofing company St. Louis MO",
      "roof replacement St. Louis MO",
      "residential roofing St. Louis",
      "residential roofing Missouri",
      "commercial roofing St. Louis",
      "commercial roofing Missouri",
      "roof repair St. Louis MO",
      "storm damage roof repair St. Louis",
      "hail damage roof repair Missouri",
      "emergency roof repair St. Louis",
      "roof replacement near me",
      "best roofing contractor St. Louis",
      "affordable roofing St. Louis MO",
      "free roofing estimate St. Louis",
      "roof inspection St. Louis MO",
      "architectural shingles St. Louis",
      "asphalt shingle roof replacement Missouri",
      "TPO roofing St. Louis",
      "EPDM flat roof commercial Missouri",
      "flat roof contractor St. Louis",
      "roof insurance claim help Missouri",
      "50 year warranty roof St. Louis",
      "IKO certified roofing contractor Missouri",
      "CertainTeed certified roofer St. Louis",

      // ── Decking ──
      "custom decks St. Louis",
      "deck builder St. Louis MO",
      "composite deck installation Missouri",
      "PVC decking Missouri",
      "PVC deck builder St. Louis",
      "outdoor deck contractor St. Louis",
      "low maintenance deck St. Louis",
      "pool deck builder Missouri",
      "pergola installation St. Louis",
      "deck with built-in lighting St. Louis",
      "backyard deck builder near me",
      "deck replacement St. Louis MO",
      "Trex deck installer Missouri",
      "composite vs PVC decking St. Louis",

      // ── Siding ──
      "siding installation St. Louis",
      "vinyl siding contractor St. Louis MO",
      "siding replacement Missouri",
      "soffit and fascia repair St. Louis",
      "soffit and fascia replacement Missouri",
      "insulated siding St. Louis",
      "exterior siding contractor near me",
      "home siding company St. Louis MO",
      "siding and roofing contractor St. Louis",
      "fiber cement siding Missouri",
      "board and batten siding installer St. Louis",
      "aluminum fascia capping Missouri",

      // ── Windows & Doors ──
      "window replacement St. Louis",
      "window replacement Missouri",
      "energy efficient windows St. Louis MO",
      "Energy Star window installation Missouri",
      "door replacement St. Louis",
      "entry door installation Missouri",
      "window and door contractor St. Louis",
      "double pane window replacement Missouri",
      "low-E window installer St. Louis",
      "window replacement near me",
      "home window upgrade St. Louis MO",

      // ── Gutters ──
      "gutter installation St. Louis",
      "seamless gutter contractor Missouri",
      "gutter replacement St. Louis MO",
      "leaf guard installation Missouri",
      "gutter protection St. Louis",
      "gutter cleaning and repair St. Louis",
      "6-inch gutter installer Missouri",
      "micro mesh gutter guard St. Louis",
      "seamless aluminum gutters near me",
      "gutter and downspout replacement Missouri",

      // ── General Home Improvement ──
      "home improvement contractor St. Louis",
      "exterior remodeling St. Louis MO",
      "veteran owned home improvement St. Louis",
      "veteran owned roofing company",
      "home exterior contractor Missouri",
      "licensed and insured contractor St. Louis MO",
      "best home improvement company St. Louis",
      "exterior home renovation Missouri",
      "St. Louis home contractor free estimate",
      "roofing siding windows decks gutters St. Louis",

      // ── Local Area Targeting ──
      "roofing contractor Chesterfield MO",
      "roofing contractor Wildwood MO",
      "roofing contractor Ballwin MO",
      "roofing contractor Kirkwood MO",
      "roofing contractor Webster Groves MO",
      "roofing contractor O'Fallon MO",
      "roofing contractor St. Charles MO",
      "contractor St. Louis County",
      "home improvement St. Louis County MO",
      "deck builder Chesterfield MO",
      "deck builder Wildwood MO",
      "deck builder Ballwin MO",
      "deck builder Kirkwood MO",
      "deck builder O'Fallon MO",
      "deck contractor St. Charles MO",

      // ── Roofing – Questions & Informational Searches ──
      "what is a roofing warranty",
      "how long does a roof last",
      "how long does a roof replacement take",
      "when should I replace my roof",
      "signs I need a new roof",
      "how do I know if my roof is damaged",
      "what does a roof inspection include",
      "how much does a roof replacement cost",
      "how much does a new roof cost in Missouri",
      "average cost of roofing in St. Louis",
      "what is a 50 year roof warranty",
      "what is a class 4 impact resistant shingle",
      "what is architectural shingles vs 3 tab",
      "composite shingles vs asphalt",
      "how to file a roof insurance claim",
      "will insurance cover roof replacement",
      "does homeowners insurance cover storm damage roof",
      "how long does it take to get roof approved by insurance",
      "what is TPO roofing",
      "what is EPDM roofing",
      "TPO vs EPDM flat roof",
      "flat roof vs pitched roof",
      "how to stop roof from leaking",
      "roof leaking after heavy rain",
      "my roof is leaking what do I do",
      "how often should a roof be inspected",
      "roof inspection after hail storm",
      "how to tell if hail damaged your roof",
      "does hail damage require roof replacement",
      "what wind speed damages a roof",
      "when do storms hit Missouri",
      "Missouri storm season roofing",
      "St. Louis tornado season roofing",
      "hail season St. Louis Missouri",
      "spring storm roof damage Missouri",
      "what is ice dam on roof",
      "how to prevent ice dams Missouri",
      "ridge vent vs box vent roofing",
      "what is roof decking",
      "what is drip edge roofing",
      "what is flashing on a roof",
      "how many layers of shingles can I have",
      "tear off vs overlay roofing",
      "what is a soffit and fascia",
      "why is my fascia rotting",
      "what is attic ventilation roofing",

      // ── Decking – Questions & Informational Searches ──
      "how much does a deck cost",
      "average cost of deck installation Missouri",
      "how much does composite decking cost",
      "composite decking vs PVC decking which is better",
      "what is the best decking material",
      "how long does composite decking last",
      "how long does PVC decking last",
      "does composite decking get hot in summer",
      "does composite decking fade",
      "does composite decking warp",
      "best low maintenance deck material",
      "does PVC decking need to be painted",
      "how to clean composite decking",
      "what is cellular PVC decking",
      "Trex vs Azek decking comparison",
      "what size deck do I need",
      "how long does it take to build a deck",
      "do I need a permit to build a deck in Missouri",
      "deck permit requirements St. Louis",
      "how deep should deck footings be Missouri",
      "frost line deck footings Missouri",
      "what is the best wood for deck framing",
      "can you build a deck over concrete",
      "how to attach deck to house",
      "what is a floating deck vs attached deck",
      "deck railing ideas and designs",
      "built in lighting for deck ideas",
      "outdoor kitchen deck St. Louis",
      "pergola vs gazebo deck addition",
      "how to winterize a composite deck",
      "deck maintenance tips Missouri",
      "how to increase home value with a deck",
      "does a deck add value to my home",
      "return on investment deck addition",

      // ── 🏆 Competitor Displacement ("Best / Top / #1") ──
      "best roofer near me",
      "top rated roofing company St. Louis",
      "number one roofing contractor Missouri",
      "highest rated roofer St. Louis MO",
      "best deck builder near me",
      "top rated deck contractor St. Louis",
      "award winning roofing company Missouri",
      "most trusted roofing contractor St. Louis",
      "5 star roofing company St. Louis",
      "five star deck builder Missouri",
      "Google rated roofing company St. Louis",
      "BBB accredited roofing contractor Missouri",
      "best reviewed home improvement company St. Louis",

      // ── 🚨 Emergency & Urgent Keywords ──
      "emergency roof repair near me",
      "emergency roof repair St. Louis MO",
      "same day roof repair St. Louis",
      "roof leaking right now what to do",
      "24 hour roofing contractor Missouri",
      "storm damage emergency roof repair",
      "urgent roof repair after storm",
      "roof tarp installation St. Louis",
      "roof collapse repair Missouri",
      "water damage roof repair St. Louis",
      "roof repair after tornado Missouri",
      "emergency roofer call now St. Louis",

      // ── 💰 Financing & Affordability Keywords ──
      "roof financing St. Louis MO",
      "no money down roof replacement Missouri",
      "roof replacement payment plans",
      "affordable deck installation St. Louis",
      "deck financing options Missouri",
      "home improvement financing St. Louis",
      "zero percent roofing financing Missouri",
      "pay monthly roof replacement St. Louis",
      "low interest home improvement loan Missouri",
      "insurance pays for roof replacement",
      "roof replacement with no out of pocket cost",

      // ── 🎙️ Voice Search & Conversational Queries ──
      "who is the best roofer in St. Louis",
      "where can I find a roofer near me",
      "how do I find a good roofing contractor",
      "find a deck builder near me",
      "who builds composite decks near me",
      "which roofing company is best in Missouri",
      "is Eagle Revolution a good roofing company",
      "what roofing company is near me",
      "call a roofer St. Louis Missouri",
      "get a free roof estimate near me",
      "how do I get a free roofing quote",

      // ── ⭐ Reviews & Reputation Keywords ──
      "Eagle Revolution reviews",
      "Eagle Revolution roofing reviews",
      "roofing company reviews St. Louis",
      "best reviewed roofer St. Louis MO",
      "deck builder reviews Missouri",
      "composite deck contractor reviews St. Louis",
      "roofing contractor Google reviews Missouri",
      "home improvement company reviews St. Louis",
      "trusted roofing contractor St. Louis",
      "reliable roofing company Missouri",
      "verified roofing contractor St. Louis MO",

      // ── 🗓️ Seasonal / Before & After Storm ──
      "spring roof inspection St. Louis",
      "fall roof inspection Missouri",
      "winter roof damage repair St. Louis",
      "summer deck installation St. Louis",
      "post storm roof inspection Missouri",
      "after hailstorm roof check St. Louis",
      "roof check after tornado Missouri",
      "annual roof maintenance St. Louis",
      "pre-winter roof inspection MO",
      "spring deck installation Missouri",
      "summer composite deck builder St. Louis",
      "deck building season Missouri",
      "when is the best time to replace a roof",
      "best time to build a deck Missouri",
      "off-season roofing discount St. Louis",

      // ── 🏠 Insurance & Claims ──
      "roof insurance claim St. Louis",
      "hail claim roof replacement Missouri",
      "storm damage insurance claim roofing",
      "file roof claim after hail Missouri",
      "public adjuster roofing St. Louis",
      "insurance approved roofer Missouri",
      "supplement roof claim St. Louis",
      "insurance supplementing contractor Missouri",
      "wind damage insurance claim roof Missouri",
      "will insurance pay for my roof",
      "how to get a new roof through insurance",
      "roofing contractor works with insurance Missouri",

      // ── 🔍 Comparison Shopping Keywords ──
      "roofing quotes St. Louis MO",
      "multiple roofing estimates St. Louis",
      "roof replacement quote comparison Missouri",
      "free deck estimate St. Louis MO",
      "compare deck builders St. Louis",
      "roofing cost estimate Missouri",
      "deck cost estimate St. Louis",
      "get three roofing quotes St. Louis",
      "roofing bid St. Louis MO",
      "deck construction quote Missouri",

      // ── 🏘️ Hyper-Local Suburb Stacking ──
      "roofing contractor Creve Coeur MO",
      "roofing contractor Ladue MO",
      "roofing contractor Town and Country MO",
      "roofing contractor Des Peres MO",
      "roofing contractor Crestwood MO",
      "roofing contractor Sunset Hills MO",
      "roofing contractor High Ridge MO",
      "roofing contractor Wentzville MO",
      "roofing contractor Lake St. Louis MO",
      "roofing contractor Hillsboro MO",
      "deck builder Creve Coeur MO",
      "deck builder Ladue MO",
      "deck builder Town and Country MO",
      "deck builder Wentzville MO",
      "deck builder Festus MO",
      "composite deck Chesterfield MO",
      "composite deck O'Fallon MO",
      "roofing Missouri 63017",
      "roofing Missouri 63011",
      "roofing Missouri 63025",
      "roofing Missouri 63301",

      // ── 🔧 Roofing Materials & Brands ──
      "Owens Corning Duration shingles installer",
      "GAF Timberline HDZ installer St. Louis",
      "IKO Dynasty shingles Missouri",
      "CertainTeed Landmark shingles St. Louis",
      "Atlas Pinnacle shingles installer MO",
      "Malarkey Vista shingles Missouri",
      "dimensional shingles St. Louis",
      "metal roofing St. Louis MO",
      "standing seam metal roof Missouri",
      "steel roofing contractor St. Louis",
      "Class 4 Hail resistant shingles Missouri",
      "impact resistant roofing St. Louis",
      "ice and water shield installation MO",
      "synthetic underlayment roofing Missouri",
      "roof decking OSB replacement St. Louis",

      // ── 🪵 Decking Materials & Brands ──
      "Trex Transcend decking St. Louis",
      "Trex Select decking Missouri",
      "Azek TimberTech decking installer St. Louis",
      "Fiberon decking contractor Missouri",
      "Deckorators composite decking St. Louis",
      "MoistureShield decking Missouri",
      "hidden fastener deck system St. Louis",
      "Cortex hidden screw decking Missouri",
      "Trex RainEscape under deck system St. Louis",
      "multi-level deck builder Missouri",
      "wraparound deck design St. Louis",
      "floating deck vs attached deck Missouri",
      "deck addition outdoor living St. Louis",
      "covered deck builder Missouri",
      "screened deck enclosure St. Louis",
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
      title: settings.siteTitle,
      description:
        "Veteran-owned roofing & exterior remodeling experts serving the greater St. Louis area. Professional residential & commercial roofing, siding, windows, decks, and gutters. Free estimates available.",
      images: [
        {
          url: settings.favicon || `${BASE_URL}/eagle-logo.png`,
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
      title: settings.siteTitle,
      description:
        "Veteran-owned roofing & home improvement company. Expert residential & commercial roofing, siding, windows, decks & gutters in St. Louis, MO.",
      images: [settings.favicon || `${BASE_URL}/eagle-logo.png`],
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
      // ── Geo Signals ──
      "geo.region": "US-MO",
      "geo.placename": "St. Louis, Missouri",
      "geo.position": "38.627003;-90.199404",
      ICBM: "38.627003, -90.199404",

      // ── Contact & Business ──
      "format-detection": "telephone=yes",
      "contact": "banderson@eaglerevolution.com",
      "phone": "+1-636-449-9714",
      image: settings.favicon || `${BASE_URL}/eagle-logo.png`,

      // ── Dublin Core (Extra credibility signals) ──
      "DC.title": "Eagle Revolution | Roofing & Decking St. Louis MO",
      "DC.description": "Veteran-owned roofing and custom deck contractor serving St. Louis, MO and surrounding areas.",
      "DC.subject": "Roofing, Decking, Home Improvement, St. Louis Missouri",
      "DC.language": "en-US",
      "DC.coverage": "St. Louis, Missouri, United States",
      "DC.creator": "Eagle Revolution LLC",
      "DC.publisher": "Eagle Revolution",
      "DC.rights": `Copyright ${new Date().getFullYear()} Eagle Revolution LLC`,
      "DC.type": "Service",

      // ── Business Classification ──
      "business:contact_data:street_address": "St. Louis Metropolitan Area",
      "business:contact_data:locality": "St. Louis",
      "business:contact_data:region": "Missouri",
      "business:contact_data:postal_code": "63101",
      "business:contact_data:country_name": "United States",
      "business:contact_data:phone_number": "+1-636-449-9714",
      "business:contact_data:website": BASE_URL,

      // ── Revisit & Cache ──
      revisit: "7 days",
      "revisit-after": "7 days",
      "content-rating": "General",
      language: "English",
      distribution: "Global",
      target: "all",
      HandheldFriendly: "True",
      MobileOptimized: "320",
    },
  };
}

// ── 1. LocalBusiness + Organization JSON-LD ──
const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": ["LocalBusiness", "RoofingContractor", "HomeAndConstructionBusiness", "GeneralContractor"],
      "@id": `${BASE_URL}/#organization`,
      name: "Eagle Revolution",
      alternateName: ["Eagle Revolution LLC", "Eagle Revolution Roofing", "Eagle Revolution Decks"],
      url: BASE_URL,
      logo: {
        "@type": "ImageObject",
        url: `${BASE_URL}/eagle-logo.png`,
        width: 400,
        height: 400,
      },
      image: `${BASE_URL}/eagle-logo.png`,
      description:
        "Veteran-owned roofing and home improvement company providing expert residential and commercial roofing, custom composite and PVC decks, siding, windows, and gutter services in the greater St. Louis, Missouri area. Free estimates available.",
      slogan: "Precision. Protection. Pride.",
      foundingDate: "2015",
      numberOfEmployees: { "@type": "QuantitativeValue", value: 25 },
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
        { "@type": "City", name: "St. Louis", "@id": "https://en.wikipedia.org/wiki/St._Louis" },
        { "@type": "AdministrativeArea", name: "St. Louis County" },
        { "@type": "AdministrativeArea", name: "St. Charles County" },
        { "@type": "City", name: "Chesterfield", containedInPlace: { "@type": "State", name: "Missouri" } },
        { "@type": "City", name: "Wildwood", containedInPlace: { "@type": "State", name: "Missouri" } },
        { "@type": "City", name: "Ballwin", containedInPlace: { "@type": "State", name: "Missouri" } },
        { "@type": "City", name: "Kirkwood", containedInPlace: { "@type": "State", name: "Missouri" } },
        { "@type": "City", name: "Webster Groves", containedInPlace: { "@type": "State", name: "Missouri" } },
        { "@type": "City", name: "O'Fallon", containedInPlace: { "@type": "State", name: "Missouri" } },
        { "@type": "City", name: "St. Charles", containedInPlace: { "@type": "State", name: "Missouri" } },
        { "@type": "City", name: "Florissant", containedInPlace: { "@type": "State", name: "Missouri" } },
        { "@type": "City", name: "Fenton", containedInPlace: { "@type": "State", name: "Missouri" } },
        { "@type": "City", name: "Arnold", containedInPlace: { "@type": "State", name: "Missouri" } },
        { "@type": "City", name: "Manchester", containedInPlace: { "@type": "State", name: "Missouri" } },
        { "@type": "City", name: "Eureka", containedInPlace: { "@type": "State", name: "Missouri" } },
        { "@type": "City", name: "Creve Coeur", containedInPlace: { "@type": "State", name: "Missouri" } },
        { "@type": "City", name: "Ladue", containedInPlace: { "@type": "State", name: "Missouri" } },
        { "@type": "City", name: "Town and Country", containedInPlace: { "@type": "State", name: "Missouri" } },
        { "@type": "City", name: "Des Peres", containedInPlace: { "@type": "State", name: "Missouri" } },
        { "@type": "City", name: "Crestwood", containedInPlace: { "@type": "State", name: "Missouri" } },
        { "@type": "City", name: "Sunset Hills", containedInPlace: { "@type": "State", name: "Missouri" } },
        { "@type": "City", name: "Wentzville", containedInPlace: { "@type": "State", name: "Missouri" } },
        { "@type": "City", name: "Lake St. Louis", containedInPlace: { "@type": "State", name: "Missouri" } },
        { "@type": "City", name: "Hillsboro", containedInPlace: { "@type": "State", name: "Missouri" } },
        { "@type": "City", name: "Festus", containedInPlace: { "@type": "State", name: "Missouri" } },
        { "@type": "State", name: "Missouri" },
      ],
      priceRange: "$$",
      currenciesAccepted: "USD",
      paymentAccepted: "Cash, Credit Card, Check, Financing Available",
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
        name: "Roofing & Home Improvement Services St. Louis MO",
        itemListElement: [
          {
            "@type": "Offer",
            name: "Residential Roof Replacement",
            description: "Complete residential roof replacement with 50-year manufacturer warranty. Free inspection included.",
            areaServed: "St. Louis, MO",
            itemOffered: { "@type": "Service", name: "Residential Roofing", serviceType: "Roofing" },
          },
          {
            "@type": "Offer",
            name: "Commercial Roofing Systems",
            description: "TPO, EPDM, and flat-roof commercial roofing with No Dollar Limit (NDL) warranties.",
            areaServed: "St. Louis, MO",
            itemOffered: { "@type": "Service", name: "Commercial Roofing", serviceType: "Commercial Roofing" },
          },
          {
            "@type": "Offer",
            name: "Custom Composite & PVC Deck Building",
            description: "Precision-crafted composite and PVC outdoor living decks with 50-year fade warranty. Free 3D design included.",
            areaServed: "St. Louis, MO",
            itemOffered: { "@type": "Service", name: "Custom Decks", serviceType: "Deck Construction" },
          },
          {
            "@type": "Offer",
            name: "Vinyl Siding & Soffit Installation",
            description: "Premium vinyl and composite siding with lifetime fade resistance and unlimited wind warranty.",
            areaServed: "St. Louis, MO",
            itemOffered: { "@type": "Service", name: "Siding, Soffit & Fascia", serviceType: "Siding" },
          },
          {
            "@type": "Offer",
            name: "Energy-Efficient Window & Door Replacement",
            description: "Energy Star certified window and entry door installation with up to 35% energy savings.",
            areaServed: "St. Louis, MO",
            itemOffered: { "@type": "Service", name: "Windows & Doors", serviceType: "Window Replacement" },
          },
          {
            "@type": "Offer",
            name: "Seamless Gutter Installation & Leaf Guards",
            description: "On-site fabricated seamless 6-inch aluminum gutters with micro-mesh leaf protection.",
            areaServed: "St. Louis, MO",
            itemOffered: { "@type": "Service", name: "Gutters & Protection", serviceType: "Gutter Installation" },
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
      founder: { "@id": `${BASE_URL}/#founder` },
    },
    {
      "@type": "WebSite",
      "@id": `${BASE_URL}/#website`,
      url: BASE_URL,
      name: "Eagle Revolution",
      description: "Veteran-owned roofing & custom deck contractor in St. Louis, MO.",
      publisher: { "@id": `${BASE_URL}/#organization` },
      potentialAction: {
        "@type": "SearchAction",
        target: { "@type": "EntryPoint", urlTemplate: `${BASE_URL}/services?search={search_term_string}` },
        "query-input": "required name=search_term_string",
      },
    },
  ],
};

// ── 2. Person / Founder Schema ── (Veteran-owned trust signal)
const founderJsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  "@id": `${BASE_URL}/#founder`,
  name: "B. Anderson",
  jobTitle: "Founder & CEO",
  description: "U.S. Military veteran and founder of Eagle Revolution, a veteran-owned roofing and home improvement contractor serving St. Louis, Missouri.",
  worksFor: { "@id": `${BASE_URL}/#organization` },
  url: BASE_URL,
  email: "banderson@eaglerevolution.com",
  telephone: "+1-636-449-9714",
  address: {
    "@type": "PostalAddress",
    addressLocality: "St. Louis",
    addressRegion: "MO",
    addressCountry: "US",
  },
  knowsAbout: [
    "Residential Roofing",
    "Commercial Roofing",
    "Composite Decking",
    "PVC Decking",
    "Siding Installation",
    "Window Replacement",
    "Seamless Gutters",
    "Storm Damage Repair",
    "Home Improvement",
    "Construction Project Management",
  ],
};

// ── 3. FAQPage Schema ── (Triggers "People Also Ask" boxes on Google)
const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    // Roofing FAQs
    {
      "@type": "Question",
      name: "How long does a roof replacement take?",
      acceptedAnswer: { "@type": "Answer", text: "Most residential roof replacements in St. Louis are completed in just 1–2 days by Eagle Revolution's disciplined crews. Commercial projects may take longer depending on square footage." },
    },
    {
      "@type": "Question",
      name: "What is a roofing warranty and what does it cover?",
      acceptedAnswer: { "@type": "Answer", text: "A roofing warranty has two parts: a manufacturer warranty covering materials (up to 50 years with premium shingles) and a workmanship warranty covering labor. Eagle Revolution offers industry-leading fully transferable 50-year manufacturer warranties on premium installations." },
    },
    {
      "@type": "Question",
      name: "Will my homeowners insurance cover storm or hail damage to my roof?",
      acceptedAnswer: { "@type": "Answer", text: "Most standard homeowners insurance policies cover sudden storm and hail damage. Eagle Revolution works directly with insurance adjusters to document damage and help you get fully covered for a complete roof replacement at no out-of-pocket cost to you." },
    },
    {
      "@type": "Question",
      name: "How do I know if my roof has hail damage?",
      acceptedAnswer: { "@type": "Answer", text: "Signs of hail damage include dents on gutters or downspouts, bruised or cracked shingles, granule loss exposing the asphalt mat, and damaged roof vents. Eagle Revolution offers free drone-assisted roof inspections to accurately assess storm damage." },
    },
    {
      "@type": "Question",
      name: "When is storm season in St. Louis, Missouri?",
      acceptedAnswer: { "@type": "Answer", text: "St. Louis experiences its most severe storm activity from April through June, with hail storms peaking in May and June. Tornado-producing supercell storms are most common during spring. We recommend a professional roof inspection after every major storm." },
    },
    {
      "@type": "Question",
      name: "What is the difference between TPO and EPDM commercial roofing?",
      acceptedAnswer: { "@type": "Answer", text: "TPO (Thermoplastic Polyolefin) is a white, heat-reflective membrane welded with hot air for superior seam strength — ideal for energy efficiency. EPDM (rubber) is highly impact-resistant and durable but absorbs heat. Eagle Revolution recommends TPO for most commercial buildings in St. Louis due to its energy savings and seam integrity." },
    },
    {
      "@type": "Question",
      name: "Do you tear off old shingles or roof over them?",
      acceptedAnswer: { "@type": "Answer", text: "Eagle Revolution always performs a complete tear-off of old roofing material. We never roof over existing shingles because doing so hides structural damage, voids manufacturer warranties, and results in a shorter-lasting roof. We inspect and replace any compromised plywood decking." },
    },
    {
      "@type": "Question",
      name: "How much does a roof replacement cost in St. Louis?",
      acceptedAnswer: { "@type": "Answer", text: "The average cost of a residential roof replacement in St. Louis ranges from $8,000 to $20,000+ depending on home size, pitch, materials, and labor. Eagle Revolution offers free, no-obligation estimates. Contact us at 636-449-9714 for an accurate quote." },
    },
    // Decking FAQs
    {
      "@type": "Question",
      name: "What is the best decking material: composite or PVC?",
      acceptedAnswer: { "@type": "Answer", text: "Both are excellent low-maintenance options. Composite decking blends wood fibers and plastic for a natural look and is heavier. Cellular PVC is 100% polymer — fully waterproof, lighter, and available in brighter colors, making it ideal for pool decks or shaded areas. Eagle Revolution offers both with free 3D design consultations." },
    },
    {
      "@type": "Question",
      name: "How long does composite decking last?",
      acceptedAnswer: { "@type": "Answer", text: "Premium composite decking typically lasts 25–30 years with minimal maintenance. Eagle Revolution installs capped composite products backed by 50-year fade and stain warranties. Unlike wood, composite never needs staining, sealing, or painting." },
    },
    {
      "@type": "Question",
      name: "How much does a composite deck cost in St. Louis?",
      acceptedAnswer: { "@type": "Answer", text: "A custom composite deck in St. Louis typically costs between $15,000 and $45,000 depending on size, materials, railings, and built-in features like lighting or pergolas. Eagle Revolution provides free design consultations and detailed quotes with no obligation." },
    },
    {
      "@type": "Question",
      name: "Do I need a permit to build a deck in Missouri?",
      acceptedAnswer: { "@type": "Answer", text: "Yes, most Missouri municipalities require a building permit for decks attached to the home or over a certain size. Eagle Revolution handles the entire permitting process — from rendering blueprints to meeting city inspectors — so you don't have to worry about it." },
    },
    {
      "@type": "Question",
      name: "Does composite or PVC decking get hot in the summer?",
      acceptedAnswer: { "@type": "Answer", text: "Some composite colors can get warm in direct summer sun. Eagle Revolution recommends lighter-colored PVC decking or composite products featuring cool-touch heat-mitigating technology for pool areas and sunny decks, keeping surfaces comfortable even in July heat." },
    },
    {
      "@type": "Question",
      name: "Does adding a deck increase my home's value?",
      acceptedAnswer: { "@type": "Answer", text: "Yes — a professionally built composite deck can return 60–80% of its cost at resale and significantly increases your home's marketability. It also expands your usable living space and enhances curb appeal, making it one of the highest-ROI home improvements available." },
    },
    // Insurance & Financing FAQs
    {
      "@type": "Question",
      name: "Can I get a roof replacement with no money out of pocket?",
      acceptedAnswer: { "@type": "Answer", text: "In many cases, yes. If your roof sustained storm or hail damage, your homeowners insurance policy may cover 100% of the replacement cost (minus your deductible). Eagle Revolution works directly with your insurance company, documents all damage, and guides you through every step of the claims process." },
    },
    {
      "@type": "Question",
      name: "Do you offer roofing financing?",
      acceptedAnswer: { "@type": "Answer", text: "Yes. Eagle Revolution offers flexible financing options including low-interest and zero-percent payment plans so you can protect your home without a large upfront payment. Contact us at 636-449-9714 to learn about current financing programs available in St. Louis." },
    },
    {
      "@type": "Question",
      name: "What should I do if my roof is leaking right now?",
      acceptedAnswer: { "@type": "Answer", text: "If your roof is actively leaking, first move valuables away from the affected area and place a bucket to catch water. Do not attempt to go on the roof yourself. Call Eagle Revolution immediately at 636-449-9714. We provide emergency roof tarping and repair services in the St. Louis area to stop water intrusion fast." },
    },
    {
      "@type": "Question",
      name: "How often should I have my roof inspected in Missouri?",
      acceptedAnswer: { "@type": "Answer", text: "Missouri homeowners should schedule a professional roof inspection at least once per year — ideally in spring after winter and again in fall before cold weather. Additionally, always request an inspection after any major storm event with high winds, hail, or heavy snow. Eagle Revolution offers free drone-assisted inspections." },
    },
    {
      "@type": "Question",
      name: "What is the difference between Trex and Azek decking?",
      acceptedAnswer: { "@type": "Answer", text: "Trex is a wood-composite blend offering a natural look at a competitive price point, while Azek (TimberTech) is made of 100% cellular PVC — fully waterproof, lighter, and available in brighter colors. Both carry 25–50 year warranties. Eagle Revolution installs both brands and can help you choose based on your environment, budget, and aesthetic goals." },
    },
    {
      "@type": "Question",
      name: "Do you serve Chesterfield, O'Fallon, and other St. Louis suburbs?",
      acceptedAnswer: { "@type": "Answer", text: "Absolutely. Eagle Revolution serves the entire greater St. Louis metropolitan area including Chesterfield, Wildwood, Ballwin, Kirkwood, O'Fallon, St. Charles, Florissant, Creve Coeur, Ladue, Town and Country, Wentzville, Fenton, Arnold, and many more. Call 636-449-9714 to schedule a free estimate in your area." },
    },
    {
      "@type": "Question",
      name: "Is Eagle Revolution a veteran-owned company?",
      acceptedAnswer: { "@type": "Answer", text: "Yes. Eagle Revolution was founded by a U.S. Military veteran who brings military-grade discipline, precision, and integrity to every roofing and decking project. We are proud to be a veteran-owned small business serving the St. Louis, Missouri community." },
    },
    {
      "@type": "Question",
      name: "What is the best time of year to replace a roof in St. Louis?",
      acceptedAnswer: { "@type": "Answer", text: "Late spring (May–June) and early fall (September–October) are ideal for roof replacements in St. Louis. Temperatures are moderate and dry weather allows for optimal adhesive sealing of shingles. However, Eagle Revolution works year-round and can safely install roofs in most Missouri weather conditions." },
    },
    {
      "@type": "Question",
      name: "What is the best time to build a deck in Missouri?",
      acceptedAnswer: { "@type": "Answer", text: "Spring (April–May) and early summer are the most popular times to build a deck in Missouri, as the weather is ideal and you'll have the full summer to enjoy it. However, booking in winter or early spring often means faster scheduling and potential off-season pricing. Eagle Revolution builds decks year-round in the St. Louis area." },
    },
  ],
};

// ── 4. Service Schema for Roofing ──
const roofingServiceJsonLd = {
  "@context": "https://schema.org",
  "@type": "Service",
  "@id": `${BASE_URL}/services/residential-roofing/#service`,
  name: "Residential Roofing St. Louis MO",
  alternateName: "Roof Replacement St. Louis",
  serviceType: "Residential Roofing",
  provider: { "@id": `${BASE_URL}/#organization` },
  areaServed: { "@type": "State", name: "Missouri" },
  description: "Expert residential roof replacement, repair, and storm damage restoration in St. Louis, MO. Architectural asphalt shingles with 50-year manufacturer warranties. Free drone inspections and insurance claim assistance.",
  url: `${BASE_URL}/services/residential-roofing`,
  image: `${BASE_URL}/eagle-logo.png`,
  offers: {
    "@type": "Offer",
    priceCurrency: "USD",
    priceSpecification: { "@type": "PriceSpecification", priceCurrency: "USD", minPrice: "8000", maxPrice: "25000" },
    availability: "https://schema.org/InStock",
    validFrom: "2024-01-01",
  },
  hasOfferCatalog: {
    "@type": "OfferCatalog",
    name: "Roofing Services",
    itemListElement: [
      { "@type": "Offer", itemOffered: { "@type": "Service", name: "Roof Replacement" } },
      { "@type": "Offer", itemOffered: { "@type": "Service", name: "Storm Damage Roof Repair" } },
      { "@type": "Offer", itemOffered: { "@type": "Service", name: "Hail Damage Roof Repair" } },
      { "@type": "Offer", itemOffered: { "@type": "Service", name: "Free Roof Inspection" } },
      { "@type": "Offer", itemOffered: { "@type": "Service", name: "Insurance Claim Assistance" } },
    ],
  },
  aggregateRating: { "@type": "AggregateRating", ratingValue: "4.9", reviewCount: "500", bestRating: "5" },
};

// ── 5. Service Schema for Decking ──
const deckingServiceJsonLd = {
  "@context": "https://schema.org",
  "@type": "Service",
  "@id": `${BASE_URL}/services/custom-decks/#service`,
  name: "Custom Composite & PVC Deck Builder St. Louis MO",
  alternateName: "Deck Installation St. Louis",
  serviceType: "Deck Construction",
  provider: { "@id": `${BASE_URL}/#organization` },
  areaServed: { "@type": "State", name: "Missouri" },
  description: "Custom outdoor living deck design and construction in St. Louis, MO. Premium composite and PVC decking with 50-year warranties. Free 3D CAD design, permit handling, and built-in lighting available.",
  url: `${BASE_URL}/services/custom-decks`,
  image: `${BASE_URL}/eagle-logo.png`,
  offers: {
    "@type": "Offer",
    priceCurrency: "USD",
    priceSpecification: { "@type": "PriceSpecification", priceCurrency: "USD", minPrice: "15000", maxPrice: "50000" },
    availability: "https://schema.org/InStock",
    validFrom: "2024-01-01",
  },
  hasOfferCatalog: {
    "@type": "OfferCatalog",
    name: "Decking Services",
    itemListElement: [
      { "@type": "Offer", itemOffered: { "@type": "Service", name: "Composite Deck Installation" } },
      { "@type": "Offer", itemOffered: { "@type": "Service", name: "PVC Deck Installation" } },
      { "@type": "Offer", itemOffered: { "@type": "Service", name: "Pool Deck Construction" } },
      { "@type": "Offer", itemOffered: { "@type": "Service", name: "Pergola Installation" } },
      { "@type": "Offer", itemOffered: { "@type": "Service", name: "Deck Lighting & Outdoor Kitchen" } },
    ],
  },
  aggregateRating: { "@type": "AggregateRating", ratingValue: "4.9", reviewCount: "500", bestRating: "5" },
};

// ── 6. BreadcrumbList Schema ──
const breadcrumbJsonLd = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: BASE_URL },
    { "@type": "ListItem", position: 2, name: "Services", item: `${BASE_URL}/services` },
    { "@type": "ListItem", position: 3, name: "Roofing", item: `${BASE_URL}/services/residential-roofing` },
    { "@type": "ListItem", position: 4, name: "Custom Decks", item: `${BASE_URL}/services/custom-decks` },
    { "@type": "ListItem", position: 5, name: "Gallery", item: `${BASE_URL}/gallery` },
    { "@type": "ListItem", position: 6, name: "Reviews", item: `${BASE_URL}/reviews` },
    { "@type": "ListItem", position: 7, name: "Contact", item: `${BASE_URL}/contact` },
  ],
};

import { ContentProvider } from "@/context/ContentContext";

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // ── Fetch CMS-managed tracking scripts from MongoDB ──
  interface SiteScript { id: string; name: string; location: string; code: string; active: boolean; }
  let siteScripts: SiteScript[] = [];
  try {
    await connectToDatabase();
    const doc = await SiteContent.findOne({ key: 'site_scripts_v2' });
    if (Array.isArray(doc?.data)) siteScripts = doc.data;
  } catch (e) {
    // Non-fatal — site renders fine without CMS scripts
  }
  const activeScripts = siteScripts.filter((s) => s.active);
  const headScripts    = activeScripts.filter((s) => s.location === 'head');
  const bodyStartScripts = activeScripts.filter((s) => s.location === 'body_start');
  const bodyEndScripts   = activeScripts.filter((s) => s.location === 'body_end');

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* 1. LocalBusiness + Organization Schema */}
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
        {/* 2. Person / Founder Schema */}
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(founderJsonLd) }} />
        {/* 3. FAQPage Schema — triggers People Also Ask on Google */}
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
        {/* 4. Roofing Service Schema */}
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(roofingServiceJsonLd) }} />
        {/* 5. Decking Service Schema */}
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(deckingServiceJsonLd) }} />
        {/* 6. BreadcrumbList Schema */}
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
        {/* Preconnect to external origins for performance */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://images.unsplash.com" />
        {/* ── CMS-managed <head> scripts ── */}
        {headScripts.map((s) => (
          <script key={s.id} dangerouslySetInnerHTML={{ __html: s.code.replace(/<script[^>]*>|<\/script>/gi, '').trim() }} />
        ))}
      </head>
      <body className={`${spaceGrotesk.variable} ${dmSans.variable} antialiased`}>
        {/* ── CMS-managed body_start scripts ── */}
        {bodyStartScripts.map((s) => (
          <div key={s.id} dangerouslySetInnerHTML={{ __html: s.code }} />
        ))}
        <ContentProvider>
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
        </ContentProvider>

        {/* ── CMS-managed body_end scripts ── */}
        {bodyEndScripts.map((s) => (
          <div key={s.id} dangerouslySetInnerHTML={{ __html: s.code }} />
        ))}
      </body>
    </html>
  );
}
