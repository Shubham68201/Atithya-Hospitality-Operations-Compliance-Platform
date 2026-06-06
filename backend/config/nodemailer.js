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

  const config = {
    host: smtpHost,
    port: smtpPort,
    secure: smtpSecure,
    auth: {
      user: smtpUser,
      pass: smtpPass,
    },
    connectionTimeout: 10000,
    greetingTimeout: 10000,
    socketTimeout: 20000,
    tls: {
      rejectUnauthorized: false,
    },
  };

  if (smtpHost.includes("gmail.com") && !process.env.SMTP_SERVICE) {
    config.service = "gmail";
  }

  return nodemailer.createTransport(config);
};
