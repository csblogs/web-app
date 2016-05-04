import _passport from 'passport';
import GitHubStrategy from 'passport-github2';
import { Strategy as WordpressStrategy } from 'passport-wordpress';
import { Strategy as StackExchangeStrategy } from 'passport-stackexchange';
import log from '../log';
import * as api from '../helpers/api';

export const passport = _passport;

export function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  // Not logged in
  return res.redirect('/login');
}

export function avatarFromCookie(req, res, next) {
  /* eslint-disable no-param-reassign */
  if (req.isAuthenticated()) {
    res.locals.user_avatar_url = req.cookies.user_avatar_url;
  }
  next();
  /* eslint-enable no-param-reassign */
}

function authenticateWithAPI(service, accessToken, done) {
  api.get('authentication/token', null, {
    username: service,
    password: accessToken
  })
  .then(res => {
    log.info(res, 'User authenticated with API');
    done(null, res);
  })
  .catch(err => {
    done(err);
  });
}

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((obj, done) => {
  done(null, obj);
});

// GitHub auth
passport.use(new GitHubStrategy({
  clientID: process.env.GITHUB_CLIENT_ID,
  clientSecret: process.env.GITHUB_CLIENT_SECRET,
  callbackURL: '/auth/github/callback'
},
(accessToken, refreshToken, profile, done) => {
  authenticateWithAPI('github', accessToken, done);
}));

// WordPress auth
passport.use(new WordpressStrategy({
  clientID: process.env.WORDPRESS_CLIENT_ID,
  clientSecret: process.env.WORDPRESS_CLIENT_SECRET,
  callbackURL: '/auth/wordpress/callback'
},
(accessToken, refreshToken, profile, done) => {
  authenticateWithAPI('wordpress', accessToken, done);
}));

// Stack Exchange auth
passport.use(new StackExchangeStrategy({
  clientID: process.env.STACK_EX_CLIENT_ID,
  clientSecret: process.env.STACK_EX_CLIENT_SECRET,
  key: process.env.STACK_EX_CLIENT_KEY,
  callbackURL: '/auth/stack-exchange/callback'
},
(accessToken, refreshToken, profile, done) => {
  authenticateWithAPI('stack_exchange', accessToken, done);
}));
