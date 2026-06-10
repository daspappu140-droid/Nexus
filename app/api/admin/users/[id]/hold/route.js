export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { verifyToken } from '@/lib/auth';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';

export async function PATCH(request, { params }) {
  try {
    const token = cookies().get('token')?.value;
    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    const decoded = verifyToken(token);
    if (!decoded || decoded.role !== 'admin') return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

    await connectDB();

    const { isOnHold, reason } = await request.json();

    const user = await User.findByIdAndUpdate(
      params.id,
      {
        isOnHold: !!isOnHold,
        holdReason: isOnHold ? (reason || 'Due to bank internal server issues') : null,
        heldAt: isOnHold ? new Date() : null,
      },
      { new: true }
    ).select('-password');

    if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 });

    return NextResponse.json({ success: true, user });
  } catch (error) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
