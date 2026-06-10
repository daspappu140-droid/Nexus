export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { verifyToken } from '@/lib/auth';
import connectDB from '@/lib/mongodb';
import KYC from '@/models/KYC';

export async function PATCH(request, { params }) {
  try {
    const token = cookies().get('token')?.value;
    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    const decoded = verifyToken(token);
    if (!decoded || decoded.role !== 'admin') return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

    await connectDB();

    const kyc = await KYC.findByIdAndUpdate(
      params.id,
      { status: 'approved', reviewedAt: new Date() },
      { new: true }
    );

    if (!kyc) return NextResponse.json({ error: 'KYC not found' }, { status: 404 });

    return NextResponse.json({ success: true, kyc });
  } catch (error) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
