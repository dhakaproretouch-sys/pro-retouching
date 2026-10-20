import app from '../server/src/app.js';

/**
 * Vercel serverless function entry. `vercel.json` rewrites every `/api/*`
 * request here, and the Express app handles the rest of the routing.
 * The database connection is established lazily (and cached across
 * invocations) by the middleware in server/src/app.js.
 */
export default app;
