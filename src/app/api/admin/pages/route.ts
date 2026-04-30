import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import Page from '@/models/Page';

export async function GET() {
  try {
    await connectToDatabase();
    const pages = await Page.find({}).sort({ createdAt: -1 });
    return NextResponse.json(pages);
  } catch (error: any) {
    console.error('Pages fetch error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    await connectToDatabase();
    const body = await req.json();
    const { title, slug, template } = body;

    const newPage = await Page.create({
      title,
      slug,
      template,
      status: 'published'
    });

    return NextResponse.json(newPage);
  } catch (error: any) {
    console.error('Page create error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    await connectToDatabase();
    const { action, ids, status } = await req.json();
    
    if (action === 'duplicate' && ids && Array.isArray(ids)) {
      const sourcePages = await Page.find({ _id: { $in: ids } });
      const newPages = [];
      
      for (const source of sourcePages) {
        const timestamp = Date.now();
        const duplicate = await Page.create({
          title: `${source.title} (Copy)`,
          slug: `${source.slug}-copy-${timestamp}`,
          template: source.template,
          content: source.content,
          seo: source.seo,
          status: 'draft'
        });
        newPages.push(duplicate);
      }
      return NextResponse.json(newPages);
    }

    if (action === 'status' && ids && Array.isArray(ids)) {
      await Page.updateMany(
        { _id: { $in: ids } },
        { $set: { status: status || 'draft' } }
      );
      return NextResponse.json({ success: true });
    }
    
    return NextResponse.json({ error: 'Invalid Action' }, { status: 400 });
  } catch (error: any) {
    console.error('Bulk action error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    await connectToDatabase();
    const { ids } = await req.json();
    if (!ids || !Array.isArray(ids)) {
      return NextResponse.json({ error: 'Invalid IDs' }, { status: 400 });
    }
    await Page.deleteMany({ _id: { $in: ids } });
    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Bulk delete error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
