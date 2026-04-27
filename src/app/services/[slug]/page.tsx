import ServiceDetailTemplate from "@/components/templates/ServiceDetailTemplate";

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  return <ServiceDetailTemplate params={resolvedParams} />;
}