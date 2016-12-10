import express from 'express';
// import log from '../log';
import { passport } from '../helpers/authentication';

const router = express.Router(); // eslint-disable-line new-cap

router.get('/:provider', (req, res, next) => {
  passport.authenticate(req.params.provider)(req, res, next);
});

router.get('/:provider/callback', (req, res, next) => {
  passport.authenticate(req.params.provider, {
    failureRedirect: '/login'
  })(req, res, next);
},
(req, res, next) => {
  if (req.user) {
    if (req.user.isRegistered) {
      res.redirect('/profile');
    } else {
      res.redirect('/register');
    }
  } else {
    next(new Error('No user information provided'));
  }
});

export default router;
