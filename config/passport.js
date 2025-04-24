const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const Employee = require("../models/Employee");
require("dotenv").config();

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        // Ensure the email is available
        if (!profile.emails || !profile.emails[0]) {
          return done(new Error('Email is not available from Google profile'), null);
        }

        let user = await Employee.findOne({ email: profile.emails[0].value });

        if (!user) {
          user = new Employee({
            name: profile.displayName,
            email: profile.emails[0].value,
            googleId: profile.id,
          });
          await user.save();
        }

        return done(null, user);
      } catch (error) {
        return done(error, null);
      }
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  const user = await Employee.findById(id);
  done(null, user);
});
