const express = require('express');
const router = express.Router();
const jobController = require('../controllers/jobController');
const auth = require('../middleware/authMiddleware');

router.post('/', auth, jobController.createJob); // create
router.get('/', auth, jobController.getJobs); // get all jobs for user
router.patch('/:id', auth, jobController.updateJob); // update job

module.exports = router;
