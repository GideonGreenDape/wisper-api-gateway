const fs = require('fs');
const path = require('path');

/**
 * Generate branded HTML email
 * @param {Object} options
 * @param {string} options.title - Email header/title
 * @param {string} options.body - Main body content (can include <p>, <ul>, etc.)
 * @param {string} [options.buttonText] - Optional button text
 * @param {string} [options.buttonUrl] - Optional button URL
 * @param {string} [options.logoPath] - Optional path to logo
 * @returns {string} - HTML string
 */
const generateEmailTemplate = ({
  title,
  body,
  buttonText,
  buttonUrl,
  logoPath = path.join(__dirname, '../assets/logos/wisper.svg'),
}) => {
  let logoBase64 = '';
  try {
    logoBase64 = fs.readFileSync(logoPath, { encoding: 'base64' });
  } catch (err) {
    console.warn('Logo not found or failed to read:', err.message);
  }

  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>${title}</title>
      <style>
        body {
          margin: 0;
          padding: 0;
          font-family: Arial, sans-serif;
          background-color: #f9fafb;
        }
        .container {
          max-width: 600px;
          margin: 20px auto;
          background: #fff;
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
          line-height: 1.5;
          text-align: center;
        }
        .button {
          display: inline-block;
          background: #4f46e5;
          color: #fff;
          text-decoration: none;
          padding: 12px 24px;
          border-radius: 8px;
          margin-top: 15px;
          font-weight: bold;
        }
        .footer {
          text-align: center;
          font-size: 12px;
          color: #777;
          padding: 20px;
          background: #f3f4f6;
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
          ${logoBase64 ? `<img src="data:image/svg+xml;base64,${logoBase64}" alt="Logo" class="logo"/>` : ''}
          <h1>${title}</h1>
        </div>
        <div class="content">
          ${body}
          ${buttonText && buttonUrl ? `<a href="${buttonUrl}" class="button">${buttonText}</a>` : ''}
        </div>
        <div class="footer">
          © ${new Date().getFullYear()} Wisper. All rights reserved.
        </div>
      </div>
    </body>
    </html>
  `;
};

module.exports = generateEmailTemplate;
