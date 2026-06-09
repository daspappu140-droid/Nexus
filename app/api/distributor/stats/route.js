import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { verifyToken } from '@/lib/auth';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';
import Transaction from '@/models/Transaction';

export async function GET() {
  try {
    const token = cookies().get('token')?.value;
    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    const decoded = verifyToken(token);
    if (!decoded || decoded.role !== 'distributor') return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

    await connectDB();

    const users = await User.find({ distributorId: decoded.userId, role: 'user' });
    const totalUsers = users.length;
    const activeUsers = users.filter(u => u.status === 'approved').length;

    // Total recharged (credits to users from this distributor)
    const userIds = users.map(u => u._id);
    const creditTxns = await Transaction.find({
      userId: { $in: userIds },
      type: 'credit',
      description: { $regex: /recharge|load/i },
    });
    const totalRecharged = creditTxns.reduce((a, t) => a + t.amount, 0);

    // Today's recharges
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const rechargesToday = creditTxns.filter(t => new Date(t.createdAt) >= today).length;

    return NextResponse.json({
      success: true,
      stats: { totalUsers, activeUsers, totalRecharged, rechargesToday },
    });
  } catch (error) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
