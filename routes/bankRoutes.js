const express = require('express');
const router = express.Router();
const bankController = require('../controllers/bankController');
const auth = require('../middleware/authMiddleware');

router.post('/', auth, bankController.addAccount);
router.get('/', auth, bankController.getAccounts);
router.patch('/:id', auth, bankController.updateAccount);
router.delete('/:id', auth, bankController.deleteAccount);

module.exports = router;
