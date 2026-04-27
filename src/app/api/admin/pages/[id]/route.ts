import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import Page from '@/models/Page';

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json();
    const { slug, title } = body;

    await connectToDatabase();
    
    const updatedPage = await Page.findByIdAndUpdate(
      id,
      { slug, title },
      { new: true }
    );

    if (!updatedPage) {
      return NextResponse.json({ error: 'Page not found' }, { status: 404 });
    }

    return NextResponse.json(updatedPage);
  } catch (error: any) {
    console.error('Page update error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
