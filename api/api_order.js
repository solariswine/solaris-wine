// api/order.js — Vercel Serverless Function
// Handles wine order submission + payment slip upload
// Sends email to orders@solariswine.com + LINE notification

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
    const { name, phone, email, address, notes, slip } = req.body;

    // Validate required fields
    if (!name || !email || !slip) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Parse slip (base64 image)
    const slipBuffer = Buffer.from(slip.split(',')[1] || slip, 'base64');

    // Build order reference
    const orderId = `ORD-${Date.now()}`;
    const orderDate = new Date().toLocaleString('en-US', { timeZone: 'Asia/Bangkok' });

    // HTML Email template
    const htmlEmail = `
      <div style="font-family: Arial, sans-serif; background: #f5f5f5; padding: 20px;">
        <div style="max-width: 600px; margin: 0 auto; background: white; border: 1px solid #ddd; padding: 30px;">
          <h2 style="color: #BF9540; border-bottom: 2px solid #BF9540; padding-bottom: 10px;">New Wine Order Received</h2>
          
          <p style="color: #333; font-size: 14px; line-height: 1.8;">
            <strong>Order ID:</strong> ${orderId}<br>
            <strong>Date:</strong> ${orderDate}<br>
            <strong>Status:</strong> 🟡 Pending Payment Verification
          </p>

          <h3 style="color: #333; margin-top: 25px; border-left: 3px solid #BF9540; padding-left: 10px;">Customer Information</h3>
          <p style="color: #555; font-size: 14px; line-height: 1.8;">
            <strong>Name:</strong> ${name}<br>
            <strong>Email:</strong> ${email}<br>
            <strong>Phone:</strong> ${phone || '—'}<br>
            <strong>Address:</strong> ${address || '—'}<br>
            <strong>Notes:</strong> ${notes || 'None'}
          </p>

          <h3 style="color: #333; margin-top: 25px; border-left: 3px solid #BF9540; padding-left: 10px;">Payment Slip</h3>
          <p style="color: #666; font-size: 13px;">
            ✓ Slip image attached to this email
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
      to: 'orders@solariswine.com',
      subject: `🍷 Wine Order ${orderId} — ${name}`,
      html: htmlEmail,
      attachments: [
        {
          filename: 'payment-slip.jpg',
          content: slipBuffer,
          contentType: 'image/jpeg',
        },
      ],
    });

    // Send LINE notification
    const lineMsg = `🍷 New Wine Order Received\n\nOrder ID: ${orderId}\nCustomer: ${name}\nEmail: ${email}\nPhone: ${phone || '—'}\n\n💳 Payment slip attached via email\n✅ Check orders@solariswine.com`;
    await sendLineNotification(lineMsg);

    return res.status(200).json({
      success: true,
      orderId,
      message: 'Order received. We will verify payment shortly.',
    });
  } catch (error) {
    console.error('Order processing error:', error);
    return res.status(500).json({
      error: 'Failed to process order',
      details: error.message,
    });
  }
}
