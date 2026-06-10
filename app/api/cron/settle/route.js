export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Settlement from '@/models/Settlement';
import { isBankingDay } from '@/utils/bankingDays';

export async function GET(request) {
  try {
    // Verify cron secret
    const { searchParams } = new URL(request.url);
    const authHeader = request.headers.get('authorization');
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check if today is a banking day
    const today = new Date();
    if (!isBankingDay(today)) {
      return NextResponse.json({ message: 'Not a banking day. Skipped.' });
    }

    await connectDB();

    // Process all pending spend/redeem settlements
    const pendingSettlements = await Settlement.find({
      status: 'pending',
      type: 'spend_redeem',
    });

    let processed = 0;
    for (const settlement of pendingSettlements) {
      settlement.status = 'processed';
      settlement.processedAt = new Date();
      await settlement.save();
      processed++;
    }

    return NextResponse.json({
      success: true,
      message: `Processed ${processed} settlements`,
      processed,
      date: today.toISOString(),
    });
  } catch (error) {
    console.error('Cron settle error:', error);
    return NextResponse.json({ error: 'Cron failed' }, { status: 500 });
  }
}
