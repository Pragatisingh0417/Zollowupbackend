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
        // Log the profile data for debugging
        console.log("✅ Google Profile Data: ", profile);

        // Ensure the email is available
        const email = profile.emails?.[0]?.value?.toLowerCase();
        if (!email) {
          console.error("❌ Email not available in Google profile");
          return done(new Error("Email is not available from Google profile"), null);
        }

        // Find existing user by email
        let user = await Employee.findOne({ email });

        if (!user) {
          // If the user does not exist, create a new one
          console.log("🆕 Creating new user:", profile.displayName);
          user = new Employee({
            name: profile.displayName,
            email,
            googleId: profile.id,
            position: "Employee", // Optional fallback position
          });
          await user.save();
        }

        return done(null, user);
      } catch (error) {
        console.error("❌ Error during Google authentication:", error);
        return done(error, null);
      }
    }
  )
);

// Serialize user to session
passport.serializeUser((user, done) => {
  console.log("🔐 Serializing user:", user.id);
  done(null, user.id);
});

// Deserialize user from session
passport.deserializeUser(async (id, done) => {
  try {
    console.log("🔓 Deserializing user with ID:", id);
    const user = await Employee.findById(id);
    if (!user) {
      console.error("❌ User not found in DB");
      return done(new Error("User not found"), null);
    }
    done(null, user);
  } catch (error) {
    console.error("❌ Error deserializing user:", error);
    done(error, null);
  }
});
