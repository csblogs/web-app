import express from 'express';
import log from '../log';
import { passport } from '../helpers/authentication';

const router = express.Router(); // eslint-disable-line new-cap
const isProduction = process.env.NODE_ENV === 'production';
const redirect = {
  failureRedirect: '/login'
};

/* eslint-disable no-param-reassign */
function authenticated(req, res) {
  log.info(req.user, 'reached here');
  if (req.user) {
    if (req.user.token) {
      res.cookie('user_token', req.user.token, {
        httpOnly: true,
        secure: isProduction
      });
      res.redirect('/profile');
    } else {
      res.redirect('/register');
    }
  } else {
    throw new Error('No user information provided');
  }
}
/* eslint-enable no-param-reassign */

router.get('/github', passport.authenticate('github'));
router.get('/github/callback',
  passport.authenticate('github', redirect),
  authenticated
);

router.get('/wordpress', passport.authenticate('wordpress'));
router.get('/wordpress/callback',
  passport.authenticate('wordpress', redirect),
  authenticated
);

router.get('/stack-exchange', passport.authenticate('stackexchange'));
router.get('/stack-exchange/callback',
  passport.authenticate('stackexchange', redirect),
  authenticated
);

export default router;
