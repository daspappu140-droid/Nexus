import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: { type: String, required: true },
  role: {
    type: String,
    enum: ['admin', 'masterdistributor', 'distributor', 'corporate', 'employee', 'user'],
    default: 'user',
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected', 'blocked'],
    default: 'pending',
  },
  walletBalance: { type: Number, default: 0, min: 0 },
  corporateId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
  distributorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
  masterDistributorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
  avatar: { type: String, default: null },
  phone: { type: String, default: null },
  lastLogin: { type: Date, default: null },
  isOnHold: { type: Boolean, default: false },
  holdReason: { type: String, default: null },
  heldAt: { type: Date, default: null },
  settlementBlocked: { type: Boolean, default: false },
  settlementBlockReason: { type: String, default: null },
  settlementRate: { type: Number, default: 1.77 },
  settlementActivated: { type: Boolean, default: false },
  settlementActivatedAt: { type: Date, default: null },
  maintenanceMode: { type: Boolean, default: false },
  maintenanceMessage: { type: String, default: 'System under maintenance. Please wait.' },
}, { timestamps: true });

userSchema.index({ role: 1, status: 1 });
userSchema.index({ distributorId: 1 });
userSchema.index({ masterDistributorId: 1 });
userSchema.index({ corporateId: 1 });

export default mongoose.models.User || mongoose.model('User', userSchema);
