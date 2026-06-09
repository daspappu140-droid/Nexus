import mongoose from 'mongoose';

const cardSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  cardNumber: { type: String, required: true, unique: true },
  expiryDate: { type: String, required: true },
  cvv: { type: String, required: true },
  pin: { type: String, required: true },
  spendingLimit: { type: Number, default: 100000 },
  balance: { type: Number, default: 0, min: 0 },
  status: {
    type: String,
    enum: ['active', 'frozen', 'expired'],
    default: 'active',
  },
  cardType: { type: String, default: 'Virtual Debit' },
  cardName: { type: String, default: 'NexusBank Platinum' },
  lastUsed: { type: Date, default: null },
}, { timestamps: true });

cardSchema.index({ userId: 1 });
cardSchema.index({ status: 1 });

export default mongoose.models.Card || mongoose.model('Card', cardSchema);
