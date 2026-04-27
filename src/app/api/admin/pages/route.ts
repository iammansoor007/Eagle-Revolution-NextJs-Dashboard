import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import Page from '@/models/Page';

export async function GET() {
  try {
    await connectToDatabase();
    const pages = await Page.find({ status: 'published' }).select('slug title template _id');
    return NextResponse.json(pages);
  } catch (error: any) {
    console.error('Pages fetch error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
