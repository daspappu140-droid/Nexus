import mongoose from 'mongoose';

const settlementSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  spendAmount: { type: Number, required: true },
  settlementRate: { type: Number, default: 1.77 },
  settlementAmount: { type: Number, required: true },
  status: {
    type: String,
    enum: ['pending', 'processed', 'paused', 'rejected'],
    default: 'pending',
  },
  type: { type: String, enum: ['spend_redeem', 't_plus_1', 'on_demand'], default: 'spend_redeem' },
  source: { type: String, enum: ['admin', 'user', 'masterdistributor'], default: 'user' },
  bankDetails: {
    accountHolder: { type: String, default: '' },
    accountNumber: { type: String, default: '' },
    ifscCode: { type: String, default: '' },
    bankName: { type: String, default: '' },
  },
  rejectionReason: { type: String, default: null },
  processedAt: { type: Date, default: null },
  scheduledFor: { type: Date, default: null },
}, { timestamps: true });

settlementSchema.index({ userId: 1, status: 1 });
settlementSchema.index({ status: 1, type: 1 });

export default mongoose.models.Settlement || mongoose.model('Settlement', settlementSchema);
