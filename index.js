const express = require("express");
const app = express();
const path = require("path");
const cookieSession = require("cookie-session");
const passport = require("passport");
const bodyParser = require("body-parser");
const keys = require("./config/keys");
const enforce = require("express-sslify");

require("./services/passport");

if (process.env.NODE_ENV === "production") {
	app.use(enforce.HTTPS({ trustProtoHeader: true }));
}

// The request handler must be the first middleware on the app
app.use(bodyParser.json({ limit: "50mb" }));
app.use(bodyParser.urlencoded({ extended: true, limit: "50mb" }));

app.use(
	cookieSession({ maxAge: 30 * 24 * 60 * 60 * 1000, keys: [keys.cookieKey] })
);
app.use(passport.initialize());
app.use(passport.session());

//ROUTES
//AUTH
require("./routes/authRoutes")(app);
//APP
require("./routes/appRoutes")(app);

//CONDITIONS IF DEPLOYED TO PRODUCTION
if (process.env.NODE_ENV === "production") {
	// Express will serve up production assets
	app.use(express.static(path.join(__dirname, "client", "build")));

	// Express will serve up the index.html file
	// if it doesn't recognize the route
	app.get("*", (req, res) => {
		res.sendFile(path.resolve(__dirname, "client", "build", "index.html"));
	});
}

app.listen(process.env.PORT || 2001, () =>
	console.log("Server running on 2001")
);
