export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { verifyToken } from '@/lib/auth';
import connectDB from '@/lib/mongodb';
import KYC from '@/models/KYC';

export async function GET() {
  try {
    const token = cookies().get('token')?.value;
    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    const decoded = verifyToken(token);
    if (!decoded) return NextResponse.json({ error: 'Invalid token' }, { status: 401 });

    await connectDB();
    const kyc = await KYC.findOne({ userId: decoded.userId });
    return NextResponse.json({ success: true, kyc });
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
    const body = await request.json();

    const existingKyc = await KYC.findOne({ userId: decoded.userId });
    if (existingKyc && existingKyc.status === 'pending') {
      return NextResponse.json({ error: 'KYC already under review' }, { status: 400 });
    }
    if (existingKyc && existingKyc.status === 'approved') {
      return NextResponse.json({ error: 'KYC already approved' }, { status: 400 });
    }

    const kycData = {
      userId: decoded.userId,
      contactNumber: body.contactNumber,
      panNumber: body.panNumber,
      bankName: body.bankName,
      accountNumber: body.accountNumber,
      ifscCode: body.ifscCode,
      bankDocument: body.bankDocument || null,
      aadhaarFront: body.aadhaarFront || null,
      aadhaarBack: body.aadhaarBack || null,
      panCard: body.panCard || null,
      status: 'pending',
      submittedAt: new Date(),
    };

    let kyc;
    if (existingKyc) {
      kyc = await KYC.findByIdAndUpdate(existingKyc._id, kycData, { new: true });
    } else {
      kyc = await KYC.create(kycData);
    }

    return NextResponse.json({ success: true, kyc });
  } catch (error) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
