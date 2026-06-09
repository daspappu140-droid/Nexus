import mongoose from 'mongoose';

const transactionSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  cardId: { type: mongoose.Schema.Types.ObjectId, ref: 'Card', default: null },
  type: {
    type: String,
    enum: ['credit', 'debit', 'voucher', 'transfer', 'refund', 'payment_request'],
    required: true,
  },
  amount: { type: Number, required: true },
  status: {
    type: String,
    enum: ['pending', 'completed', 'failed', 'cancelled'],
    default: 'completed',
  },
  description: { type: String, default: '' },
  reference: { type: String, sparse: true, unique: true },
  metadata: { type: mongoose.Schema.Types.Mixed, default: {} },
  fromWallet: { type: String, default: null },
  toWallet: { type: String, default: null },
  balanceBefore: { type: Number, default: 0 },
  balanceAfter: { type: Number, default: 0 },
}, { timestamps: true });

transactionSchema.index({ userId: 1, createdAt: -1 });
transactionSchema.index({ type: 1 });
transactionSchema.index({ status: 1 });

export default mongoose.models.Transaction || mongoose.model('Transaction', transactionSchema);
