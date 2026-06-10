export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import bcrypt from 'bcryptjs';
import { verifyToken } from '@/lib/auth';
import connectDB from '@/lib/mongodb';
import Card from '@/models/Card';

function generateCardNumber() {
  let num = '4532';
  for (let i = 0; i < 12; i++) {
    num += Math.floor(Math.random() * 10);
  }
  return num;
}

function generateCVV() {
  return String(Math.floor(100 + Math.random() * 900));
}

function generateExpiry() {
  const date = new Date();
  date.setFullYear(date.getFullYear() + 3);
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = String(date.getFullYear()).slice(-2);
  return `${month}/${year}`;
}

export async function GET() {
  try {
    const token = cookies().get('token')?.value;
    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    const decoded = verifyToken(token);
    if (!decoded) return NextResponse.json({ error: 'Invalid token' }, { status: 401 });

    await connectDB();
    const cards = await Card.find({ userId: decoded.userId }).sort({ createdAt: -1 });
    return NextResponse.json({ success: true, cards });
  } catch (error) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

export async function POST() {
  try {
    const token = cookies().get('token')?.value;
    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    const decoded = verifyToken(token);
    if (!decoded) return NextResponse.json({ error: 'Invalid token' }, { status: 401 });

    await connectDB();

    // Generate unique card number with collision check
    let cardNumber;
    let exists = true;
    while (exists) {
      cardNumber = generateCardNumber();
      exists = await Card.findOne({ cardNumber });
    }

    const pin = String(Math.floor(1000 + Math.random() * 9000));
    const hashedPin = await bcrypt.hash(pin, 10);

    const card = await Card.create({
      userId: decoded.userId,
      cardNumber,
      expiryDate: generateExpiry(),
      cvv: generateCVV(),
      pin: hashedPin,
      status: 'active',
      balance: 0,
      spendingLimit: 100000,
      cardName: 'NexusBank Platinum',
    });

    return NextResponse.json({ success: true, card: { ...card.toObject(), pin: '****' } }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
