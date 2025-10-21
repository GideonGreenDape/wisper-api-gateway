# WISPER JOB & COURSE Backend API (Express + MongoDB + Mongoose)

This is a backend server built using **Express.js**, **MongoDB**, and **Mongoose** following a clean architecture pattern:


The system supports **Recruiters** and **Trainers**, who can:
- Sign up and log in
- Complete profiles
- Verify OTP
- Create jobs or courses
- Manage earnings and bank accounts
- Log out

---

##  Features

| Feature | Description |
|----------|--------------|
| **Authentication** | JWT-based authentication with Recruiter or Trainer roles |
| **Profile Management** | Create and update personal and business details |
| **OTP Verification** | Email OTP verification via Nodemailer and Gmail |
| **Job Management** | Recruiters can create and edit job listings |
| **Course Management** | Trainers can upload courses with image and price |
| **Earnings Tracking** | Auto-calculated earnings per job/course |
| **Bank Accounts** | Add up to 4 withdrawal accounts |
| **Secure Logout** | Invalidate tokens on logout |

---

## Installation

### 1 Clone the Repository

```bash
git clone 
cd wisper-api-gateway


### Install dependencies
npm install


PORT=5000
MONGO_URI=mongodb://localhost:27017/
JWT_SECRET=supersecretkey
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_gmail_app_password
CLIENT_URL=http://localhost:5173


npm run dev


  wisper-api-gateway
├── controllers/
├── middlewares/
├── models/
├── routes/
├── scripts/
├── tests/
│   └── app.test.js
├── server.js
├── .env
└── package.json

