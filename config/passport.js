const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const User = require("../models/User");
const Profile = require("../models/Profile");

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL:
        process.env.NODE_ENV === "production"
          ? "https://wisperonline.com/api/auth/google/callback"
          : "http://localhost:5000/api/auth/google/callback",
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const email = profile.emails?.[0]?.value;
        if (!email) return done(null, false, { message: "No email from Google" });

        let user = await User.findOne({ email });

       
        if (!user) {
          const role = "trainer"; 
          user = await User.create({
            email,
            password: null, 
            phone: null,
            role,
            googleId: profile.id,
          });

          const profileDoc = new Profile({
            user: user._id,
            email,
            verified: true, 
          });
          await profileDoc.save();
        }

        return done(null, user);
      } catch (err) {
        return done(err, false);
      }
    }
  )
);
