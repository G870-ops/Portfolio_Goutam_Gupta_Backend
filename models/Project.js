import mongoose from 'mongoose';

const projectSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Project title is required'],
      trim: true,
      maxlength: [100, 'Title cannot exceed 100 characters'],
    },
    description: {
      type: String,
      required: [true, 'Project description is required'],
      trim: true,
    },
    techStack: {
      type: [String],
      required: [true, 'At least one tech stack tag is required'],
    },
    liveUrl: {
      type: String,
      default: '',
      trim: true,
    },
    githubUrl: {
      type: String,
      default: '',
      trim: true,
    },
    apkUrl: {
      type: String,
      default: '',
      trim: true,
    },
    imageUrl: {
      type: String,
      default: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=1200&auto=format&fit=crop',
    },
    featured: {
      type: Boolean,
      default: false,
    },
    category: {
      type: String,
      enum: ['Full Stack', 'Frontend', 'Backend', 'AI/ML', 'Mobile / Android', 'Systems'],
      default: 'Full Stack',
    },
    telemetryInsight: {
      type: String,
      default: '⚡ Optimized Asynchronous Execution Loop',
    },
  },
  {
    timestamps: true,
  }
);

const Project = mongoose.model('Project', projectSchema);

export default Project;
