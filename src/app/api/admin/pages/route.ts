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
