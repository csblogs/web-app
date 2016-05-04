import express from 'express';
import * as blogController from '../controllers/blog-controller';

const router = express.Router(); // eslint-disable-line new-cap

router.get('/', (req, res, next) => {
  const pageNumber = req.query.page || 1;

  blogController.getAllPosts(pageNumber)
    .then(blogController.getPostAuthors)
    .then(posts => {
      if (posts.length === 0) {
        res.render('info', {
          title: 'No more posts',
          description: 'No more posts to read.'
        });
      } else {
        const hasMore = posts.length === blogController.PAGE_SIZE;
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
