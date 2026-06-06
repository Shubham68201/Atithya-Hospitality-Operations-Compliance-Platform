import "dotenv/config";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import cookieParser from "cookie-parser";

import { connectDB } from "./config/db.js";
import { errorHandler, notFound } from "./middleware/errorMiddleware.js";
import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import dashboardRoutes from "./routes/dashboardRoutes.js";
import contentRoutes from "./routes/contentRoutes.js";
import contactRoutes from "./routes/contactRoutes.js";
import demoRoutes from "./routes/demoRoutes.js";
import careerRoutes from "./routes/careerRoutes.js";
import propertyRoutes from "./routes/propertyRoutes.js";
import complianceRoutes from "./routes/complianceRoutes.js";
import notificationRoutes from "./routes/notificationRoutes.js";
import messageRoutes from "./routes/messageRoutes.js";

const app = express();

connectDB();

// ── CORS ─────────────────────────────────────────────────────────────
// Allow multiple origins: local dev + production Vercel URL
const ALLOWED_ORIGINS = [
  "http://localhost:5173",
  "http://localhost:3000",
  process.env.CLIENT_URL, // e.g. https://atithya.vercel.app
  process.env.CLIENT_URL_2, // optional second domain
].filter(Boolean);

console.log("CORS allowed origins:", ALLOWED_ORIGINS);

const corsOptions = {
  origin: (origin, callback) => {
    // Allow requests with no origin (mobile apps, curl, Postman)
    if (!origin) return callback(null, true);
    if (ALLOWED_ORIGINS.includes(origin)) return callback(null, true);
    console.warn(`CORS blocked: ${origin}`);
    return callback(new Error(`CORS: origin ${origin} not allowed`));
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

// Handle preflight OPTIONS requests explicitly (before rate limiters, auth, etc.)
app.options("*", cors(corsOptions));

app.use(cors(corsOptions));

// ── Security & Parsing ────────────────────────────────────────────────
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" }, // needed for Cloudinary assets
  }),
);
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));
app.use(cookieParser());

if (process.env.NODE_ENV !== "production") app.use(morgan("dev"));

// ── Health ────────────────────────────────────────────────────────────
app.get("/api/health", (req, res) =>
  res.json({
    status: "OK",
    message: "Atithya API running",
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
    smtp_user: process.env.SMTP_USER ? "configured" : "MISSING",
    smtp_pass: process.env.SMTP_PASS ? "configured" : "MISSING",
    smtp_host: process.env.SMTP_HOST || "not set (default: smtp.gmail.com)",
    cloudinary: process.env.CLOUDINARY_CLOUD_NAME ? "configured" : "MISSING",
    mongo: process.env.MONGO_URI ? "configured" : "MISSING",
  }),
);

// ── Email diagnostic (verify connection only, no email sent) ─────────
app.get("/api/health/email-test", async (req, res) => {
  try {
    const { createTransporter, useResend } = await import("./config/nodemailer.js");

    if (useResend()) {
      // Resend uses HTTP API — just verify the key is set
      res.json({
        success: true,
        message: "Resend API key is configured. Email will be sent via Resend HTTP API.",
        provider: "resend",
        resend_from: process.env.RESEND_FROM_EMAIL || process.env.FROM_EMAIL || "not set",
      });
    } else {
      // Test SMTP connection
      const transporter = createTransporter();
      await transporter.verify();
      res.json({ success: true, message: "SMTP connection verified successfully.", provider: "smtp" });
    }
  } catch (err) {
    console.error("Email verify failed:", err);
    res.status(500).json({
      success: false,
      message: "Email connection failed.",
      error: err.message,
      code: err.code,
      command: err.command,
    });
  }
});

// ── Routes ────────────────────────────────────────────────────────────
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/content", contentRoutes);
app.use("/api/contact", contactRoutes);
app.use("/api/demo", demoRoutes);
app.use("/api/careers", careerRoutes);
app.use("/api/properties", propertyRoutes);
app.use("/api/compliance", complianceRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/messages", messageRoutes);

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`\n🚀  Atithya API → port ${PORT}  [${process.env.NODE_ENV}]`);
  console.log(`🏥  Health: http://localhost:${PORT}/api/health`);
  console.log(`📧  SMTP user: ${process.env.SMTP_USER || "⚠ NOT SET"}`);
  console.log(
    `☁️   Cloudinary: ${process.env.CLOUDINARY_CLOUD_NAME || "⚠ NOT SET"}\n`,
  );
});
