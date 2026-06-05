// api/line-webhook.js
// TEMPORARY helper to capture your userId.
// It does TWO things so you can get the userId either way:
//   (A) logs the userId to Vercel logs  -> read it under Vercel > Logs
//   (B) tries to reply it back in LINE   -> needs a valid LINE_ACCESS_TOKEN
// After you have the userId: put it in Vercel as LINE_ADMIN_USER_ID, then
// delete this file or turn the webhook off.

module.exports = async (req, res) => {
  // make the URL openable in a browser to confirm it's deployed
  if (req.method === 'GET') return res.status(200).send('webhook alive');
  if (req.method !== 'POST') return res.status(200).send('ok');

  try {
    const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
    const events = (body && body.events) || [];

    for (const ev of events) {
      const userId = ev.source && ev.source.userId;

      // (A) ALWAYS log it — visible in Vercel > Logs even if the token is wrong
      console.log('==== LINE userId ====', userId, JSON.stringify(ev.source));

      // (B) also try to reply it back in chat (only works if token is valid)
      if (ev.type === 'message' && ev.replyToken && userId && process.env.LINE_ACCESS_TOKEN) {
        await fetch('https://api.line.me/v2/bot/message/reply', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${process.env.LINE_ACCESS_TOKEN}`,
          },
          body: JSON.stringify({
            replyToken: ev.replyToken,
            messages: [{ type: 'text', text: `Your userId:\n${userId}` }],
          }),
        }).catch(e => console.error('reply failed:', e.message));
      }
    }
    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error('webhook error:', err);
    return res.status(200).json({ ok: true });
  }
};
