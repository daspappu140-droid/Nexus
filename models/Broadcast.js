import mongoose from 'mongoose';

const broadcastSchema = new mongoose.Schema({
  message: { type: String, required: true },
  type: { type: String, enum: ['info', 'warning', 'success', 'error'], default: 'info' },
  isActive: { type: Boolean, default: true },
  dismissAfter: { type: Number, default: 0 },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
}, { timestamps: true });

export default mongoose.models.Broadcast || mongoose.model('Broadcast', broadcastSchema);
