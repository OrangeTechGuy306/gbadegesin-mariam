import mongoose, { Schema } from 'mongoose';

const AuditLogSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    userName: { type: String, required: true },
    userEmail: { type: String, required: true },
    action: { type: String, required: true }, // e.g. "CREATE_PROJECT", "UPDATE_BLOG", "DELETE_SKILL", "LOGIN"
    details: { type: String, default: '' },
    ip: { type: String, default: '' },
    timestamp: { type: Date, default: Date.now, index: true },
  },
  { timestamps: true }
);

export default mongoose.models.AuditLog || mongoose.model('AuditLog', AuditLogSchema);
