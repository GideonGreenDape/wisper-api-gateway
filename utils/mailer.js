const { google } = require('googleapis');
const fs = require('fs');
const path = require('path');
const GmailToken = require('../models/GmailToken');
const generateEmailTemplate = require('../template/emailTemplate')


const getOAuthClient = (refreshToken) => {
  const oauth2Client = new google.auth.OAuth2(
    process.env.GMAIL_CLIENT_ID,
    process.env.GMAIL_CLIENT_SECRET
  );
  oauth2Client.setCredentials({ refresh_token: refreshToken });
  return oauth2Client;
};


const sendGmailMessage = async ({ to, subject, html }) => {
  // Fetch the platform Gmail token from DB (assume single record)
  const gmailToken = await GmailToken.findOne({});
  if (!gmailToken || !gmailToken.refresh_token) {
    throw new Error('Gmail token not found in DB');
  }

  const oauth2Client = getOAuthClient(gmailToken.refresh_token);
  const gmail = google.gmail({ version: 'v1', auth: oauth2Client });

  // Build raw email
  let raw = `From: "Wisper" <${process.env.GMAIL_USER}>\r\n`;
  raw += `To: ${to}\r\n`;
  raw += `Subject: ${subject}\r\n`;
  raw += `MIME-Version: 1.0\r\n`;
  raw += `Content-Type: text/html; charset=UTF-8\r\n\r\n`;
  raw += html;

  const encodedMessage = Buffer.from(raw)
    .toString('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');

  const result = await gmail.users.messages.send({
    userId: 'me',
    requestBody: { raw: encodedMessage },
  });

  return result.data;
};

exports.sendOtpEmail = async ({ to,code}) => {
  try {
    const html = generateEmailTemplate({
      title: 'Wisper Verification Code',
      body: `
        <p>Hello,</p>
        <p>Your verification code is:</p>
        <div style="font-size:28px; font-weight:bold; color:#4f46e5;">${code}</div>
        <p>This code expires in ${process.env.OTP_TTL_MINUTES || 10} minutes.</p>
        <p>If you didn’t request this, please ignore this email.</p>
      `
    });

    const result = await sendGmailMessage({ to, subject: 'Your OTP Code - Wisper', html });
    return { message: 'OTP sent', result };
  } catch (err) {
    console.error(err);
   return { message: 'Failed to send OTP', error: err.message };
  }
};

exports.sendSignupEmailInternal = async ({ to, name = 'there' }) => {
  try {
    const html = generateEmailTemplate({
      title: 'Welcome to Wisper!',
      body: `
        <p>Hi ${name},</p>
        <p>We’re thrilled to have you join <strong>Wisper</strong> — start exploring today!</p>
      `,
      buttonText: 'Go to Wisper',
      buttonUrl: 'https://wisperonline.com/signin'
    });

    return await sendGmailMessage({ to, subject: 'Welcome to Wisper', html });
  } catch (err) {
    console.error('Internal mail send failed:', err);
    return null;
  }
};

exports.sendSignupEmail = async (req, res) => {
  try {
    const { to, name = 'there' } = req.body;
    if (!to) return res.status(400).json({ message: 'Missing recipient email' });

    const html = generateEmailTemplate({
      title: 'Welcome to Wisper!',
      body: `
        <p>Hi ${name},</p>
        <p>We’re thrilled to have you join <strong>Wisper</strong> — start exploring today!</p>
      `,
      buttonText: 'Go to Wisper',
      buttonUrl: 'https://wisperonline.com/signin'
    });

    const result = await sendGmailMessage({ to, subject: 'Welcome to Wisper', html });
    res.json({ message: 'Signup email sent', result });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to send signup email', error: err.message });
  }
};
