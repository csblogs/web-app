import express from 'express';
import { passport } from '../helpers/authentication';

const router = express.Router(); // eslint-disable-line new-cap
const redirects = {
  successRedirect: '/profile',
  failureRedirect: '/login'
};

router.get('/github', passport.authenticate('github'));
router.get('/github/callback',
  passport.authenticate('github', redirects)
);

router.get('/wordpress', passport.authenticate('wordpress'));
router.get('/wordpress/callback',
  passport.authenticate('wordpress', redirects)
);

router.get('/stack-exchange', passport.authenticate('stackexchange'));
router.get('/stack-exchange/callback',
  passport.authenticate('stackexchange', redirects)
);

export default router;
