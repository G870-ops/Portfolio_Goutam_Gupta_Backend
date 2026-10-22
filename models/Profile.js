import mongoose from 'mongoose';

const profileSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      default: 'Goutam Gupta',
      trim: true,
    },
    bio: {
      type: String,
      default:
        'Full-Stack MERN Architect & Android Developer with deep expertise in reactive frontends, asynchronous Node.js microservices, distributed MongoDB pipelines, and mission-critical edge AI applications.',
      trim: true,
    },
    email: {
      type: String,
      default: 'goutamgupta605@gmail.com',
      trim: true,
    },
    phone: {
      type: String,
      default: '+91 8343957187',
      trim: true,
    },
    github: {
      type: String,
      default: 'https://github.com/G870-ops',
      trim: true,
    },
    linkedin: {
      type: String,
      default: 'https://www.linkedin.com/in/goutam-gupta',
      trim: true,
    },
    resumeEmail: {
      type: String,
      default: 'goutamgupta605@gmail.com',
      trim: true,
    },
    profileImg: {
      type: String,
      default: '/profile.jpg',
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

const Profile = mongoose.model('Profile', profileSchema);

export default Profile;
