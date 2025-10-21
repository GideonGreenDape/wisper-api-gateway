const express = require('express');
const router = express.Router();
const profileController = require('../controllers/profileController');
const auth = require('../middleware/authMiddleware');

router.get('/contact', auth, profileController.getEmailPhone); // GET email & phone
router.get('/basic', auth, profileController.getBasicInfo); // GET firstname, lastname, email, phone
router.patch('/', auth, profileController.updateProfile); // PATCH update profile records
router.post('/photo', auth, profileController.uploadPhoto); // POST profile photo

module.exports = router;
