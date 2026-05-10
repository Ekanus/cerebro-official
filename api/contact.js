export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { name, email, businessType, message } = req.body ?? {};

  if (!name || !email || !businessType || !message) {
    return res.status(400).json({ error: 'All fields are required.' });
  }

  const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRe.test(email)) {
    return res.status(400).json({ error: 'Invalid email address.' });
  }

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: 'Server misconfiguration.' });
  }

  const businessLabels = {
    hotel:    'Hotel / Tourism',
    medical:  'Medical Clinic',
    business: 'Other Business',
  };
  const businessLabel = businessLabels[businessType] ?? businessType;

  const html = `
<table style="font-family:sans-serif;font-size:15px;line-height:1.6;color:#111;max-width:560px">
  <tr><td style="padding:0 0 8px"><strong>Name:</strong> ${escHtml(name)}</td></tr>
  <tr><td style="padding:0 0 8px"><strong>Email:</strong> ${escHtml(email)}</td></tr>
  <tr><td style="padding:0 0 8px"><strong>Business type:</strong> ${escHtml(businessLabel)}</td></tr>
  <tr><td style="padding:0 0 8px;border-top:1px solid #e5e5e5;padding-top:12px"><strong>Message:</strong><br><br>${escHtml(message).replace(/\n/g, '<br>')}</td></tr>
</table>`;

  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: 'Cerebro Contact Form <onboarding@resend.dev>',
      to:   ['info@cerebro.gr'],
      reply_to: email,
      subject: `New inquiry from ${name} — ${businessLabel}`,
      html,
    }),
  });

  if (!response.ok) {
    const err = await response.text();
    console.error('Resend error:', err);
    return res.status(502).json({ error: 'Failed to send email.' });
  }

  return res.status(200).json({ success: true });
}

function escHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}
