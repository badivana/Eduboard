console.log("✅ app.js loaded");
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import mongoSanitize from 'express-mongo-sanitize';
import rateLimit from 'express-rate-limit';

import authRoutes from './routes/auth.routes.js';
import userRoutes from './routes/user.routes.js';
import courseRoutes from './routes/course.routes.js';
import enrollmentRoutes from './routes/enrollment.routes.js';
import reviewRoutes from './routes/review.routes.js';
import contactRoutes from './routes/contact.routes.js';
import planRoutes from './routes/plan.routes.js';

import { notFound, errorHandler } from './middleware/error.middleware.js';
const app = express();

app.get('/hello-chatgpt', (req, res) => {
  res.send('HELLO FROM CHATGPT');
});

// Behind Render/Vercel's proxy in production — needed for correct client IPs
// (rate limiting) and for secure cookies to be issued over forwarded HTTPS.
if (process.env.NODE_ENV === 'production') {
  app.set('trust proxy', 1);
}

// --- Security & parsing middleware ---
app.use(helmet());

// Explicit allow-list from env (comma-separated), plus any Vercel deployment
// URL for this project. Vercel mints a new preview hostname every deploy, so we
// match the project suffix instead of pinning a single URL.
const allowedOrigins = (process.env.CLIENT_URL || 'http://localhost:5173')
  .split(',')
  .map((o) => o.trim())
  .filter(Boolean);

const isAllowedOrigin = (origin) => {
  // Non-browser clients (curl, server-to-server) send no Origin — allow them.
  if (!origin) return true;
  if (allowedOrigins.includes(origin)) return true;
  try {
    const { hostname } = new URL(origin);
    // Your Vercel account's deployments, e.g. eduboard-<hash>-badivanas-projects.vercel.app
    if (hostname.endsWith('-badivanas-projects.vercel.app')) return true;
  } catch {
    return false;
  }
  return false;
};

app.use(
  cors({
    origin: (origin, callback) =>
      isAllowedOrigin(origin)
        ? callback(null, true)
        : callback(new Error(`Not allowed by CORS: ${origin}`)),
    credentials: true,
  })
);
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(mongoSanitize());

if (process.env.NODE_ENV !== 'test') {
  app.use(morgan('dev'));
}

// Rate limit the API surface
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 300,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: 'Too many requests, please try again later.' },
});
app.use('/api', apiLimiter);

// --- Health check ---
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', service: 'eduboard-api', time: new Date().toISOString() });
});

console.log("✅ Mounting course routes");
app.use('/api/courses', courseRoutes);

// --- Routes ---
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/enrollments', enrollmentRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/plans', planRoutes);

// --- Error handling ---
app.use(notFound);
app.use(errorHandler);
console.log("✅ routes mounted");
export default app;
