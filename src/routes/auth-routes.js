import express from 'express';
import { passport } from '../helpers/authentication';

const router = express.Router(); // eslint-disable-line new-cap

router.get('/github', passport.authenticate('github'));

router.get('/github/callback',
  passport.authenticate('github', {
    successRedirect: '/',
    failureRedirect: '/login'
  })
);

export default router;
