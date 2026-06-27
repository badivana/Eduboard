/**
 * Seed script — populates MongoDB with demo data.
 * Run with: npm run seed
 */
import dotenv from 'dotenv';
dotenv.config();

import mongoose from 'mongoose';
import connectDB from '../config/db.js';
import User from '../models/User.js';
import Course from '../models/Course.js';
import Plan from '../models/Plan.js';
import Enrollment from '../models/Enrollment.js';
import Review from '../models/Review.js';

const PLANS = [
  {
    name: 'Free',
    price: 0,
    interval: 'month',
    tagline: 'Get started with the basics',
    order: 1,
    features: ['Access to 10 free courses', 'Community support', 'Course certificates', 'Mobile & desktop access'],
  },
  {
    name: 'Pro',
    price: 19,
    interval: 'month',
    tagline: 'For serious learners',
    highlighted: true,
    order: 2,
    features: [
      'Unlimited course access',
      'Downloadable resources',
      'Priority support',
      'Verified certificates',
      'Offline viewing',
    ],
  },
  {
    name: 'Teams',
    price: 49,
    interval: 'month',
    tagline: 'For organizations & teams',
    order: 3,
    features: [
      'Everything in Pro',
      'Up to 20 team members',
      'Team analytics dashboard',
      'Dedicated account manager',
      'Custom learning paths',
    ],
  },
];

const COURSES = [
  {
    title: 'Modern Web Development with the MERN Stack',
    subtitle: 'Build full-stack apps with MongoDB, Express, React & Node',
    category: 'Development',
    level: 'Intermediate',
    price: 49.99,
    featured: true,
    thumbnail: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800&q=80',
    description:
      'Master the MERN stack from the ground up. You will build a production-ready application with authentication, REST APIs, a React frontend, and a MongoDB database — exactly like the platform you are using right now.',
    tags: ['react', 'node', 'mongodb', 'express', 'javascript'],
    lessons: [
      { title: 'Course Introduction & Setup', duration: 12, isPreview: true },
      { title: 'Designing the MongoDB Schema', duration: 28 },
      { title: 'Building the Express REST API', duration: 45 },
      { title: 'JWT Authentication', duration: 38 },
      { title: 'React Frontend with Hooks', duration: 52 },
      { title: 'Deploying to Production', duration: 31 },
    ],
  },
  {
    title: 'UI/UX Design Fundamentals',
    subtitle: 'Design beautiful, user-friendly interfaces',
    category: 'Design',
    level: 'Beginner',
    price: 0,
    featured: true,
    thumbnail: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800&q=80',
    description:
      'Learn the principles of great design: color theory, typography, spacing, and user psychology. Create wireframes and prototypes that users love.',
    tags: ['design', 'figma', 'ux', 'ui'],
    lessons: [
      { title: 'What is UX Design?', duration: 15, isPreview: true },
      { title: 'Color Theory & Typography', duration: 33 },
      { title: 'Wireframing in Figma', duration: 40 },
      { title: 'Prototyping & Testing', duration: 27 },
    ],
  },
  {
    title: 'Python for Data Science & Machine Learning',
    subtitle: 'From zero to predictive models',
    category: 'Data Science',
    level: 'Intermediate',
    price: 59.99,
    featured: true,
    thumbnail: 'https://images.unsplash.com/photo-1526379095098-d400fd0bf935?w=800&q=80',
    description:
      'A hands-on journey through NumPy, Pandas, Matplotlib, and scikit-learn. Analyze real datasets and train your first machine learning models.',
    tags: ['python', 'data', 'machine-learning', 'pandas'],
    lessons: [
      { title: 'Python Crash Course', duration: 50, isPreview: true },
      { title: 'Data Wrangling with Pandas', duration: 48 },
      { title: 'Visualization with Matplotlib', duration: 35 },
      { title: 'Intro to Machine Learning', duration: 55 },
      { title: 'Building a Prediction Model', duration: 42 },
    ],
  },
  {
    title: 'Digital Marketing Masterclass',
    subtitle: 'Grow any brand online in 2026',
    category: 'Marketing',
    level: 'All Levels',
    price: 39.99,
    thumbnail: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&q=80',
    description:
      'SEO, social media, email marketing, and paid ads — everything you need to drive traffic and convert customers.',
    tags: ['marketing', 'seo', 'social-media'],
    lessons: [
      { title: 'Marketing Foundations', duration: 20, isPreview: true },
      { title: 'Mastering SEO', duration: 44 },
      { title: 'Social Media Strategy', duration: 38 },
      { title: 'Email & Funnels', duration: 30 },
    ],
  },
  {
    title: 'Photography: From Beginner to Pro',
    subtitle: 'Take stunning photos with any camera',
    category: 'Photography',
    level: 'Beginner',
    price: 29.99,
    thumbnail: 'https://images.unsplash.com/photo-1452587925148-ce544e77e70d?w=800&q=80',
    description:
      'Understand exposure, composition, and lighting. Learn to edit your photos and build a portfolio that stands out.',
    tags: ['photography', 'editing', 'lightroom'],
    lessons: [
      { title: 'Camera Basics', duration: 25, isPreview: true },
      { title: 'Composition Rules', duration: 32 },
      { title: 'Lighting & Exposure', duration: 36 },
      { title: 'Editing in Lightroom', duration: 41 },
    ],
  },
  {
    title: 'Startup & Business Strategy 101',
    subtitle: 'Turn your idea into a business',
    category: 'Business',
    level: 'All Levels',
    price: 44.99,
    thumbnail: 'https://images.unsplash.com/photo-1664575602554-2087b04935a5?w=800&q=80',
    description:
      'Validate ideas, write a business plan, understand finance, and pitch to investors. A practical guide for aspiring founders.',
    tags: ['business', 'startup', 'entrepreneurship'],
    lessons: [
      { title: 'Finding a Winning Idea', duration: 22, isPreview: true },
      { title: 'Market Validation', duration: 34 },
      { title: 'Business Models', duration: 29 },
      { title: 'Pitching to Investors', duration: 37 },
    ],
  },
];

