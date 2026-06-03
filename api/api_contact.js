// api/contact.js — Vercel Serverless Function
// Handles contact form submissions
// Sends email to contact@solariswine.com + LINE notification

const nodemailer = require('nodemailer');

// Initialize Gmail transporter
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER || 'info@solariswine.com',
    pass: process.env.GMAIL_PASS, // Google App Password
  },
});

// LINE Messaging API
async function sendLineNotification(message) {
  try {
    const response = await fetch('https://api.line.biz/v2/bot/message/push', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.LINE_ACCESS_TOKEN}`,
      },
      body: JSON.stringify({
        to: process.env.LINE_CHANNEL_ID,
        messages: [
          {
            type: 'text',
            text: message,
          },
        ],
      }),
    });
    if (!response.ok) console.error('LINE API error:', await response.text());
  } catch (err) {
    console.error('LINE notification failed:', err.message);
  }
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { name, email, phone, inquiry, message } = req.body;

    // Validate required fields
    if (!name || !email || !inquiry || !message) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const inquiryLabels = {
      tasting: '🍷 Private Tasting Request',
      wholesale: '🏪 Wholesale / B2B Enquiry',
      retail: '🛍️ Retail Partnership',
      other: '💬 Other',
    };

    const inquiryLabel = inquiryLabels[inquiry] || inquiry;
    const contactDate = new Date().toLocaleString('en-US', { timeZone: 'Asia/Bangkok' });

    // HTML Email template
    const htmlEmail = `
      <div style="font-family: Arial, sans-serif; background: #f5f5f5; padding: 20px;">
        <div style="max-width: 600px; margin: 0 auto; background: white; border: 1px solid #ddd; padding: 30px;">
          <h2 style="color: #BF9540; border-bottom: 2px solid #BF9540; padding-bottom: 10px;">New Contact Form Submission</h2>
          
          <p style="color: #333; font-size: 14px; line-height: 1.8;">
            <strong>Date:</strong> ${contactDate}<br>
            <strong>Type:</strong> ${inquiryLabel}
          </p>

          <h3 style="color: #333; margin-top: 25px; border-left: 3px solid #BF9540; padding-left: 10px;">Contact Details</h3>
          <p style="color: #555; font-size: 14px; line-height: 1.8;">
            <strong>Name:</strong> ${name}<br>
            <strong>Email:</strong> ${email}<br>
            <strong>Phone:</strong> ${phone || '—'}
          </p>

          <h3 style="color: #333; margin-top: 25px; border-left: 3px solid #BF9540; padding-left: 10px;">Message</h3>
          <p style="color: #555; font-size: 14px; line-height: 1.8; white-space: pre-wrap;">
            ${message}
          </p>

          <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
          <p style="color: #999; font-size: 12px; text-align: center;">
            Solaris Wine | Exclusive Importer of Herdade de Rocim<br>
            info@solariswine.com | +66 961 644 422<br>
            Bangkok, Thailand
          </p>
        </div>
      </div>
    `;

    // Send email
    await transporter.sendMail({
      from: process.env.GMAIL_USER,
      to: 'contact@solariswine.com',
      replyTo: email,
      subject: `${inquiryLabel} — ${name}`,
      html: htmlEmail,
    });

    // Send LINE notification
    const lineMsg = `📬 New Contact Form\n\nType: ${inquiryLabel}\nName: ${name}\nEmail: ${email}\nPhone: ${phone || '—'}\n\n💬 Check contact@solariswine.com for full message`;
    await sendLineNotification(lineMsg);

    return res.status(200).json({
      success: true,
      message: 'Thank you for your enquiry. We will get back to you soon!',
    });
  } catch (error) {
    console.error('Contact form error:', error);
    return res.status(500).json({
      error: 'Failed to process enquiry',
      details: error.message,
    });
  }
}
