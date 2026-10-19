import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Project from '../models/Project.js';
import Skill from '../models/Skill.js';
import User from '../models/User.js';

dotenv.config();

const projectsData = [
  {
    title: 'Full Stack Food Delivery Website',
    description: 'A comprehensive, high-performance food delivery platform featuring real-time order telemetry, secure payment integrations, and an aesthetic, high-contrast user interface.',
    techStack: ['React.js', 'MongoDB', 'Express', 'Node.js', 'Stripe'],
    liveUrl: 'https://food-dev-frontend.vercel.app/',
    githubUrl: 'https://github.com/G870-ops/FOOD_DEV_FRONTEND',
    imageUrl: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?q=80&w=1200&auto=format&fit=crop',
    featured: true,
    category: 'Full Stack',
    telemetryInsight: '⚡ PIPELINE: Async V8 Event Loop | PAYMENTS: Stripe Gateway',
  },
  {
    title: 'Invitor (Event Booking) Web App',
    description: 'Full-stack Event Booking Management web platform featuring dynamic role-based dashboards and cross-layered API logic.',
    techStack: ['React.js', 'Vite', 'Tailwind CSS', 'Postman APIs'],
    liveUrl: 'https://event-booking-web-app-seven.vercel.app/',
    githubUrl: 'https://github.com/G870-ops/Event_Booking_WebApp',
    imageUrl: 'https://images.unsplash.com/photo-1511578314322-379afb476865?q=80&w=1200&auto=format&fit=crop',
    featured: true,
    category: 'Full Stack',
    telemetryInsight: '⚡ PIPELINE: React + Vite Core | INTERFACE: Tailwind Utility Classes',
  },
  {
    title: 'PBIS App (Pig Breed Identification)',
    description: 'Real-time pig breed identification using TFLite and OpenCV with up to 100% accuracy and mobile camera edge inference.',
    techStack: ['AI/ML', 'TFLite', 'OpenCV', 'Android Studio'],
    liveUrl: 'https://github.com/G870-ops',
    githubUrl: 'https://github.com/G870-ops',
    imageUrl: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?q=80&w=1200&auto=format&fit=crop',
    featured: true,
    category: 'AI/ML',
    telemetryInsight: '⚡ INFERENCE_SPEED: ~45ms | MODEL: INT8 Quantized Edge TFLite',
  },
  {
    title: 'Jarvis AI Assistant App',
    description: 'AI-powered voice assistant for hands-free device control, natural speech recognition, and real-time task automation.',
    techStack: ['NLP', 'Python', 'Voice AI', 'Android Intent'],
    liveUrl: 'https://github.com/G870-ops/JARVIS_AI_ASSISTANT_APP',
    githubUrl: 'https://github.com/G870-ops/JARVIS_AI_ASSISTANT_APP',
    imageUrl: 'https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=1200&auto=format&fit=crop',
    featured: true,
    category: 'AI/ML',
    telemetryInsight: '⚡ PIPELINE: Async Subprocesses | ENGINES: Offline STT Engines',
  },
  {
    title: 'Tactical Chess Game App',
    description: 'A high-fidelity tactical two-player chess simulation built with native web execution layers and 0ms interactive input lag.',
    techStack: ['JavaScript', 'Game Logic', 'DOM Manipulation', 'CSS3'],
    liveUrl: 'https://github.com/G870-ops',
    githubUrl: 'https://github.com/G870-ops',
    imageUrl: 'https://images.unsplash.com/photo-1529699211952-734e80c4d42b?q=80&w=1200&auto=format&fit=crop',
    featured: false,
    category: 'Frontend',
    telemetryInsight: '⚡ MATRIX_STATE: Dynamic Board Grid Array | 0ms Input Lag',
  },
  {
    title: 'Goutam Computer Institute App',
    description: 'Comprehensive Android management platform for Goutam Computer Institute featuring student tracking and interactive modules.',
    techStack: ['Android UI', 'Java', 'Digital Management', 'SQLite'],
    liveUrl: 'https://github.com/G870-ops',
    githubUrl: 'https://github.com/G870-ops',
    imageUrl: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?q=80&w=1200&auto=format&fit=crop',
    featured: false,
    category: 'Mobile / Android',
    telemetryInsight: '⚡ ARCHITECTURE: Native Android Layouts | Progress Stream Engine',
  },
  {
    title: 'FlatBookingApp (StudentStay)',
    description: 'Housing accommodation platform featuring dual role-based access architectures for landlords and students.',
    techStack: ['Android Studio', 'Firebase Auth', 'Kotlin', 'Cloud Firestore'],
    liveUrl: 'https://github.com/G870-ops',
    githubUrl: 'https://github.com/G870-ops',
    imageUrl: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?q=80&w=1200&auto=format&fit=crop',
    featured: true,
    category: 'Mobile / Android',
    telemetryInsight: '⚡ AUTH_LATENCY: ~12ms sync | ROUTING: Role-Based Gateways',
  },
  {
    title: 'Stack Market App',
    description: 'Full-stack productivity workspace organizing enterprise project workflows with real-time tracking metrics.',
    techStack: ['React.js', 'Spring Boot', 'MySQL', 'Tailwind CSS'],
    liveUrl: 'https://github.com/G870-ops/Stock_Market_App',
    githubUrl: 'https://github.com/G870-ops/Stock_Market_App',
    imageUrl: 'https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?q=80&w=1200&auto=format&fit=crop',
    featured: true,
    category: 'Full Stack',
    telemetryInsight: '⚡ REST_PIPELINE: Non-blocking I/O | FRONTEND: High-Velocity Vite',
  },
  {
    title: 'Sci-Fi Scientific Calculator',
    description: 'Advanced Android calculator app featuring an interstellar neon UI, modular matrix solver, complex functions, and statistical conversions.',
    techStack: ['Android Studio', 'Java', 'XML', 'Material Design'],
    liveUrl: 'https://github.com/G870-ops/Scientifc_calculator_project',
    githubUrl: 'https://github.com/G870-ops/Scientifc_calculator_project',
    apkUrl: 'https://github.com/G870-ops/Scientifc_calculator_project/releases/download/v1.0.0/SciFi_Calculator_v1.0.apk',
    imageUrl: 'https://images.unsplash.com/photo-1611532736597-de2d4265fba3?q=80&w=1200&auto=format&fit=crop',
    featured: true,
    category: 'Mobile / Android',
    telemetryInsight: '⚡ RENDER: Native XML Layouts | MATH_ENGINE: Java BigDecimal Precision Core',
  },
];

