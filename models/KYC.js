import mongoose from 'mongoose';

const kycSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  contactNumber: { type: String, default: '' },
  panNumber: { type: String, default: '' },
  bankName: { type: String, default: '' },
  accountNumber: { type: String, default: '' },
  ifscCode: { type: String, default: '' },
  bankDocument: { type: String, default: null },
  aadhaarFront: { type: String, default: null },
  aadhaarBack: { type: String, default: null },
  panCard: { type: String, default: null },
  gstCertificate: { type: String, default: null },
  msmeCertificate: { type: String, default: null },
  otherDocument: { type: String, default: null },
  otherDocumentRemark: { type: String, default: '' },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected', 'rekyc'],
    default: 'pending',
  },
  rejectionReason: { type: String, default: null },
  rekycReason: { type: String, default: null },
  submittedAt: { type: Date, default: Date.now },
  reviewedAt: { type: Date, default: null },
}, { timestamps: true });

export default mongoose.models.KYC || mongoose.model('KYC', kycSchema);
