const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const authMiddleware = require('../middleware/authMiddleware');

router.post('/signup', authController.signup); // POST signup
router.post('/signin', authController.signin); // POST signin
router.post('/logout', authMiddleware, authController.logout); // POST logout

module.exports = router;
