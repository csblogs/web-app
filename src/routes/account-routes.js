import express from 'express';
import log from '../log';
import * as bloggerController from '../controllers/blogger-controller';
import * as blogController from '../controllers/blog-controller';
import { ensureAuthenticated } from '../helpers/authentication';

const router = express.Router(); // eslint-disable-line new-cap
const isProduction = process.env.NODE_ENV === 'production';

/* eslint-disable no-param-reassign */
function setAvatarCookie(res, blogger) {
  res.cookie('user_avatar_url', blogger.profilePictureURI, {
    httpOnly: true,
    secure: isProduction
  });
  res.locals.user_avatar_url = blogger.profilePictureURI;
}
/* eslint-enable no-param-reassign */

router.route('/register')
.get((req, res) => {
  // if (req.user && req.user.iRegistered && req.cookies.user_token) {
  if (req.user && req.cookies.user_token) {
    res.render('register', {
      title: 'Register',
      submitText: 'Add your blog',
      postAction: 'register',
      user: req.user
    });
  } else {
    res.redirect('/login');
  }
})
.post((req, res, next) => {
  const user = req.body;
  user.profilePictureURI = req.user.profilePictureURI;

  bloggerController.registerUser(user, req.user.apiToken)
    .then(data => {
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
    })
    .catch(err => {
      next(err);
    });
});

router.get('/login', (req, res) => {
  if (req.isAuthenticated() && req.cookies.user_token) {
    res.redirect('/profile');
  } else {
    res.render('login', {
      title: 'Login'
    });
  }
});

router.get('/logout', (req, res) => {
  res.clearCookie('user_avatar_url');
  res.clearCookie('user_token');
  req.logout();
  res.redirect('/');
});

router.get('/profile', ensureAuthenticated, (req, res, next) => {
  const pageNumber = req.query.page || 1;

  bloggerController.getLoggedInBlogger(req.cookies.user_token)
    .then(blogger => {
      setAvatarCookie(res, blogger);

      blogController.getBloggerPosts(blogger.id, pageNumber)
        .then(posts => {
          const hasMore = posts.length === blogController.PAGE_SIZE;
          const hasLess = pageNumber > 1;

          res.render('profile', {
            title: `${blogger.firstName} ${blogger.lastName}`,
            loggedIn: true,
            blogger,
            posts,
            pageNumber,
            hasMore,
            hasLess
          });
        });
    })
    .catch(err => {
      next(err);
    });
});

router.route('/account')
.get(ensureAuthenticated, (req, res, next) => {
  bloggerController.getLoggedInBlogger(req.user.apiToken)
    .then(user => {
      res.render('register', {
        title: 'Account',
        submitText: 'Update profile',
        postAction: 'account',
        showDelete: true,
        user
      });
    })
    .catch(err => {
      next(err);
    });
})
.post(ensureAuthenticated, (req, res, next) => {
  const user = req.body;
  user.profilePictureURI = req.user.profilePictureURI;

  bloggerController.updateUser(user, req.user.apiToken)
    .then(data => {
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
    })
    .catch(err => {
      next(err);
    });
});

router.get('/confirm-delete', ensureAuthenticated, (req, res) => {
  res.render('confirm-delete', {
    title: 'Confirm account deletion'
  });
});

router.get('/delete-account', ensureAuthenticated, (req, res, next) => {
  bloggerController.deleteUser(req.cookies.user_token)
    .then(data => {
      if (data.status === 200) {
        res.redirect('/logout');
      } else {
        next(new Error(data.error || 'Failed to delete user'));
      }
    })
    .catch(err => {
      next(err);
    });
});

export default router;
