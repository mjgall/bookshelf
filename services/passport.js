const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const keys = require('../config/keys')
const mongoose = require('mongoose');

const User = mongoose.model('User');

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  User.findById(id).then(user => {
    done(null, user);
  });
});

passport.use(
  new GoogleStrategy(
    {
      clientID: keys.googleClientId,
      clientSecret: keys.googleClientSecret,
      callbackURL: `/auth/google/callback`,
      proxy: true
    },
    async (accessToken, refreshToken, profile, done) => {
      const existingUser = await User.findOne({ googleId: profile.id });

      if (!existingUser) {
        //create new user instance then save it then call done
        const user = await new User({
          googleId: profile.id,
          email: profile._json.email,
          first: profile._json.given_name,
          last: profile._json.family_name,
          full: profile._json.name,
          picture: profile._json.picture,
        });
        user.save();
        done(null, user);
      } else {
        //Already a user, don't do anything

        done(null, existingUser);
      }
    }
  )
);
