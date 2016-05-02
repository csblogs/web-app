import express from 'express';
import log from '../log';
import * as blogController from '../controllers/blog-controller';
import * as auth from '../helpers/authentication';

const router = express.Router(); // eslint-disable-line new-cap
const ensureAuthenticated = auth.ensureAuthenticated;

router.get('/', ensureAuthenticated, (req, res, next) => {
  const pageNumber = req.query.page || 1;

  log.info(req.user, 'API user');

  blogController.getAllPosts(pageNumber)
    .then(blogController.getPostAuthors)
    .then(posts => {
      if (posts.length === 0) {
        res.render('info', {
          title: 'No more posts',
          description: 'No more posts to read.'
        });
      } else {
        const hasMore = posts.length === blogController.getPageSize();
        const hasLess = pageNumber > 1;

        res.render('index', {
          title: 'Home',
          hasMore,
          hasLess,
          pageNumber,
          posts
        });
      }
    })
    .catch(err => {
      next(err);
    });
});

export default router;
