import mongoose from 'mongoose';

const ticketSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  subject: { type: String, required: true },
  message: { type: String, required: true },
  status: { type: String, enum: ['open', 'in_progress', 'resolved', 'closed'], default: 'open' },
  priority: { type: String, enum: ['low', 'medium', 'high', 'urgent'], default: 'medium' },
  replies: [{
    message: String,
    isAdmin: Boolean,
    createdAt: { type: Date, default: Date.now },
  }],
}, { timestamps: true });

ticketSchema.index({ userId: 1, status: 1 });

export default mongoose.models.Ticket || mongoose.model('Ticket', ticketSchema);
