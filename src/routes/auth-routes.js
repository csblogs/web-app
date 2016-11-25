import express from 'express';
// import log from '../log';
import { passport } from '../helpers/authentication';

const router = express.Router(); // eslint-disable-line new-cap
const isProduction = process.env.NODE_ENV === 'production';

router.get('/:provider', (req, res, next) => {
  passport.authenticate(req.params.provider)(req, res, next);
});

router.get('/:provider/callback', (req, res, next) => {
  passport.authenticate(req.params.provider, {
    failureRedirect: '/login'
  })(req, res, next);
},
(req, res) => {
  if (req.user) {
    res.cookie('user_token', req.user.apiToken, {
      httpOnly: true,
      secure: isProduction
    });

    if (req.user.isRegistered) {
      res.redirect('/profile');
    } else {
      res.redirect('/register');
    }
  } else {
    throw new Error('No user information provided');
  }
});

export default router;
