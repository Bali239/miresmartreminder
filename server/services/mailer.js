const nodemailer = require('nodemailer');

function escapeHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

const smtpPort = Number(process.env.SMTP_PORT || 587);
const isSecure = smtpPort === 465;

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: smtpPort,
  secure: isSecure,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
  connectionTimeout: 10000,
  greetingTimeout: 10000,
  socketTimeout: 15000,
});

// Verify connection on startup without crashing the server
const provider = (process.env.EMAIL_PROVIDER || 'smtp').toLowerCase();
if (provider === 'smtp') {
  transporter.verify((error) => {
    if (error) {
      console.error(`[Mailer] SMTP verify warning: ${error.message} (Check SMTP credentials in server/.env)`);
    } else {
      console.log('[Mailer] SMTP transport verified & ready');
    }
  });
} else {
  console.log(`[Mailer] Using HTTP Email API provider: ${provider}`);
}

/**
 * Format due date nicely according to user timezone
 */
function formatDueDate(date, timezone) {
  const tz = timezone || 'UTC';
  try {
    return new Intl.DateTimeFormat('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
      timeZone: tz,
    }).format(new Date(date));
  } catch {
    return new Date(date).toUTCString();
  }
}

/**
 * Generate responsive HTML email with inline CSS
 */
function buildReminderHtml({ title, description, formattedDate, timezone, clientUrl }) {
  const safeTitle = escapeHtml(title);
  const safeDesc = escapeHtml(description);
  const safeTz = escapeHtml(timezone || 'UTC');

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Reminder: ${safeTitle}</title>
</head>
<body style="margin: 0; padding: 0; background-color: #08061A; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #F1F0FA; -webkit-font-smoothing: antialiased;">
  <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #08061A; padding: 40px 16px;">
    <tr>
      <td align="center">
        <!-- Main Container -->
        <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0" style="max-width: 560px; background-color: #110E2E; border-radius: 24px; overflow: hidden; border: 1px solid rgba(139, 92, 246, 0.25); box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);">
          
          <!-- Header Banner -->
          <tr>
            <td style="background: linear-gradient(135deg, #8B5CF6 0%, #6366F1 100%); padding: 32px 36px; text-align: left;">
              <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0">
                <tr>
                  <td>
                    <span style="display: inline-block; width: 36px; height: 36px; line-height: 36px; background-color: rgba(255, 255, 255, 0.2); border-radius: 12px; text-align: center; font-size: 18px; margin-right: 12px; vertical-align: middle;">✨</span>
                    <span style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; font-size: 24px; font-weight: 800; color: #FFFFFF; vertical-align: middle; letter-spacing: -0.5px;">Mira</span>
                  </td>
                  <td align="right">
                    <span style="display: inline-block; background-color: rgba(255, 255, 255, 0.18); color: #FFFFFF; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.8px; padding: 5px 12px; border-radius: 999px;">Reminder Alert</span>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Content Body -->
          <tr>
            <td style="padding: 36px 36px 28px 36px;">
              <p style="margin: 0 0 8px 0; font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; color: #A78BFA;">Upcoming Task</p>
              <h1 style="margin: 0 0 16px 0; font-size: 24px; line-height: 1.3; font-weight: 700; color: #F1F0FA; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
                ${safeTitle}
              </h1>

              ${safeDesc ? `
              <div style="margin: 0 0 24px 0; padding: 14px 18px; background-color: rgba(255, 255, 255, 0.04); border-left: 3px solid #8B5CF6; border-radius: 0 12px 12px 0; color: rgba(241, 240, 250, 0.7); font-size: 14px; line-height: 1.6;">
                ${safeDesc}
              </div>` : ''}

              <!-- Due Date Box -->
              <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0" style="margin: 20px 0 32px 0; background-color: rgba(139, 92, 246, 0.08); border: 1px solid rgba(139, 92, 246, 0.2); border-radius: 16px; padding: 16px;">
                <tr>
                  <td width="36" valign="top" style="padding-top: 2px;">
                    <span style="font-size: 22px;">🗓️</span>
                  </td>
                  <td style="padding-left: 12px;">
                    <div style="font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; color: rgba(241, 240, 250, 0.4);">Due Date & Time</div>
                    <div style="font-size: 16px; font-weight: 700; color: #A78BFA; margin-top: 3px;">${formattedDate}</div>
                    <div style="font-size: 12px; color: rgba(241, 240, 250, 0.4); margin-top: 2px;">Timezone: ${safeTz}</div>
                  </td>
                </tr>
              </table>

              <!-- Call to Action Button -->
              <table role="presentation" border="0" cellspacing="0" cellpadding="0" style="margin: 0 auto 16px auto;">
                <tr>
                  <td align="center" style="border-radius: 999px; background: linear-gradient(135deg, #8B5CF6 0%, #6366F1 100%);">
                    <a href="${clientUrl}/reminders" target="_blank" style="display: inline-block; padding: 14px 34px; font-size: 15px; font-weight: 700; color: #FFFFFF; text-decoration: none; border-radius: 999px; letter-spacing: 0.3px;">
                      Open Mira &rarr;
                    </a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding: 20px 36px 28px 36px; border-top: 1px solid rgba(255, 255, 255, 0.06); background-color: rgba(8, 6, 26, 0.5); text-align: center;">
              <p style="margin: 0 0 6px 0; font-size: 12px; color: rgba(241, 240, 250, 0.4);">
                Sent by <strong style="color: #A78BFA;">Mira</strong> &bull; A calm, private reminder system.
              </p>
              <p style="margin: 0; font-size: 11px; color: rgba(241, 240, 250, 0.25);">
                You received this email because you scheduled a notification for this task.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `.trim();
}

/**
 * Dispatch an email via configured provider (SMTP or HTTP API fallback)
 */
async function dispatchEmail({ to, subject, html, text }) {
  const mailFrom = process.env.MAIL_FROM || '"Mira" <no-reply@mira.app>';
  const activeProvider = (process.env.EMAIL_PROVIDER || 'smtp').toLowerCase();

  if (activeProvider === 'brevo_api') {
    const apiKey = process.env.BREVO_API_KEY || process.env.SMTP_PASS;
    const fromMatch = mailFrom.match(/^(?:"?([^"]*)"?\s)?(?:<?(.+@[^>]+)>?)$/) || [];
    const senderName = fromMatch[1] || 'Mira';
    const senderEmail = fromMatch[2] || 'no-reply@mira.app';

    const res = await fetch('https://api.brevo.com/v3/smtp/email', {
      method: 'POST',
      headers: {
        'api-key': apiKey,
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({
        sender: { name: senderName, email: senderEmail },
        to: [{ email: to }],
        subject,
        htmlContent: html,
        textContent: text,
      }),
    });

    if (!res.ok) {
      const errBody = await res.text();
      throw new Error(`Brevo API error: ${res.status} ${errBody}`);
    }
    return res.json();
  }

  if (activeProvider === 'resend') {
    const apiKey = process.env.RESEND_API_KEY || process.env.SMTP_PASS;
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: mailFrom,
        to: [to],
        subject,
        html,
        text,
      }),
    });

    if (!res.ok) {
      const errBody = await res.text();
      throw new Error(`Resend API error: ${res.status} ${errBody}`);
    }
    return res.json();
  }

  // Default: SMTP via Nodemailer
  return transporter.sendMail({
    from: mailFrom,
    to,
    subject,
    html,
    text,
  });
}

/**
 * Send reminder email for scheduled notification
 */
exports.sendReminderEmail = async (r) => {
  const to = r.user?.email;
  if (!to) throw new Error('Reminder user email is missing');

  const timezone = r.user?.timezone || 'UTC';
  const formattedDate = formatDueDate(r.dueAt, timezone);
  const clientUrl = process.env.CLIENT_URL || 'http://localhost:5173';

  const html = buildReminderHtml({
    title: r.title,
    description: r.description,
    formattedDate,
    timezone,
    clientUrl,
  });

  const text = `
Reminder: ${r.title}
${r.description ? `\n${r.description}\n` : ''}
Due Date: ${formattedDate} (${timezone})

Open in Mira: ${clientUrl}/reminders
`.trim();

  return dispatchEmail({
    to,
    subject: `[Mira] Reminder: ${r.title}`,
    html,
    text,
  });
};

/**
 * Send test email to verify mail setup
 */
exports.sendTestEmail = async (user) => {
  if (!user || !user.email) throw new Error('User email is required');

  const timezone = user.timezone || 'UTC';
  const now = new Date();
  const formattedDate = formatDueDate(now, timezone);
  const clientUrl = process.env.CLIENT_URL || 'http://localhost:5173';

  const html = buildReminderHtml({
    title: 'Your Mira Email Setup is Working!',
    description: `Hello ${user.name || 'there'}! This is a test email sent from your Mira settings to confirm that your email delivery system is correctly configured.`,
    formattedDate,
    timezone,
    clientUrl,
  });

  const text = `
Mira Email Verification
Hello ${user.name || 'there'}!

Your email notification system is working perfectly.
Current time: ${formattedDate} (${timezone})

Visit Mira: ${clientUrl}
`.trim();

  return dispatchEmail({
    to: user.email,
    subject: 'Mira: Test Email Notification',
    html,
    text,
  });
};

exports.transporter = transporter;
