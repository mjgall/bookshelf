const passport = require('passport');

module.exports = (app) => {
  app.get('/auth/google/redirect/:referrer/', (req, res, next) => {
    req.session.redirect = req.params.referrer;

    passport.authenticate('google', {
      scope: ['profile', 'email'],
    })(req, res, next);
  });

  app.get('/auth/google/redirect/book/owned/:id', (req, res, next) => {
    req.session.redirect = 'book/owned' + '/' + req.params.id;

    passport.authenticate('google', {
      scope: ['profile', 'email'],
    })(req, res, next);
  });

  app.get('/auth/google/redirect/book/household/:id', (req, res, next) => {
    req.session.redirect = 'book/household' + '/' + req.params.id;
 
    passport.authenticate('google', {
      scope: ['profile', 'email'],
    })(req, res, next);
  });



  app.get('/auth/google/redirect/:referrer/:id', (req, res, next) => {
    req.session.redirect = req.params.referrer + '/' + req.params.id;

    passport.authenticate('google', {
      scope: ['profile', 'email'],
    })(req, res, next);
  });

  app.get('/auth/google', (req, res, next) => {
    req.session.redirect = null;
    passport.authenticate('google', {
      scope: ['profile', 'email'],
    })(req, res, next);
  });

  app.get(
    '/auth/google/callback',
    passport.authenticate('google'),
    (req, res) => {
      if (req.session.redirect) {
        const redirect = req.session.redirect;
        req.session.redirect = null;
        res.redirect(`/${redirect}`);
      } else {
        res.redirect('/');
      }
    }
  );

  app.get('/api/logout', (req, res) => {
    req.session.redirect = null;
    req.logout();
    res.redirect('/');
  });

  app.get('/api/current_user', (req, res) => {
    res.send(req.user);
  });
};
