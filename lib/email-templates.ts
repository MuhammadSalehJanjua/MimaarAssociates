type ContactNotificationData = {
  name: string
  email: string
  phone?: string
  service?: string
  message: string
}

type ContactConfirmationData = {
  name: string
}

const baseStyles = `
  body { margin: 0; padding: 0; background-color: #f4f4f7; font-family: 'Helvetica Neue', Arial, sans-serif; }
  .wrapper { width: 100%; background-color: #f4f4f7; padding: 40px 0; }
  .container { max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.1); }
  .header { background-color: #1A1A2E; padding: 32px 40px; text-align: center; }
  .header h1 { color: #C9A84C; margin: 0; font-size: 28px; font-weight: 700; letter-spacing: 1px; }
  .header p { color: #a0a0b8; margin: 8px 0 0; font-size: 14px; letter-spacing: 0.5px; }
  .body { padding: 40px; }
  .body h2 { color: #1A1A2E; font-size: 22px; margin: 0 0 16px; }
  .body p { color: #4a4a68; font-size: 15px; line-height: 1.7; margin: 0 0 16px; }
  .detail-table { width: 100%; border-collapse: collapse; margin: 24px 0; }
  .detail-table td { padding: 12px 16px; border-bottom: 1px solid #eee; font-size: 14px; color: #4a4a68; vertical-align: top; }
  .detail-table td.label { font-weight: 600; color: #1A1A2E; width: 120px; background-color: #fafafa; }
  .message-box { background-color: #f8f7f4; border-left: 4px solid #C9A84C; padding: 20px; margin: 24px 0; border-radius: 0 8px 8px 0; }
  .message-box p { margin: 0; color: #333; font-size: 14px; line-height: 1.8; }
  .cta-button { display: inline-block; background-color: #C9A84C; color: #1A1A2E; padding: 14px 32px; text-decoration: none; border-radius: 6px; font-weight: 600; font-size: 15px; margin: 16px 0; }
  .footer { background-color: #1A1A2E; padding: 24px 40px; text-align: center; }
  .footer p { color: #7a7a9a; font-size: 12px; margin: 4px 0; }
  .footer a { color: #C9A84C; text-decoration: none; }
  .divider { height: 1px; background: linear-gradient(to right, transparent, #C9A84C, transparent); margin: 24px 0; }
`

function wrapInLayout(content: string): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Mimaar Associates</title>
  <style>${baseStyles}</style>
</head>
<body>
  <div class="wrapper">
    <div class="container">
      <div class="header">
        <h1>MIMAAR ASSOCIATES</h1>
        <p>Architecture &bull; Design &bull; Excellence</p>
      </div>
      ${content}
      <div class="footer">
        <p>&copy; ${new Date().getFullYear()} Mimaar Associates. All rights reserved.</p>
        <p><a href="https://mimaarassociates.com">mimaarassociates.com</a></p>
      </div>
    </div>
  </div>
</body>
</html>`
}

export function contactNotificationEmail(data: ContactNotificationData): string {
  const content = `
      <div class="body">
        <h2>New Contact Submission</h2>
        <p>You have received a new inquiry through the website contact form. Details are below:</p>

        <table class="detail-table">
          <tr>
            <td class="label">Name</td>
            <td>${escapeHtml(data.name)}</td>
          </tr>
          <tr>
            <td class="label">Email</td>
            <td><a href="mailto:${escapeHtml(data.email)}" style="color: #C9A84C;">${escapeHtml(data.email)}</a></td>
          </tr>
          ${data.phone ? `<tr><td class="label">Phone</td><td>${escapeHtml(data.phone)}</td></tr>` : ""}
          ${data.service ? `<tr><td class="label">Service</td><td>${escapeHtml(data.service)}</td></tr>` : ""}
        </table>

        <div class="divider"></div>

        <h2 style="font-size: 16px; margin-bottom: 12px;">Message</h2>
        <div class="message-box">
          <p>${escapeHtml(data.message).replace(/\n/g, "<br>")}</p>
        </div>

        <p style="font-size: 13px; color: #888; margin-top: 24px;">
          Submitted on ${new Date().toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" })} 
          at ${new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })}
        </p>
      </div>`

  return wrapInLayout(content)
}

export function contactConfirmationEmail(data: ContactConfirmationData): string {
  const content = `
      <div class="body">
        <h2>Thank You, ${escapeHtml(data.name)}!</h2>
        <p>
          We have received your message and truly appreciate you reaching out to Mimaar Associates.
          Our team will review your inquiry and get back to you within <strong>1–2 business days</strong>.
        </p>

        <div class="divider"></div>

        <p>
          At Mimaar Associates, we believe every project is unique. Whether you&rsquo;re looking for architectural design,
          interior planning, or project consultation, we&rsquo;re here to bring your vision to life.
        </p>

        <p style="text-align: center; margin: 32px 0;">
          <a href="https://mimaarassociates.com/projects" class="cta-button">
            Explore Our Projects
          </a>
        </p>

        <p style="font-size: 13px; color: #888;">
          If you have any urgent questions, feel free to reply directly to this email or call us at your convenience.
        </p>
      </div>`

  return wrapInLayout(content)
}

export function newsletterWelcomeEmail(): string {
  const content = `
      <div class="body">
        <h2>Welcome to the Mimaar Family!</h2>
        <p>
          Thank you for subscribing to our newsletter. You&rsquo;re now part of an exclusive community that gets
          first access to our latest projects, design insights, and industry trends.
        </p>

        <div class="divider"></div>

        <h2 style="font-size: 18px;">What to Expect</h2>
        <p>
          &#10003; &nbsp; Showcase of our latest architectural projects<br>
          &#10003; &nbsp; Behind-the-scenes design process insights<br>
          &#10003; &nbsp; Industry trends and innovations<br>
          &#10003; &nbsp; Exclusive invitations to events and exhibitions
        </p>

        <p style="text-align: center; margin: 32px 0;">
          <a href="https://mimaarassociates.com" class="cta-button">
            Visit Our Website
          </a>
        </p>

        <p style="font-size: 13px; color: #888;">
          You can unsubscribe at any time by clicking the unsubscribe link in our emails.
          We respect your privacy and will never share your information.
        </p>
      </div>`

  return wrapInLayout(content)
}

function escapeHtml(text: string): string {
  const map: Record<string, string> = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#039;",
  }
  return text.replace(/[&<>"']/g, (char) => map[char])
}
