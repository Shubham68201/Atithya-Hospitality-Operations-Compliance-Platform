import nodemailer from "nodemailer";
import { Resend } from "resend";

/**
 * Email Strategy:
 * 1. If RESEND_API_KEY is set → use Resend HTTP API (works on all cloud hosts)
 * 2. Else fall back to SMTP (Gmail etc.) — may not work on Render free tier
 */

let resendClient = null;

const getResendClient = () => {
  if (!resendClient && process.env.RESEND_API_KEY) {
    resendClient = new Resend(process.env.RESEND_API_KEY);
  }
  return resendClient;
};

/**
 * Returns true if Resend is configured and should be used.
 */
export const useResend = () => !!process.env.RESEND_API_KEY;

/**
 * Send email via Resend HTTP API (port 443 — never blocked by cloud hosts).
 */
export const sendViaResend = async ({ from, to, subject, html, text }) => {
  const client = getResendClient();
  if (!client) throw new Error("RESEND_API_KEY is not configured.");

  const { data, error } = await client.emails.send({
    from,
    to: Array.isArray(to) ? to : [to],
    subject,
    html,
    text,
  });

  if (error) {
    const err = new Error(error.message || "Resend API error");
    err.code = error.statusCode;
    throw err;
  }

  console.log(
    `✉  Email sent via Resend → ${to} | ${subject} | id: ${data?.id}`,
  );
  return data;
};

/**
 * SMTP transporter (fallback for local dev or non-Render hosts).
 */
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

  console.log(
    `📧 SMTP transporter: ${isGmail ? "Gmail service" : `${smtpHost}:${smtpPort}`} | user: ${smtpUser}`,
  );

  return nodemailer.createTransport(config);
};
