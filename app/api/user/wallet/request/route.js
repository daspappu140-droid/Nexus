import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { verifyToken } from '@/lib/auth';
import connectDB from '@/lib/mongodb';
import Transaction from '@/models/Transaction';
import User from '@/models/User';

export async function POST(request) {
  try {
    const token = cookies().get('token')?.value;
    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    const decoded = verifyToken(token);
    if (!decoded) return NextResponse.json({ error: 'Invalid token' }, { status: 401 });

    await connectDB();
    const { amount } = await request.json();

    if (!amount || amount < 100) {
      return NextResponse.json({ error: 'Minimum request is ₹100' }, { status: 400 });
    }

    const user = await User.findById(decoded.userId);
    if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 });

    const reference = `UTR${Date.now()}${Math.floor(100000 + Math.random() * 900000)}`;

    await Transaction.create({
      userId: decoded.userId,
      type: 'payment_request',
      amount,
      status: 'pending',
      description: `Wallet load request of ₹${amount.toLocaleString('en-IN')}`,
      reference,
      balanceBefore: user.walletBalance,
      balanceAfter: user.walletBalance,
    });

    return NextResponse.json({ success: true, message: 'Payment request submitted' });
  } catch (error) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
