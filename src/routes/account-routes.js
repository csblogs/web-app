import express from 'express';
import * as bloggerController from '../controllers/blogger-controller';
import * as blogController from '../controllers/blog-controller';
import { ensureAuthenticated } from '../helpers/authentication';

const router = express.Router(); // eslint-disable-line new-cap

router.get('/login', (req, res) => {
  res.render('login', {
    title: 'Login'
  });
});

router.get('/logout', (req, res) => {
  req.logout();
  res.redirect('/');
});

router.get('/profile', ensureAuthenticated, (req, res, next) => {
  const pageNumber = req.query.page || 1;

  bloggerController.getLoggedInBlogger(req.user.token)
    .then(blogger => {
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
