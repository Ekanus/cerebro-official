# Cerebro Software — Contact Form Implementation

Complete, copy-paste-ready pattern for adding a working contact form to any Cerebro client site.

---

## 1. HTML Form Markup

```html
<form id="contactForm" class="contact-form" novalidate>
  <div class="form-row">
    <div class="form-group">
      <label class="form-label">Name</label>
      <input type="text" class="form-input" name="name" placeholder="Your name" required>
    </div>
    <div class="form-group">
      <label class="form-label">Email</label>
      <input type="email" class="form-input" name="email" placeholder="email@company.com" required>
    </div>
  </div>
  <div class="form-group">
    <label class="form-label">Business type</label>
    <select class="form-input form-select" name="businessType">
      <option value="">Select your business</option>
      <option value="hotel">Hotel / Tourism</option>
      <option value="medical">Medical Clinic</option>
      <option value="business">Other Business</option>
    </select>
  </div>
  <div class="form-group">
    <label class="form-label">What do you need?</label>
    <textarea class="form-input form-textarea" name="message"
      placeholder="Describe your situation..." required></textarea>
  </div>
  <button type="submit" class="btn btn--dark form-submit">Send Message →</button>
</form>
```

**Critical:** Every `<input>`, `<select>`, and `<textarea>` must have a `name` attribute. `FormData` uses `name` to collect values — without it, fields are silently skipped.

---

## 2. Vercel Serverless Function — `api/contact.js`

```js
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
  <tr><td style="padding:0 0 8px;border-top:1px solid #e5e5e5;padding-top:12px">
    <strong>Message:</strong><br><br>
    ${escHtml(message).replace(/\n/g, '<br>')}
  </td></tr>
</table>`;

  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from:     'Cerebro Contact Form <onboarding@resend.dev>',
      to:       ['info@cerebro.gr'],          // ← change per client
      reply_to: email,
      subject:  `New inquiry from ${name} — ${businessLabel}`,
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
```

---

## 3. main.js Fetch Handler

Replace the form's submit listener with this async handler:

```js
const form = document.getElementById('contactForm');
if (form) {
  form.addEventListener('submit', async e => {
    e.preventDefault();
    const btn  = form.querySelector('.form-submit');
    const data = Object.fromEntries(new FormData(form));

    // Client-side validation
    const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!data.name || !data.email || !data.businessType || !data.message) return;
    if (!emailRe.test(data.email)) return;

    btn.textContent = 'Sending…';
    btn.disabled    = true;

    try {
      const res = await fetch('/api/contact', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify(data),
      });
      if (res.ok) {
        btn.textContent = 'Message sent ✓';
        btn.classList.add('form-submit--sent');
      } else {
        throw new Error();
      }
    } catch {
      btn.textContent = 'Something went wrong. Try again.';
      btn.disabled    = false;
    }
  });
}
```

---

## 4. vercel.json

```json
{
  "functions": {
    "api/*.js": {
      "runtime": "nodejs20.x"
    }
  }
}
```

Place in project root. No `package.json` is needed — the function uses native `fetch` (Node 18+), no npm packages.

---

## 5. Environment Variable Setup

1. Go to [resend.com](https://resend.com) → Create account
2. Add and verify the client's sending domain (e.g. `cerebro.gr` or `clientsite.com`)
3. Create an API key
4. In Vercel dashboard → Project → Settings → Environment Variables:
   - Name: `RESEND_API_KEY`
   - Value: `re_xxxxxxxxxxxx` (from Resend)
   - Environments: Production + Preview

The serverless function reads `process.env.RESEND_API_KEY` — the key is never in source code.

---

## 6. Customization Checklist

| Thing to change | Where | How |
|----------------|-------|-----|
| Recipient email | `api/contact.js` | Change `to: ['info@cerebro.gr']` |
| Email subject format | `api/contact.js` | Edit the `subject:` string |
| Business type options | HTML + `api/contact.js` | Add/edit `<option>` values and `businessLabels` map |
| From address | `api/contact.js` | Change `from:` — must use verified domain or `onboarding@resend.dev` for testing |
| Form field names | HTML `name=` attrs + `api/contact.js` destructuring | Keep in sync |
| Reply-to | `api/contact.js` | Currently set to sender's email — always keep this |

---

## 7. Testing Before Go-Live

1. Deploy to Vercel (even preview URL works)
2. Submit the form — check the recipient inbox
3. Check Vercel Functions logs (Dashboard → Deployments → Functions) for any errors
4. Verify `reply_to` works by hitting "Reply" in the received email

**Local testing:** The `/api/contact` route only works on Vercel (or with `vercel dev` CLI locally). A plain `file://` or local HTTP server will get a 404 on the fetch — that is expected and not a bug.
