import express from 'express';
import * as bloggerController from '../controllers/blogger-controller';

const router = express.Router(); // eslint-disable-line new-cap

router.get('/', (req, res, next) => {
  const pageNumber = req.query.page || 1;

  bloggerController.getAllBloggers(pageNumber)
    .then(bloggers => {
      if (bloggers.length === 0) {
        res.render('info', {
          title: 'No more bloggers',
          description: 'No more bloggers to see.'
        });
      } else {
        const hasMore = bloggers.length === bloggerController.getPageSize();
        const hasLess = pageNumber > 1;

        res.render('bloggers', {
          title: 'Bloggers',
          hasMore,
          hasLess,
          pageNumber,
          bloggers
        });
      }
    })
    .catch(err => {
      next(err);
    });
});

export default router;
