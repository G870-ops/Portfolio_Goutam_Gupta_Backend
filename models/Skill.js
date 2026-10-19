import mongoose from 'mongoose';

const skillSchema = new mongoose.Schema(
  {
    category: {
      type: String,
      required: [true, 'Skill category is required'],
      enum: [
        'Programming Languages',
        'Frontend Engineering',
        'Backend Ecosystem',
        'Database Management',
        'Tools & Core Skills',
        'Other Qualifications',
      ],
    },
    name: {
      type: String,
      required: [true, 'Skill name is required'],
      trim: true,
    },
    proficiency: {
      type: Number,
      min: 1,
      max: 100,
      default: 85,
    },
    icon: {
      type: String,
      default: 'Code',
    },
  },
  {
    timestamps: true,
  }
);

const Skill = mongoose.model('Skill', skillSchema);

export default Skill;
