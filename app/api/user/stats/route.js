export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { verifyToken } from '@/lib/auth';
import connectDB from '@/lib/mongodb';
import Card from '@/models/Card';
import Settlement from '@/models/Settlement';

export async function GET() {
  try {
    const token = cookies().get('token')?.value;
    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    const decoded = verifyToken(token);
    if (!decoded) return NextResponse.json({ error: 'Invalid token' }, { status: 401 });

    await connectDB();

    const [activeCards, pendingSettlements, latestCard] = await Promise.all([
      Card.countDocuments({ userId: decoded.userId, status: 'active' }),
      Settlement.countDocuments({ userId: decoded.userId, status: 'pending' }),
      Card.findOne({ userId: decoded.userId }).sort({ createdAt: -1 }),
    ]);

    return NextResponse.json({
      success: true,
      stats: { activeCards, pendingSettlements, latestCard },
    });
  } catch (error) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
