import { createTransporter } from "../config/nodemailer.js";

const SMTP_USER = process.env.SMTP_USER;
const SMTP_PASS = process.env.SMTP_PASS;
const COMPANY_EMAIL = process.env.FROM_EMAIL || SMTP_USER;
const CLIENT_URL = process.env.CLIENT_URL || "http://localhost:5173";

const base = (
  content,
) => `<!DOCTYPE html><html><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0"></head>
<body style="margin:0;padding:0;background:#FAF7F2;font-family:'Poppins',Arial,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#FAF7F2;padding:40px 20px;"><tr><td align="center">
<table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;">
<tr><td style="background:#0B1F3A;padding:30px;text-align:center;border-radius:12px 12px 0 0;">
  <h1 style="color:#C8A25D;font-size:28px;margin:0;letter-spacing:4px;font-family:Georgia,serif;">ATITHYA</h1>
  <p style="color:#9BB0C9;font-size:11px;margin:6px 0 0;letter-spacing:2px;">CHECK IN SE COMPLIANCE TAK SAB AUTOMATIC</p>
</td></tr>
<tr><td style="background:#FFFFFF;padding:40px 40px 30px;border-left:1px solid #EAE0D5;border-right:1px solid #EAE0D5;">${content}</td></tr>
<tr><td style="background:#0B1F3A;padding:24px;text-align:center;border-radius:0 0 12px 12px;">
  <p style="color:#9BB0C9;font-size:12px;margin:0;">Shri Perumal Hospitality Innovations Private Limited</p>
  <p style="color:#9BB0C9;font-size:11px;margin:4px 0 0;">sriperumal.aperio@gmail.com &nbsp;|&nbsp; +91 8828273581</p>
  <p style="color:#5A7A9A;font-size:10px;margin:8px 0 0;">Incubated at AIC-MFIE-IMS-BHU</p>
</td></tr>
</table></td></tr></table></body></html>`;

/**
 * Core send function — throws on failure so callers can decide to
 * surface the error or swallow it gracefully.
 */
const send = async (to, subject, html) => {
  if (!SMTP_USER || !SMTP_PASS) {
    throw new Error("SMTP_USER and SMTP_PASS are required.");
  }
  const transporter = createTransporter();
  // ← verify() call removed; it was failing on cold SMTP connections
  await transporter.sendMail({
    from: `"${process.env.FROM_NAME || "Atithya Platform"}" <${COMPANY_EMAIL}>`,
    to,
    subject,
    text: html
      .replace(/<[^>]+>/g, " ")
      .replace(/\s+/g, " ")
      .trim(),
    html,
  });
  console.log(`✉  Email sent → ${to} | ${subject}`);
};

// ── OTP ──────────────────────────────────────────────────────────────
export const sendOTPEmail = async (email, otp, type) => {
  const isReset = type === "password_reset";
  await send(
    email,
    isReset
      ? "Reset Your Atithya Password – OTP Inside"
      : "Verify Your Atithya Account – OTP Inside",
    base(`
      <h2 style="color:#0B1F3A;font-size:22px;margin:0 0 16px;">${isReset ? "Password Reset" : "Verify Your Account"}</h2>
      <p style="color:#2E2E2E;font-size:15px;line-height:1.6;margin:0 0 24px;">
        ${isReset ? "We received a request to reset your Atithya password." : "Thank you for registering with Atithya. Please verify your email address."}
      </p>
      <div style="background:#0B1F3A;border:2px solid #C8A25D;border-radius:10px;padding:28px;text-align:center;margin:0 0 28px;">
        <p style="color:#9BB0C9;font-size:12px;letter-spacing:2px;margin:0 0 10px;text-transform:uppercase;">Your OTP Code</p>
        <p style="color:#C8A25D;font-size:42px;font-weight:bold;letter-spacing:12px;margin:0;font-family:Georgia,serif;">${otp}</p>
        <p style="color:#9BB0C9;font-size:12px;margin:12px 0 0;">Expires in ${process.env.OTP_EXPIRE_MINUTES || 10} minutes</p>
      </div>
      <p style="color:#888;font-size:13px;">If you did not request this, please ignore this email.</p>
    `),
  );
};

