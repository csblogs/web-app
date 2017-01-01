import express from 'express';
import log from '../log';
import * as bloggerController from '../controllers/blogger-controller';
import { ensureAuthenticated } from '../helpers/authentication';

const router = express.Router(); // eslint-disable-line new-cap
const BASE_URL = process.env.CSBLOGS_BASE_URL || process.env.NOW_URL;

router.route('/register')
.get(ensureAuthenticated, (req, res) => {
  if (req.user.isRegistered) {
    res.redirect('/profile');
  } else {
    res.render('register', {
      title: 'Register',
      submitText: 'Add your blog',
      postAction: 'register',
      user: req.user
    });
  }
})
.post(async (req, res, next) => {
  const user = req.body;
  user.profilePictureURI = req.user.profilePictureURI;

  try {
    const data = await bloggerController.registerUser(user, req.user.apiToken);

    if (data.status === 201) {
      log.info(data, 'SUCCESSFULLY REGISTERED');
      res.redirect('/profile');
    } else {
      res.render('register', {
        title: 'Register',
        submitText: 'Add your blog',
        postAction: 'register',
        errors: data.errors,
        user
      });
    }
  } catch (err) {
    next(err);
  }
});

router.get('/login', (req, res) => {
  if (req.isAuthenticated()) {
    res.redirect('/profile');
  } else {
    res.render('login', {
      title: 'Login'
    });
  }
});

router.get('/logout', (req, res) => {
  req.logout();
  res.redirect('/');
});

router.get('/profile', ensureAuthenticated, (req, res, next) => {
  if (!req.user.isRegistered) {
    res.redirect('/register');
  }

  try {
    bloggerController.renderProfile(req, res, true);
  } catch (err) {
    next(err);
  }
});

router.route('/account')
.get(ensureAuthenticated, async (req, res, next) => {
  try {
    const user = await bloggerController.getLoggedInBlogger(req.user.apiToken);

    res.render('register', {
      title: 'Account',
      submitText: 'Update profile',
      postAction: 'account',
      showDelete: true,
      user
    });
  } catch (err) {
    next(err);
  }
})
.post(ensureAuthenticated, async (req, res, next) => {
  const user = req.body;
  user.profilePictureURI = req.user.profilePictureURI;

  try {
    const data = await bloggerController.updateUser(user, req.user.apiToken);

    if (data.status === 200) {
      log.info(data, 'SUCCESSFULLY UPDATED');
      res.redirect('/profile');
    } else {
      res.render('register', {
        title: 'Account',
        submitText: 'Update profile',
        postAction: 'account',
        errors: data.errors,
        user
      });
    }
  } catch (err) {
    next(err);
  }
});

router.get('/confirm-delete', ensureAuthenticated, (req, res) => {
  res.render('confirm-delete', {
    title: 'Confirm account deletion'
  });
});

router.get('/delete-account', ensureAuthenticated, async (req, res, next) => {
  try {
    if (req.get('Referrer') !== `${BASE_URL}/confirm-delete`) {
      const error = new Error('Request has not been confirmed by the user.');
      error.status = 400;
      throw error;
    }

    const data = await bloggerController.deleteUser(req.user.apiToken);

    if (data.status === 200) {
      res.redirect('/logout');
    } else {
      next(new Error(data.error || 'Failed to delete user'));
    }
  } catch (err) {
    next(err);
  }
});

export default router;
