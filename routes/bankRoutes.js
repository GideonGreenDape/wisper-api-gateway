const express = require('express');
const router = express.Router();
const bankController = require('../controllers/bankController');
const authMiddleware = require('../middleware/authMiddleware');

router.post('/', authMiddleware, bankController.addAccount);
router.get('/', authMiddleware, bankController.getAccounts);
router.patch('/:id', authMiddleware, bankController.updateAccount);
router.delete('/:id', authMiddleware, bankController.deleteAccount);

module.exports = router;
