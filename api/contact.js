// api/contact.js — Vercel serverless function for the contact form
const nodemailer = require('nodemailer');

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const data = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
    const { name, email, phone, message, inquiry } = data || {};
    if (!name || (!email && !phone)) return res.status(400).json({ error: 'Missing fields' });

    const text =
      `✉️ ข้อความติดต่อใหม่ / NEW ENQUIRY\n` +
      `ชื่อ: ${name}\n` +
      (inquiry ? `ประเภท: ${inquiry}\n` : '') +
      (email ? `อีเมล: ${email}\n` : '') +
      (phone ? `โทร: ${phone}\n` : '') +
      `\n${message || '-'}`;

    await sendLine(text).catch(e => console.error('LINE error:', e.message));
    await sendEmail({ name, text }).catch(e => console.error('Email error:', e.message));

    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error('Contact handler error:', err);
    return res.status(500).json({ error: 'Server error' });
  }
};

async function sendLine(text) {
  const token = process.env.LINE_ACCESS_TOKEN;
  if (!token) return;
  const to = process.env.LINE_ADMIN_USER_ID;
  const url = to
    ? 'https://api.line.me/v2/bot/message/push'
    : 'https://api.line.me/v2/bot/message/broadcast';
  const body = to ? { to, messages: [{ type: 'text', text }] } : { messages: [{ type: 'text', text }] };
  const r = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify(body),
  });
  if (!r.ok) throw new Error(`${r.status} ${await r.text()}`);
}

async function sendEmail({ name, text }) {
  const user = process.env.GMAIL_USER;
  const pass = process.env.GMAIL_PASS;
  if (!user || !pass) return;
  const transporter = nodemailer.createTransport({ service: 'gmail', auth: { user, pass } });
  await transporter.sendMail({
    from: `"Solaris Wine" <${user}>`,
    to: process.env.CONTACT_EMAIL || 'contact@solariswine.com',
    subject: `New Enquiry from ${name} — Solaris Wine`,
    text,
  });
}
