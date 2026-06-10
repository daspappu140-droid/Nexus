export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import bcrypt from 'bcryptjs';
import { verifyToken } from '@/lib/auth';
import connectDB from '@/lib/mongodb';
import Card from '@/models/Card';
import User from '@/models/User';
import Transaction from '@/models/Transaction';
import Settlement from '@/models/Settlement';

export async function POST(request) {
  try {
    const token = cookies().get('token')?.value;
    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    const decoded = verifyToken(token);
    if (!decoded) return NextResponse.json({ error: 'Invalid token' }, { status: 401 });

    await connectDB();
    const { cardId, amount, pin } = await request.json();

    if (!cardId || !amount || !pin) {
      return NextResponse.json({ error: 'Card, amount, and PIN are required' }, { status: 400 });
    }

    const card = await Card.findOne({ _id: cardId, userId: decoded.userId });
    if (!card) return NextResponse.json({ error: 'Card not found' }, { status: 404 });

    if (card.status !== 'active') {
      return NextResponse.json({ error: 'Card is not active' }, { status: 400 });
    }

    // Verify PIN
    const pinMatch = await bcrypt.compare(pin, card.pin);
    if (!pinMatch) {
      return NextResponse.json({ error: 'Invalid PIN' }, { status: 401 });
    }

    if (amount > card.balance) {
      return NextResponse.json({ error: 'Insufficient card balance' }, { status: 400 });
    }

    if (amount > card.spendingLimit) {
      return NextResponse.json({ error: 'Exceeds spending limit' }, { status: 400 });
    }

    // Deduct from card
    card.balance -= amount;
    card.lastUsed = new Date();
    await card.save();

    // Get user's settlement rate
    const user = await User.findById(decoded.userId);
    const settlementRate = user.settlementRate || 1.77;
    const deduction = (amount * settlementRate) / 100;
    const settlementAmount = amount - deduction;

    // Create transaction
    const reference = `UTR${Date.now()}${Math.floor(100000 + Math.random() * 900000)}`;
    await Transaction.create({
      userId: decoded.userId,
      cardId: card._id,
      type: 'debit',
      amount,
      status: 'completed',
      description: `Gateway payment via card ••••${card.cardNumber.slice(-4)}`,
      reference,
      balanceBefore: card.balance + amount,
      balanceAfter: card.balance,
    });

    // Auto-generate spend/redeem settlement
    await Settlement.create({
      userId: decoded.userId,
      spendAmount: amount,
      settlementRate,
      settlementAmount,
      status: 'pending',
      type: 'spend_redeem',
      source: 'admin',
      bankDetails: {},
    });

    return NextResponse.json({
      success: true,
      message: 'Payment processed. Settlement will be processed T+1.',
      transaction: { amount, reference },
    });
  } catch (error) {
    console.error('Gateway pay error:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
