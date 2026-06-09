import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { verifyToken } from '@/lib/auth';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';
import Card from '@/models/Card';

export async function GET() {
  try {
    const token = cookies().get('token')?.value;
    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    const decoded = verifyToken(token);
    if (!decoded || decoded.role !== 'masterdistributor') return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

    await connectDB();

    // Get all users under this MD's network
    const distributors = await User.find({ masterDistributorId: decoded.userId, role: 'distributor' }).select('_id');
    const distributorIds = distributors.map(d => d._id);
    const users = await User.find({ distributorId: { $in: distributorIds }, role: 'user' }).select('_id');
    const userIds = users.map(u => u._id);

    const cards = await Card.find({ userId: { $in: userIds } })
      .populate('userId', 'name email')
      .sort({ createdAt: -1 });

    return NextResponse.json({ success: true, cards });
  } catch (error) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
