import nodemailer from "nodemailer";

export const createTransporter = () => {
  const smtpHost = process.env.SMTP_HOST || "smtp.gmail.com";
  const smtpPort = parseInt(process.env.SMTP_PORT, 10) || 587;
  const smtpSecure = String(process.env.SMTP_SECURE).toLowerCase() === "true";
  const smtpUser = process.env.SMTP_USER;
  const smtpPass = process.env.SMTP_PASS;

  if (!smtpUser || !smtpPass) {
    throw new Error(
      "SMTP_USER and SMTP_PASS must be configured for nodemailer.",
    );
  }

  const isGmail = smtpHost.includes("gmail.com") && !process.env.SMTP_SERVICE;

  // When using Gmail service, do NOT set host/port — they conflict.
  // nodemailer's "gmail" service already knows the correct host/port/security.
  const config = isGmail
    ? {
        service: "gmail",
        auth: {
          user: smtpUser,
          pass: smtpPass,
        },
      }
    : {
        host: smtpHost,
        port: smtpPort,
        secure: smtpSecure,
        auth: {
          user: smtpUser,
          pass: smtpPass,
        },
      };

  // Common options for both
  config.connectionTimeout = 30000; // 30s — Render free tier can be slow
  config.greetingTimeout = 30000;
  config.socketTimeout = 30000;
  config.tls = { rejectUnauthorized: false };

  // Debug logging in production to diagnose email issues
  config.logger = process.env.NODE_ENV !== "production" ? true : false;
  config.debug = process.env.NODE_ENV !== "production";

  console.log(`📧 SMTP transporter: ${isGmail ? "Gmail service" : `${smtpHost}:${smtpPort}`} | user: ${smtpUser}`);

  return nodemailer.createTransport(config);
};

