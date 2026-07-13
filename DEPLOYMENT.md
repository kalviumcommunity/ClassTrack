# ClassTrack — Deployment Guide

**Stack:** React/Vite (frontend) · Express/Node.js (backend) · MongoDB Atlas

| Layer | Platform | Free Tier? |
|-------|----------|-----------|
| Frontend | [Vercel](https://vercel.com) | ✅ Yes |
| Backend API | [Render](https://render.com) | ✅ Yes (sleeps after 15 min) |
| Database | [MongoDB Atlas](https://cloud.mongodb.com) | ✅ Yes (512 MB M0) |

---

## Phase 1 — MongoDB Atlas (Database)

> Do this first — you'll need the connection string for Render.

1. Go to [cloud.mongodb.com](https://cloud.mongodb.com) and sign in / register.
2. Click **Create a deployment** → choose **M0 Free** → pick a region close to you → name it `classtrack` → **Create**.
3. When prompted to create a database user:
   - **Username:** `classtrack_user`
   - **Password:** generate a strong one and **save it** (you'll need it shortly)
   - Click **Create User**
4. Under **Network Access** → **Add IP Address** → enter `0.0.0.0/0` (allows Render's dynamic IPs) → **Confirm**.
5. Back on the cluster view, click **Connect** → **Drivers** → copy the connection string. It looks like:
   ```
   mongodb+srv://classtrack_user:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```
6. Replace `<password>` with your actual password and append the DB name:
   ```
   mongodb+srv://classtrack_user:YOUR_PASS@cluster0.xxxxx.mongodb.net/classtrack?retryWrites=true&w=majority&appName=Cluster0
   ```
   **Save this string — it becomes `MONGO_URI`.**

---

## Phase 2 — Render (Backend API)

### Option A — Render Blueprint (recommended, uses `render.yaml`)

1. Go to [render.com](https://render.com) → **New** → **Blueprint**.
2. Connect your GitHub repository (`ClassTrack`).
3. Render auto-detects `render.yaml` at the repo root and shows the `classtrack-api` service.
4. Click **Apply** — Render will prompt you to fill in the `sync: false` env vars (all the sensitive ones).

### Option B — Manual Setup

1. **New** → **Web Service** → connect your GitHub repo.
2. Settings:
   | Setting | Value |
   |---------|-------|
   | Name | `classtrack-api` |
   | Root Directory | `backend` |
   | Runtime | `Node` |
   | Build Command | `npm install` |
   | Start Command | `node server.js` |
3. Click **Create Web Service**.

### Environment Variables (set in Render Dashboard)

Go to your service → **Environment** → add each key:

| Key | Value |
|-----|-------|
| `NODE_ENV` | `production` |
| `PORT` | `5000` |
| `MONGO_URI` | *(your Atlas connection string from Phase 1)* |
| `JWT_SECRET` | *(run `node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"` locally to generate)* |
| `FRONTEND_URL` | *(fill in after Vercel deploy — e.g. `https://classtrack.vercel.app`)* |
| `SMTP_HOST` | `smtp.gmail.com` |
| `SMTP_PORT` | `465` |
| `SMTP_SECURE` | `true` |
| `SMTP_USER` | *(your Gmail address)* |
| `SMTP_PASS` | *(your Gmail [App Password](https://myaccount.google.com/apppasswords))* |
| `EMAIL_FROM` | `ClassTrack <your.email@gmail.com>` |
| `OPENAI_API_KEY` | *(your OpenAI key — optional, only needed for AI search)* |
| `GOOGLE_CLIENT_ID` | *(your Google OAuth client ID)* |
| `GOOGLE_CLIENT_SECRET` | *(your Google OAuth secret)* |
| `GOOGLE_CALLBACK_URL` | `https://classtrack-api.onrender.com/api/auth/google/callback` |

4. Click **Save Changes** → Render will redeploy automatically.
5. Wait for the deploy to show **Live** (usually 2–3 minutes).
6. Test: visit `https://classtrack-api.onrender.com/api/health` — you should see:
   ```json
   { "status": "ok", "uptime": 12.3, "timestamp": "..." }
   ```
7. **Copy your Render URL** — e.g. `https://classtrack-api.onrender.com`

---

## Phase 3 — Vercel (Frontend)

1. Go to [vercel.com](https://vercel.com) → **Add New Project** → **Import Git Repository** → select `ClassTrack`.
2. Configure the project:
   | Setting | Value |
   |---------|-------|
   | **Root Directory** | `frontend` |
   | **Framework Preset** | Vite *(auto-detected)* |
   | **Build Command** | `npm run build` |
   | **Output Directory** | `dist` |
3. Expand **Environment Variables** and add:
   | Key | Value |
   |-----|-------|
   | `VITE_API_URL` | `https://classtrack-api.onrender.com/api` |
   | `VITE_GA_MEASUREMENT_ID` | *(your GA4 ID, e.g. `G-XXXXXXXXXX` — optional)* |
4. Click **Deploy**.
5. Vercel will build and give you a URL like `https://classtrack.vercel.app`.

---

## Phase 4 — Wire Everything Together

### 4a. Update Render FRONTEND_URL

1. Go back to Render → your service → **Environment**.
2. Set `FRONTEND_URL` = `https://classtrack.vercel.app` (your actual Vercel URL).
3. Click **Save Changes** — Render redeploys.

### 4b. Update Google OAuth Authorized Redirect URIs

1. Go to [Google Cloud Console](https://console.cloud.google.com) → **APIs & Services** → **Credentials**.
2. Click your OAuth 2.0 Client ID.
3. Under **Authorized redirect URIs**, add:
   ```
   https://classtrack-api.onrender.com/api/auth/google/callback
   ```
4. Under **Authorized JavaScript origins**, add:
   ```
   https://classtrack.vercel.app
   ```
5. Click **Save**.

---

## Phase 5 — Verification Checklist

Run through these after all three platforms are deployed:

- [ ] Visit `https://classtrack.vercel.app` → app loads, login page renders
- [ ] Visit `https://classtrack-api.onrender.com/api/health` → returns `{ "status": "ok" }`
- [ ] Login with email/password → JWT auth works
- [ ] Login with Google → OAuth flow completes and redirects back to app
- [ ] Create a student → data persists in MongoDB Atlas
- [ ] Mark attendance → data persists correctly
- [ ] Contact form → email is received (tests SMTP config)
- [ ] Navigate to `/dashboard` directly (hard refresh) → page loads (tests `vercel.json` rewrites)

---

## Seed Initial Admin User (Optional)

After Render is live, you can seed the database from your local machine:

```bash
# In your project root
MONGO_URI="mongodb+srv://..." node backend/utils/seed.js
```

Or trigger it via Render's **Shell** tab in the dashboard:
```bash
node utils/seed.js
```

---

## Continuous Deployment

After this setup, every `git push` to `main`:
- **Vercel** automatically rebuilds and redeploys the frontend
- **Render** automatically rebuilds and redeploys the backend
- **GitHub Actions** (`ci.yml`) runs your CI pipeline (backend health check + frontend build)

---

## Troubleshooting

| Issue | Fix |
|-------|-----|
| Render deploy fails | Check build logs in Render dashboard; likely a missing env var |
| `CORS` errors in browser | Ensure `FRONTEND_URL` on Render matches your exact Vercel URL (no trailing slash) |
| App shows blank page on refresh | Confirm `frontend/vercel.json` was committed to git |
| Google OAuth "redirect_uri_mismatch" | The Render callback URL must exactly match what's in Google Cloud Console |
| Render cold start is slow | Normal on free tier; first request after 15 min idle takes 30–60s to wake up |
| MongoDB connection timeout | Check Atlas Network Access — `0.0.0.0/0` must be whitelisted |
