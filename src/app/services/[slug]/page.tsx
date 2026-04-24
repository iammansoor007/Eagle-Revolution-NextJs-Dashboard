import ServiceDetailTemplate from "@/components/templates/ServiceDetailTemplate";

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  return <ServiceDetailTemplate params={resolvedParams} />;
}