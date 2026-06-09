import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { verifyToken } from '@/lib/auth';
import connectDB from '@/lib/mongodb';
import Settlement from '@/models/Settlement';
import User from '@/models/User';
import KYC from '@/models/KYC';
import Transaction from '@/models/Transaction';

export async function GET() {
  try {
    const token = cookies().get('token')?.value;
    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    const decoded = verifyToken(token);
    if (!decoded) return NextResponse.json({ error: 'Invalid token' }, { status: 401 });

    await connectDB();
    const settlements = await Settlement.find({ userId: decoded.userId }).sort({ createdAt: -1 });
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
    if (!decoded) return NextResponse.json({ error: 'Invalid token' }, { status: 401 });

    await connectDB();
    const { amount } = await request.json();

    if (!amount || amount < 10000) {
      return NextResponse.json({ error: 'Minimum settlement amount is ₹10,000' }, { status: 400 });
    }

    const user = await User.findById(decoded.userId);
    if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 });

    if (user.isOnHold) {
      return NextResponse.json({ error: 'Your settlement is currently on hold. Contact admin.' }, { status: 403 });
    }

    if (user.settlementBlocked) {
      return NextResponse.json({ error: user.settlementBlockReason || 'Settlement blocked' }, { status: 403 });
    }

    if (amount > user.walletBalance) {
      return NextResponse.json({ error: 'Insufficient wallet balance' }, { status: 400 });
    }

    // Check KYC
    const kyc = await KYC.findOne({ userId: decoded.userId, status: 'approved' });
    if (!kyc) {
      return NextResponse.json({ error: 'KYC verification required' }, { status: 403 });
    }

    // Deduct from wallet immediately
    const balanceBefore = user.walletBalance;
    user.walletBalance -= amount;
    await user.save();

    // Create settlement
    const settlement = await Settlement.create({
      userId: decoded.userId,
      spendAmount: amount,
      settlementRate: 0,
      settlementAmount: amount,
      status: 'pending',
      type: 't_plus_1',
      source: 'user',
      bankDetails: {
        accountHolder: kyc.bankName ? user.name : '',
        accountNumber: kyc.accountNumber,
        ifscCode: kyc.ifscCode,
        bankName: kyc.bankName,
      },
    });

    // Create transaction
    const reference = `UTR${Date.now()}${Math.floor(100000 + Math.random() * 900000)}`;
    await Transaction.create({
      userId: decoded.userId,
      type: 'debit',
      amount,
      status: 'completed',
      description: 'T+1 Settlement Request',
      reference,
      balanceBefore,
      balanceAfter: user.walletBalance,
    });

    return NextResponse.json({ success: true, settlement });
  } catch (error) {
    console.error('Settlement error:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
