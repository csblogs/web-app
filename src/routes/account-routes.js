import express from 'express';
import * as bloggerController from '../controllers/blogger-controller';
import * as blogController from '../controllers/blog-controller';
import { ensureAuthenticated } from '../helpers/authentication';

const router = express.Router(); // eslint-disable-line new-cap
const isProduction = process.env.NODE_ENV === 'production';

/* eslint-disable no-param-reassign */
function setAvatarCookie(res, blogger) {
  res.cookie('user_avatar_url', blogger.profile_picture_uri, {
    httpOnly: true,
    secure: isProduction
  });
  res.locals.user_avatar_url = blogger.profile_picture_uri;
}
/* eslint-enable no-param-reassign */

router.get('/register', (req, res) => {
  res.render('register', {
    title: 'Register'
  });
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
  res.clearCookie('user_avatar_url');
  req.logout();
  res.redirect('/');
});

router.get('/profile', ensureAuthenticated, (req, res, next) => {
  const pageNumber = req.query.page || 1;

  bloggerController.getLoggedInBlogger(req.user.token)
    .then(blogger => {
      setAvatarCookie(res, blogger);

      blogController.getBloggerPosts(blogger.id, pageNumber)
        .then(posts => {
          const hasMore = posts.length === blogController.PAGE_SIZE;
          const hasLess = pageNumber > 1;

          res.render('profile', {
            title: `${blogger.first_name} ${blogger.last_name}`,
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

export default router;
