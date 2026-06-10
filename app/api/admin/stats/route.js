export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { verifyToken } from '@/lib/auth';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';
import Card from '@/models/Card';
import Settlement from '@/models/Settlement';
import KYC from '@/models/KYC';
import Transaction from '@/models/Transaction';

export async function GET() {
  try {
    const token = cookies().get('token')?.value;
    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    const decoded = verifyToken(token);
    if (!decoded || decoded.role !== 'admin') return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

    await connectDB();

    const [
      totalUsers,
      totalDistributors,
      totalMasterDistributors,
      totalCards,
      pendingSettlements,
      pendingKYC,
      totalWalletBalance,
      processedSettlements,
    ] = await Promise.all([
      User.countDocuments({ role: 'user' }),
      User.countDocuments({ role: 'distributor' }),
      User.countDocuments({ role: 'masterdistributor' }),
      Card.countDocuments({ status: 'active' }),
      Settlement.countDocuments({ status: 'pending' }),
      KYC.countDocuments({ status: 'pending' }),
      User.aggregate([{ $group: { _id: null, total: { $sum: '$walletBalance' } } }]),
      Settlement.aggregate([
        { $match: { status: 'processed' } },
        { $group: { _id: null, total: { $sum: '$settlementAmount' } } },
      ]),
    ]);

    return NextResponse.json({
      success: true,
      stats: {
        totalUsers,
        totalDistributors,
        totalMasterDistributors,
        totalCards,
        pendingSettlements,
        pendingKYC,
        totalWalletBalance: totalWalletBalance[0]?.total || 0,
        totalSettlementAmount: processedSettlements[0]?.total || 0,
      },
    });
  } catch (error) {
    console.error('Admin stats error:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
