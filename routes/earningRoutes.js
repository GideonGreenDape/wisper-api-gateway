const express = require('express');
const router = express.Router();
const earningController = require('../controllers/earnignCotroller');
const auth = require('../middleware/authMiddleware');

router.post('/withdraw', auth, earningController.recordWithdrawal); // user posts a withdrawal
router.get('/', auth, earningController.getEarnings);
router.get('/totals', auth, earningController.totals);

module.exports = router;
