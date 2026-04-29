import GalleryTemplate from "@/components/templates/GalleryTemplate";
import { Metadata } from "next";
import connectToDatabase from "@/lib/mongodb";
import SiteContent from "@/models/Content";
import Script from "next/script";
import { generateSchema } from "@/lib/schema-generator";

export async function generateMetadata(): Promise<Metadata> {
  await connectToDatabase();
  const content = await SiteContent.findOne({ key: "complete_data" }).lean() as any;
  const galleryData = content?.data?.portfolio;
  
  return {
    title: galleryData?.section?.headline || "Project Gallery | Eagle Revolution",
    description: galleryData?.section?.description || "Browse our recent roofing, decking, and home improvement projects in St. Louis.",
  };
}

export default async function GalleryPage() {
  await connectToDatabase();
  const content = await SiteContent.findOne({ key: "complete_data" }).lean() as any;
  const galleryData = content?.data?.portfolio;

  const schema = generateSchema({
    title: galleryData?.section?.headline || "Project Gallery",
    description: galleryData?.section?.description || "",
    slug: "/gallery",
    type: "CollectionPage"
  });

  return (
    <>
      <Script
        id="json-ld-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
      <GalleryTemplate />
    </>
  );
}