import _passport from 'passport';
import URI from 'urijs';
import GitHubStrategy from 'passport-github2';
import { Strategy as WordpressStrategy } from 'passport-wordpress';
import { Strategy as StackExchangeStrategy } from 'passport-stackexchange';
import log from '../log';
import * as api from '../helpers/api';

const BASE_URL = process.env.CSBLOGS_BASE_URL || process.env.NOW_URL;

export const passport = _passport;

export function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated() && req.cookies.user_token) {
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

function normalizeVanityName(name) {
  return name.replace(/\s+/g, '-').toLowerCase();
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
        vanityName: normalizeVanityName(passportUser.username)
      };

      log.info(userAsBlogger, 'GitHub blogger');

      // Check displayName for first/last name combinations
      if (passportUser.displayName) {
        if (passportUser.displayName.includes(' ')) {
          const name = passportUser.displayName.split(' ');
          userAsBlogger.firstName = name.shift();
          userAsBlogger.lastName = name.join(' ');
        } else {
          userAsBlogger.firstName = passportUser.displayName;
        }
      }
      break;
    }
    case 'Wordpress': {
      userAsBlogger = {
        profilePictureURI: passportUser._json.avatar_URL,
        emailAddress: passportUser._json.email,
        blogFeedURI: `http://${passportUser.displayName}.wordpress.com/feed`,
        blogURI: `http://${passportUser.displayName}.wordpress.com`,
        vanityName: normalizeVanityName(passportUser._json.display_name)
      };
      break;
    }
    case 'stackexchange': {
      userAsBlogger = {
        profilePictureURI: passportUser.profile_image,
        vanityName: normalizeVanityName(passportUser.display_name),
        blogURI: passportUser.website_url
      };
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
    accessToken
    // accessAppKey
  })
  .then(res => {
    log.info(res, 'User authenticated with API');
    // done(null, res);
    done(null, normalizeUser(profile, res));
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
