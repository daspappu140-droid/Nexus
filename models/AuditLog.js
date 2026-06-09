import mongoose from 'mongoose';

const auditLogSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  action: { type: String, required: true },
  target: { type: String, default: '' },
  targetId: { type: mongoose.Schema.Types.ObjectId, default: null },
  details: { type: mongoose.Schema.Types.Mixed, default: {} },
  ipAddress: { type: String, default: '' },
}, { timestamps: true });

auditLogSchema.index({ userId: 1, createdAt: -1 });

export default mongoose.models.AuditLog || mongoose.model('AuditLog', auditLogSchema);
