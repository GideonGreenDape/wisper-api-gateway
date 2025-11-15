const express = require('express');
const router = express.Router();
const passport = require("passport");
const authController = require('../controllers/authController');
const authMiddleware = require('../middleware/authMiddleware');
const { getConsentUrl, gmailCallback } = require('../controllers/gmailController');

router.post('/signup', authController.signup); 
router.post('/signin', authController.signin); 
router.post('/logout', authMiddleware, authController.logout);
router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);


router.get(
  "/google/callback",
  passport.authenticate("google", { session: false }),
  authController.googleCallbackHandler 
); 

router.get('/consent-url', getConsentUrl);


router.get('/callback', gmailCallback);

module.exports = router;
