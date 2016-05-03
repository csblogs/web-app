import express from 'express';
import * as bloggerController from '../controllers/blogger-controller';
import * as blogController from '../controllers/blog-controller';
import { ensureAuthenticated } from '../helpers/authentication';

const router = express.Router(); // eslint-disable-line new-cap
const isProduction = process.env.NODE_ENV === 'production';

router.get('/login', (req, res) => {
  res.render('login', {
    title: 'Login'
  });
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
      res.cookie('user_avatar_url', blogger.profile_picture_uri, {
        httpOnly: true,
        secure: isProduction
      });
      /* eslint-disable no-param-reassign */
      res.locals.user_avatar_url = blogger.profile_picture_uri;
      /* eslint-enable no-param-reassign */

      blogController.getBloggerPosts(blogger.id, pageNumber)
        .then(posts => {
          const hasMore = posts.length === blogController.getPageSize();
          const hasLess = pageNumber > 1;

          res.render('profile', {
            title: `${blogger.first_name} ${blogger.last_name}`,
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
