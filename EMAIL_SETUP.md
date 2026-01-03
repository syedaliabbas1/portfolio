# Email Service Setup Instructions

To enable email notifications for your contact form, you need to set up an email service. I recommend **Resend** as it's easy to set up and works great with Next.js.

## Option 1: Resend (Recommended) ⭐

### Step 1: Install Resend
```bash
npm install resend
```

### Step 2: Get API Key
1. Go to [resend.com](https://resend.com)
2. Sign up for a free account
3. Verify your domain (or use onboarding domain for testing)
4. Get your API key from the dashboard

### Step 3: Add Environment Variable
Create/update `.env.local`:
```
RESEND_API_KEY=re_your_api_key_here
```

### Step 4: Update API Route
Uncomment the Resend code in `app/api/contact/route.ts` (lines starting with "// Option 1")

---

## Option 2: SendGrid

### Step 1: Install SendGrid
```bash
npm install @sendgrid/mail
```

### Step 2: Get API Key
1. Go to [sendgrid.com](https://sendgrid.com)
2. Create account and verify email
3. Create API key in Settings > API Keys

### Step 3: Add Environment Variable
```
SENDGRID_API_KEY=SG.your_api_key_here
```

### Step 4: Update API Route
Uncomment the SendGrid code in `app/api/contact/route.ts` (lines starting with "// Option 2")

---

## Option 3: Nodemailer with Gmail (Free)

### Step 1: Install Nodemailer
```bash
npm install nodemailer
```

### Step 2: Setup Gmail App Password
1. Enable 2-factor authentication on your Gmail
2. Go to Google Account > Security > 2-Step Verification > App passwords
3. Generate app password for "Mail"

### Step 3: Add Environment Variables
```
GMAIL_USER=your.email@gmail.com
GMAIL_APP_PASSWORD=your_16_digit_app_password
```

### Step 4: Use Nodemailer in API Route
```typescript
import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD,
  },
});

await transporter.sendMail({
  from: process.env.GMAIL_USER,
  to: 'syedaliabbas1124@gmail.com',
  replyTo: email,
  subject: emailContent.subject,
  html: emailContent.html,
});
```

---

## Testing

After setup, test the form:
1. Fill out the contact form on your website
2. Check your email at syedaliabbas1124@gmail.com
3. Verify you receive the formatted email with all details

## Current Status

✅ Form component created with your design
✅ API route configured
⚠️ Email service needs to be set up (choose one option above)

The form will work and log messages to console, but won't send emails until you complete one of the setups above.
