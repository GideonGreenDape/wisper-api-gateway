const { Schema, model } = require('mongoose');

const GmailTokenSchema = new Schema({
    access_token: { type: String },
    refresh_token: { type: String, required: true },
    scope: { type: String },
    token_type: { type: String },
    expiry_date: { type: Number },
    createdAt: { type: Date, default: Date.now },
});

module.exports = model('GmailToken', GmailTokenSchema);
