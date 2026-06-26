import mongoose, { Schema } from 'mongoose';

const SkillSchema = new Schema(
  {
    name: { type: String, required: true },
    proficiency: { type: Number, required: true, min: 0, max: 100 }, // 0 to 100
    category: {
      type: String,
      enum: [
        'SQL', 'Python', 'Excel', 'Power BI', 'Tableau', 'R',
        'Statistics', 'Machine Learning', 'Data Cleaning',
        'Data Visualization', 'ETL', 'Business Intelligence'
      ],
      required: true
    },
    radarValue: { type: Number, default: 0 }, // Value for Recharts Radar chart (e.g. 1-10)
    bubbleSize: { type: Number, default: 0 }, // Size mapping for bubble chart visualizations
  },
  { timestamps: true }
);

export default mongoose.models.Skill || mongoose.model('Skill', SkillSchema);
