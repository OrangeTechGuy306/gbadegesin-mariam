import mongoose, { Schema } from 'mongoose';

const AnalyticsSchema = new Schema(
  {
    path: { type: String, required: true },
    ip: { type: String, default: '' },
    userAgent: { type: String, default: '' },
    browser: { type: String, default: 'Unknown' },
    device: { type: String, default: 'Desktop' }, // Desktop, Mobile, Tablet
    country: { type: String, default: 'Local' },
    referrer: { type: String, default: '' },
    timestamp: { type: Date, default: Date.now, index: true },
  },
  { timestamps: true }
);

export default mongoose.models.Analytics || mongoose.model('Analytics', AnalyticsSchema);