const seed = async () => {
  try {
    await connectDB();
    console.log('🧹 Clearing existing data...');
    await Promise.all([
      User.deleteMany(),
      Course.deleteMany(),
      Plan.deleteMany(),
      Enrollment.deleteMany(),
      Review.deleteMany(),
    ]);

    console.log('👤 Creating users...');
    // create() triggers the password-hashing pre-save hook
    const admin = await User.create({
      name: 'Admin User',
      email: 'admin@eduboard.com',
      password: 'admin123',
      role: 'admin',
      bio: 'Platform administrator.',
    });

    const instructor1 = await User.create({
      name: 'Sarah Mitchell',
      email: 'sarah@eduboard.com',
      password: 'password123',
      role: 'instructor',
      bio: 'Full-stack engineer & educator with 10 years of experience.',
      avatar: 'https://i.pravatar.cc/150?img=47',
    });

    const instructor2 = await User.create({
      name: 'David Chen',
      email: 'david@eduboard.com',
      password: 'password123',
      role: 'instructor',
      bio: 'Data scientist and machine learning practitioner.',
      avatar: 'https://i.pravatar.cc/150?img=12',
    });

    const student = await User.create({
      name: 'Demo Student',
      email: 'student@eduboard.com',
      password: 'password123',
      role: 'student',
      avatar: 'https://i.pravatar.cc/150?img=32',
    });

    console.log('💳 Creating pricing plans...');
    await Plan.insertMany(PLANS);

    console.log('📚 Creating courses...');
    const instructors = [instructor1, instructor2];
    const createdCourses = [];
    for (let i = 0; i < COURSES.length; i++) {
      const course = await Course.create({
        ...COURSES[i],
        instructor: instructors[i % instructors.length]._id,
      });
      createdCourses.push(course);
    }

    console.log('🎓 Enrolling demo student & adding reviews...');
    const enrollIn = createdCourses.slice(0, 3);
    for (const course of enrollIn) {
      await Enrollment.create({
        student: student._id,
        course: course._id,
        pricePaid: course.price,
        progress: 40,
        status: 'active',
      });
      course.enrolledCount += 1;
      await course.save();

      await Review.create({
        course: course._id,
        user: student._id,
        rating: 5,
        comment: 'Fantastic course — clear, practical, and well-paced!',
      });
    }

    // The Review post-save hook recalculates ratings in the background; do it
    // explicitly here and await so the aggregates are written before we exit.
    await Promise.all(enrollIn.map((c) => Review.recalcRating(c._id)));

    console.log('\n✅ Seed complete!');
    console.log('───────────────────────────────');
    console.log('Admin     → admin@eduboard.com / admin123');
    console.log('Instructor→ sarah@eduboard.com / password123');
    console.log('Student   → student@eduboard.com / password123');
    console.log('───────────────────────────────');

    // Exit directly — process teardown closes the pool without racing
    // any straggling background hook queries.
    process.exit(0);
  } catch (err) {
    console.error('❌ Seed failed:', err);
    process.exit(1);
  }
};

seed();
