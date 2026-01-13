import nodemailer from "nodemailer";

const SMTP_HOST = process.env.SMTP_HOST!;
const SMTP_PORT = parseInt(process.env.SMTP_PORT || "587");
const SMTP_USER = process.env.SMTP_USER!;
const SMTP_PASS = process.env.SMTP_PASS!;
const FROM_EMAIL = process.env.FROM_EMAIL || "no-reply@opsvantage.ai";

const transporter = nodemailer.createTransport({
  host: SMTP_HOST,
  port: SMTP_PORT,
  secure: SMTP_PORT === 465,
  auth: {
    user: SMTP_USER,
    pass: SMTP_PASS,
  },
});

export async function sendSubscriptionEmail({
  to,
  subject,
  body,
}: {
  to: string;
  subject: string;
  body: string;
}) {
  await transporter.sendMail({
    from: `"OpsVantage AI-Explainer Engine" <${FROM_EMAIL}>`,
    to,
    subject,
    html: wrapHtml(body),
  });
}

function wrapHtml(content: string) {
  return `
  <div style="font-family: Inter, sans-serif; background: #f9f9f9; padding: 40px;">
    <div style="max-width: 600px; margin: auto; background: #fff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.05);">
      <div style="background: #0a0a0a; padding: 24px; text-align: center;">
        <img src="cid:opsvantage-logo" alt="OpsVantage Logo" width="64" height="64" style="margin-bottom: 12px;" />
        <h1 style="margin: 0; font-size: 20px; background: linear-gradient(to right, #00BFFF, #00FF7F, #FFD700); -webkit-background-clip: text; color: transparent;">
          OpsVantage AI-Explainer Engine
        </h1>
      </div>
      <div style="padding: 32px; font-size: 16px; color: #333;">
        ${content}
        <p style="margin-top: 24px; font-size: 14px; color: #666;">
          Questions? Reach out to <strong>support@opsvantage.ai</strong>
        </p>
      </div>
    </div>
  </div>
  `;
}
