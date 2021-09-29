const passport = require("passport");
const addUser = require("../queries/addUser");
const getUserByEmail = require("../queries/getUserByEmail");

module.exports = (app) => {
  app.get("/auth/google/redirect/:referrer/", (req, res, next) => {
    req.session.redirect = req.params.referrer;

    passport.authenticate("google", {
      scope: ["profile", "email"],
    })(req, res, next);
  });

  app.get("/auth/google/redirect/book/owned/:id", (req, res, next) => {
    req.session.redirect = "book/owned" + "/" + req.params.id;

    passport.authenticate("google", {
      scope: ["profile", "email"],
    })(req, res, next);
  });

  app.get("/auth/google/redirect/book/household/:id", (req, res, next) => {
    req.session.redirect = "book/household" + "/" + req.params.id;

    passport.authenticate("google", {
      scope: ["profile", "email"],
    })(req, res, next);
  });

  app.get("/auth/google/redirect/:referrer/:id", (req, res, next) => {
    req.session.redirect = req.params.referrer + "/" + req.params.id;

    passport.authenticate("google", {
      scope: ["profile", "email"],
    })(req, res, next);
  });

  app.get("/auth/google", (req, res, next) => {
    req.session.redirect = null;
    passport.authenticate("google", {
      scope: ["profile", "email"],
    })(req, res, next);
  });

  app.get(
    "/auth/google/callback",
    passport.authenticate("google"),
    (req, res) => {
      if (req.session.redirect) {
        const redirect = req.session.redirect;
        req.session.redirect = null;
        res.redirect(`/${redirect}`);
      } else {
        res.redirect("/");
      }
    }
  );

  app.post("/auth/transparent", (req, res, next) => {
    if (!req.user.admin) {
      res.sendStatus(401);
    } else {
      passport.authenticate("local", (err, user, info) => {
        if (err) {
          return res
            .status(400)
            .send({ error: "Something went wrong." });
        }
        if (!user) {
          return res.status(200).send(info);
        }

        req.logIn(user, function (err) {
          if (err) {
            return next(err);
          }
          return res.status(200).send(info);
        });
      })(req, res, next);
    }
  });

  app.get("/api/logout", (req, res) => {
    req.session.redirect = null;
    req.logout();
    res.redirect("/");
  });

  app.get("/api/transparent_logout", (req, res) => {
    req.session.redirect = null;
    req.logout();
  });

  app.get("/api/current_user", (req, res) => {
    res.send(req.user);
  });

  app.post("/auth/login", (req, res, next) => {
    passport.authenticate("local", (err, user, info) => {
      if (err) {
        return res.status(400).send({ error: "Something went wrong." });
      }
      if (!user) {
        return res.status(200).send(info);
      }

      req.logIn(user, function (err) {
        if (err) {
          return next(err);
        }
        return res.status(200).send(info);
      });
    })(req, res, next);
  });

  app.post("/auth/register", async (req, res) => {
    const { firstName, lastName } = req.body;
    try {
      const users = await getUserByEmail(req.body.email);

      if (users) {
        res.status(400).send({ message: "Email already exists" });
      } else {
        await addUser({
          ...req.body,
          first: firstName,
          last: lastName,
          googleId: null,
          picture: "https://cdn4.iconfinder.com/data/icons/small-n-flat/24/user-alt-512.png",
        });
        res.status(200).send({ message: "success" });
      }
    } catch (error) {
      console.log(error);
      res.sendStatus(500);
    }

    // console.log(req.body)
    // res.send(req.body)
  });
};
