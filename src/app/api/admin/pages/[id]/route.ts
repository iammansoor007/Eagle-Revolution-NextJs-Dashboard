import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import Page from '@/models/Page';

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await connectToDatabase();
    const page = await Page.findById(id);
    if (!page) return NextResponse.json({ error: 'Page not found' }, { status: 404 });
    return NextResponse.json(page);
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json();
    const { slug, title, template, status, metadata, content } = body;

    await connectToDatabase();
    
    const updateData: any = {};
    if (slug !== undefined) updateData.slug = slug;
    if (title !== undefined) updateData.title = title;
    if (template !== undefined) updateData.template = template;
    if (status !== undefined) updateData.status = status;
    if (metadata !== undefined) updateData.metadata = metadata;
    if (content !== undefined) updateData.content = content;

    const updatedPage = await Page.findByIdAndUpdate(
      id,
      updateData,
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
