import { notFound } from 'next/navigation';
import connectToDatabase from '@/lib/mongodb';
import Page from '@/models/Page';
import { getTemplate } from '@/components/templates/TemplateRegistry';

interface PageProps {
  params: Promise<{ slug: string[] }>;
}

export default async function DynamicPage({ params }: PageProps) {
  const resolvedParams = await params;
  const slug = resolvedParams.slug.join('/');

  await connectToDatabase();
  
  // Find the page in MongoDB
  const pageDoc = await Page.findOne({ 
    slug: slug, 
    status: 'published' 
  }).lean();

  if (!pageDoc) {
    // If no page found in DB, 404
    notFound();
  }

  // Convert to plain object to avoid Mongoose serialization issues in Client Components
  const page = JSON.parse(JSON.stringify(pageDoc));

  // Get the registered component for this template name
  const Template = getTemplate(page.template);

  return (
    <main>
      <Template pageData={page} params={resolvedParams} />
    </main>
  );
}

// Generate static params for ISR/SSG optimization
export async function generateStaticParams() {
  try {
    await connectToDatabase();
    const pages = await Page.find({ status: 'published' }).select('slug');
    
    return pages.map((page: any) => ({
      slug: page.slug.split('/'),
    }));
  } catch (error) {
    console.error("Error generating static params:", error);
    return [];
  }
}
