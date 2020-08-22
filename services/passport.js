const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const keys = require('../config/keys');
const db = require('../config/db/mysql').pool;
const getUserByGoogleId = require('../queries/getUser');
const addUser = require('../queries/addUser');
const sendEmail = require('../services/aws-ses');
passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  db.getConnection((err, connection) => {
    if (err) throw err;

    connection.query(
      `SELECT 
      bookshelf.users.*
      FROM bookshelf.users
      WHERE bookshelf.users.id = ${id}`,
      (err, results, fields) => {
        if (!results || err) {
          connection.query(
            `SELECT 
            bookshelf.users.*
            FROM bookshelf.users
            WHERE mongo_id = '${id}'`,
            (err, results, fields) => {
              if (err) throw err;
              done(null, results[0]);
            }
          );
        } else {
          if (err) throw err;
          done(null, results[0]);
        }
      }
    );

    // connection.query(
    //   `SELECT * FROM users WHERE id = ${id}`,
    //   (err, users, fields) => {
    //     if (err) throw err;
    //     done(null, users[0]);
    //   }
    // );
    connection.release();
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
      //check for existing user, if there is one call done with that user as the second argument, if there is not create one then call done with that user

      try {
        const user = await getUserByGoogleId(profile.id);
        if (user) {
          sendEmail('mike@gllghr.io', '📖 Log in', `${user.full} logged into Bookshelf!`)
          done(null, user);
        } else if (!user) {
          try {
            const user = await addUser({
              googleId: profile.id,
              first: profile._json.given_name,
              last: profile._json.family_name,
              email: profile._json.email,
              full: profile._json.name,
              picture: profile._json.picture
            });
            sendEmail('mike@gllghr.io', '📖 Log in', `${user.full} logged into Bookshelf!`)
            done(null, user);
          } catch (err) {
            throw err;
          }
        }
      } catch (err) {
        throw err;
      }
    }
  )
);
