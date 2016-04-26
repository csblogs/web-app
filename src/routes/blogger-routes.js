import express from 'express';
import * as bloggerController from '../controllers/blogger-controller';
import * as blogController from '../controllers/blog-controller';

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

router.get('/:vanity_name', (req, res, next) => {
  const vanityName = req.params.vanity_name;
  const pageNumber = req.query.page || 1;

  bloggerController.getSingleBlogger(vanityName)
    .then(blogger => {
      blogController.getBloggerPosts(blogger.id, pageNumber)
        .then(posts => {
          res.render('profile', {
            title: `${blogger.first_name} ${blogger.last_name}`,
            blogger,
            posts,
            pageNumber,
            hasMore: posts.length === blogController.getPageSize(),
            hasLess: pageNumber > 1
          });
        });
    })
    .catch(err => {
      next(err);
    });
});

export default router;
