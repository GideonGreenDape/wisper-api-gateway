const { google } = require('googleapis');
const GmailToken = require('../models/GmailToken');

const SCOPES = [
  'https://www.googleapis.com/auth/gmail.send',
  'https://www.googleapis.com/auth/gmail.readonly',
];


const getOAuthClient = () => {
  return new google.auth.OAuth2(
    process.env.GMAIL_CLIENT_ID,
    process.env.GMAIL_CLIENT_SECRET,
    process.env.NODE_ENV === 'production'
      ? 'https://wisperonline.com/api/auth/gmail/callback'
      : 'http://localhost:5000/api/auth/gmail/callback'
  );
};


exports.getConsentUrl = (req, res) => {
  const oauth2Client = getOAuthClient();
  const url = oauth2Client.generateAuthUrl({
    access_type: 'offline', 
    scope: SCOPES,
    prompt: 'consent',       
  });

  res.json({ url });
};


exports.gmailCallback = async (req, res) => {
  try {
    const { code } = req.query;
    if (!code) return res.status(400).send('Missing code');

    const oauth2Client = getOAuthClient();
    const { tokens } = await oauth2Client.getToken(code);

    if (!tokens.refresh_token) {
      return res
        .status(400)
        .send('No refresh token returned. Make sure you used prompt=consent.');
    }

    
    await GmailToken.findOneAndUpdate(
      {},
      { ...tokens },
      { upsert: true, new: true }
    );

    res.send(
      'Gmail connected successfully! Refresh token saved in database. You can now close this page.'
    );
  } catch (err) {
    console.error(err);
    res.status(500).send('Error connecting Gmail: ' + err.message);
  }
};
