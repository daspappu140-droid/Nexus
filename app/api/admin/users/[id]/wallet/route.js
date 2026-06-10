export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { verifyToken } from '@/lib/auth';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';
import Transaction from '@/models/Transaction';

export async function POST(request, { params }) {
  try {
    const token = cookies().get('token')?.value;
    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    const decoded = verifyToken(token);
    if (!decoded || decoded.role !== 'admin') return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

    await connectDB();

    const { amount, action } = await request.json();

    if (!amount || amount <= 0) {
      return NextResponse.json({ error: 'Invalid amount' }, { status: 400 });
    }

    const user = await User.findById(params.id);
    if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 });

    const balanceBefore = user.walletBalance;

    if (action === 'add') {
      user.walletBalance += amount;
    } else if (action === 'deduct') {
      if (user.walletBalance < amount) {
        return NextResponse.json({ error: 'Insufficient balance' }, { status: 400 });
      }
      user.walletBalance -= amount;
    } else {
      return NextResponse.json({ error: 'Invalid action. Use "add" or "deduct"' }, { status: 400 });
    }

    await user.save();

    // Create transaction record
    const reference = `UTR${Date.now()}${Math.floor(100000 + Math.random() * 900000)}`;
    await Transaction.create({
      userId: user._id,
      type: action === 'add' ? 'credit' : 'debit',
      amount,
      status: 'completed',
      description: `Admin ${action === 'add' ? 'wallet load' : 'wallet deduction'}`,
      reference,
      balanceBefore,
      balanceAfter: user.walletBalance,
    });

    return NextResponse.json({
      success: true,
      message: `₹${amount.toLocaleString('en-IN')} ${action === 'add' ? 'credited' : 'debited'} successfully`,
      newBalance: user.walletBalance,
    });
  } catch (error) {
    console.error('Wallet error:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
