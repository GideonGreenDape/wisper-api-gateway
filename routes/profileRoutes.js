const express = require('express');
const router = express.Router();
const profileController = require('../controllers/profileController');
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

router.post('/setup',auth, profileController.setupProfile);
router.get('/contact', auth, profileController.getEmailPhone);
router.get('/basic', auth, profileController.getBasicInfo);
router.post('/update', auth, upload.single('photo'), profileController.updateProfile);
router.post('/photo', auth, upload.single('photo'), profileController.uploadPhoto);
router.delete('/delete-photo',auth, profileController.deletePhoto)

module.exports = router;