const skillsData = [
  // Programming Languages
  { category: 'Programming Languages', name: 'JavaScript (ES6+)', proficiency: 92, icon: 'Code' },
  { category: 'Programming Languages', name: 'TypeScript', proficiency: 86, icon: 'FileCode' },
  { category: 'Programming Languages', name: 'Java', proficiency: 88, icon: 'Coffee' },
  { category: 'Programming Languages', name: 'C / C++', proficiency: 82, icon: 'Cpu' },
  { category: 'Programming Languages', name: 'Python', proficiency: 78, icon: 'Terminal' },

  // Frontend Engineering
  { category: 'Frontend Engineering', name: 'React.js', proficiency: 94, icon: 'Atom' },
  { category: 'Frontend Engineering', name: 'Tailwind CSS', proficiency: 92, icon: 'Wind' },
  { category: 'Frontend Engineering', name: 'HTML5 & CSS3', proficiency: 95, icon: 'Layout' },
  { category: 'Frontend Engineering', name: 'Vite & Next.js', proficiency: 84, icon: 'Zap' },
  { category: 'Frontend Engineering', name: 'Bootstrap', proficiency: 88, icon: 'Grid' },

  // Backend Ecosystem
  { category: 'Backend Ecosystem', name: 'Node.js', proficiency: 90, icon: 'Server' },
  { category: 'Backend Ecosystem', name: 'Express.js', proficiency: 91, icon: 'Layers' },
  { category: 'Backend Ecosystem', name: 'REST APIs & JWT', proficiency: 93, icon: 'Lock' },
  { category: 'Backend Ecosystem', name: 'Spring Boot', proficiency: 72, icon: 'Shield' },

  // Database Management
  { category: 'Database Management', name: 'MongoDB & Mongoose', proficiency: 90, icon: 'Database' },
  { category: 'Database Management', name: 'MySQL', proficiency: 85, icon: 'HardDrive' },
  { category: 'Database Management', name: 'Firebase Firestore', proficiency: 84, icon: 'Cloud' },

  // Tools & Core Skills
  { category: 'Tools & Core Skills', name: 'Git & GitHub', proficiency: 92, icon: 'GitBranch' },
  { category: 'Tools & Core Skills', name: 'Postman API Testing', proficiency: 90, icon: 'Send' },
  { category: 'Tools & Core Skills', name: 'Android Studio', proficiency: 86, icon: 'Smartphone' },
  { category: 'Tools & Core Skills', name: 'Data Structures & Algorithms', proficiency: 83, icon: 'Binary' },
];

const seedDB = async () => {
  try {
    const mongoUri = process.env.MONGO_URI;
    if (!mongoUri) {
      console.error('[SEED ERROR] MONGO_URI is missing in .env');
      process.exit(1);
    }

    await mongoose.connect(mongoUri);
    console.log('[SEED] Connected to MongoDB Atlas successfully.');

    // 1. Clear existing items
    await Project.deleteMany({});
    await Skill.deleteMany({});
    await User.deleteMany({});
    console.log('[SEED] Cleared existing Projects, Skills, and Users.');

    // 2. Insert Projects
    await Project.insertMany(projectsData);
    console.log(`[SEED] Inserted ${projectsData.length} projects.`);

    // 3. Insert Skills
    await Skill.insertMany(skillsData);
    console.log(`[SEED] Inserted ${skillsData.length} skills.`);

    // 4. Create Admin User
    const adminUser = new User({
      username: process.env.ADMIN_USERNAME || 'goutam',
      email: process.env.ADMIN_EMAIL || 'goutamgupta605@gmail.com',
      password: process.env.ADMIN_PASSWORD || 'adminPassword123!',
      role: 'admin',
    });
    await adminUser.save();
    console.log(`[SEED] Created Admin User: ${adminUser.username} (${adminUser.email})`);

    console.log('[SEED COMPLETE] MongoDB successfully seeded with real portfolio data!');
    process.exit(0);
  } catch (error) {
    console.error('[SEED ERROR]', error);
    process.exit(1);
  }
};

seedDB();
