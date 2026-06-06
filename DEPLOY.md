# Atithya — Deployment Guide
## Frontend → Vercel | Backend → Render | Docker for local/self-host

---

## 🔑 Critical: Environment Variables Checklist

Before deploying, make sure ALL of these are configured or you will get 500 errors:

| Variable | Where | Notes |
|---|---|---|
| `MONGO_URI` | Render | MongoDB Atlas connection string |
| `JWT_SECRET` | Render | Random 32+ char string |
| `SMTP_USER` | Render | Your Gmail address |
| `SMTP_PASS` | Render | Gmail **App Password** (not your login password) |
| `FROM_EMAIL` | Render | Same as SMTP_USER |
| `CLOUDINARY_CLOUD_NAME` | Render | From Cloudinary dashboard |
| `CLOUDINARY_API_KEY` | Render | From Cloudinary dashboard |
| `CLOUDINARY_API_SECRET` | Render | From Cloudinary dashboard |
| `CLIENT_URL` | Render | Your Vercel URL e.g. `https://atithya.vercel.app` |
| `VITE_API_BASE_URL` | Vercel | Your Render URL e.g. `https://atithya-backend.onrender.com/api` |

---

## 🍃 MongoDB Atlas Setup

1. Go to [mongodb.com/atlas](https://www.mongodb.com/atlas) → Create free M0 cluster (Singapore region)
2. **Database Access** → Add User → username + password → Read/Write to any database
3. **Network Access** → Add IP → `0.0.0.0/0` (allow all — required for Render)
4. **Connect** → Drivers → Copy connection string → replace `<password>`
5. Use as `MONGO_URI` in Render

---

## ☁️ Cloudinary Setup (for public file access)

1. Go to [cloudinary.com](https://cloudinary.com) → Free account
2. Dashboard → copy **Cloud Name**, **API Key**, **API Secret**
3. Go to **Settings → Upload** → Make sure default upload preset is set to **Unsigned** or create one
4. Files uploaded via Atithya will be at `https://res.cloudinary.com/<cloud_name>/...`
5. ✅ All uploads use `type: "upload"` and `access_mode: "public"` — no "Access Blocked" errors

---

## 📧 Gmail SMTP Setup (App Password required)

> ⚠️ Regular Gmail password does NOT work. You must use an App Password.

1. Go to [myaccount.google.com](https://myaccount.google.com)
2. **Security** → Enable **2-Step Verification** (required)
3. **Security** → Search "App passwords" → Select "Mail" + device → **Generate**
4. Copy the 16-char password (e.g. `abcd efgh ijkl mnop`) → use as `SMTP_PASS` (no spaces)
5. Set `SMTP_USER` and `FROM_EMAIL` to your Gmail address

> **Test:** After deploying, hit `GET /api/health` — it shows `smtp_user: configured` or `MISSING`

---

## 🚀 Backend Deployment (Render)

### 1. Push backend to GitHub
```bash
cd atithya/backend
git init
git add .
git commit -m "Initial backend"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/atithya-backend.git
git push -u origin main
```

### 2. Create Render Web Service
1. [render.com](https://render.com) → **New → Web Service**
2. Connect GitHub repo → select `atithya-backend`
3. Configure:
   - **Name:** `atithya-backend`
   - **Region:** Singapore
   - **Branch:** `main`
   - **Runtime:** Node
   - **Build Command:** `npm install`
   - **Start Command:** `node server.js`
   - **Plan:** Free (or Starter $7/mo to avoid cold starts)

### 3. Add ALL environment variables
```
NODE_ENV=production
PORT=10000
MONGO_URI=mongodb+srv://user:pass@cluster.mongodb.net/atithya_db
JWT_SECRET=your_random_32_char_secret_here
JWT_EXPIRE=7d
COOKIE_EXPIRE=7
CLIENT_URL=https://your-app.vercel.app
CLIENT_URL_2=                          # (optional second domain)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your_gmail@gmail.com
SMTP_PASS=your_16char_app_password
FROM_NAME=Atithya Platform
FROM_EMAIL=your_gmail@gmail.com
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
OTP_EXPIRE_MINUTES=10
```

### 4. Verify deployment
```
GET https://atithya-backend.onrender.com/api/health
```
Should return `"smtp_user": "configured"` and `"cloudinary": "configured"`.

### 5. Seed database (optional)
In Render dashboard → your service → **Shell**:
```bash
node seed/seed.js
```

---

## 🌐 Frontend Deployment (Vercel)

### 1. Push frontend to GitHub
```bash
cd atithya/frontend
git init
git add .
git commit -m "Initial frontend"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/atithya-frontend.git
git push -u origin main
```

### 2. Deploy on Vercel
1. [vercel.com](https://vercel.com) → **New Project** → Import frontend repo
2. Configure:
   - **Framework Preset:** Vite
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`

### 3. Add Environment Variables on Vercel
```
VITE_API_BASE_URL=https://atithya-backend.onrender.com/api
VITE_APP_NAME=Atithya
VITE_CONTACT_EMAIL=sriperumal.aperio@gmail.com
VITE_CONTACT_PHONE=+91 8828273581
```

### 4. Update CLIENT_URL on Render
Copy your Vercel URL → go to Render env vars → update `CLIENT_URL`.
This is required for CORS to work!

### 5. The `vercel.json` (already in project)
Handles React Router SPA — prevents 404 on page refresh:
```json
{ "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }] }
```

---

## 🐳 Docker (Local / Self-hosted)

### Quick start
```bash
# Clone the repo
git clone https://github.com/YOUR_USERNAME/atithya.git
cd atithya

# Copy and fill env file
cp backend/.env.example backend/.env
# Edit backend/.env with your values

# Build and run everything
docker-compose up --build

# Access:
# Frontend: http://localhost:80
# Backend:  http://localhost:5000/api/health
```

### Backend only (Docker)
```bash
cd backend
docker build -t atithya-backend .
docker run -p 5000:5000 --env-file .env atithya-backend
```

### Frontend only (Docker with nginx)
```bash
cd frontend
docker build --build-arg VITE_API_BASE_URL=http://localhost:5000/api -t atithya-frontend .
docker run -p 80:80 atithya-frontend
```

---

## 🐛 Troubleshooting

| Problem | Likely Cause | Fix |
|---|---|---|
| Register returns 500 in prod | SMTP not configured | Set SMTP_USER, SMTP_PASS (App Password) in Render |
| Login works locally, not in prod | Cross-origin cookie | Cookie is `sameSite:none, secure:true` in prod — ensure HTTPS on both ends |
| Home page redirects to login | `/api/auth/me` 401 triggering redirect | Fixed in authSlice — 401 = guest state, no redirect |
| CORS error | CLIENT_URL mismatch | Set exact Vercel URL (no trailing slash) in Render's CLIENT_URL |
| File uploads "Access Control Blocked" | Cloudinary `type:authenticated` | Fixed — uploads use `type:upload, access_mode:public` |
| Compliance properties dropdown empty | Role-based access | Fixed — all staff roles can now read properties |
| Render cold start (~30s) | Free plan | Upgrade to Starter ($7/mo) or use UptimeRobot to ping every 14min |
| OTP email not arriving | Gmail blocking | Use App Password, not regular password. Check spam folder. |
| MongoDB connection timeout | Atlas Network Access | Add `0.0.0.0/0` in Atlas Network Access settings |

---

## 🔑 Seed Credentials

| Role | Email | Password |
|---|---|---|
| Super Admin | superadmin@atithya.in | Sp3r!A#9kXmN2@qZ |
| Admin | admin@atithya.in | Adm!nS#4rMa$7tY2 |
| Operations Manager | operations@atithya.in | 0pZ#Nair$3mQ!7vXr |
| Compliance Manager | compliance@atithya.in | C0mpl!M3hta#9Xv$k |
| Staff | staff@atithya.in | St@ff!K4v#9Rd$2mZ |
| Customer | customer@atithya.in | Cu$t0!R4jan#7Pl2X |

> ⚠️ Change all passwords immediately after first production login.
