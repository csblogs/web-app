import express from 'express';
import * as blogController from '../controllers/blog-controller';

const router = express.Router(); // eslint-disable-line new-cap

router.get('/', async (req, res, next) => {
  const pageNumber = req.query.page || 1;

  try {
    const posts = await blogController.getPostAuthors(
      await blogController.getAllPosts(pageNumber));

    if (posts.length === 0) {
      res.render('info', {
        title: 'Home',
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
  } catch (err) {
    next(err);
  }
});

export default router;
