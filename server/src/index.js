import app from './app.js';
import { env } from './config/env.js';
import { connectDB } from './config/db.js';

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
