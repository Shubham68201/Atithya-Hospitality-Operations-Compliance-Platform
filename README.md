# Atithya — Hospitality Operations & Compliance Platform

> **Check In Se Compliance Tak — Sab Automatic**  
> A product by **Shri Perumal Hospitality Innovations Pvt. Ltd.**  
> Incubated at **AIC-MFIE-IMS-BHU, Varanasi**

---

## 🏗️ Tech Stack

| Layer      | Technology                                           |
|------------|------------------------------------------------------|
| Frontend   | React 18 + Vite, Tailwind CSS v3, DaisyUI, Framer Motion |
| State      | Redux Toolkit                                        |
| Forms      | React Hook Form + Zod                                |
| Charts     | Recharts                                             |
| Routing    | React Router DOM v6                                  |
| Backend    | Node.js + Express.js                                 |
| Database   | MongoDB + Mongoose                                   |
| Auth       | JWT (httpOnly cookies) + OTP via Email               |
| Email      | Nodemailer (Gmail SMTP)                              |
| File Upload| Cloudinary + Multer                                  |
| Security   | Helmet, CORS, express-rate-limit, bcryptjs           |

---

## 📁 Project Structure

```
atithya/
├── backend/
│   ├── config/          # DB, Cloudinary, Nodemailer
│   ├── controllers/     # Route handlers
│   ├── middleware/       # Auth, role, rate-limit, upload, error
│   ├── models/          # Mongoose schemas
│   ├── routes/          # Express routers
│   ├── seed/            # Seed script with sample data
│   ├── services/        # Email service (branded HTML)
│   ├── utils/           # JWT, OTP, API response helpers
│   └── server.js
└── frontend/
    ├── src/
    │   ├── api/         # Axios instance
    │   ├── app/         # Redux store
    │   ├── components/  # Navbar, Footer, Layouts, Guards
    │   ├── features/    # Redux slices
    │   └── pages/
    │       ├── auth/    # Login, Register, OTP, Password reset
    │       ├── public/  # Home, About, Solutions, Careers, Contact
    │       └── admin/   # Dashboard, Users, Demos, Messages, Jobs,
    │                    #  Applications, CMS, Properties, Compliance,
    │                    #  Notifications, Profile
    └── index.html
```

---

## 🚀 Getting Started

### 1. Clone & install

```bash
# Backend
cd backend
npm install

# Frontend
cd ../frontend
npm install
```

### 2. Configure environment

```bash
# Backend
cp .env.example .env
# Edit .env — fill in MongoDB URI, Gmail SMTP, Cloudinary, JWT secrets

# Frontend
cp .env.example .env
# Edit VITE_API_BASE_URL if needed (default: http://localhost:5000/api)
```

### 3. Seed the database

```bash
cd backend
npm run seed
```

This creates all users, properties, jobs, demo requests, compliance records,  
contact messages, and website content with realistic data.

**After seeding, credentials are printed in the terminal. Save them.**

### 4. Run development servers

```bash
# Terminal 1 — Backend
cd backend
npm run dev   # runs on port 5000

# Terminal 2 — Frontend
cd frontend
npm run dev   # runs on port 5173
```

Open: **http://localhost:5173**

---

## 🔐 Seed Credentials

| Role               | Email                        | Password                 |
|--------------------|------------------------------|--------------------------|
| Super Admin        | superadmin@atithya.in        | Sp3r!A#9kXmN2@qZ         |
| Admin              | admin@atithya.in             | Adm!nS#4rMa$7tY2         |
| Operations Manager | operations@atithya.in        | 0pZ#Nair$3mQ!7vXr        |
| Compliance Manager | compliance@atithya.in        | C0mpl!M3hta#9Xv$k        |
| Staff              | staff@atithya.in             | St@ff!K4v#9Rd$2mZ        |
| Customer           | customer@atithya.in          | Cu$t0!R4jan#7Pl2X        |

> ⚠️ **Change all passwords immediately after first login in production.**

---

## 🌐 Public Pages

