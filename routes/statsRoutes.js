const express = require('express');
const router = express.Router();
const statsController = require('../controllers/statsController');
const auth = require('../middleware/authMiddleware');

router.get('/period/:period', auth, statsController.totalsPeriod); // period=week|month|year

module.exports = router;
