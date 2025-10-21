const express = require('express');
const router = express.Router();
const courseController = require('../controllers/courseController');
const auth = require('../middleware/authMiddleware');

router.post('/', auth, courseController.createCourse);
router.get('/', auth, courseController.getCourses);
router.patch('/:id', auth, courseController.updateCourse);

module.exports = router;