| Route        | Description                                |
|--------------|--------------------------------------------|
| `/`          | Home — Hero, Stats, Features, Testimonials |
| `/about`     | About Atithya & Shri Perumal               |
| `/solutions` | Platform modules & features                |
| `/careers`   | Job listings + Apply modal                 |
| `/contact`   | Contact form + Demo request form           |

---

## 🔒 Admin Panel Pages

| Route                    | Access                          |
|--------------------------|---------------------------------|
| `/dashboard`             | All staff roles                 |
| `/admin/users`           | Admin+                          |
| `/admin/demo-requests`   | Admin+                          |
| `/admin/messages`        | Admin+                          |
| `/admin/jobs`            | Admin+                          |
| `/admin/applications`    | Admin+                          |
| `/admin/content`         | Admin+                          |
| `/admin/properties`      | Admin+, Operations Manager      |
| `/admin/compliance`      | Admin+, Compliance Manager      |
| `/admin/notifications`   | All staff roles                 |
| `/admin/profile`         | All authenticated users         |

---

## 📧 Email Templates

All outgoing emails use a branded dark-navy + gold HTML template:

- **OTP Verification** — Sent on register & forgot password
- **Welcome Email** — Sent after account verification
- **Demo Confirmation** — Sent to demo requesters
- **Contact Reply** — Sent when admin replies to a message

---

## 🔑 API Endpoints

```
POST   /api/auth/register
POST   /api/auth/verify-otp
POST   /api/auth/login
POST   /api/auth/logout
GET    /api/auth/me
POST   /api/auth/forgot-password
POST   /api/auth/reset-password
POST   /api/auth/resend-otp
PATCH  /api/auth/change-password

GET    /api/users            (admin)
GET    /api/users/:id        (admin)
PATCH  /api/users/:id/role   (super_admin)
PATCH  /api/users/:id/status (admin)
DELETE /api/users/:id        (super_admin)
PUT    /api/users/profile    (authenticated)

GET    /api/dashboard/stats  (admin)
GET    /api/dashboard/charts (admin)

GET    /api/content
PUT    /api/content/:page/:section/:key (admin)

POST   /api/contact
GET    /api/contact          (admin)
POST   /api/contact/:id/reply (admin)
DELETE /api/contact/:id      (admin)

POST   /api/demo
GET    /api/demo             (admin)
GET    /api/demo/:id         (admin)
PATCH  /api/demo/:id/status  (admin)
POST   /api/demo/:id/notes   (admin)
DELETE /api/demo/:id         (admin)

GET    /api/careers/jobs
GET    /api/careers/jobs/:id
POST   /api/careers/jobs        (admin)
PUT    /api/careers/jobs/:id    (admin)
DELETE /api/careers/jobs/:id    (admin)
POST   /api/careers/apply/:id
GET    /api/careers/applications (admin)
PATCH  /api/careers/applications/:id/status (admin)

GET    /api/properties       (ops+)
POST   /api/properties       (ops+)
PUT    /api/properties/:id   (ops+)
DELETE /api/properties/:id   (ops+)

GET    /api/compliance       (compliance+)
POST   /api/compliance       (compliance+)
PUT    /api/compliance/:id   (compliance+)
PATCH  /api/compliance/:id/status (compliance+)
DELETE /api/compliance/:id   (compliance+)

GET    /api/notifications    (authenticated)
PATCH  /api/notifications/read-all
DELETE /api/notifications/:id
```

---

## 🏭 Production Deployment

1. Set `NODE_ENV=production` in backend `.env`
2. Build frontend: `cd frontend && npm run build`
3. Serve `frontend/dist` via Nginx or via Express static middleware
4. Use PM2 for backend process management: `pm2 start server.js`
5. Set up MongoDB Atlas for cloud database
6. Configure Cloudinary for file uploads
7. Use a real domain for CORS `CLIENT_URL`

---

## 📞 Support

**Shri Perumal Hospitality Innovations Pvt. Ltd.**  
📧 sriperumal.aperio@gmail.com  
📞 +91 8828273581  
📍 AIC-MFIE-IMS-BHU, Varanasi, Uttar Pradesh

---

*Built with ❤️ for India's Hospitality Industry*
