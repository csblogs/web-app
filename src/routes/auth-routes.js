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

export default router;
