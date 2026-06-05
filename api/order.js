// api/order.js — Vercel serverless function
// Receives an order from the website, then:
//   1) pushes a notification to your LINE Official Account
//   2) emails the order (with payment slip) to your inbox
//
// All secrets come from Vercel Environment Variables. NEVER hard-code them here.

const nodemailer = require('nodemailer');

// Allow large payloads (the payment slip is base64)
module.exports.config = { api: { bodyParser: { sizeLimit: '8mb' } } };

module.exports = async (req, res) => {
  // ---- CORS ----
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const order = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
    const { ref, customer = {}, items = [], total = 0, slip } = order || {};

    if (!ref || !customer.name || !customer.phone) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const itemLines = items
      .map(it => `• ${it.name} x${it.qty} = ฿${Number(it.subtotal || 0).toLocaleString()}`)
      .join('\n');

    const text =
      `🍷 ออเดอร์ใหม่ / NEW ORDER\n` +
      `Ref: ${ref}\n` +
      `ชื่อ: ${customer.name}\n` +
      `โทร: ${customer.phone}\n` +
      (customer.email ? `อีเมล: ${customer.email}\n` : '') +
      `ที่อยู่: ${customer.address || '-'}\n` +
      (customer.notes ? `หมายเหตุ: ${customer.notes}\n` : '') +
      `\n${itemLines}\n` +
      `รวม: ฿${Number(total).toLocaleString()}`;

    // ---- 1) LINE notification (don't fail the whole order if LINE errors) ----
    await sendLine(text).catch(err => console.error('LINE error:', err.message));

    // ---- 2) Email to YOU (shop) with slip attached ----
    await sendEmail({ ref, text, slip }).catch(err => console.error('Email error:', err.message));

    // ---- 3) Confirmation email to the CUSTOMER (only if they gave an email) ----
    if (customer.email) {
      await sendCustomerEmail({ ref, customer, itemLines, total })
        .catch(err => console.error('Customer email error:', err.message));
    }

    return res.status(200).json({ ok: true, ref });
  } catch (err) {
    console.error('Order handler error:', err);
    return res.status(500).json({ error: 'Server error' });
  }
};

// --- LINE Messaging API push ---
// Pushes to the admin userId if set, otherwise broadcasts to all OA followers.
async function sendLine(text) {
  const token = process.env.LINE_ACCESS_TOKEN;
  if (!token) { console.warn('LINE_ACCESS_TOKEN not set — skipping LINE'); return; }

  const to = process.env.LINE_ADMIN_USER_ID; // your own userId (see notes below)
  const url = to
    ? 'https://api.line.me/v2/bot/message/push'
    : 'https://api.line.me/v2/bot/message/broadcast';

  const body = to
    ? { to, messages: [{ type: 'text', text }] }
    : { messages: [{ type: 'text', text }] };

  const r = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify(body),
  });
  if (!r.ok) throw new Error(`${r.status} ${await r.text()}`);
}

// --- Email via Gmail App Password ---
async function sendEmail({ ref, text, slip }) {
  const user = process.env.GMAIL_USER;
  const pass = process.env.GMAIL_PASS;
  if (!user || !pass) { console.warn('GMAIL creds not set — skipping email'); return; }

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: { user, pass },
  });

  const attachments = [];
  if (slip && typeof slip === 'string' && slip.includes('base64,')) {
    const [, b64] = slip.split('base64,');
    attachments.push({
      filename: `slip-${ref}.jpg`,
      content: Buffer.from(b64, 'base64'),
    });
  }

  await transporter.sendMail({
    from: `"Solaris Wine" <${user}>`,
    to: process.env.ORDER_EMAIL || 'orders@solariswine.com',
    subject: `New Order ${ref} — Solaris Wine`,
    text,
    attachments,
  });
}

// --- Confirmation email to the customer ---
async function sendCustomerEmail({ ref, customer, itemLines, total }) {
  const user = process.env.GMAIL_USER;
  const pass = process.env.GMAIL_PASS;
  if (!user || !pass) return;

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: { user, pass },
  });

  const text =
    `สวัสดีคุณ ${customer.name},\n\n` +
    `ขอบคุณสำหรับคำสั่งซื้อกับ Solaris Wine 🍷\n` +
    `เราได้รับออเดอร์และสลิปของคุณเรียบร้อยแล้ว และจะดำเนินการจัดส่งโดยเร็วที่สุด\n\n` +
    `หมายเลขออเดอร์: ${ref}\n\n` +
    `รายการสั่งซื้อ\n` +
    `${itemLines}\n` +
    `ยอดรวม: ฿${Number(total).toLocaleString()}\n\n` +
    `จัดส่งไปที่: ${customer.address || '-'}\n\n` +
    `หากมีคำถาม ตอบกลับอีเมลนี้ได้เลย\n` +
    `— Solaris Wine\n` +
    `------------------------------------------------\n` +
    `Hello ${customer.name},\n` +
    `Thank you for your order with Solaris Wine.\n` +
    `We've received your order and payment slip and will ship it shortly.\n` +
    `Order ref: ${ref} · Total: ฿${Number(total).toLocaleString()}`;

  await transporter.sendMail({
    from: `"Solaris Wine" <${user}>`,
    to: customer.email,
    subject: `ยืนยันคำสั่งซื้อ ${ref} — Solaris Wine`,
    text,
  });
}
