import express from 'express';
import * as bloggerController from '../controllers/blogger-controller';

const router = express.Router(); // eslint-disable-line new-cap

router.get('/', async (req, res, next) => {
  const pageNumber = req.query.page || 1;

  try {
    const bloggers = await bloggerController.getAllBloggers(pageNumber);

    if (bloggers.length === 0) {
      res.render('info', {
        title: 'Bloggers',
        description: 'No more bloggers to see.'
      });
    } else {
      const hasMore = bloggers.length === bloggerController.PAGE_SIZE;
      const hasLess = pageNumber > 1;

      res.render('bloggers', {
        title: 'Bloggers',
        hasMore,
        hasLess,
        pageNumber,
        bloggers
      });
    }
  } catch (err) {
    next(err);
  }
});

router.get('/:vanity_name', async (req, res, next) => {
  const loggedIn = req.isAuthenticated() && req.params.vanity_name === req.user.vanityName;

  try {
    await bloggerController.renderProfile(req, res, loggedIn);
  } catch (err) {
    next(err);
  }
});

export default router;
