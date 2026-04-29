import ContactTemplate from "@/components/templates/ContactTemplate";
import { Metadata } from "next";
import connectToDatabase from "@/lib/mongodb";
import SiteContent from "@/models/Content";
import Script from "next/script";
import { generateSchema } from "@/lib/schema-generator";

export async function generateMetadata(): Promise<Metadata> {
  await connectToDatabase();
  const content = await SiteContent.findOne({ key: "complete_data" }).lean() as any;
  const contactData = content?.data?.contactPage;
  
  return {
    title: contactData?.hero?.headline || "Contact Us | Eagle Revolution",
    description: contactData?.hero?.description || "Get a free estimate for your roofing or decking project. Contact St. Louis's most trusted veteran-owned contractor.",
  };
}

export default async function ContactPage() {
  await connectToDatabase();
  const content = await SiteContent.findOne({ key: "complete_data" }).lean() as any;
  const contactData = content?.data?.contactPage;

  const schema = generateSchema({
    title: contactData?.hero?.headline || "Contact Us",
    description: contactData?.hero?.description || "",
    slug: "/contact",
    type: "ContactPage"
  });

  return (
    <>
      <Script
        id="json-ld-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
      <ContactTemplate />
    </>
  );
}