require('dotenv').config();
const express = require('express');
const passport = require('passport');
const cors = require('cors');
const bodyParser = require('body-parser');
const connectDB = require('./config/db');

const authRoutes = require('./routes/authRoutes');
const profileRoutes = require('./routes/profileRoutes');
const otpRoutes = require('./routes/otpRoutes');
const jobRoutes = require('./routes/jobRoutes');
const courseRoutes = require('./routes/courseRoutes');
const earningRoutes = require('./routes/earningRoutes');
const bankRoutes = require('./routes/bankRoutes');
const statsRoutes = require('./routes/statsRoutes');


const fs = require('fs');
const path = require('path');

const app = express();


connectDB();

require('./config/passport'); 
app.use(passport.initialize())

const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:5173";


app.use(
  cors({
    origin: FRONTEND_URL,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true, 
  })
);


app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ extended: true }));

const profilePhotosDir = path.join(__dirname, 'uploads/profilePhotos');
if (!fs.existsSync(profilePhotosDir)) {
  fs.mkdirSync(profilePhotosDir, { recursive: true });
}


app.use('/uploads', express.static('uploads'));

app.use('/api/auth', authRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/otp', otpRoutes);
app.use('/api/jobs', jobRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/earnings', earningRoutes);
app.use('/api/banks', bankRoutes);
app.use('/api/stats', statsRoutes);

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Server error' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server listening on ${PORT}`));
