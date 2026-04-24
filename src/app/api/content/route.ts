import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import SiteContent from '@/models/Content';

export async function GET() {
  try {
    await connectToDatabase();
    
    // Target the specific key we seeded
    const content = await SiteContent.findOne({ key: 'complete_data' });
    
    if (!content) {
      console.warn('Content not found in MongoDB, key: complete_data');
      return NextResponse.json({ error: 'Content not found' }, { status: 404 });
    }
    
    return NextResponse.json(content.data);
  } catch (error: any) {
    console.error('Content fetch error:', error);
    return NextResponse.json({ error: 'Internal Server Error', details: error.message }, { status: 500 });
  }
}
