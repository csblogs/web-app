import _passport from 'passport';
import URI from 'urijs';
import GitHubStrategy from 'passport-github2';
import { Strategy as WordpressStrategy } from 'passport-wordpress';
import { Strategy as StackExchangeStrategy } from 'passport-stackexchange';
import log from '../log';
import * as api from './api';
import * as helpers from './auth-helpers';

const BASE_URL = process.env.CSBLOGS_BASE_URL || process.env.NOW_URL;

export const passport = _passport;

export function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  // Not logged in
  return res.redirect('/login');
}

export function getUserAvatar(req, res, next) {
  /* eslint-disable no-param-reassign */
  if (req.isAuthenticated()) {
    res.locals.user_avatar_url = req.user.profilePictureURI;
  }
  next();
  /* eslint-enable no-param-reassign */
}

function normalizeUser(passportUser, authDetails) {
  let userAsBlogger = null;

  switch (passportUser.provider) {
    case 'github': {
      // Remove version from GitHub, so the most recent is always used
      const avatarUrl = new URI(passportUser._json.avatar_url).removeSearch('v');

      userAsBlogger = {
        profilePictureURI: avatarUrl.toString(),
        emailAddress: passportUser._json.email,
        blogURI: passportUser._json.blog,
        githubUsername: passportUser._json.login,
        bio: passportUser._json.bio,
        vanityName: helpers.normalizeVanityName(passportUser.username)
      };
      if (passportUser.displayName) {
        userAsBlogger = helpers.getFullName(passportUser.displayName, userAsBlogger);
      }
      break;
    }
    case 'Wordpress': {
      userAsBlogger = {
        profilePictureURI: helpers.resizeGravatar(passportUser._json.avatar_URL),
        emailAddress: passportUser._json.email,
        blogFeedURI: `http://${passportUser.displayName}.wordpress.com/feed`,
        blogURI: `http://${passportUser.displayName}.wordpress.com`,
        vanityName: helpers.normalizeVanityName(passportUser._json.display_name)
      };
      if (passportUser._json.display_name) {
        userAsBlogger = helpers.getFullName(passportUser._json.display_name, userAsBlogger);
      }
      break;
    }
    case 'stackexchange': {
      userAsBlogger = {
        profilePictureURI: passportUser.profile_image,
        vanityName: helpers.normalizeVanityName(passportUser.display_name),
        blogURI: passportUser.website_url
      };
      if (passportUser.display_name) {
        userAsBlogger = helpers.getFullName(passportUser.display_name, userAsBlogger);
      }
      break;
    }
    default: {
      const err = new Error('Unsupported Passport provider');
      err.passportUser = passportUser;

      throw err;
    }
  }

  if (userAsBlogger) {
    userAsBlogger.apiToken = authDetails.csbToken;
    userAsBlogger.isRegistered = authDetails.isRegistered;
  }

  return userAsBlogger;
}

function authenticateWithAPI(service, accessToken, profile, done) {
  api.post('token', {
    authenticationProvider: service,
    accessToken,
    accessAppKey: process.env.CSBLOGS_STACK_EX_CLIENT_KEY
  })
  .then(res => {
    if (res.status !== 200) {
      const error = new Error(res.error);
      error.status = res.status;
      return done(error);
    }

    log.info(res, 'User authenticated with API');
    return done(null, normalizeUser(profile, res));
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
  clientID: process.env.CSBLOGS_GITHUB_CLIENT_ID,
  clientSecret: process.env.CSBLOGS_GITHUB_CLIENT_SECRET,
  callbackURL: `${BASE_URL}/auth/github/callback`
},
(accessToken, refreshToken, profile, done) => {
  authenticateWithAPI('github', accessToken, profile, done);
}));

// WordPress auth
passport.use(new WordpressStrategy({
  clientID: process.env.CSBLOGS_WORDPRESS_CLIENT_ID,
  clientSecret: process.env.CSBLOGS_WORDPRESS_CLIENT_SECRET,
  callbackURL: `${BASE_URL}/auth/wordpress/callback`
},
(accessToken, refreshToken, profile, done) => {
  authenticateWithAPI('wordpress', accessToken, profile, done);
}));

// Stack Exchange auth
passport.use(new StackExchangeStrategy({
  clientID: process.env.CSBLOGS_STACK_EX_CLIENT_ID,
  clientSecret: process.env.CSBLOGS_STACK_EX_CLIENT_SECRET,
  key: process.env.CSBLOGS_STACK_EX_CLIENT_KEY,
  callbackURL: `${BASE_URL}/auth/stackexchange/callback`
},
(accessToken, refreshToken, profile, done) => {
  authenticateWithAPI('stack_exchange', accessToken, profile, done);
}));