// ── Welcome ──────────────────────────────────────────────────────────
export const sendWelcomeEmail = async (email, fullName) => {
  await send(
    email,
    "Welcome to Atithya – Your Account is Active",
    base(`
      <h2 style="color:#0B1F3A;font-size:22px;margin:0 0 16px;">Welcome, ${fullName}! 🎉</h2>
      <p style="color:#2E2E2E;font-size:15px;line-height:1.6;margin:0 0 20px;">Your account is verified and active. You now have full access to the Atithya platform.</p>
      <a href="${CLIENT_URL}/login" style="display:inline-block;background:#C8A25D;color:#0B1F3A;padding:14px 32px;border-radius:6px;text-decoration:none;font-weight:600;font-size:15px;">Login to Dashboard</a>
    `),
  );
};

// ── Demo: confirmation to requester ──────────────────────────────────
export const sendDemoConfirmationEmail = async (email, companyName) => {
  await send(
    email,
    "Thank You! Your Demo Request Has Been Received",
    base(`
      <h2 style="color:#0B1F3A;font-size:22px;margin:0 0 16px;">Demo Request Received!</h2>
      <p style="color:#2E2E2E;font-size:15px;line-height:1.6;margin:0 0 20px;">
        Thank you, <strong>${companyName}</strong>. Our team will contact you within 24–48 business hours.
      </p>
      <div style="background:#FAF7F2;border:1px solid #EAE0D5;border-radius:8px;padding:20px;margin:0 0 24px;">
        <p style="color:#0B1F3A;font-size:14px;margin:0;font-weight:600;">What happens next?</p>
        <ol style="color:#2E2E2E;font-size:14px;line-height:2;margin:10px 0 0;padding-left:20px;">
          <li>Our team reviews your request</li>
          <li>We schedule a convenient demo time</li>
          <li>You experience Atithya live!</li>
        </ol>
      </div>
    `),
  );
};

// ── Demo: notify company ──────────────────────────────────────────────
export const sendDemoNotifyCompany = async (demo) => {
  if (!COMPANY_EMAIL) return;
  await send(
    COMPANY_EMAIL,
    `🆕 New Demo Request — ${demo.companyName}`,
    base(`
      <h2 style="color:#0B1F3A;font-size:20px;margin:0 0 16px;">New Demo Request Received</h2>
      <table style="width:100%;border-collapse:collapse;font-size:14px;">
        ${[
          ["Company", demo.companyName],
          ["Contact", demo.contactPerson],
          ["Email", demo.email],
          ["Phone", demo.phone],
          ["Property Type", demo.propertyType],
          ["No. of Properties", demo.numberOfProperties],
          ["Message", demo.message || "—"],
        ]
          .map(
            ([k, v]) => `<tr>
            <td style="padding:8px 12px;background:#F8F8F8;font-weight:600;color:#0B1F3A;width:40%;border-bottom:1px solid #EEE;">${k}</td>
            <td style="padding:8px 12px;color:#333;border-bottom:1px solid #EEE;">${v}</td>
          </tr>`,
          )
          .join("")}
      </table>
    `),
  );
};

// ── Contact reply ─────────────────────────────────────────────────────
export const sendContactReplyEmail = async (
  email,
  name,
  subject,
  replyMessage,
) => {
  await send(
    email,
    `RE: ${subject} — Atithya Support`,
    base(`
      <h2 style="color:#0B1F3A;font-size:22px;margin:0 0 16px;">Response to Your Enquiry</h2>
      <p style="color:#2E2E2E;font-size:15px;line-height:1.6;margin:0 0 16px;">Dear ${name},</p>
      <p style="color:#2E2E2E;font-size:15px;line-height:1.6;margin:0 0 16px;">
        Thank you for reaching out. Here is our response to: <strong>"${subject}"</strong>
      </p>
      <div style="background:#FAF7F2;border-left:4px solid #C8A25D;border-radius:4px;padding:20px;margin:0 0 24px;">
        <p style="color:#2E2E2E;font-size:14px;line-height:1.8;margin:0;">${replyMessage}</p>
      </div>
    `),
  );
};

