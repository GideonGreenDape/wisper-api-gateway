const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const User = require("../models/User");
const Profile = require("../models/Profile");

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "https://wisper-api-gateway.onrender.com/api/auth/google/callback"
    },
    async (accessToken, refreshToken, profile, done) => {
  try {
    const email = profile.emails?.[0]?.value;
    if (!email) return done(null, false, { message: "No email from Google" });

    let user = await User.findOne({ email });

    if (!user) {
      const role = "recruiter";
      user = await User.create({
        email,
        password: null,
        phone: "+0000000000",
        role,
        googleId: profile.id,
      });

     
      let dbProfile = await Profile.findOne({ user: user._id });

      if (!dbProfile) {
        await Profile.create({
          user: user._id,
          email,
          verified: true,
          phone: "+0000000000"
        });
      }
    }

    return done(null, user);
  } catch (err) {
    return done(err, false);
  }
}

  )
);
