export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { verifyToken } from '@/lib/auth';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';
import Card from '@/models/Card';
import Transaction from '@/models/Transaction';
import Settlement from '@/models/Settlement';

export async function GET() {
  try {
    const token = cookies().get('token')?.value;
    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    const decoded = verifyToken(token);
    if (!decoded || decoded.role !== 'masterdistributor') return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

    await connectDB();

    const distributors = await User.find({ masterDistributorId: decoded.userId, role: 'distributor' }).select('_id');
    const distributorIds = distributors.map(d => d._id);

    const users = await User.find({ distributorId: { $in: distributorIds }, role: 'user' }).select('_id');
    const userIds = users.map(u => u._id);

    const [totalCards, totalTransactions, settlements] = await Promise.all([
      Card.countDocuments({ userId: { $in: userIds } }),
      Transaction.countDocuments({ userId: { $in: [...userIds, ...distributorIds, decoded.userId] } }),
      Settlement.find({ userId: decoded.userId }),
    ]);

    // Check if already settled today
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todaySettlement = await Settlement.findOne({
      userId: decoded.userId,
      createdAt: { $gte: today },
    });

    return NextResponse.json({
      success: true,
      stats: {
        totalDistributors: distributors.length,
        totalUsers: users.length,
        totalCards,
        totalTransactions,
        totalSettled: settlements.filter(s => s.status === 'processed').reduce((a, s) => a + s.settlementAmount, 0),
        pendingSettlements: settlements.filter(s => s.status === 'pending').length,
        approvedSettlements: settlements.filter(s => s.status === 'processed').length,
        rejectedSettlements: settlements.filter(s => s.status === 'rejected').length,
        canSettleToday: !todaySettlement,
      },
    });
  } catch (error) {
    console.error('MD stats error:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
