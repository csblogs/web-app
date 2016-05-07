import express from 'express';
import { passport } from '../helpers/authentication';

const router = express.Router(); // eslint-disable-line new-cap
const isProduction = process.env.NODE_ENV === 'production';
const redirect = {
  failureRedirect: '/login'
};

/* eslint-disable no-param-reassign */
function setTokenCookie(req, res) {
  if (req.user && req.user.token) {
    res.cookie('user_token', req.user.token, {
      httpOnly: true,
      secure: isProduction
    });
  }
  res.redirect('/profile');
}
/* eslint-enable no-param-reassign */

router.get('/github', passport.authenticate('github'));
router.get('/github/callback',
  passport.authenticate('github', redirect),
  setTokenCookie
);

router.get('/wordpress', passport.authenticate('wordpress'));
router.get('/wordpress/callback',
  passport.authenticate('wordpress', redirect),
  setTokenCookie
);

router.get('/stack-exchange', passport.authenticate('stackexchange'));
router.get('/stack-exchange/callback',
  passport.authenticate('stackexchange', redirect),
  setTokenCookie
);

export default router;
