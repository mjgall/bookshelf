const passport = require('passport');

module.exports = (app) => {
  app.get('/auth/google/redirect/:referrer', (req, res, next) => {
    req.session.redirect = req.params.referrer;
    passport.authenticate('google', {
      scope: ['profile', 'email'],
    })(req, res, next);
  });

  app.get(
    '/auth/google',
    passport.authenticate('google', {
      scope: ['profile', 'email'],
    })
  );

  app.get(
    '/auth/google/callback',
    passport.authenticate('google'),
    (req, res) => {
      if (req.session.redirect) {
        res.redirect(`/${req.session.redirect}`);
      } else {
        res.redirect('/');
      }
    }
  );

  app.get('/api/logout', (req, res) => {
    req.logout();
    res.redirect('/');
  });

  app.get('/api/current_user', (req, res) => {
    res.send(req.user);
  });
};