// ── Contact: notify company ───────────────────────────────────────────
export const sendContactNotifyCompany = async (msg) => {
  if (!COMPANY_EMAIL) return;
  await send(
    COMPANY_EMAIL,
    `📬 New Contact Message — ${msg.subject}`,
    base(`
      <h2 style="color:#0B1F3A;font-size:20px;margin:0 0 16px;">New Contact Message</h2>
      <table style="width:100%;border-collapse:collapse;font-size:14px;">
        ${[
          ["From", msg.name],
          ["Email", msg.email],
          ["Phone", msg.phone || "—"],
          ["Subject", msg.subject],
        ]
          .map(
            ([k, v]) => `<tr>
            <td style="padding:8px 12px;background:#F8F8F8;font-weight:600;color:#0B1F3A;width:40%;border-bottom:1px solid #EEE;">${k}</td>
            <td style="padding:8px 12px;color:#333;border-bottom:1px solid #EEE;">${v}</td>
          </tr>`,
          )
          .join("")}
      </table>
      <div style="margin-top:16px;background:#FAF7F2;border-left:4px solid #C8A25D;padding:16px;border-radius:4px;">
        <p style="color:#333;font-size:14px;margin:0;">${msg.message}</p>
      </div>
    `),
  );
};

// ── Job application: notify company ──────────────────────────────────
export const sendApplicationNotifyCompany = async (app, jobTitle) => {
  if (!COMPANY_EMAIL) return;
  await send(
    COMPANY_EMAIL,
    `👤 New Application — ${jobTitle}`,
    base(`
      <h2 style="color:#0B1F3A;font-size:20px;margin:0 0 16px;">New Job Application</h2>
      <p style="color:#333;font-size:14px;margin:0 0 16px;">Position: <strong>${jobTitle}</strong></p>
      <table style="width:100%;border-collapse:collapse;font-size:14px;">
        ${[
          ["Applicant", app.name],
          ["Email", app.email],
          ["Phone", app.phone],
          ["Cover Letter", app.coverLetter || "—"],
        ]
          .map(
            ([k, v]) => `<tr>
            <td style="padding:8px 12px;background:#F8F8F8;font-weight:600;color:#0B1F3A;width:40%;border-bottom:1px solid #EEE;">${k}</td>
            <td style="padding:8px 12px;color:#333;border-bottom:1px solid #EEE;">${v}</td>
          </tr>`,
          )
          .join("")}
      </table>
      ${app.resumeUrl ? `<p style="margin-top:16px;"><a href="${app.resumeUrl}" style="background:#C8A25D;color:#0B1F3A;padding:10px 20px;border-radius:6px;text-decoration:none;font-weight:600;font-size:13px;">📄 Download Resume</a></p>` : ""}
    `),
  );
};

// ── Application confirmation to applicant ────────────────────────────
export const sendApplicationConfirmEmail = async (email, name, jobTitle) => {
  await send(
    email,
    `Application Received — ${jobTitle} | Atithya`,
    base(`
      <h2 style="color:#0B1F3A;font-size:22px;margin:0 0 16px;">Application Received! ✅</h2>
      <p style="color:#2E2E2E;font-size:15px;line-height:1.6;margin:0 0 16px;">
        Hi <strong>${name}</strong>, thank you for applying for <strong>${jobTitle}</strong> at Atithya / Shri Perumal Hospitality Innovations.
      </p>
      <p style="color:#2E2E2E;font-size:15px;line-height:1.6;margin:0 0 24px;">
        Our HR team will review your application and contact you if your profile matches our requirements. We typically respond within 5–7 business days.
      </p>
    `),
  );
};
