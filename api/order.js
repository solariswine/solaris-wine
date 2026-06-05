// api/order.js — Vercel serverless function
// Receives an order from the website, then:
//   1) pushes a notification to your LINE Official Account
//   2) emails the order (with payment slip) to your inbox
//
// All secrets come from Vercel Environment Variables. NEVER hard-code them here.

const nodemailer = require('nodemailer');

// Public base URL of the live site (used to build absolute image links in emails)
const SITE_URL = process.env.SITE_URL || 'https://www.solariswine.com';

// Wine name -> public image path. Files live in /images on the site.
const WINE_IMAGES = {
  'Mariana Red 2024': '/images/mariana-red-2024.png',
  'Mariana White 2024': '/images/mariana-white-2024.png',
  'Mariana Rosé 2024': '/images/mariana-rose-2024.png',
  'Goivo 2024': '/images/goivo-2024.png',
  'Alicante Bouschet 2023': '/images/alicante-bouschet-2023.png',
  'Rocim Vindima 2024': '/images/rocim-vindima-2024.png',
  'Rocim White 2024': '/images/rocim-white-2024.png',
  'Rocim Red Reserva 2023': '/images/rocim-red-reserva-2023.png',
  'Vale da Mata Red 2024': '/images/vale-da-mata-red-2024.png',
  'Vale da Mata White 2024': '/images/vale-da-mata-white-2024.png',
  'Raio de Luz Red 2024': '/images/raio-de-luz-red-2024.png',
  'Raio de Luz White 2024': '/images/raio-de-luz-white-2024.png',
};
const wineImage = name => (WINE_IMAGES[name] ? SITE_URL + WINE_IMAGES[name] : '');

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
      await sendCustomerEmail({ ref, customer, items, itemLines, total })
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

// --- Confirmation email to the customer (bilingual TH / EN, HTML) ---
async function sendCustomerEmail({ ref, customer, items = [], itemLines, total }) {
  const user = process.env.GMAIL_USER;
  const pass = process.env.GMAIL_PASS;
  if (!user || !pass) return;

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: { user, pass },
  });

  const baht = n => '฿' + Number(n || 0).toLocaleString();

  // Plain-text fallback (TH + EN) for mail clients that block HTML
  const text =
    `สวัสดีคุณ ${customer.name},\n\n` +
    `ขอบคุณจากใจที่เลือก Solaris Wine 🍷\n` +
    `เราได้รับคำสั่งซื้อและสลิปของคุณเรียบร้อยแล้ว ทีมงานจะตรวจสอบการชำระเงินและจัดส่งให้โดยเร็วที่สุด\n\n` +
    `หมายเลขออเดอร์: ${ref}\n` +
    `รายการสั่งซื้อ:\n${itemLines}\n` +
    `ยอดรวม: ${baht(total)}\n` +
    `จัดส่งไปที่: ${customer.address || '-'}\n\n` +
    `หากมีคำถาม ตอบกลับอีเมลฉบับนี้ได้เลย เรายินดีดูแลคุณด้วยความจริงใจ\n\n` +
    `================================\n\n` +
    `Hello ${customer.name},\n\n` +
    `Thank you so much for choosing Solaris Wine 🍷\n` +
    `We have received your order and payment slip. Our team will verify your payment and ship your wines as soon as possible.\n\n` +
    `Order number: ${ref}\n` +
    `Your items:\n${itemLines}\n` +
    `Total: ${baht(total)}\n` +
    `Shipping to: ${customer.address || '-'}\n\n` +
    `If you have any questions, simply reply to this email. We're happy to help.\n\n` +
    `Warm regards,\nThe Solaris Wine Team`;

  // HTML rows — shows a small bottle image when item.image (a public URL) exists
  const rows = items.map(it => {
    const img = it.image || wineImage(it.name);
    return `
    <tr>
      <td style="padding:10px 0;border-bottom:1px solid #eee;vertical-align:middle;">
        ${img ? `<img src="${img}" alt="" width="34" style="vertical-align:middle;margin-right:10px;border-radius:3px;">` : ''}
        <span style="color:#2b2b2b;">${it.name}</span>
        <span style="color:#999;">&times;${it.qty}</span>
      </td>
      <td style="padding:10px 0;border-bottom:1px solid #eee;text-align:right;color:#2b2b2b;white-space:nowrap;">
        ${baht(it.subtotal)}
      </td>
    </tr>`;
  }).join('');

  const html = `
  <div style="margin:0;padding:24px;background:#f4f1ec;font-family:Arial,Helvetica,sans-serif;">
    <div style="max-width:560px;margin:0 auto;background:#ffffff;border:1px solid #e6e0d6;">
      <div style="background:#0A0806;padding:22px 28px;text-align:center;">
        <div style="color:#BF9540;font-size:20px;letter-spacing:2px;font-weight:bold;">SOLARIS WINE</div>
        <div style="color:#8a8276;font-size:10px;letter-spacing:3px;margin-top:4px;">BY SOLARIS INTERTRADE</div>
      </div>
      <div style="padding:28px;">
        <h2 style="margin:0 0 6px;color:#1f1f1f;font-size:20px;">ขอบคุณสำหรับคำสั่งซื้อ 🍷</h2>
        <p style="margin:0 0 18px;color:#555;font-size:14px;line-height:1.7;">
          สวัสดีคุณ <strong>${customer.name}</strong>,<br>
          ขอบคุณจากใจที่เลือก Solaris Wine เราได้รับคำสั่งซื้อและสลิปของคุณเรียบร้อยแล้ว
          ทีมงานจะตรวจสอบการชำระเงินและจัดส่งให้โดยเร็วที่สุด
        </p>

        <div style="background:#faf7f2;border:1px solid #ece5d8;padding:14px 16px;margin-bottom:16px;">
          <span style="color:#999;font-size:11px;letter-spacing:1px;">หมายเลขออเดอร์ / ORDER</span><br>
          <strong style="color:#BF9540;font-size:18px;letter-spacing:1px;">${ref}</strong>
        </div>

        <table style="width:100%;border-collapse:collapse;font-size:14px;">${rows}
          <tr>
            <td style="padding:12px 0 0;font-weight:bold;color:#1f1f1f;">ยอดรวม / Total</td>
            <td style="padding:12px 0 0;text-align:right;font-weight:bold;color:#BF9540;font-size:16px;">${baht(total)}</td>
          </tr>
        </table>

        <p style="margin:18px 0 0;color:#555;font-size:13px;line-height:1.7;">
          <strong>จัดส่งไปที่ / Shipping to:</strong><br>${customer.address || '-'}
        </p>

        <hr style="border:none;border-top:1px solid #eee;margin:22px 0;">

        <p style="margin:0;color:#777;font-size:13px;line-height:1.7;">
          Hello <strong>${customer.name}</strong>, thank you so much for choosing Solaris Wine.
          We've received your order and payment slip, and will verify your payment and ship your
          wines as soon as possible. If you have any questions, simply reply to this email.
        </p>
        <p style="margin:18px 0 0;color:#999;font-size:13px;">
          ด้วยความขอบคุณ / Warm regards,<br>
          <strong style="color:#1f1f1f;">The Solaris Wine Team</strong>
        </p>
      </div>
    </div>
  </div>`;

  await transporter.sendMail({
    from: `"Solaris Wine" <${user}>`,
    to: customer.email,
    subject: `ยืนยันคำสั่งซื้อ ${ref} / Order Confirmation — Solaris Wine`,
    text,
    html,
  });
}
