import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { verifyToken } from '@/lib/auth';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';

export async function GET() {
  try {
    const token = cookies().get('token')?.value;
    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    const decoded = verifyToken(token);
    if (!decoded || decoded.role !== 'admin') return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

    await connectDB();

    const users = await User.find({ role: 'user' })
      .select('-password')
      .sort({ createdAt: -1 })
      .limit(500);

    return NextResponse.json({ success: true, users });
  } catch (error) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const token = cookies().get('token')?.value;
    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    const decoded = verifyToken(token);
    if (!decoded || decoded.role !== 'admin') return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

    await connectDB();
    const { name, email, phone, password, distributorId } = await request.json();

    const bcrypt = require('bcryptjs');
    const hashedPassword = await bcrypt.hash(password || '123456', 12);

    const user = await User.create({
      name, email: email.toLowerCase(), phone,
      password: hashedPassword,
      role: 'user',
      status: 'approved',
      distributorId: distributorId || null,
    });

    return NextResponse.json({ success: true, user: { ...user.toObject(), password: undefined } }, { status: 201 });
  } catch (error) {
    if (error.code === 11000) return NextResponse.json({ error: 'Email already exists' }, { status: 409 });
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
