# Pro Retouching — Commercial Photo Editing Website

Full-stack marketing site for a Dhaka-based e-commerce photo retouching studio.

- **Frontend:** React 19 + Vite + TypeScript + Tailwind CSS v4 (port 3000)
- **Backend:** Express + MongoDB (Mongoose) + Zod + JWT (port 5000)
- **Database:** MongoDB (local or MongoDB Atlas M0 free tier)
- **File uploads:** Cloudinary (free tier) — required for the public Free Test form and admin image uploads

All public pages load content from the backend (`GET /api/public/*`) and fall back to static data in `src/data/` if the API is down, times out, or returns nothing — the site never blanks out.

## Quick Start (local)

```bash
# 1. Install dependencies
npm install
npm --prefix server install

# 2. Configure the server
cp server/.env.example server/.env
# edit server/.env — set MONGO_URI and JWT_SECRET at minimum

# 3. Configure the client (optional; defaults to http://localhost:5000/api)
cp .env.example .env

# 4. Seed the database (admin user + public content, ~46 docs)
npm run seed

# 5. Run both client and server
npm run dev
# client → http://localhost:3000
# server → http://localhost:5000/api/health
```

Default admin login: `admin@proretouching.com` / the `ADMIN_PASSWORD` you set in `server/.env` (the seed uses `Admin123!` if unset in development).

## Environment Variables

### Server (`server/.env`)

| Variable | Required | Notes |
| --- | --- | --- |
| `MONGO_URI` | yes | Local `mongodb://127.0.0.1:27017/pro-retouching` or Atlas SRV string |
| `JWT_SECRET` | yes | Long random string (≥ 8 chars; use 32+ in production) |
| `NODE_ENV` | no | `development` (default), `production`, `test` |
| `PORT` | no | `5000` (default) |
| `CLIENT_URL` | no | Frontend origin for CORS cookies — `http://localhost:3000` (default); set to your Vercel URL in production |
| `CLOUDINARY_CLOUD_NAME` | prod | Required for Free Test uploads and admin image uploads |
| `CLOUDINARY_API_KEY` | prod | Same |
| `CLOUDINARY_API_SECRET` | prod | Same |
| `ADMIN_EMAIL` | no | Seed admin email — `admin@proretouching.com` (default) |
| `ADMIN_PASSWORD` | yes | Seed admin password |

### Client (`.env`)

| Variable | Required | Notes |
| --- | --- | --- |
| `VITE_API_URL` | no | Backend base URL including `/api`. Defaults to `http://localhost:5000/api`. In production set `https://<your-backend>/api`. This is the **only** value exposed to the browser — never put secrets here. |

## MongoDB Atlas (free) setup

1. Create a free M0 cluster at [cloud.mongodb.com](https://cloud.mongodb.com).
2. Database Access → add a user with *Read and write to any database*.
3. Network Access → allow your IP (or `0.0.0.0/0` for development).
4. Copy the connection string into `MONGO_URI` in `server/.env` (replace `<password>` and the database name).

## Cloudinary (free) setup

The **Free Test** public form and admin image uploads require Cloudinary. Without it configured, `POST /api/public/free-test` returns `503` and the form shows a friendly error.

1. Create a free account at [cloudinary.com](https://cloudinary.com).
2. Copy Cloud name, API Key, and API Secret from the dashboard into `CLOUDINARY_*` in `server/.env`.
3. Restart the server.

## Deploy

### Frontend (Vercel)

1. Push this repo to GitHub.
2. In Vercel: *New Project* → import the repo. Framework preset: **Vite**. Build command `npm run build`, output `dist`.
3. Set env var `VITE_API_URL=https://<your-backend-host>/api`.
4. Deploy. `vercel.json` already contains the SPA rewrite (`/(.*) → /index.html`) so client-side routes like `/services/clipping-path` work on refresh.

### Backend (Render or any Node host)

1. New Web Service → point at this repo, root directory `server`.
2. Build command `npm install`, start command `npm start`.
3. Set all server env vars above (`NODE_ENV=production`, your Vercel URL as `CLIENT_URL`, Atlas `MONGO_URI`, strong `JWT_SECRET`, Cloudinary keys, admin credentials).
4. After the first deploy, run the seed once from the host shell or locally against Atlas: `npm run seed`.

## Scripts

| Command | What it does |
| --- | --- |
| `npm run dev` | Client (3000) + server (5000) together |
| `npm run dev:client` | Client only |
| `npm run dev:server` | Server only |
| `npm run seed` | Reset + seed the database |
| `npm run build` | Production client build → `dist/` |
| `npm run lint` | TypeScript check (`tsc --noEmit`) |
| `npm --prefix server test` | Backend E2E suite (needs a running server + DB) |

## Project Layout

```
src/                 React app (public site + /admin dashboard)
  components/        Shared UI (Navbar, Footer, HeroSlider, Skeleton, ...)
  data/              Static fallback content (used when the API is down)
  hooks/usePublic.js Public content hooks (React Query + static fallbacks)
  lib/publicApi.js   Public API wrappers (GET cache + lead POSTs)
  pages/             Route components (Home, Services, ContactUs, admin/*)
server/src/          Express API
  config/            env, db, cloudinary
  controllers/       public + admin controllers
  middleware/        auth, upload (multer), rate limiting, errors
  models/            Mongoose models (Service, Work, FreeTest, ...)
  routes/            /api/public/* and /api/admin/* routers
  validators/        Zod schemas
tests/               Shell-based E2E verification scripts
```

## Known Limitations / Future Work

- The `Service` model does not yet store `category`, `startingPrice`, or `turnaround`; the public site merges these display-only fields from static data in `src/data/constants.ts` (matched by slug). Admin edits to title/description/images always win.
- The public Free Test form requires Cloudinary to be configured server-side; otherwise it returns 503 and the UI surfaces a retry-later message.
- Free Test accepts up to 5 files server-side (JPG/PNG/WebP, 5MB each); the public form caps at 3 files and validates the same limits client-side.
