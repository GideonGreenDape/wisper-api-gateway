const nodemailer = require('nodemailer');
const path = require('path');

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST || 'smtp.gmail.com',
  port: process.env.EMAIL_PORT ? Number(process.env.EMAIL_PORT) : 465,
  secure: process.env.EMAIL_SECURE === 'true' || true,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

/**
 * Send OTP Email
 */
async function sendOtpEmail(to, code) {
  const mailOptions = {
    from: process.env.EMAIL_FROM || process.env.EMAIL_USER,
    to,
    subject: 'Your OTP Code - Wisper',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 500px; margin: auto; border: 1px solid #eee; border-radius: 8px; padding: 20px;">
        <h2 style="text-align: center; color: #4f46e5;">Wisper Verification Code</h2>
        <p>Hello,</p>
        <p>Your verification code is:</p>
        <h1 style="text-align: center; color: #4f46e5;">${code}</h1>
        <p style="font-size: 14px; text-align: center;">This code expires in ${process.env.OTP_TTL_MINUTES || 10} minutes.</p>
        <p style="font-size: 12px; text-align: center; color: #999;">If you didn’t request this, please ignore this email.</p>
      </div>
    `,
  };

  return transporter.sendMail(mailOptions);
}

/**
 * Send Signup Welcome Email with embedded SVG logo & responsive design
 */
async function sendSignupEmail(to, name = 'there') {
  const logoPath = path.join(__dirname, '../assets/logos/wisper.svg'); 

  const mailOptions = {
    from: process.env.EMAIL_FROM || process.env.EMAIL_USER,
    to,
    subject: 'Welcome to Wisper 🎉',
    attachments: [
      {
        filename: 'wisper.svg',
        path: logoPath,
        cid: 'wisperlogo',
        contentType: 'image/svg+xml', 
      },
    ],
    html: `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Welcome to Wisper</title>
        <style>
          body {
            margin: 0;
            padding: 0;
            background-color: #f9fafb;
            font-family: Arial, sans-serif;
          }
          .container {
            max-width: 600px;
            margin: 20px auto;
            background: #ffffff;
            border-radius: 12px;
            overflow: hidden;
            box-shadow: 0 4px 10px rgba(0,0,0,0.05);
          }
          .header {
            background: #4f46e5;
            color: #fff;
            text-align: center;
            padding: 30px 20px;
          }
          .logo {
            max-width: 120px;
            margin-bottom: 10px;
          }
          .content {
            padding: 20px;
            color: #333;
            font-size: 16px;
            line-height: 1.6;
          }
          .button {
            display: inline-block;
            background: #4f46e5;
            color: #fff;
            text-decoration: none;
            padding: 12px 24px;
            border-radius: 8px;
            margin-top: 10px;
          }
          .footer {
            text-align: center;
            font-size: 12px;
            color: #777;
            padding: 20px;
            background: #f3f4f6;
          }
          .social-icons img {
            width: 24px;
            height: 24px;
            margin: 0 6px;
          }
          @media (max-width: 600px) {
            .content { font-size: 14px; padding: 16px; }
            .button { padding: 10px 20px; font-size: 14px; }
            .logo { max-width: 100px; }
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <img src="cid:wisperlogo" alt="Wisper Logo" class="logo" />
            <h1>Welcome to Wisper!</h1>
          </div>
          <div class="content">
            <p>Hi ${name},</p>
            <p>We’re thrilled to have you join <strong>Wisper</strong> — the space where ideas meet connection and creativity flourishes.</p>
            <p>Here’s what you can do next:</p>
            <ul>
              <li>Set up your profile</li>
              <li>Start uploading jobs and courses</li>
              <li>Start exploring Wisper today!</li>
            </ul>
            <p style="text-align: center;">
              <a href="https://wisper.app" class="button">Go to Wisper</a>
            </p>
            <p>If you ever need help, just reply to this email — we’ve got your back!</p>
          </div>
          <div class="footer">
            <div class="social-icons">
              <a href="https://twitter.com/wisper" target="_blank">
                <img src="https://cdn-icons-png.flaticon.com/512/733/733579.png" alt="Twitter" />
              </a>
              <a href="https://linkedin.com/company/wisper" target="_blank">
                <img src="https://cdn-icons-png.flaticon.com/512/733/733561.png" alt="LinkedIn" />
              </a>
              <a href="https://instagram.com/wisper" target="_blank">
                <img src="https://cdn-icons-png.flaticon.com/512/733/733558.png" alt="Instagram" />
              </a>
            </div>
            <p style="margin-top: 12px;">© ${new Date().getFullYear()} Wisper. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `,
  };

  return transporter.sendMail(mailOptions);
}


/**
 * Send Job Posting Success Notification Email
 */
async function sendJobPostSuccessEmail(to, jobTitle, name = 'there') {
  const logoPath = path.join(__dirname, '../assets/logos/wisper.svg');

  const mailOptions = {
    from: process.env.EMAIL_FROM || process.env.EMAIL_USER,
    to,
    subject: `Your Job "${jobTitle}" was posted successfully 🎉`,
    attachments: [
      {
        filename: 'wisper.svg',
        path: logoPath,
        cid: 'wisperlogo',
        contentType: 'image/svg+xml',
      },
    ],
    html: `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Job Posted Successfully</title>
        <style>
          body {
            margin: 0;
            padding: 0;
            background-color: #f9fafb;
            font-family: Arial, sans-serif;
          }
          .container {
            max-width: 600px;
            margin: 20px auto;
            background: #ffffff;
            border-radius: 12px;
            overflow: hidden;
            box-shadow: 0 4px 10px rgba(0,0,0,0.05);
          }
          .header {
            background: #4f46e5;
            color: #fff;
            text-align: center;
            padding: 30px 20px;
          }
          .logo {
            max-width: 120px;
            margin-bottom: 10px;
          }
          .content {
            padding: 20px;
            color: #333;
            font-size: 16px;
            line-height: 1.6;
          }
          .button {
            display: inline-block;
            background: #4f46e5;
            color: #fff;
            text-decoration: none;
            padding: 12px 24px;
            border-radius: 8px;
            margin-top: 10px;
          }
          .footer {
            text-align: center;
            font-size: 12px;
            color: #777;
            padding: 20px;
            background: #f3f4f6;
          }
          .social-icons img {
            width: 24px;
            height: 24px;
            margin: 0 6px;
          }
          @media (max-width: 600px) {
            .content { font-size: 14px; padding: 16px; }
            .button { padding: 10px 20px; font-size: 14px; }
            .logo { max-width: 100px; }
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <img src="cid:wisperlogo" alt="Wisper Logo" class="logo" />
            <h1>Job Posted Successfully!</h1>
          </div>
          <div class="content">
            <p>Hi ${name},</p>
            <p>Great news — your job post <strong>"${jobTitle}"</strong> has been published successfully on <strong>Wisper</strong>.</p>
            <p>Here’s what you can do next:</p>
            <ul>
              <li>View your live job listing</li>
              <li>Track applications as they come in</li>
            </ul>
            <p style="text-align: center;">
              <a href="https://wisper.app/dashboard/jobs" class="button">View My Job Post</a>
            </p>
            <p>We’re excited to help you find the perfect match!</p>
          </div>
          <div class="footer">
            <div class="social-icons">
              <a href="https://twitter.com/wisper" target="_blank">
                <img src="https://cdn-icons-png.flaticon.com/512/733/733579.png" alt="Twitter" />
              </a>
              <a href="https://linkedin.com/company/wisper" target="_blank">
                <img src="https://cdn-icons-png.flaticon.com/512/733/733561.png" alt="LinkedIn" />
              </a>
              <a href="https://instagram.com/wisper" target="_blank">
                <img src="https://cdn-icons-png.flaticon.com/512/733/733558.png" alt="Instagram" />
              </a>
            </div>
            <p style="margin-top: 12px;">© ${new Date().getFullYear()} Wisper. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `,
  };

  return transporter.sendMail(mailOptions);
}


module.exports = { sendOtpEmail, sendSignupEmail, sendJobPostSuccessEmail, transporter };
