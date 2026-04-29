import AboutTemplate from "@/components/templates/AboutTemplate";
import { Metadata } from "next";
import connectToDatabase from "@/lib/mongodb";
import SiteContent from "@/models/Content";
import Script from "next/script";
import { generateSchema } from "@/lib/schema-generator";

export async function generateMetadata(): Promise<Metadata> {
  await connectToDatabase();
  const content = await SiteContent.findOne({ key: "complete_data" }).lean() as any;
  const aboutData = content?.data?.aboutPage;
  
  return {
    title: aboutData?.hero?.headline || "About Us | Eagle Revolution",
    description: aboutData?.hero?.description || "Learn about Eagle Revolution, our veteran-owned standards, and our commitment to roofing excellence in St. Louis.",
  };
}

export default async function AboutPage() {
  await connectToDatabase();
  const content = await SiteContent.findOne({ key: "complete_data" }).lean() as any;
  const aboutData = content?.data?.aboutPage;

  const schema = generateSchema({
    title: aboutData?.hero?.headline || "About Us",
    description: aboutData?.hero?.description || "",
    slug: "/about",
    type: "AboutPage"
  });

  return (
    <>
      <Script
        id="json-ld-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
      <AboutTemplate />
    </>
  );
}