// Contact Form API Handler
// This serverless function handles contact form submissions and sends emails via Resend

const { Resend } = require('resend');

// Initialize Resend with API key from environment variables
const resend = new Resend(process.env.RESEND_API_KEY);

// Email configuration
// Configure these in your environment (see .env.example).
// FROM must be an address on a domain you have verified in Resend.
const FROM_EMAIL = process.env.CONTACT_FROM_EMAIL || 'Orbweave <onboarding@resend.dev>';
const TO_EMAIL = process.env.CONTACT_TO_EMAIL || 'you@example.com';

// Escape user-supplied values before putting them into HTML emails
const escapeHtml = (value = '') => String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');

module.exports = async (req, res) => {
    // Handle CORS preflight
    if (req.method === 'OPTIONS') {
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
        res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
        return res.status(200).end();
    }

    // Only allow POST requests
    if (req.method !== 'POST') {
        return res.status(405).json({
            success: false,
            error: 'Method not allowed'
        });
    }

    try {
        const raw = req.body || {};
        const email = typeof raw.email === 'string' ? raw.email.trim() : '';
        const safeEmail = escapeHtml(email);
        const name = escapeHtml(raw.name);
        const company = escapeHtml(raw.company);
        const phone = escapeHtml(raw.phone);
        const interest = escapeHtml(raw.interest);
        const message = escapeHtml(raw.message);

        // Validate required fields
        if (!name || !company || !email || !message) {
            return res.status(400).json({
                success: false,
                error: 'Missing required fields: name, company, email, and message are required'
            });
        }

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({
                success: false,
                error: 'Invalid email format'
            });
        }

        // Map interest value to readable text
        const interestMap = {
            'automation': 'We want to cut waste or energy use',
            'ai-tool': 'We want sensors and AI on our assets',
            'strategy': 'We need a circularity roadmap',
            'training': 'We want to train our team',
            'explore': 'Just exploring what\'s possible'
        };
        const interestText = interestMap[interest] || interest || 'Not specified';

        // Current date/time
        const submittedAt = new Date().toLocaleString('en-GB', {
            timeZone: process.env.CONTACT_TIMEZONE || 'UTC',
            dateStyle: 'full',
            timeStyle: 'short'
        });

        // Send notification email to Orbweave team
        const teamEmailResult = await resend.emails.send({
            from: FROM_EMAIL,
            to: TO_EMAIL,
            replyTo: email,
            subject: `🚀 New Contact: ${name} from ${company}`,
            html: `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: #0a0a0a; color: #ffffff; margin: 0; padding: 0; }
        .container { max-width: 600px; margin: 0 auto; padding: 40px 20px; }
        .header { text-align: center; margin-bottom: 40px; }
        .logo { font-size: 28px; font-weight: 700; color: #ffffff; letter-spacing: -0.5px; }
        .card { background: linear-gradient(145deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.03) 100%); border: 1px solid rgba(255,255,255,0.1); border-radius: 16px; padding: 30px; margin-bottom: 20px; }
        .badge { display: inline-block; background: rgba(34, 197, 94, 0.15); color: #22c55e; padding: 6px 14px; border-radius: 20px; font-size: 12px; font-weight: 600; margin-bottom: 20px; }
        h2 { margin: 0 0 20px 0; font-size: 22px; color: #ffffff; }
        .field { margin-bottom: 18px; }
        .field-label { font-size: 12px; color: rgba(255,255,255,0.5); text-transform: uppercase; letter-spacing: 0.1em; margin-bottom: 6px; }
        .field-value { font-size: 16px; color: #ffffff; line-height: 1.5; }
        .message-box { background: rgba(255,255,255,0.05); border-radius: 12px; padding: 20px; margin-top: 20px; }
        .message-text { font-size: 15px; line-height: 1.7; color: rgba(255,255,255,0.9); white-space: pre-wrap; }
        .footer { text-align: center; color: rgba(255,255,255,0.4); font-size: 12px; margin-top: 30px; }
        a { color: #22c55e; text-decoration: none; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <div class="logo">Orbweave</div>
        </div>
        <div class="card">
            <span class="badge">✨ New Lead</span>
            <h2>Contact Form Submission</h2>
            
            <div class="field">
                <div class="field-label">Name</div>
                <div class="field-value">${name}</div>
            </div>
            
            <div class="field">
                <div class="field-label">Company</div>
                <div class="field-value">${company}</div>
            </div>
            
            <div class="field">
                <div class="field-label">Email</div>
                <div class="field-value"><a href="mailto:${safeEmail}">${safeEmail}</a></div>
            </div>
            
            ${phone ? `
            <div class="field">
                <div class="field-label">Phone</div>
                <div class="field-value">${phone}</div>
            </div>
            ` : ''}
            
            <div class="field">
                <div class="field-label">Interest</div>
                <div class="field-value">${interestText}</div>
            </div>
            
            <div class="message-box">
                <div class="field-label">Message</div>
                <div class="message-text">${message}</div>
            </div>
        </div>
        
        <div class="footer">
            Submitted on ${submittedAt}<br>
            Reply directly to this email to respond to ${name}
        </div>
    </div>
</body>
</html>
            `
        });

        // Send auto-reply to the user
        const userEmailResult = await resend.emails.send({
            from: FROM_EMAIL,
            to: email,
            subject: `Thanks for reaching out, ${name.split(' ')[0]}! 🙌`,
            html: `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: #0a0a0a; color: #ffffff; margin: 0; padding: 0; }
        .container { max-width: 600px; margin: 0 auto; padding: 40px 20px; }
        .header { text-align: center; margin-bottom: 40px; }
        .logo { font-size: 28px; font-weight: 700; color: #ffffff; letter-spacing: -0.5px; }
        .card { background: linear-gradient(145deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.03) 100%); border: 1px solid rgba(255,255,255,0.1); border-radius: 16px; padding: 35px; }
        h1 { margin: 0 0 20px 0; font-size: 26px; color: #ffffff; line-height: 1.3; }
        p { font-size: 16px; line-height: 1.7; color: rgba(255,255,255,0.8); margin: 0 0 18px 0; }
        .highlight { color: #22c55e; }
        .summary { background: rgba(255,255,255,0.05); border-radius: 12px; padding: 20px; margin: 25px 0; }
        .summary-title { font-size: 13px; color: rgba(255,255,255,0.5); text-transform: uppercase; letter-spacing: 0.1em; margin-bottom: 12px; }
        .summary-text { font-size: 14px; color: rgba(255,255,255,0.7); line-height: 1.6; }
        .footer { text-align: center; margin-top: 35px; padding-top: 25px; border-top: 1px solid rgba(255,255,255,0.1); }
        .footer p { font-size: 14px; color: rgba(255,255,255,0.5); }
        .social-links { margin-top: 15px; }
        .social-links a { display: inline-block; margin: 0 8px; color: rgba(255,255,255,0.6); text-decoration: none; font-size: 13px; }
        .social-links a:hover { color: #22c55e; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <div class="logo">Orbweave</div>
        </div>
        <div class="card">
            <h1>Hey ${name.split(' ')[0]}, we got your message! 👋</h1>
            
            <p>Thanks for reaching out. We read every message personally, and someone from our team will get back to you within <span class="highlight">24 hours</span> (usually much faster).</p>
            
            <p>In the meantime, here's a quick recap of what you shared:</p>
            
            <div class="summary">
                <div class="summary-title">Your Message</div>
                <div class="summary-text">${message.substring(0, 200)}${message.length > 200 ? '...' : ''}</div>
            </div>
            
            <p>We're excited to learn more about ${company} and how we might be able to help. Talk soon!</p>
            
            <p style="margin-top: 30px;">
                Cheers,<br>
                <strong style="color: #ffffff;">The Orbweave Team</strong>
            </p>
        </div>
        
        <div class="footer">
            <p>Orbweave — From linear to circular</p>
            <div class="social-links">
                <a href="https://orbweave.example">Website</a> •
                <a href="https://www.linkedin.com/">LinkedIn</a> •
                <a href="https://x.com/">Twitter</a> •
                <a href="https://www.instagram.com/">Instagram</a>
            </div>
        </div>
    </div>
</body>
</html>
            `
        });

        // Log success (useful for debugging in Vercel logs)
        console.log('Emails sent successfully:', {
            teamEmail: teamEmailResult.id,
            userEmail: userEmailResult.id,
            to: email,
            from: name
        });

        // Return success response
        return res.status(200).json({
            success: true,
            message: 'Message sent successfully! We\'ll be in touch soon.'
        });

    } catch (error) {
        console.error('Error sending email:', error);

        return res.status(500).json({
            success: false,
            error: 'Failed to send message. Please try again or email us directly'
        });
    }
};
