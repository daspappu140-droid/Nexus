export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { verifyToken } from '@/lib/auth';
import connectDB from '@/lib/mongodb';
import Settlement from '@/models/Settlement';
import User from '@/models/User';
import Transaction from '@/models/Transaction';
import KYC from '@/models/KYC';

export async function GET() {
  try {
    const token = cookies().get('token')?.value;
    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    const decoded = verifyToken(token);
    if (!decoded || decoded.role !== 'masterdistributor') return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

    await connectDB();
    const settlements = await Settlement.find({ userId: decoded.userId, type: 'on_demand' }).sort({ createdAt: -1 });
    return NextResponse.json({ success: true, settlements });
  } catch (error) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const token = cookies().get('token')?.value;
    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    const decoded = verifyToken(token);
    if (!decoded || decoded.role !== 'masterdistributor') return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

    await connectDB();
    const { amount } = await request.json();

    if (!amount || amount <= 0) {
      return NextResponse.json({ error: 'Invalid amount' }, { status: 400 });
    }

    const user = await User.findById(decoded.userId);
    if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 });

    // Check 72-hour limit
    if (!user.settlementActivated && amount > 25000) {
      return NextResponse.json({ error: 'New account limit: ₹25,000. Contact admin for activation.' }, { status: 403 });
    }

    // Check daily limit (1 per day)
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todaySettlement = await Settlement.findOne({
      userId: decoded.userId,
      type: 'on_demand',
      createdAt: { $gte: today },
    });
    if (todaySettlement) {
      return NextResponse.json({ error: 'Daily limit reached. You can request 1 settlement per day.' }, { status: 429 });
    }

    if (amount > user.walletBalance) {
      return NextResponse.json({ error: 'Insufficient balance' }, { status: 400 });
    }

    // Calculate fee: ₹300 per ₹1,00,000
    const fee = Math.ceil((amount / 100000) * 300);
    const netAmount = amount - fee;

    // Get KYC bank details
    const kyc = await KYC.findOne({ userId: decoded.userId, status: 'approved' });

    // Deduct from wallet
    const balanceBefore = user.walletBalance;
    user.walletBalance -= amount;
    await user.save();

    // Create settlement
    const settlement = await Settlement.create({
      userId: decoded.userId,
      spendAmount: amount,
      settlementRate: 0,
      settlementAmount: netAmount,
      status: 'pending',
      type: 'on_demand',
      source: 'masterdistributor',
      bankDetails: kyc ? {
        accountHolder: user.name,
        accountNumber: kyc.accountNumber,
        ifscCode: kyc.ifscCode,
        bankName: kyc.bankName,
      } : {},
    });

    // Create transaction
    const reference = `UTR${Date.now()}${Math.floor(100000 + Math.random() * 900000)}`;
    await Transaction.create({
      userId: decoded.userId,
      type: 'debit',
      amount,
      status: 'completed',
      description: `On-demand settlement (Fee: ₹${fee})`,
      reference,
      balanceBefore,
      balanceAfter: user.walletBalance,
    });

    return NextResponse.json({ success: true, settlement });
  } catch (error) {
    console.error('MD settlement error:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
