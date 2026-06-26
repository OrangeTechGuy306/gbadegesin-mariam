import mongoose, { Schema } from 'mongoose';

const ExperienceSchema = new Schema(
  {
    title: { type: String, required: true },
    company: { type: String, required: true },
    location: { type: String, default: '' },
    description: { type: String, default: '' },
    startDate: { type: String, required: true }, // Format e.g. "2024-01"
    endDate: { type: String, default: 'Present' },
    type: { type: String, enum: ['work', 'education', 'award'], default: 'work' },
    highlights: [{ type: String }],
  },
  { timestamps: true }
);

export default mongoose.models.Experience || mongoose.model('Experience', ExperienceSchema);
