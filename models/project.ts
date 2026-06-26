import mongoose, { Schema } from 'mongoose';

const ProjectSchema = new Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    problemStatement: { type: String, default: '' },
    methodology: { type: String, default: '' },
    dataset: { type: String, default: '' },
    technologies: [{ type: String, required: true }],
    results: { type: String, default: '' },
    businessImpact: { type: String, default: '' },
    coverImage: { type: String, required: true },
    gallery: [{ type: String }],
    liveUrl: { type: String, default: '' },
    githubUrl: { type: String, default: '' },
    category: { type: String, enum: ['Power BI', 'Tableau', 'SQL', 'Python', 'Excel', 'Machine Learning'], required: true },
    tags: [{ type: String }],
    featured: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export default mongoose.models.Project || mongoose.model('Project', ProjectSchema);
