const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const LocalStrategy = require("passport-local").Strategy;
const keys = require("../config/keys");
const db = require("../config/db/mysql").pool;
const getUserByGoogleId = require("../queries/getUser");
const addUser = require("../queries/addUser");
const sendEmail = require("../services/aws-ses");
const getUserById = require("../queries/getUserById");
const updateUser = require("../queries/updateUser");
const bcrypt = require("bcryptjs");
const getUserByEmailAddress = require("../queries/getUserByEmailAddress");
const posthog = require("../services/posthog");

passport.serializeUser((user, done) => {
	done(null, user.id);
});

passport.deserializeUser((id, done) => {
	db.getConnection((err, connection) => {
		if (err) throw err;

		connection.query(
			`SELECT id, email, first, last, full, picture, create_date, admin, shelf_id, shelf_enabled, searchable, last_login
      FROM bookshelf.users
      WHERE bookshelf.users.id = ${id};`,
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
		connection.release();
	});
});

passport.use(
	new LocalStrategy(
		{
			usernameField: "email",
			password: "password",
			passReqToCallback: true,
		},
		async (req, username, password, done) => {
			try {
				const user = await getUserById(req.body.id).catch((err) => {
					console.log(err);
					throw Error(err);
				});

				if (user) {
					done(false, user, { message: "redirect", user: user });
				}
			} catch (error) {
				console.log(error);
				throw Error(error);
			}
		}
	)
);

passport.use(
	new GoogleStrategy(
		{
			clientID: keys.googleClientId,
			clientSecret: keys.googleClientSecret,
			callbackURL: `/auth/google/callback`,
			proxy: true,
		},
		async (accessToken, refreshToken, profile, done) => {
			//check for existing user, if there is one call done with that user as the second argument, if there is not create one then call done with that user

			try {
				const user = await getUserByGoogleId(profile.id);
				if (user) {
					// sendEmail('mike@gllghr.io', '📚 Log in', `${user.full} logged into Bookshelf!`)
					try {
						posthog.capture({
							distinctId: user.id,
							event: "login",
						});
						console.log({
							message: "sent to posthog",
							distinctId: user.id,
							event: "login",
						});
					} catch (error) {
						console.log("posthog fail");
					}

					updateUser(user.id, "last_login", "NOW()");
					done(null, user);
				} else if (!user) {
					try {
						const user = await addUser({
							googleId: profile.id,
							first: profile._json.given_name,
							last: profile._json.family_name,
							email: profile._json.email,
							full: profile._json.name,
							picture: profile._json.picture,
						});
						// sendEmail('mike@gllghr.io', '📚 Sign up!', `${user.full} signed up and logged into Bookshelf!`)
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

passport.use(
	new LocalStrategy(
		{
			usernameField: "email",
			password: "password",
			passReqToCallback: true,
		},
		async (req, username, password, done) => {
			try {
				let user;

				if (req.body.id) {
					user = await getUserById(req.body.id).catch((err) => {
						console.log(err);
						throw Error(err);
					});
				} else {
					user = await getUserByEmailAddress(username).catch(
						(err) => {
							console.log(err);
							throw Error(err);
						}
					);
				}

				if (user && username === "empty" && password === "empty") {
					done(false, user, { message: "redirect" });
				} else if (user && user.password) {
					if (
						await bcrypt
							.compare(password, user.password)
							.catch((e) => {
								console.log(e);
								throw Error(e);
							})
					) {
						updateUser(user.id, "last_login", "NOW()");
						done(false, user, { message: "redirect" });
					} else {
						done(false, null, {
							message: "Incorrect email and/or password.",
						});
					}
				} else if (!user) {
					try {
						done(false, null, {
							message: "Incorrect email and/or password.",
						});
					} catch (error) {
						throw error;
					}
				} else {
					//already exists from oauth login
					done(false, null, {
						message: "Existing Google account found.",
					});
				}
			} catch (error) {
				console.log(error);
				throw Error(error);
			}
			//find if username (email) exists already. If it does, call done(null, user). If it does not, create new user, then call done(null, user).
		}
	)
);
