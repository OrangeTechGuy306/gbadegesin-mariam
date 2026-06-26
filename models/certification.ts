import mongoose, { Schema } from 'mongoose';

const CertificationSchema = new Schema(
  {
    name: { type: String, required: true },
    organization: { type: String, required: true },
    issueDate: { type: String, required: true },
    expirationDate: { type: String, default: 'No Expiration' },
    credentialId: { type: String, default: '' },
    verificationUrl: { type: String, default: '' },
    image: { type: String, default: '/images/cert-placeholder.png' },
  },
  { timestamps: true }
);

export default mongoose.models.Certification || mongoose.model('Certification', CertificationSchema);
