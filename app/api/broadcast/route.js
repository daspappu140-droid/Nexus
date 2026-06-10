export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Broadcast from '@/models/Broadcast';

export async function GET() {
  try {
    await connectDB();
    const broadcast = await Broadcast.findOne({ isActive: true }).sort({ createdAt: -1 });
    return NextResponse.json({ success: true, broadcast });
  } catch (error) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
