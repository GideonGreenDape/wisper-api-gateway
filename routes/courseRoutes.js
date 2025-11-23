const express = require('express');
const router = express.Router();
const courseController = require('../controllers/courseController');
const auth = require('../middleware/authMiddleware');
const multer = require('multer');
const path = require('path');


const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/profilePhotos'); 
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ storage });


router.post('/', auth,upload.single('photo'), courseController.createCourse);
router.get('/', auth, courseController.getCourses);
router.patch('/:id', auth, courseController.updateCourse);

module.exports = router;
