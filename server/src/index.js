import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import mongoSanitize from 'express-mongo-sanitize';
import morgan from 'morgan';

import { env, isProd } from './config/env.js';
import { connectDB } from './config/db.js';
import apiRoutes from './routes/index.js';
import { apiLimiter } from './middleware/rateLimiter.js';
import { notFound, errorHandler } from './middleware/errorHandler.js';

const app = express();

// Behind a proxy (Vercel / nginx) so req.ip and secure cookies work correctly
app.set('trust proxy', 1);

// Security headers
app.use(helmet());

// CORS: only the frontend origin gets CORS headers, with credentials (cookies)
// allowed. Requests from any other origin receive no CORS headers at all.
app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || origin === env.CLIENT_URL) return callback(null, true);
      return callback(null, false);
    },
    credentials: true,
  })
);

// Body parsing with a sane limit (base64-encoded uploads live in later phases)
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

app.use(cookieParser());

// Strip `$`/`.` operators from user input to prevent NoSQL injection
app.use(mongoSanitize());

if (!isProd) app.use(morgan('dev'));

// Routes
app.use('/api', apiLimiter, apiRoutes);

// 404 → central error handler → { success, message, data }
app.use(notFound);
app.use(errorHandler);

async function start() {
  try {
    await connectDB();
    app.listen(env.PORT, () => {
      console.log(`🚀 API server running on http://localhost:${env.PORT} (${env.NODE_ENV})`);
      console.log(`   Health check: http://localhost:${env.PORT}/api/health`);
      console.log(`   CORS origin:  ${env.CLIENT_URL}`);
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error.message);
    process.exit(1);
  }
}

start();

export default app;
